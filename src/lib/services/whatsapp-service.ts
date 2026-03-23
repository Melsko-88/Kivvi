// src/lib/services/whatsapp-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin'

const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0'
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const WHATSAPP_TEMPLATE = 'kivvi_debt_reminder'
const WHATSAPP_TEMPLATE_LANG = 'fr'

interface SendReminderParams {
  userId: string
  clientId: string
  debtId?: string
  clientPhone: string
  clientName: string
  shopName: string
  amount: number
  currency: string
  paymentLinkUrl?: string
  type: 'manual' | 'auto'
}

interface SendResult {
  success: boolean
  channel: 'whatsapp' | 'sms'
  error?: string
}

/**
 * Auto-generate a payment link for this debt if one doesn't exist yet.
 * Returns the public URL (kivvi.tech/pay/[id]) or undefined.
 */
export async function getOrCreatePaymentLink(
  userId: string, clientId: string, amount: number, currency: string, commissionRate: number
): Promise<string | undefined> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kivvi.tech'

  // Check if client already has an active payment link
  const { data: existingLink } = await supabaseAdmin
    .from('payment_links')
    .select('id, status')
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingLink) {
    return `${siteUrl}/pay/${existingLink.id}`
  }

  // Create new payment link (22-char crypto ID)
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(36).padStart(2, '0')).join('').slice(0, 22)

  const { error } = await supabaseAdmin
    .from('payment_links')
    .insert({
      id,
      user_id: userId,
      client_id: clientId,
      amount,
      description: `Solde impayé`,
      status: 'pending',
      commission_rate: commissionRate,
      commission_amount: Math.round(amount * commissionRate),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

  if (error) return undefined
  return `${siteUrl}/pay/${id}`
}

export async function sendDebtReminder(params: SendReminderParams): Promise<SendResult> {
  const { userId, clientId, debtId, clientPhone, clientName, shopName, amount, currency, paymentLinkUrl, type } = params

  // Format phone for WhatsApp (remove + and spaces)
  const phone = clientPhone.replace(/[\s+\-]/g, '')

  // Try WhatsApp first
  let channel: 'whatsapp' | 'sms' = 'whatsapp'
  let success = false
  let error: string | undefined

  try {
    if (WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_ACCESS_TOKEN) {
      const templateParams = [
        { type: 'text', text: clientName },
        { type: 'text', text: shopName },
        { type: 'text', text: Math.round(amount).toLocaleString('fr-FR') },
        { type: 'text', text: currency === 'XOF' ? 'FCFA' : currency },
      ]

      // Add payment link as 5th param if available
      if (paymentLinkUrl) {
        templateParams.push({ type: 'text', text: paymentLinkUrl })
      }

      const res = await fetch(
        `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone,
            type: 'template',
            template: {
              name: WHATSAPP_TEMPLATE,
              language: { code: WHATSAPP_TEMPLATE_LANG },
              components: [
                {
                  type: 'body',
                  parameters: templateParams,
                },
              ],
            },
          }),
        }
      )

      if (res.ok) {
        success = true
      } else {
        const errBody = await res.json().catch(() => ({}))
        error = errBody?.error?.message || `WhatsApp API ${res.status}`
        // Fall through to SMS fallback
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'WhatsApp send failed'
  }

  // SMS fallback via Termii
  if (!success) {
    channel = 'sms'
    try {
      const amountStr = Math.round(amount).toLocaleString('fr-FR')
      const currencyStr = currency === 'XOF' ? 'FCFA' : currency
      let message = `Rappel de ${shopName}: Bonjour ${clientName}, vous avez un solde impayé de ${amountStr} ${currencyStr}.`
      if (paymentLinkUrl) {
        message += ` Payez ici: ${paymentLinkUrl}`
      }

      const termiiRes = await fetch('https://v3.api.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TERMII_API_KEY,
          to: phone,
          from: process.env.TERMII_SENDER_ID || 'Kivvi',
          sms: message,
          type: 'plain',
          channel: 'generic',
        }),
      })

      success = termiiRes.ok
      if (!success) {
        const errBody = await termiiRes.json().catch(() => ({}))
        error = errBody?.message || `Termii ${termiiRes.status}`
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'SMS send failed'
    }
  }

  // Log to database
  await supabaseAdmin.from('whatsapp_reminders').insert({
    user_id: userId,
    client_id: clientId,
    debt_id: debtId,
    type,
    channel,
    status: success ? 'sent' : 'failed',
    payment_link_id: paymentLinkUrl ? paymentLinkUrl.split('/').pop() : null,
    error_message: success ? null : error,
  })

  return { success, channel, error: success ? undefined : error }
}
