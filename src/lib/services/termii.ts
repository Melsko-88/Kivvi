import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

// ─── OTP Helpers ────────────────────────────────────────────────

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

// ─── Send OTP via Meta WhatsApp Cloud API ──────────────────────
export async function sendOTP(phone: string): Promise<{ pinId: string }> {
  const code = generateOTP()
  const pinId = crypto.randomUUID()

  // Store OTP in Supabase with 10min TTL
  const { error: insertError } = await supabaseAdmin
    .from('otp_codes')
    .insert({
      pin_id: pinId,
      phone,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attempts: 0,
    })

  if (insertError) {
    console.error('OTP store error:', insertError)
    throw new Error('Erreur stockage OTP')
  }

  // Clean expired entries (fire-and-forget)
  supabaseAdmin
    .from('otp_codes')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .then()

  // Send via Meta WhatsApp
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v22.0'
  const template = process.env.WHATSAPP_OTP_TEMPLATE || 'nopal_otp'
  const templateLang = process.env.WHATSAPP_OTP_TEMPLATE_LANG || 'fr'

  // Format phone for WhatsApp (remove leading +)
  const waPhone = phone.startsWith('+') ? phone.slice(1) : phone

  const res = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: waPhone,
        type: 'template',
        template: {
          name: template,
          language: { code: templateLang },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: code }],
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [{ type: 'text', text: code }],
            },
          ],
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('WhatsApp OTP error:', err)
    // Fallback: try SMS via Termii (SN/CI only)
    if (process.env.TERMII_API_KEY) {
      return sendOTPviaSMS(phone, code, pinId)
    }
    throw new Error('Erreur envoi OTP')
  }

  return { pinId }
}

// ─── SMS Fallback via Termii ───────────────────────────────────
async function sendOTPviaSMS(phone: string, code: string, pinId: string): Promise<{ pinId: string }> {
  const res = await fetch('https://v3.api.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: 'Nopal',
      sms: `Ton code Kivvi : ${code}`,
      type: 'plain',
      channel: 'generic',
    }),
  })

  if (!res.ok) throw new Error('Erreur envoi SMS')
  return { pinId }
}

// ─── Verify OTP (Supabase check) ──────────────────────────────
export async function verifyOTP(pinId: string, pin: string): Promise<boolean> {
  const { data: entry, error } = await supabaseAdmin
    .from('otp_codes')
    .select('code, expires_at, attempts')
    .eq('pin_id', pinId)
    .single()

  if (error || !entry) return false

  // Check expiry
  if (new Date(entry.expires_at) < new Date()) {
    await supabaseAdmin.from('otp_codes').delete().eq('pin_id', pinId)
    return false
  }

  // Check max attempts
  if (entry.attempts >= 3) {
    await supabaseAdmin.from('otp_codes').delete().eq('pin_id', pinId)
    return false
  }

  // Increment attempts
  await supabaseAdmin
    .from('otp_codes')
    .update({ attempts: entry.attempts + 1 })
    .eq('pin_id', pinId)

  if (entry.code === pin) {
    // Valid — delete OTP
    await supabaseAdmin.from('otp_codes').delete().eq('pin_id', pinId)
    return true
  }

  return false
}

// ─── Rate Limiting (Supabase) ─────────────────────────────────
const RATE_MAX = 5
const RATE_WINDOW_MS = 15 * 60 * 1000

export async function checkRateLimit(key: string): Promise<boolean> {
  const now = new Date()
  const { data: entry } = await supabaseAdmin
    .from('rate_limits')
    .select('count, reset_at')
    .eq('key', key)
    .single()

  if (!entry || new Date(entry.reset_at) < now) {
    // Upsert: new window
    await supabaseAdmin
      .from('rate_limits')
      .upsert({
        key,
        count: 1,
        reset_at: new Date(now.getTime() + RATE_WINDOW_MS).toISOString(),
      })
    return true
  }

  if (entry.count >= RATE_MAX) return false

  // Increment
  await supabaseAdmin
    .from('rate_limits')
    .update({ count: entry.count + 1 })
    .eq('key', key)

  return true
}

// ─── Send SMS (generic) ───────────────────────────────────────
export async function sendSMS(phone: string, message: string): Promise<void> {
  if (!process.env.TERMII_API_KEY) return

  await fetch('https://v3.api.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: 'Nopal',
      sms: message,
      type: 'plain',
      channel: 'generic',
    }),
  })
}
