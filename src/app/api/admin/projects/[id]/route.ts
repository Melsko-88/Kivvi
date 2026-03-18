import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Projet introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Admin project GET error:', error)
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
    const fields = ['name', 'description', 'url', 'technologies', 'category', 'image', 'featured'] as const
    for (const field of fields) {
      if (body[field] !== undefined) {
        allowedFields[field] = body[field]
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ à mettre à jour' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error || !project) {
      console.error('Supabase error (update project):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du projet' },
        { status: 500 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Admin project PATCH error:', error)
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
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error (delete project):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du projet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Projet supprimé' })
  } catch (error) {
    console.error('Admin project DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
