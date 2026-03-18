import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !invoice) {
      return NextResponse.json(
        { error: 'Facture introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Admin invoice GET error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields: Record<string, unknown> = {}
    const fields = [
      'client_name', 'client_email', 'client_address',
      'items', 'subtotal', 'tax_rate', 'tax_amount', 'total',
      'status', 'due_date', 'paid_at',
    ] as const

    for (const field of fields) {
      if (body[field] !== undefined) {
        allowedFields[field] = body[field]
      }
    }

    // Auto-set paid_at when status changes to 'paid'
    if (body.status === 'paid' && !body.paid_at) {
      allowedFields.paid_at = new Date().toISOString()
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ à mettre à jour' },
        { status: 400 }
      )
    }

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error || !invoice) {
      console.error('Supabase error (update invoice):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la facture' },
        { status: 500 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Admin invoice PATCH error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
