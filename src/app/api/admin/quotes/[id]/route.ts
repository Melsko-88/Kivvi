import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !quote) {
      return NextResponse.json(
        { error: 'Devis introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Admin quote GET error:', error)
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
    if (body.status !== undefined) allowedFields.status = body.status
    if (body.notes !== undefined) allowedFields.notes = body.notes
    allowedFields.updated_at = new Date().toISOString()

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error || !quote) {
      console.error('Supabase error (update quote):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du devis' },
        { status: 500 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Admin quote PATCH error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('quotes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error (delete quote):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du devis' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Devis supprimé' })
  } catch (error) {
    console.error('Admin quote DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
