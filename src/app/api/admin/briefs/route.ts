import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: briefs, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .not('brief_data', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error (fetch briefs):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des briefs' },
        { status: 500 }
      )
    }

    return NextResponse.json(briefs)
  } catch (error) {
    console.error('Admin briefs API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
