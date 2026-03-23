import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getUserPlanStatus } from '@/lib/services/plan-service'

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

  const status = await getUserPlanStatus(user.id)

  // Serialize Infinity for JSON
  const serialized = {
    ...status,
    effectiveProductLimit: status.effectiveProductLimit === Infinity ? -1 : status.effectiveProductLimit,
    effectiveReminderLimit: status.effectiveReminderLimit === Infinity ? -1 : status.effectiveReminderLimit,
  }

  return NextResponse.json(serialized, { headers: response.headers })
}
