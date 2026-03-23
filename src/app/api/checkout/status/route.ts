import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

  const entityId = req.nextUrl.searchParams.get('id')
  if (!entityId) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }

  // Check subscriptions first, then packs
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('id', entityId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (sub) {
    return NextResponse.json({ status: sub.status }, { headers: response.headers })
  }

  const { data: pack } = await supabaseAdmin
    .from('usage_packs')
    .select('status')
    .eq('id', entityId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (pack) {
    return NextResponse.json({ status: pack.status }, { headers: response.headers })
  }

  return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
}
