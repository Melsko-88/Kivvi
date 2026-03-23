'use client'

import { useState, useEffect } from 'react'
import { LogOut, Trash2, User, Store, Phone, Globe, Loader2, Crown, Package, Zap, Download } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { usePlan } from '@/hooks/use-plan'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, SUBSCRIPTION_PRICES, PACK_PRICES, PACK_DETAILS } from '@/lib/carnet-constants'
import { UpsellModal } from '@/components/carnet/upsell-modal'
import { AutoReminderForm } from '@/components/carnet/auto-reminder-form'
import type { UsagePack } from '@/lib/carnet-types'

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const { planStatus, loading: planLoading, refresh, isPro } = usePlan(user?.id)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Handle payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const checkoutId = params.get('id')

    if (paymentStatus === 'success' && checkoutId) {
      // Poll for activation
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        if (attempts > 15) {
          clearInterval(poll)
          return
        }
        try {
          const res = await fetch(`/api/checkout/status?id=${checkoutId}`)
          const data = await res.json()
          if (data.status === 'active' || data.status === 'completed') {
            clearInterval(poll)
            setPaymentSuccess(true)
            refresh()
            // Clean URL
            window.history.replaceState({}, '', '/app/settings')
            setTimeout(() => setPaymentSuccess(false), 5000)
          }
        } catch {}
      }, 2000)

      return () => clearInterval(poll)
    }

    // Handle upgrade param from pricing page
    const upgrade = params.get('upgrade')
    if (upgrade === 'pro' || upgrade === 'business') {
      handleCheckout('subscription', upgrade)
      window.history.replaceState({}, '', '/app/settings')
    }
  }, [])

  async function handleCheckout(type: 'subscription' | 'pack', planOrPack: string) {
    setCheckingOut(planOrPack)
    try {
      const body = type === 'subscription'
        ? { type: 'subscription', plan: planOrPack }
        : { type: 'pack', packType: planOrPack }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Checkout failed')
      const { checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    } catch {
      setCheckingOut(null)
    }
  }

  async function handleSignOut() {
    await signOut()
    window.location.href = '/auth'
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        await supabase.from('profiles').delete().eq('id', currentUser.id)
      }
      await signOut()
      window.location.href = '/auth'
    } finally {
      setDeleting(false)
    }
  }

  async function handleExportCSV(exportType: 'sales' | 'products' | 'debts') {
    try {
      const res = await fetch('/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: exportType }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kivvi-${exportType}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {}
  }

  const planLabels: Record<string, string> = { free: 'Gratuit', pro: 'Pro', business: 'Business' }
  const currentPlan = planStatus?.plan || 'free'

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paramètres</h2>

      {paymentSuccess && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-sm font-medium text-green-700">Paiement confirmé ! Votre plan a été mis à jour.</p>
        </div>
      )}

      {/* Abonnement */}
      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Abonnement
        </h3>
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Plan {planLabels[currentPlan]}</p>
                {currentPlan !== 'free' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">
                    {currentPlan.toUpperCase()}
                  </span>
                )}
              </div>
              {planStatus?.expiresAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Expire le {new Date(planStatus.expiresAt).toLocaleDateString('fr-FR')}
                  {planStatus.daysRemaining !== null && ` (${planStatus.daysRemaining}j restants)`}
                </p>
              )}
              {currentPlan === 'free' && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {planStatus ? `${planStatus.productCount}/${planStatus.effectiveProductLimit === Infinity ? '∞' : planStatus.effectiveProductLimit} produits` : '50 produits, 3 rappels/jour'}
                </p>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              currentPlan !== 'free' ? 'bg-green-100 text-green-700' : 'bg-muted'
            }`}>
              Actif
            </span>
          </div>

          {currentPlan !== 'free' && (
            <div className="border-t border-border px-4 py-2">
              <button
                onClick={() => handleCheckout('subscription', currentPlan)}
                disabled={!!checkingOut}
                className="text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {checkingOut === currentPlan ? 'Redirection...' : 'Renouveler'}
              </button>
            </div>
          )}

          {currentPlan === 'free' && (
            <div className="border-t border-border px-4 py-3 flex gap-2">
              <button
                onClick={() => handleCheckout('subscription', 'pro')}
                disabled={!!checkingOut}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-foreground text-background text-sm font-medium transition-opacity hover:opacity-90"
              >
                {checkingOut === 'pro' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Crown className="size-4" />
                )}
                Pro · {formatCurrency(SUBSCRIPTION_PRICES.pro)}/mois
              </button>
              <button
                onClick={() => handleCheckout('subscription', 'business')}
                disabled={!!checkingOut}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                {checkingOut === 'business' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Zap className="size-4" />
                )}
                Business
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Packs actifs */}
      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Packs & Options
        </h3>
        <div className="glass rounded-xl divide-y divide-border">
          {planStatus?.activePacks && planStatus.activePacks.length > 0 ? (
            planStatus.activePacks.map((pack: UsagePack) => (
              <div key={pack.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {PACK_DETAILS[pack.pack_type as keyof typeof PACK_DETAILS]?.label || pack.pack_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pack.pack_type === 'commission_reduction' && pack.expires_at
                      ? `Expire le ${new Date(pack.expires_at).toLocaleDateString('fr-FR')}`
                      : `${pack.remaining} restant${pack.remaining > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Actif
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-muted-foreground">Aucun pack actif</p>
            </div>
          )}

          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Acheter un pack</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCheckout('pack', 'products')}
                disabled={!!checkingOut}
                className="flex-1 text-xs py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
              >
                {checkingOut === 'products' ? '...' : `+50 produits · ${formatCurrency(PACK_PRICES.products)}`}
              </button>
              <button
                onClick={() => handleCheckout('pack', 'reminders')}
                disabled={!!checkingOut}
                className="flex-1 text-xs py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
              >
                {checkingOut === 'reminders' ? '...' : `+20 rappels · ${formatCurrency(PACK_PRICES.reminders)}`}
              </button>
            </div>
            <button
              onClick={() => handleCheckout('pack', 'commission_reduction')}
              disabled={!!checkingOut}
              className="w-full text-xs py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
            >
              {checkingOut === 'commission_reduction' ? '...' : `Commission 1% (30j) · ${formatCurrency(PACK_PRICES.commission_reduction)}`}
            </button>
          </div>
        </div>
      </section>

      {/* Auto-reminders */}
      <AutoReminderForm
        isPro={isPro}
        onUpgrade={() => setShowUpsell(true)}
      />

      {/* Export CSV (Pro) */}
      {isPro && (
        <section className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
            Exporter les données
          </h3>
          <div className="glass rounded-xl divide-y divide-border">
            {(['sales', 'products', 'debts'] as const).map(t => (
              <button
                key={t}
                onClick={() => handleExportCSV(t)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <Download className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t === 'sales' ? 'Ventes' : t === 'products' ? 'Produits' : 'Dettes'} (CSV)
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Profil */}
      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Profil
        </h3>
        <div className="glass rounded-xl divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <User className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">Nom</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Store className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.shop_name}</p>
              <p className="text-xs text-muted-foreground">Boutique</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.phone}</p>
              <p className="text-xs text-muted-foreground">Téléphone</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Globe className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Français</p>
              <p className="text-xs text-muted-foreground">Langue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compte */}
      <section className="space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <LogOut className="size-4" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="size-4" />
            <span className="text-sm font-medium">Supprimer mon compte</span>
          </button>
        ) : (
          <div className="border border-destructive/30 rounded-xl p-4 space-y-3">
            <p className="text-sm">
              Toutes tes données seront supprimées définitivement. Cette action
              est irréversible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium flex items-center justify-center"
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : 'Confirmer'}
              </button>
            </div>
          </div>
        )}
      </section>

      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        type="feature"
        featureName="Rappels automatiques"
      />
    </div>
  )
}
