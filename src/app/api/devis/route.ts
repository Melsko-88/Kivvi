import { NextResponse } from 'next/server'
import { devisSchema } from '@/lib/schemas'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { SITE_CONFIG } from '@/lib/constants'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SITE_CONFIG.email
const FROM_EMAIL = `${SITE_CONFIG.name} <noreply@kivvi.tech>`

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = devisSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Save to Supabase
    const { data: quote, error: dbError } = await supabaseAdmin
      .from('quotes')
      .insert({
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        description: data.description,
        budget: data.budget,
        deadline: data.deadline || null,
        features: data.features,
        status: 'new',
      })
      .select('id')
      .single()

    if (dbError || !quote) {
      console.error('Supabase error (quotes):', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du devis' },
        { status: 500 }
      )
    }

    // Send notification email to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nouvelle demande de devis : ${data.type}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Type</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.type}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nom</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Téléphone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
          ${data.company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entreprise</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company}</td></tr>` : ''}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Budget</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.budget}</td></tr>
          ${data.deadline ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Deadline</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.deadline}</td></tr>` : ''}
          ${data.features.length > 0 ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fonctionnalités</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.features.join(', ')}</td></tr>` : ''}
        </table>
        <hr />
        <p><strong>Description du projet :</strong></p>
        <p>${data.description.replace(/\n/g, '<br />')}</p>
        <br />
        <p><em>ID du devis : ${quote.id}</em></p>
      `,
    })

    // Send confirmation email to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Votre demande de devis - ${SITE_CONFIG.name}`,
      html: `
        <h2>Merci pour votre demande, ${data.name} !</h2>
        <p>Nous avons bien reçu votre demande de devis pour un projet de type <strong>${data.type}</strong>.</p>
        <p>Notre équipe analysera votre demande et vous enverra un devis détaillé dans les 48 heures.</p>
        <br />
        <p><strong>Référence :</strong> ${quote.id}</p>
        <br />
        <p>Cordialement,</p>
        <p>L'équipe ${SITE_CONFIG.name}</p>
        <p><a href="${SITE_CONFIG.url}">${SITE_CONFIG.url}</a></p>
      `,
    })

    return NextResponse.json({ success: true, id: quote.id, message: 'Demande de devis envoyée avec succès' })
  } catch (error) {
    console.error('Devis API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
