'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Store, UtensilsCrossed, Scissors, Hammer, MoreHorizontal, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ShopType } from '@/lib/carnet-types'

const SHOP_ICONS = {
  boutique: Store,
  restaurant: UtensilsCrossed,
  salon: Scissors,
  atelier: Hammer,
  autre: MoreHorizontal,
} as const

const SHOP_OPTIONS: { value: ShopType; label: string }[] = [
  { value: 'boutique', label: 'Boutique' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'salon', label: 'Salon de coiffure' },
  { value: 'atelier', label: 'Atelier / Couture' },
  { value: 'autre', label: 'Autre' },
]

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopType, setShopType] = useState<ShopType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleComplete() {
    if (!shopType) return

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        phone: user.phone || '',
        name,
        shop_name: shopName,
        shop_type: shopType,
      })

      if (insertError) {
        setError('Erreur lors de la création du profil')
        return
      }

      router.push('/app/sales')
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex gap-1.5 mb-10">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-foreground' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Comment tu t&apos;appelles ?</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton prénom"
              autoFocus
              className="glass-input w-full px-4 py-3 rounded-xl text-lg"
            />
            <button
              onClick={() => setStep(1)}
              disabled={name.length < 2}
              className="w-full py-3 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            >
              Continuer <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour
            </button>
            <h1 className="text-2xl font-semibold">
              Ta boutique s&apos;appelle comment ?
            </h1>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Nom de ta boutique"
              autoFocus
              className="glass-input w-full px-4 py-3 rounded-xl text-lg"
            />
            <button
              onClick={() => setStep(2)}
              disabled={shopName.length < 2}
              className="w-full py-3 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            >
              Continuer <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour
            </button>
            <h1 className="text-2xl font-semibold">Qu&apos;est-ce que tu vends ?</h1>
            <div className="space-y-2">
              {SHOP_OPTIONS.map((opt) => {
                const Icon = SHOP_ICONS[opt.value]
                const selected = shopType === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setShopType(opt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                      selected
                        ? 'border-foreground bg-foreground/5'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              onClick={handleComplete}
              disabled={!shopType || loading}
              className="w-full py-3 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Ouvrir mon carnet <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
