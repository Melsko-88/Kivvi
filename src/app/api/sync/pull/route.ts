import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const TABLES = [
  { local: 'sales', db: 'sales' },
  { local: 'products', db: 'carnet_products' },
  { local: 'clients', db: 'clients' },
  { local: 'debts', db: 'debts' },
  { local: 'debtPayments', db: 'debt_payments' },
] as const

export async function GET(req: NextRequest) {
  const response = NextResponse.json({})

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const since = req.nextUrl.searchParams.get('since') || new Date(0).toISOString()
    const result: Record<string, unknown[]> = {}

    for (const table of TABLES) {
      const { data } = await supabase
        .from(table.db)
        .select('*')
        .eq('user_id', user.id)
        .gt('updated_at', since)
        .order('updated_at', { ascending: true })
        .limit(500)

      result[table.local] = data || []
    }

    return NextResponse.json(result, { headers: response.headers })
  } catch {
    return NextResponse.json({ error: 'Erreur sync pull' }, { status: 500 })
  }
}
