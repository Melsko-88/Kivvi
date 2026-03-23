// src/lib/services/plan-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin'
import { PLAN_LIMITS } from '@/lib/carnet-constants'
import type { Plan, PlanStatus, UsagePack, Subscription } from '@/lib/carnet-types'

export async function getUserPlanStatus(userId: string): Promise<PlanStatus> {
  // 1. Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('plan, subscription_expires_at')
    .eq('id', userId)
    .single()

  let plan = (profile?.plan || 'free') as Plan

  // 2. Check expiration — auto-downgrade if expired
  if (plan !== 'free' && profile?.subscription_expires_at) {
    const expiresAt = new Date(profile.subscription_expires_at)
    if (expiresAt < new Date()) {
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', subscription_expires_at: null, subscription_id: null })
        .eq('id', userId)

      // Disable auto-reminders
      await supabaseAdmin
        .from('auto_reminder_settings')
        .update({ enabled: false })
        .eq('user_id', userId)

      plan = 'free'
    }
  }

  // 3. Get active subscription
  const { data: activeSubscription } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // 4. Get active packs
  const { data: activePacks } = await supabaseAdmin
    .from('usage_packs')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')

  const packs = (activePacks || []) as UsagePack[]

  // 5. Calculate effective limits
  const baseLimits = PLAN_LIMITS[plan]

  const productPackBonus = packs
    .filter(p => p.pack_type === 'products')
    .reduce((sum, p) => sum + p.quantity, 0)

  const reminderPackRemaining = packs
    .filter(p => p.pack_type === 'reminders')
    .reduce((sum, p) => sum + p.remaining, 0)

  const hasCommissionReduction = packs.some(
    p => p.pack_type === 'commission_reduction' && (!p.expires_at || new Date(p.expires_at) > new Date())
  )

  // 6. Count products
  const { count: productCount } = await supabaseAdmin
    .from('carnet_products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null)

  // 7. Count today's manual reminders
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count: remindersUsedToday } = await supabaseAdmin
    .from('whatsapp_reminders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'manual')
    .gte('created_at', todayStart.toISOString())

  // 8. Calculate effective commission rate
  let effectiveCommissionRate = baseLimits.commission
  if (hasCommissionReduction && plan === 'free') {
    effectiveCommissionRate = 0.01 // Pack gives Pro-level commission
  }

  const expiresAt = profile?.subscription_expires_at || null
  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return {
    plan,
    expiresAt,
    daysRemaining,
    effectiveProductLimit: baseLimits.products === Infinity ? Infinity : baseLimits.products + productPackBonus,
    effectiveReminderLimit: baseLimits.reminders_per_day === Infinity ? Infinity : baseLimits.reminders_per_day + reminderPackRemaining,
    hasCommissionReduction,
    effectiveCommissionRate,
    remindersUsedToday: remindersUsedToday || 0,
    productCount: productCount || 0,
    activePacks: packs,
    activeSubscription: activeSubscription as Subscription | null,
  }
}

export function canAddProduct(status: PlanStatus): boolean {
  if (status.plan !== 'free') return true
  return status.productCount < status.effectiveProductLimit
}

export function canSendReminder(status: PlanStatus): boolean {
  if (status.plan !== 'free') return true
  return status.remindersUsedToday < status.effectiveReminderLimit
}

export function isPro(status: PlanStatus): boolean {
  return status.plan === 'pro' || status.plan === 'business'
}
