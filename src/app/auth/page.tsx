'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { PhoneInput } from '@/components/carnet/phone-input'
import { OtpInput } from '@/components/carnet/otp-input'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [pinId, setPinId] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  // ─── Send OTP ────────────────────────────────────────────
  async function handleSendOTP(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur envoi OTP')
        return
      }

      setPinId(data.pinId)
      setStep('otp')
      setCountdown(60)
      startCountdown()
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // ─── Verify OTP ──────────────────────────────────────────
  async function handleVerify(code: string) {
    if (code.length !== 6) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: code, pinId, phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur vérification')
        setLoading(false)
        return
      }

      // Hard redirect to ensure cookies are fully applied before navigation
      window.location.href = data.needsOnboarding ? '/auth/onboarding' : '/app/sales'
    } catch {
      setError('Erreur de connexion')
      setLoading(false)
    }
  }

  // ─── Resend OTP ──────────────────────────────────────────
  async function handleResend() {
    setError('')
    setOtp('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur renvoi')
        return
      }

      setPinId(data.pinId)
      setCountdown(60)
      startCountdown()
    } catch {
      setError('Erreur de connexion')
    }
  }

  function startCountdown() {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  function handleOtpChange(code: string) {
    setOtp(code)
    if (code.length === 6) handleVerify(code)
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.015] blur-[100px]" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          {step === 'phone' ? (
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/30 transition-colors hover:text-foreground/60"
            >
              <ArrowLeft className="size-4" />
              Retour au site
            </a>
          ) : (
            <button
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
              }}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/30 transition-colors hover:text-foreground/60"
            >
              <ArrowLeft className="size-4" />
              Changer de numéro
            </button>
          )}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-center space-y-3"
        >
          <div className="mx-auto mb-4 inline-flex rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] p-3">
            <BookOpen className="size-6 text-foreground/60" strokeWidth={1.5} />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Carnet Digital
          </h1>
          <p className="text-foreground/40 text-sm">
            {step === 'phone'
              ? 'Ouvre ton carnet digital gratuit'
              : `Code envoyé au ${phone}`}
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease }}
              onSubmit={handleSendOTP}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/30">
                  Ton numéro de téléphone
                </label>
                <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="glass glass-hover w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-30 transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin text-foreground/60" />
                ) : (
                  <>
                    Recevoir le code
                    <ArrowRight className="size-4 text-foreground/60" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-foreground/25">
                Tu recevras un code par WhatsApp. Pas de mot de passe requis.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="block text-xs font-medium uppercase tracking-[0.2em] text-foreground/30 text-center">
                  Entre le code à 6 chiffres
                </label>
                <OtpInput value={otp} onChange={handleOtpChange} disabled={loading} />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {loading && (
                <div className="flex justify-center">
                  <Loader2 className="size-5 animate-spin text-foreground/30" />
                </div>
              )}

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-foreground/25">
                    Renvoyer dans {countdown}s
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm font-medium text-foreground/40 transition-colors hover:text-foreground/70 underline underline-offset-2"
                  >
                    Renvoyer le code
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
