import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendDebtReminder, getOrCreatePaymentLink } from '@/lib/services/whatsapp-service'
import { PLAN_LIMITS } from '@/lib/carnet-constants'
import type { Plan } from '@/lib/carnet-types'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    expiredSubscriptions: 0,
    renewalReminders: 0,
    autoReminders: 0,
    expiredPacks: 0,
  }

  const now = new Date()

  // 1. Expire subscriptions
  const { data: expiredSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('id, user_id')
    .eq('status', 'active')
    .lt('expires_at', now.toISOString())

  for (const sub of expiredSubs || []) {
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', sub.id)

    await supabaseAdmin
      .from('profiles')
      .update({ plan: 'free', subscription_expires_at: null, subscription_id: null })
      .eq('id', sub.user_id)

    await supabaseAdmin
      .from('auto_reminder_settings')
      .update({ enabled: false })
      .eq('user_id', sub.user_id)

    results.expiredSubscriptions++
  }

  // 2. J-3 renewal reminders
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const { data: expiringSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('id, user_id, plan')
    .eq('status', 'active')
    .lt('expires_at', threeDaysLater.toISOString())
    .gt('expires_at', now.toISOString())
    .is('reminder_sent_at', null)

  for (const sub of expiringSubs || []) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('phone, name, shop_name, currency')
      .eq('id', sub.user_id)
      .single()

    if (profile?.phone) {
      const phone = profile.phone.replace(/[\s+\-]/g, '')
      const planName = sub.plan === 'pro' ? 'Pro' : 'Business'
      const message = `Kivvi: Bonjour ${profile.name}, votre abonnement ${planName} expire dans 3 jours. Renouvelez sur kivvi.tech pour garder vos avantages.`

      try {
        await fetch('https://v3.api.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TERMII_API_KEY,
            to: phone,
            from: process.env.TERMII_SENDER_ID || 'Kivvi',
            sms: message,
            type: 'plain',
            channel: 'generic',
          }),
        })
      } catch {}

      await supabaseAdmin
        .from('subscriptions')
        .update({ reminder_sent_at: now.toISOString() })
        .eq('id', sub.id)

      results.renewalReminders++
    }
  }

  // 3. Auto debt reminders (Pro/Business users with enabled settings)
  const { data: autoSettings } = await supabaseAdmin
    .from('auto_reminder_settings')
    .select('user_id, frequency_days, min_debt_age_days, min_amount')
    .eq('enabled', true)

  for (const setting of autoSettings || []) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan, shop_name, currency')
      .eq('id', setting.user_id)
      .single()

    if (!profile || profile.plan === 'free') continue

    const minDate = new Date(now.getTime() - setting.min_debt_age_days * 24 * 60 * 60 * 1000)
    const { data: debts } = await supabaseAdmin
      .from('debts')
      .select('local_id, client_id, amount, paid_amount, created_at')
      .eq('user_id', setting.user_id)
      .in('status', ['pending', 'partial'])
      .lt('created_at', minDate.toISOString())

    for (const debt of debts || []) {
      const remaining = debt.amount - debt.paid_amount
      if (remaining < setting.min_amount) continue

      const lastReminderCutoff = new Date(now.getTime() - setting.frequency_days * 24 * 60 * 60 * 1000)
      const { count } = await supabaseAdmin
        .from('whatsapp_reminders')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', debt.client_id)
        .eq('user_id', setting.user_id)
        .gte('created_at', lastReminderCutoff.toISOString())

      if ((count || 0) > 0) continue

      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('name, phone')
        .eq('local_id', debt.client_id)
        .eq('user_id', setting.user_id)
        .maybeSingle()

      if (!client?.phone) continue

      const commissionRate = PLAN_LIMITS[profile.plan as Plan]?.commission ?? 0.02
      const paymentLinkUrl = await getOrCreatePaymentLink(
        setting.user_id, debt.client_id, remaining, profile.currency || 'XOF', commissionRate
      )

      await sendDebtReminder({
        userId: setting.user_id,
        clientId: debt.client_id,
        debtId: debt.local_id,
        clientPhone: client.phone,
        clientName: client.name,
        shopName: profile.shop_name || 'Commerçant',
        amount: remaining,
        currency: profile.currency || 'XOF',
        paymentLinkUrl,
        type: 'auto',
      })

      results.autoReminders++
    }
  }

  // 4. Expire commission reduction packs
  const { data: expiredPacks } = await supabaseAdmin
    .from('usage_packs')
    .select('id')
    .eq('pack_type', 'commission_reduction')
    .eq('status', 'active')
    .lt('expires_at', now.toISOString())

  for (const pack of expiredPacks || []) {
    await supabaseAdmin
      .from('usage_packs')
      .update({ status: 'expired' })
      .eq('id', pack.id)
    results.expiredPacks++
  }

  return NextResponse.json({ success: true, results })
}
