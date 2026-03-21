import { NextRequest, NextResponse } from 'next/server'
import { sendOTP, checkRateLimit } from '@/lib/services/termii'
import { phoneSchema } from '@/lib/carnet-schemas'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessaie dans 15 minutes.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = phoneSchema.safeParse(body.phone)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Numéro invalide' },
        { status: 400 }
      )
    }

    const { pinId } = await sendOTP(parsed.data)

    return NextResponse.json({ pinId })
  } catch {
    return NextResponse.json({ error: 'Erreur envoi OTP' }, { status: 500 })
  }
}
