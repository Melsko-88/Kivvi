// src/app/api/reminders/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserPlanStatus, isPro } from '@/lib/services/plan-service'

export async function GET(req: NextRequest) {
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

  const { data: settings } = await supabaseAdmin
    .from('auto_reminder_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json(
    settings || { enabled: false, frequency_days: 3, min_debt_age_days: 7, min_amount: 0 },
    { headers: response.headers }
  )
}

export async function PUT(req: NextRequest) {
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

  // Verify Pro/Business plan
  const planStatus = await getUserPlanStatus(user.id)
  if (!isPro(planStatus)) {
    return NextResponse.json({ error: 'Plan Pro requis' }, { status: 403 })
  }

  const body = await req.json()
  const { enabled, frequency_days, min_debt_age_days, min_amount } = body

  // Validate
  const freq = Math.min(30, Math.max(1, frequency_days || 3))
  const minAge = Math.max(1, min_debt_age_days || 7)
  const minAmt = Math.max(0, min_amount || 0)

  await supabaseAdmin
    .from('auto_reminder_settings')
    .upsert({
      user_id: user.id,
      enabled: !!enabled,
      frequency_days: freq,
      min_debt_age_days: minAge,
      min_amount: minAmt,
      updated_at: new Date().toISOString(),
    })

  return NextResponse.json({ success: true }, { headers: response.headers })
}
