import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Store, Clock, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react'
import { createWaveCheckout } from '@/lib/services/wave'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/carnet-constants'
import { createClient } from '@supabase/supabase-js'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 10
const WINDOW_MS = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_REQUESTS) return false

  entry.count++
  return true
}

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

interface PaymentData {
  id: string
  amount: number
  description: string | null
  status: string
  commission_rate: number
  expires_at: string
  created_at: string
  wave_checkout_id: string | null
  user_id: string
  profiles: { shop_name: string; currency: string } | null
  clients: { name: string } | null
}

async function getPaymentLink(id: string): Promise<PaymentData | null> {
  const supabase = createAnonClient()

  const { data } = await supabase
    .from('payment_links')
    .select('id, amount, description, status, commission_rate, expires_at, created_at, wave_checkout_id, user_id, profiles(shop_name, currency), clients(name)')
    .eq('id', id)
    .single()

  return data as PaymentData | null
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!checkRateLimit(ip)) {
    return (
      <PageShell>
        <StatusCard
          icon={<AlertTriangle className="size-8 text-amber-400" />}
          title="Trop de requêtes"
          message="Veuillez patienter quelques instants avant de réessayer."
        />
      </PageShell>
    )
  }

  const link = await getPaymentLink(id)

  if (!link) {
    return (
      <PageShell>
        <StatusCard
          icon={<AlertTriangle className="size-8 text-red-400" />}
          title="Lien introuvable"
          message="Ce lien de paiement n'existe pas ou a été supprimé."
        />
      </PageShell>
    )
  }

  if (link.status === 'paid') {
    return (
      <PageShell>
        <StatusCard
          icon={
            <div className="animate-scale-in">
              <CheckCircle className="size-10 text-emerald-400" />
            </div>
          }
          title="Paiement confirmé"
          message="Ce paiement a été effectué avec succès. Merci !"
          variant="success"
        />
      </PageShell>
    )
  }

  if (link.status === 'expired' || isExpired(link.expires_at)) {
    return (
      <PageShell>
        <StatusCard
          icon={<Clock className="size-8 text-amber-400" />}
          title="Ce lien a expiré"
          message="Contactez le commerçant pour obtenir un nouveau lien de paiement."
        />
      </PageShell>
    )
  }

  const shopName = link.profiles?.shop_name || 'Commerçant'
  const clientName = link.clients?.name
  const currency = link.profiles?.currency || 'XOF'

  async function handlePay() {
    'use server'

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kivvi.tech'

    const checkout = await createWaveCheckout({
      amount: link!.amount,
      currency,
      client_reference: `kivvi_pay_${link!.id}`,
      success_url: `${siteUrl}/pay/${link!.id}`,
      error_url: `${siteUrl}/pay/${link!.id}`,
    })

    await supabaseAdmin
      .from('payment_links')
      .update({ wave_checkout_id: checkout.id })
      .eq('id', link!.id)

    redirect(checkout.wave_launch_url)
  }

  return (
    <PageShell>
      <div className="w-full max-w-md mx-auto animate-slide-up">
        {/* Main glass card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Header */}
          <div className="px-6 pt-8 pb-6 text-center">
            <div
              className="inline-flex items-center justify-center size-14 rounded-2xl mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Store className="size-7 text-white/80" />
            </div>
            <h2 className="text-white font-semibold text-lg tracking-tight">{shopName}</h2>
            {clientName && (
              <p className="text-white/40 text-sm mt-1">Pour {clientName}</p>
            )}
          </div>

          {/* Separator */}
          <div
            className="mx-6"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent 100%)',
            }}
          />

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            {/* Amount */}
            <div className="text-center">
              <p className="text-sm text-white/40 mb-2">Montant à payer</p>
              <p className="text-4xl font-bold text-white tracking-tight">
                {formatCurrency(link.amount, currency)}
              </p>
            </div>

            {/* Description */}
            {link.description && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <p className="text-xs text-white/30 mb-0.5">Description</p>
                <p className="text-sm text-white/70">{link.description}</p>
              </div>
            )}

            {/* Wave Pay Button */}
            <form action={handlePay}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#1DC3F1] hover:bg-[#18a8cf] text-white font-semibold py-4 rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
                style={{
                  boxShadow: '0 0 30px rgba(29, 195, 241, 0.15)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dzi8whann/image/upload/v1772014289/tiak-tiak/icons/transport/dgbwn7kcgwakswxmwyls.png"
                  alt="Wave"
                  width={24}
                  height={24}
                  className="size-6"
                />
                Payer avec Wave
              </button>
            </form>

            {/* Security note */}
            <div className="flex items-center gap-1.5 justify-center text-xs text-white/25">
              <ShieldCheck className="size-3.5" />
              <span>Paiement sécurisé via Wave</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6">
          Propulsé par <span className="font-semibold text-white/35">Kivvi</span>
        </p>
      </div>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex items-center justify-center px-4 py-8 relative"
      style={{
        background: 'linear-gradient(180deg, #030712 0%, #111827 50%, #030712 100%)',
      }}
    >
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.4,
        }}
      />
      {/* Subtle radial glow behind card */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(255,255,255,0.02) 0%, transparent 100%)',
        }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  title,
  message,
  variant,
}: {
  icon: React.ReactNode
  title: string
  message: string
  variant?: 'success' | 'error' | 'warning'
}) {
  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div
        className="rounded-2xl px-6 py-10 text-center space-y-3"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex justify-center">{icon}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/50">{message}</p>
      </div>
      <p className="text-center text-xs text-white/20 mt-6">
        Propulsé par <span className="font-semibold text-white/35">Kivvi</span>
      </p>
    </div>
  )
}
