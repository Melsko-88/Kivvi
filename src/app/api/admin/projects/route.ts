import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error (fetch projects):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des projets' },
        { status: 500 }
      )
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Admin projects API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, description, url, technologies, category, image, featured } = body

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Les champs name, description et category sont requis' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        description,
        url: url || null,
        technologies: technologies || [],
        category,
        image: image || '',
        featured: featured ?? false,
      })
      .select()
      .single()

    if (error || !project) {
      console.error('Supabase error (create project):', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du projet' },
        { status: 500 }
      )
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Admin projects POST error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
