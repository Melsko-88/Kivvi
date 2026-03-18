import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: invoices, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error (fetch invoices):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des factures' },
        { status: 500 }
      )
    }

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Admin invoices API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      quote_id,
      client_name,
      client_email,
      client_address,
      items,
      subtotal,
      tax_rate,
      tax_amount,
      total,
      status,
      due_date,
    } = body

    if (!client_name || !client_email || !items || !total || !due_date) {
      return NextResponse.json(
        { error: 'Les champs client_name, client_email, items, total et due_date sont requis' },
        { status: 400 }
      )
    }

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        quote_id: quote_id || null,
        client_name,
        client_email,
        client_address: client_address || null,
        items,
        subtotal: subtotal ?? 0,
        tax_rate: tax_rate ?? 0,
        tax_amount: tax_amount ?? 0,
        total,
        status: status || 'draft',
        due_date,
      })
      .select()
      .single()

    if (error || !invoice) {
      console.error('Supabase error (create invoice):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la facture' },
        { status: 500 }
      )
    }

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Admin invoices POST error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
