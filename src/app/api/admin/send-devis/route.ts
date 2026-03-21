import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { SITE_CONFIG } from '@/lib/constants'
import { formatPrice } from '@/lib/format'

const FROM_EMAIL = `${SITE_CONFIG.name} <noreply@kivvi.tech>`

export async function POST(request: Request) {
  try {
    const { pdfBase64, email, devis } = await request.json()

    if (!pdfBase64 || !email || !devis?.numero) {
      return NextResponse.json(
        { error: 'Données manquantes (pdfBase64, email, devis)' },
        { status: 400 }
      )
    }

    // Strip data URI prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;[^,]+,/, '')

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Votre devis ${devis.numero} - ${SITE_CONFIG.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="padding: 32px 24px; border-bottom: 3px solid #111;">
            <h1 style="margin: 0 0 4px; font-size: 22px; font-weight: 700;">${SITE_CONFIG.name}</h1>
            <p style="margin: 0; font-size: 12px; color: #888; letter-spacing: 0.5px;">${SITE_CONFIG.tagline}</p>
          </div>

          <div style="padding: 32px 24px;">
            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
              Bonjour${devis.clientNom ? ` ${devis.clientNom}` : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
              Veuillez trouver ci-joint votre devis <strong>${devis.numero}</strong> d'un montant de <strong>${formatPrice(devis.total)}</strong>.
            </p>

            <div style="background: #f8f8f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #666;">Référence</td>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; text-align: right;">${devis.numero}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #666;">Montant total</td>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; text-align: right;">${formatPrice(devis.total)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #666;">Validité</td>
                  <td style="padding: 6px 0; font-size: 13px; text-align: right;">${devis.validite || '30 jours'}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
              Ce devis est valable <strong>${devis.validite || '30 jours'}</strong> à compter de sa date d'émission.
            </p>
            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              N'hésitez pas à nous contacter pour toute question.
            </p>

            <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0; color: #555;">
              Cordialement,<br />
              <strong>${SITE_CONFIG.founder.name}</strong><br />
              <span style="color: #888;">${SITE_CONFIG.founder.role}</span><br />
              <span style="color: #888;">${SITE_CONFIG.phone}</span>
            </p>
          </div>

          <div style="padding: 20px 24px; border-top: 1px solid #eee; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #aaa;">
              ${SITE_CONFIG.name} · ${SITE_CONFIG.tagline} · <a href="${SITE_CONFIG.url}" style="color: #888;">${SITE_CONFIG.url}</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `devis-${devis.numero}.pdf`,
          content: base64Data,
          contentType: 'application/pdf',
        },
      ],
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: `Erreur d'envoi : ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (error) {
    console.error('Send devis error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
