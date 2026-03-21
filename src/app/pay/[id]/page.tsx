import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Store, CreditCard, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { createWaveCheckout } from '@/lib/services/wave'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/carnet-constants'

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
          icon={<AlertTriangle className="size-8 text-amber-500" />}
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
          icon={<AlertTriangle className="size-8 text-red-500" />}
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
          icon={<CheckCircle className="size-8 text-emerald-500" />}
          title="Déjà payé"
          message="Ce paiement a déjà été effectué. Merci !"
        />
      </PageShell>
    )
  }

  if (link.status === 'expired' || isExpired(link.expires_at)) {
    return (
      <PageShell>
        <StatusCard
          icon={<Clock className="size-8 text-amber-500" />}
          title="Lien expiré"
          message="Ce lien de paiement a expiré. Contactez le commerçant pour en obtenir un nouveau."
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
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/10 mb-4">
              <Store className="size-7 text-white" />
            </div>
            <h2 className="text-white font-semibold text-lg">{shopName}</h2>
            {clientName && (
              <p className="text-white/60 text-sm mt-1">Pour {clientName}</p>
            )}
          </div>

          <div className="px-6 py-8 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Montant à payer</p>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">
                {formatCurrency(link.amount, currency)}
              </p>
            </div>

            {link.description && (
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-sm text-gray-500 mb-0.5">Description</p>
                <p className="text-sm text-gray-700">{link.description}</p>
              </div>
            )}

            <form action={handlePay}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#1DC1EC] hover:bg-[#18a8cf] text-white font-semibold py-4 rounded-xl transition-colors active:scale-[0.98]"
              >
                <Zap className="size-5" />
                Payer via Wave
              </button>
            </form>

            <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
              <CreditCard className="size-3.5" />
              <span>Paiement sécurisé via Wave</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Propulsé par <span className="font-semibold text-gray-500">Kivvi</span>
        </p>
      </div>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50 flex items-center justify-center px-4 py-8">
      {children}
    </div>
  )
}

function StatusCard({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-10 text-center space-y-3">
        <div className="flex justify-center">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        Propulsé par <span className="font-semibold text-gray-500">Kivvi</span>
      </p>
    </div>
  )
}
