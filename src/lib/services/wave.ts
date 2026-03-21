import crypto from 'crypto'

const WAVE_API_URL = process.env.WAVE_API_URL || 'https://api.wave.com/v1'

interface WaveCheckoutParams {
  amount: number
  currency: string
  client_reference: string
  success_url: string
  error_url: string
}

interface WaveCheckoutResponse {
  wave_launch_url: string
  id: string
}

export async function createWaveCheckout(params: WaveCheckoutParams): Promise<WaveCheckoutResponse> {
  const apiKey = process.env.WAVE_API_KEY
  if (!apiKey) {
    throw new Error('WAVE_API_KEY is not configured')
  }

  const res = await fetch(`${WAVE_API_URL}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount.toString(),
      currency: params.currency,
      client_reference: params.client_reference,
      success_url: params.success_url,
      error_url: params.error_url,
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Wave API error: ${res.status}`)
  }

  const data = await res.json()
  return { wave_launch_url: data.wave_launch_url, id: data.id }
}

export function verifyWaveWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.WAVE_WEBHOOK_SECRET
  if (!secret || !signature) return false

  try {
    let timestamp: string | null = null
    const v1Signatures: string[] = []

    for (const part of signature.split(',')) {
      const eqIdx = part.indexOf('=')
      if (eqIdx === -1) continue
      const key = part.slice(0, eqIdx).trim()
      const value = part.slice(eqIdx + 1)
      if (key === 't') timestamp = value
      else if (key === 'v1') v1Signatures.push(value)
    }

    if (!timestamp || v1Signatures.length === 0) return false

    const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10)
    if (age > 300) return false

    const expected = crypto
      .createHmac('sha256', secret)
      .update(timestamp + rawBody)
      .digest('hex')

    const expectedBuf = Buffer.from(expected, 'utf8')

    return v1Signatures.some(sig => {
      const sigBuf = Buffer.from(sig, 'utf8')
      return expectedBuf.length === sigBuf.length && crypto.timingSafeEqual(expectedBuf, sigBuf)
    })
  } catch {
    return false
  }
}
