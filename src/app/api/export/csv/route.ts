// src/app/api/export/csv/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserPlanStatus, isPro } from '@/lib/services/plan-service'
import { getDateRange } from '@/lib/carnet-constants'
import type { Period } from '@/lib/carnet-types'

function escapeCsv(value: unknown): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCsv).join(',')]
  for (const row of rows) {
    lines.push(row.map(escapeCsv).join(','))
  }
  return '\ufeff' + lines.join('\n') // BOM for Excel
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

  const planStatus = await getUserPlanStatus(user.id)
  if (!isPro(planStatus)) {
    return NextResponse.json({ error: 'Plan Pro requis' }, { status: 403 })
  }

  const body = await req.json()
  const { type, period = 'month' } = body as {
    type: 'sales' | 'products' | 'debts'
    period?: Period | 'all'
  }

  let csv: string
  let filename: string

  if (type === 'sales') {
    const query = supabaseAdmin
      .from('sales')
      .select(
        'amount, cost_price, quantity, payment_method, note, created_at, carnet_products(name), clients(name)'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (period !== 'all') {
      const { start, end } = getDateRange(period as Period)
      query
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
    }

    const { data: sales } = await query
    const rows = (sales || []).map((s: Record<string, unknown>) => {
      const product = s.carnet_products as { name: string } | null
      const client = s.clients as { name: string } | null
      const amount = Number(s.amount)
      const cost = Number(s.cost_price) * Number(s.quantity)
      return [
        new Date(s.created_at as string).toLocaleDateString('fr-FR'),
        product?.name || '-',
        s.quantity,
        amount,
        cost,
        amount - cost,
        client?.name || '-',
        s.payment_method,
      ]
    })
    csv = toCsv(
      ['Date', 'Produit', 'Quantité', 'Montant', 'Coût', 'Profit', 'Client', 'Paiement'],
      rows
    )
    filename = `ventes-${period}.csv`
  } else if (type === 'products') {
    const { data: products } = await supabaseAdmin
      .from('carnet_products')
      .select('name, buy_price, sell_price, quantity, category, low_stock_threshold')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('name')

    const rows = (products || []).map((p: Record<string, unknown>) => [
      p.name,
      p.buy_price,
      p.sell_price,
      p.quantity,
      p.category || '-',
      p.low_stock_threshold,
    ])
    csv = toCsv(
      ['Nom', 'Prix achat', 'Prix vente', 'Quantité', 'Catégorie', 'Seuil stock bas'],
      rows
    )
    filename = 'produits.csv'
  } else if (type === 'debts') {
    const { data: debts } = await supabaseAdmin
      .from('debts')
      .select('amount, paid_amount, status, created_at, clients(name, phone)')
      .eq('user_id', user.id)
      .in('status', ['pending', 'partial'])
      .order('created_at', { ascending: false })

    const rows = (debts || []).map((d: Record<string, unknown>) => {
      const client = d.clients as { name: string; phone?: string } | null
      const amount = Number(d.amount)
      const paid = Number(d.paid_amount)
      return [
        client?.name || '-',
        client?.phone || '-',
        amount,
        paid,
        amount - paid,
        d.status,
        new Date(d.created_at as string).toLocaleDateString('fr-FR'),
      ]
    })
    csv = toCsv(
      ['Client', 'Téléphone', 'Montant total', 'Payé', 'Reste dû', 'Statut', 'Date'],
      rows
    )
    filename = 'dettes.csv'
  } else {
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      ...Object.fromEntries(response.headers.entries()),
    },
  })
}
