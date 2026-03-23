'use client'

import { useState } from 'react'
import { X, Crown, Package } from 'lucide-react'
import { SUBSCRIPTION_PRICES, PACK_PRICES, formatCurrency } from '@/lib/carnet-constants'

interface UpsellModalProps {
  open: boolean
  onClose: () => void
  type: 'products' | 'reminders' | 'feature'
  currentUsage?: { used: number; limit: number }
  featureName?: string
}

export function UpsellModal({ open, onClose, type, currentUsage, featureName }: UpsellModalProps) {
  const [loading, setLoading] = useState<'pack' | 'pro' | null>(null)

  if (!open) return null

  const titles: Record<string, string> = {
    products: 'Limite de produits atteinte',
    reminders: 'Quota de rappels atteint',
    feature: `Fonctionnalité ${featureName || 'Pro'}`,
  }

  const descriptions: Record<string, string> = {
    products: currentUsage
      ? `Vous utilisez ${currentUsage.used}/${currentUsage.limit} produits sur le plan Gratuit`
      : 'Vous avez atteint la limite de produits',
    reminders: currentUsage
      ? `Vous avez utilisé ${currentUsage.used}/${currentUsage.limit} rappels aujourd'hui`
      : 'Vous avez atteint le quota de rappels',
    feature: 'Cette fonctionnalité est réservée aux abonnés Pro et Business',
  }

  const packOptions: Record<string, { label: string; price: number; packType: string } | null> = {
    products: { label: '+50 produits (permanent)', price: PACK_PRICES.products, packType: 'products' },
    reminders: { label: '+20 rappels WhatsApp', price: PACK_PRICES.reminders, packType: 'reminders' },
    feature: null,
  }

  async function handleCheckout(checkoutType: 'pack' | 'pro') {
    setLoading(checkoutType)
    try {
      const body = checkoutType === 'pro'
        ? { type: 'subscription', plan: 'pro' }
        : { type: 'pack', packType: packOptions[type]?.packType }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Checkout failed')

      const { checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    } catch {
      setLoading(null)
    }
  }

  const pack = packOptions[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="bg-background rounded-2xl max-w-sm w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold">{titles[type]}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground px-5 pb-4">{descriptions[type]}</p>

        <div className="px-5 pb-5 space-y-3">
          {pack && (
            <button
              onClick={() => handleCheckout('pack')}
              disabled={!!loading}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors text-left"
            >
              <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Package className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{pack.label}</p>
                <p className="text-xs text-muted-foreground">Paiement unique</p>
              </div>
              <span className="text-sm font-bold shrink-0">
                {loading === 'pack' ? '...' : formatCurrency(pack.price)}
              </span>
            </button>
          )}

          <button
            onClick={() => handleCheckout('pro')}
            disabled={!!loading}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors text-left relative"
          >
            <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">
              Recommandé
            </span>
            <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
              <Crown className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Passer au Pro</p>
              <p className="text-xs text-muted-foreground">Tout illimité + export + dashboard avancé</p>
            </div>
            <span className="text-sm font-bold shrink-0">
              {loading === 'pro' ? '...' : `${formatCurrency(SUBSCRIPTION_PRICES.pro)}/mois`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
