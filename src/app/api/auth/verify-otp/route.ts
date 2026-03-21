import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifyOTP } from '@/lib/services/termii'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { otpSchema, phoneSchema } from '@/lib/carnet-schemas'
import crypto from 'crypto'

function derivePassword(phone: string): string {
  return crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(phone)
    .digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const pinParsed = otpSchema.safeParse(body.pin)
    if (!pinParsed.success) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 })
    }

    const phoneParsed = phoneSchema.safeParse(body.phone)
    if (!phoneParsed.success || !body.pinId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const phone = phoneParsed.data
    const verified = await verifyOTP(body.pinId, pinParsed.data)

    if (!verified) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 401 })
    }

    const email = `${phone}@phone.kivvi.tech`
    const password = derivePassword(phone)

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .single()

    if (!existingProfile) {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        phone,
        email_confirm: true,
        phone_confirm: true,
      })

      if (createError && !createError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Erreur création compte' }, { status: 500 })
      }
    }

    const response = NextResponse.json({
      needsOnboarding: !existingProfile,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: 'Erreur connexion' }, { status: 500 })
    }

    return response
  } catch {
    return NextResponse.json({ error: 'Erreur vérification' }, { status: 500 })
  }
}
