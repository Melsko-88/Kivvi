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
  const checkoutId = data.id as string || data.checkout_session_id as string
  if (!checkoutId) return

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
