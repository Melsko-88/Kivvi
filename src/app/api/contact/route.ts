import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { SITE_CONFIG } from '@/lib/constants'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SITE_CONFIG.email
const FROM_EMAIL = `${SITE_CONFIG.name} <noreply@kivvi.tech>`

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      })

    if (dbError) {
      console.error('Supabase error (contacts):', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du message' },
        { status: 500 }
      )
    }

    // Send notification email to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nouveau message de contact : ${data.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
    })

    // Send confirmation email to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Confirmation de votre message - ${SITE_CONFIG.name}`,
      html: `
        <h2>Merci pour votre message, ${data.name} !</h2>
        <p>Nous avons bien reçu votre message concernant "<strong>${data.subject}</strong>".</p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <br />
        <p>Cordialement,</p>
        <p>L'équipe ${SITE_CONFIG.name}</p>
        <p><a href="${SITE_CONFIG.url}">${SITE_CONFIG.url}</a></p>
      `,
    })

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
