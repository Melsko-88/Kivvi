import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createWaveCheckout } from '@/lib/services/wave'
import { SUBSCRIPTION_PRICES, PACK_PRICES, PACK_DETAILS } from '@/lib/carnet-constants'

const checkoutLimits = new Map<string, { count: number; resetAt: number }>()

function checkCheckoutLimit(userId: string): boolean {
  const now = Date.now()
  const entry = checkoutLimits.get(userId)
  if (!entry || now > entry.resetAt) {
    checkoutLimits.set(userId, { count: 1, resetAt: now + 3600000 }) // 1h window
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

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

  if (!checkCheckoutLimit(user.id)) {
    return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { type, plan, packType } = body as {
      type: 'subscription' | 'pack'
      plan?: 'pro' | 'business'
      packType?: 'products' | 'reminders' | 'commission_reduction'
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kivvi.tech'
    let amount: number
    let entityId: string
    let clientReference: string

    if (type === 'subscription') {
      if (!plan || !SUBSCRIPTION_PRICES[plan]) {
        return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
      }
      amount = SUBSCRIPTION_PRICES[plan]

      const { data: sub, error } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan,
          status: 'pending',
          amount,
        })
        .select('id')
        .single()

      if (error || !sub) {
        return NextResponse.json({ error: 'Erreur création abonnement' }, { status: 500 })
      }

      entityId = sub.id
      clientReference = `sub_${sub.id}`

    } else if (type === 'pack') {
      if (!packType || !PACK_PRICES[packType]) {
        return NextResponse.json({ error: 'Type de pack invalide' }, { status: 400 })
      }
      amount = PACK_PRICES[packType]
      const details = PACK_DETAILS[packType]

      const { data: pack, error } = await supabaseAdmin
        .from('usage_packs')
        .insert({
          user_id: user.id,
          pack_type: packType,
          quantity: details.quantity,
          remaining: details.quantity,
          amount,
          status: 'pending',
        })
        .select('id')
        .single()

      if (error || !pack) {
        return NextResponse.json({ error: 'Erreur création pack' }, { status: 500 })
      }

      entityId = pack.id
      clientReference = `pack_${pack.id}`

    } else {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }

    const checkout = await createWaveCheckout({
      amount,
      currency: 'XOF',
      client_reference: clientReference,
      success_url: `${siteUrl}/app/settings?payment=success&id=${entityId}`,
      error_url: `${siteUrl}/app/settings?payment=error`,
    })

    // Save wave_checkout_id
    const table = type === 'subscription' ? 'subscriptions' : 'usage_packs'
    await supabaseAdmin
      .from(table)
      .update({ wave_checkout_id: checkout.id })
      .eq('id', entityId)

    return NextResponse.json(
      { checkoutUrl: checkout.wave_launch_url, entityId },
      { headers: response.headers }
    )
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Erreur checkout' }, { status: 500 })
  }
}
