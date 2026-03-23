import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyWaveWebhook } from '@/lib/services/wave'
import { PLAN_LIMITS } from '@/lib/carnet-constants'
import type { Plan } from '@/lib/carnet-types'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-wave-signature') || ''

    if (!verifyWaveWebhook(rawBody, signature)) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const body = JSON.parse(rawBody)
    const eventType = body.type || body.event

    if (eventType === 'checkout.session.completed') {
      await handleCheckoutCompleted(body.data || body)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch {
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

async function handleCheckoutCompleted(data: Record<string, unknown>) {
  const checkoutId = (data.id as string) || (data.checkout_session_id as string)
  const clientRef = (data.client_reference as string) || ''

  if (!checkoutId) return

  // Route by client_reference prefix
  if (clientRef.startsWith('sub_')) {
    await handleSubscriptionPayment(checkoutId, clientRef.slice(4))
  } else if (clientRef.startsWith('pack_')) {
    await handlePackPayment(checkoutId, clientRef.slice(5))
  } else {
    // Legacy: payment links (pay_ prefix or no prefix)
    await handlePaymentLinkPayment(checkoutId)
  }
}

async function handleSubscriptionPayment(checkoutId: string, subId: string) {
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('id, user_id, plan, status')
    .eq('id', subId)
    .eq('wave_checkout_id', checkoutId)
    .single()

  if (!sub || sub.status === 'active') return

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // +30 days

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active',
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq('id', sub.id)

  await supabaseAdmin
    .from('profiles')
    .update({
      plan: sub.plan,
      subscription_expires_at: expiresAt.toISOString(),
      subscription_id: sub.id,
    })
    .eq('id', sub.user_id)
}

async function handlePackPayment(checkoutId: string, packId: string) {
  const { data: pack } = await supabaseAdmin
    .from('usage_packs')
    .select('id, user_id, pack_type, status')
    .eq('id', packId)
    .eq('wave_checkout_id', checkoutId)
    .single()

  if (!pack || pack.status === 'active') return

  const now = new Date()
  const update: Record<string, unknown> = {
    status: 'active',
    activated_at: now.toISOString(),
  }

  if (pack.pack_type === 'commission_reduction') {
    update.expires_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  await supabaseAdmin
    .from('usage_packs')
    .update(update)
    .eq('id', pack.id)
}

async function handlePaymentLinkPayment(checkoutId: string) {
  const { data: link } = await supabaseAdmin
    .from('payment_links')
    .select('id, user_id, amount, status, commission_rate')
    .eq('wave_checkout_id', checkoutId)
    .single()

  if (!link || link.status === 'paid') return

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('plan')
    .eq('id', link.user_id)
    .single()

  const plan = (profile?.plan || 'free') as Plan
  const commissionRate = PLAN_LIMITS[plan]?.commission ?? 0.02
  const commissionAmount = Math.round(link.amount * commissionRate)

  await supabaseAdmin
    .from('payment_links')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
    })
    .eq('id', link.id)
}
