import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { SITE_CONFIG, DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import { randomUUID } from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SITE_CONFIG.email
const FROM_EMAIL = `${SITE_CONFIG.name} <noreply@kivvi.tech>`

const briefSchema = z.object({
  projects: z.array(z.string()).min(1, 'Sélectionnez au moins un projet'),
  organization: z.object({
    name: z.string().min(2, 'Nom de structure requis'),
    sector: z.string().min(1, 'Secteur requis'),
    hasWebsite: z.boolean(),
    websiteUrl: z.string().optional(),
  }),
  sectorQuestions: z.record(z.string(), z.boolean()).optional(),
  style: z.string().min(1, 'Style requis'),
  identity: z.object({
    hasLogo: z.boolean(),
    logoUrl: z.string().optional(),
    colors: z.array(z.string()),
  }),
  budget: z.string().min(1, 'Budget requis'),
  deadline: z.string().optional(),
  contact: z.object({
    name: z.string().min(2, 'Nom requis'),
    phone: z.string().min(9, 'Téléphone invalide'),
    email: z.string().email().optional().or(z.literal('')).or(z.undefined()),
    preferWhatsApp: z.boolean(),
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = briefSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const briefToken = randomUUID()

    // Build description from brief data
    const projectLabels = data.projects.map(p => {
      const found = DEVIS_TYPES.find(t => t.value === p)
      return found?.label || p
    })
    const budgetLabel = BUDGET_RANGES.find(b => b.value === data.budget)?.label || data.budget
    const description = `Brief conversationnel — ${projectLabels.join(', ')} — ${data.organization.name} (${data.organization.sector})`

    // Active sector questions
    const activeNeeds = Object.entries(data.sectorQuestions || {})
      .filter(([, v]) => v)
      .map(([k]) => k)

    // Save to quotes table with brief_data JSONB
    const { data: quote, error: dbError } = await supabaseAdmin
      .from('quotes')
      .insert({
        type: data.projects[0],
        name: data.contact.name,
        email: data.contact.email || '',
        phone: data.contact.phone,
        company: data.organization.name,
        description,
        budget: data.budget,
        deadline: data.deadline || null,
        features: activeNeeds,
        status: 'new',
        brief_data: data,
        brief_token: briefToken,
      })
      .select('id')
      .single()

    if (dbError || !quote) {
      console.error('Supabase error (brief):', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    // ─── Admin notification email ────────────────────────────────
    const styleMap: Record<string, string> = {
      moderne: 'Moderne & Minimaliste',
      corporate: 'Corporate & Institutionnel',
      chaleureux: 'Coloré & Chaleureux',
      premium: 'Premium & Élégant',
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nouveau brief : ${data.organization.name} — ${projectLabels.join(', ')}`,
      html: `
        <h2>Nouveau brief client</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Projets</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${projectLabels.join(', ')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Structure</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.organization.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Secteur</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.organization.sector}</td></tr>
          ${data.organization.hasWebsite ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Site existant</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.organization.websiteUrl || 'Oui'}</td></tr>` : ''}
          ${activeNeeds.length > 0 ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Besoins</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${activeNeeds.join(', ')}</td></tr>` : ''}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Style</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${styleMap[data.style] || data.style}</td></tr>
          ${data.identity.colors.length > 0 ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Couleurs</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.identity.colors.map(c => `<span style="display:inline-block;width:20px;height:20px;background:${c};border-radius:4px;margin-right:4px;vertical-align:middle;"></span>`).join('')}</td></tr>` : ''}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Logo</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.identity.hasLogo ? (data.identity.logoUrl || 'Oui') : 'Non'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Budget</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${budgetLabel}</td></tr>
          ${data.deadline ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Deadline</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.deadline}</td></tr>` : ''}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Contact</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contact.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Téléphone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contact.phone}</td></tr>
          ${data.contact.email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contact.email}</td></tr>` : ''}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>WhatsApp</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contact.preferWhatsApp ? 'Oui' : 'Non'}</td></tr>
        </table>
        <br />
        <p><em>ID : ${quote.id} | Token : ${briefToken}</em></p>
      `,
    })

    // ─── Confirmation email (if email provided) ──────────────────
    if (data.contact.email) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.contact.email,
        subject: `Votre brief projet - ${SITE_CONFIG.name}`,
        html: `
          <h2>Merci ${data.contact.name} !</h2>
          <p>Nous avons bien reçu votre brief pour <strong>${projectLabels.join(', ')}</strong>.</p>
          <p>Notre équipe analyse votre projet et vous contactera sous 24 heures${data.contact.preferWhatsApp ? ' par WhatsApp' : ''}.</p>
          <br />
          <p><strong>Référence :</strong> ${quote.id}</p>
          <br />
          <p>Cordialement,</p>
          <p>L'équipe ${SITE_CONFIG.name}</p>
          <p><a href="${SITE_CONFIG.url}">${SITE_CONFIG.url}</a></p>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      id: quote.id,
      message: 'Brief envoyé avec succès',
    })
  } catch (error) {
    console.error('Brief API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
