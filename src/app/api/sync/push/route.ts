import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const TABLE_MAP: Record<string, string> = {
  sales: 'sales',
  products: 'carnet_products',
  clients: 'clients',
  debts: 'debts',
  debtPayments: 'debt_payments',
}

export async function POST(req: NextRequest) {
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
    const body = await req.json()
    const syncedIds: Record<string, string[]> = {}

    for (const [localTable, records] of Object.entries(body)) {
      const dbTable = TABLE_MAP[localTable]
      if (!dbTable || !Array.isArray(records)) continue

      const synced: string[] = []

      for (const record of records) {
        const { local_id, server_id, synced: _synced, ...data } = record as Record<string, unknown>

        const row = {
          ...data,
          local_id,
          user_id: user.id,
          synced: true,
        }

        const { error } = await supabase
          .from(dbTable)
          .upsert(row, { onConflict: 'local_id' })

        if (!error) synced.push(local_id as string)
      }

      syncedIds[localTable] = synced
    }

    return NextResponse.json({ syncedIds }, { headers: response.headers })
  } catch {
    return NextResponse.json({ error: 'Erreur sync push' }, { status: 500 })
  }
}
