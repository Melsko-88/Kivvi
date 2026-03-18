"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { devisSchema, type DevisFormValues } from '@/lib/schemas'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { cn } from '@/lib/utils'

const STEPS = ['Type de projet', 'Description', 'Budget', 'Vos coordonnées']

const FEATURE_OPTIONS = [
  'Design sur mesure',
  'Multi-langue',
  'Paiement en ligne',
  'Espace administration',
  'Blog / Actualités',
  'SEO avancé',
  'Notifications',
  'Mode hors-ligne',
  'API / Intégrations',
  'Analytics',
]

export function DevisWizard() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DevisFormValues>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      type: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      description: '',
      budget: '',
      deadline: '',
      features: [],
    },
  })

  const selectedType = watch('type')
  const selectedBudget = watch('budget')
  const selectedFeatures = watch('features') || []

  function toggleFeature(feature: string) {
    const current = selectedFeatures
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature]
    setValue('features', updated)
  }

  async function nextStep() {
    const fieldsPerStep: (keyof DevisFormValues)[][] = [
      ['type'],
      ['description'],
      ['budget'],
      ['name', 'email', 'phone'],
    ]
    const valid = await trigger(fieldsPerStep[step])
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  async function onSubmit(data: DevisFormValues) {
    setStatus('loading')
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card p-10 rounded-xl text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2">Demande envoyée !</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Merci pour votre confiance. Nous étudions votre demande et vous enverrons
          une proposition personnalisée sous 48 heures.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-8 rounded-xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(
                'text-xs font-medium transition-colors',
                i <= step ? 'text-primary' : 'text-muted-foreground/50'
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Type */}
        {step === 0 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-6">
              Quel type de projet ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEVIS_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setValue('type', t.value)}
                  className={cn(
                    'text-left p-4 rounded-xl border transition-all',
                    selectedType === t.value
                      ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(37,99,235,0.2)]'
                      : 'border-border bg-white/[0.02] hover:border-white/20'
                  )}
                >
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-400 mt-2">{errors.type.message}</p>}
          </div>
        )}

        {/* Step 2: Description + Features */}
        {step === 1 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-6">
              Décrivez votre projet
            </h3>
            <textarea
              {...register('description')}
              rows={5}
              className={cn(
                'w-full bg-white/5 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none mb-5',
                errors.description && 'border-red-500'
              )}
              placeholder="Décrivez votre projet, vos objectifs, votre public cible..."
            />
            {errors.description && <p className="text-xs text-red-400 mb-4">{errors.description.message}</p>}

            <p className="text-sm font-medium mb-3">Fonctionnalités souhaitées (optionnel)</p>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                    selectedFeatures.includes(f)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget + Deadline */}
        {step === 2 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-6">
              Quel est votre budget ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BUDGET_RANGES.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setValue('budget', b.value)}
                  className={cn(
                    'text-left p-4 rounded-xl border transition-all',
                    selectedBudget === b.value
                      ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(37,99,235,0.2)]'
                      : 'border-border bg-white/[0.02] hover:border-white/20'
                  )}
                >
                  <p className="font-[family-name:var(--font-mono)] text-sm font-medium">{b.label}</p>
                </button>
              ))}
            </div>
            {errors.budget && <p className="text-xs text-red-400 mb-4">{errors.budget.message}</p>}

            <div>
              <label className="block text-sm font-medium mb-1.5">Délai souhaité (optionnel)</label>
              <input
                {...register('deadline')}
                type="text"
                className="w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ex: 1 mois, fin mars, ASAP..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact info */}
        {step === 3 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-6">
              Vos coordonnées
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nom complet *</label>
                <input
                  {...register('name')}
                  className={cn(
                    'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
                    errors.name && 'border-red-500'
                  )}
                  placeholder="Votre nom complet"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn(
                      'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
                      errors.email && 'border-red-500'
                    )}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Téléphone *</label>
                  <input
                    {...register('phone')}
                    className={cn(
                      'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
                      errors.phone && 'border-red-500'
                    )}
                    placeholder="+221 77 xxx xx xx"
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Entreprise / Organisation</label>
                <input
                  {...register('company')}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Nom de votre entreprise (optionnel)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <LiquidGlassButton type="submit" variant="primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
              <Send className="h-4 w-4" />
            </LiquidGlassButton>
          )}
        </div>
      </form>
    </div>
  )
}
