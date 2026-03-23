// src/app/api/reminders/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserPlanStatus, canSendReminder } from '@/lib/services/plan-service'
import { sendDebtReminder } from '@/lib/services/whatsapp-service'
import { PLAN_LIMITS, PACK_DETAILS } from '@/lib/carnet-constants'

export async function POST(req: NextRequest) {
  const response = NextResponse.json({})
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { clientId } = body as { clientId: string }

  if (!clientId) {
    return NextResponse.json({ error: 'clientId requis' }, { status: 400 })
  }

  // Check plan limits
  const planStatus = await getUserPlanStatus(user.id)
  if (!canSendReminder(planStatus)) {
    return NextResponse.json({
      error: 'quota_exceeded',
      limit: planStatus.effectiveReminderLimit,
      used: planStatus.remindersUsedToday,
    }, { status: 429 })
  }

  // Get client info from Supabase (synced data)
  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('name, phone, local_id')
    .eq('local_id', clientId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!client) {
    return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
  }

  if (!client.phone) {
    return NextResponse.json({ error: 'Le client n\'a pas de numéro de téléphone' }, { status: 400 })
  }

  // Get profile for shop info
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('shop_name, currency')
    .eq('id', user.id)
    .single()

  // Calculate total debt for this client
  const { data: debts } = await supabaseAdmin
    .from('debts')
    .select('local_id, amount, paid_amount')
    .eq('client_id', clientId)
    .eq('user_id', user.id)
    .in('status', ['pending', 'partial'])

  const totalDebt = (debts || []).reduce((sum, d) => sum + d.amount - d.paid_amount, 0)

  if (totalDebt <= 0) {
    return NextResponse.json({ error: 'Pas de dette en cours' }, { status: 400 })
  }

  // Auto-generate payment link for this debt
  const { getOrCreatePaymentLink } = await import('@/lib/services/whatsapp-service')
  const paymentLinkUrl = await getOrCreatePaymentLink(
    user.id, clientId, totalDebt, profile?.currency || 'XOF', planStatus.effectiveCommissionRate
  )

  // Send reminder
  const result = await sendDebtReminder({
    userId: user.id,
    clientId,
    clientPhone: client.phone,
    clientName: client.name,
    shopName: profile?.shop_name || 'Commerçant',
    amount: totalDebt,
    currency: profile?.currency || 'XOF',
    paymentLinkUrl,
    type: 'manual',
  })

  // If pack reminders were used (plan quota exhausted), decrement pack
  if (result.success && planStatus.plan === 'free') {
    const baseLimitUsed = planStatus.remindersUsedToday >= PLAN_LIMITS.free.reminders_per_day
    if (baseLimitUsed) {
      // Find first active reminder pack with remaining > 0
      const reminderPack = planStatus.activePacks.find(
        p => p.pack_type === 'reminders' && p.remaining > 0
      )
      if (reminderPack) {
        const newRemaining = reminderPack.remaining - 1
        await supabaseAdmin
          .from('usage_packs')
          .update({
            remaining: newRemaining,
            status: newRemaining <= 0 ? 'used' : 'active',
          })
          .eq('id', reminderPack.id)
      }
    }
  }

  if (result.success) {
    return NextResponse.json({
      success: true,
      channel: result.channel,
    }, { headers: response.headers })
  } else {
    return NextResponse.json({
      error: 'send_failed',
      message: result.error,
    }, { status: 500 })
  }
}
