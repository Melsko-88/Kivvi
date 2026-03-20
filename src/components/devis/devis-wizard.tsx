"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { devisSchema, type DevisFormValues } from '@/lib/schemas'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import { Button } from '@/components/shared/button'
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
      <div className="bg-[#F3F1EE] border border-[#E8E5E0] p-10 rounded-xl text-center">
        <CheckCircle className="h-14 w-14 text-[#4A7C59] mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1A1A] mb-2">Demande envoyée !</h3>
        <p className="text-[#6B6B6B] max-w-md mx-auto">
          Merci pour votre confiance. Nous étudions votre demande et vous enverrons
          une proposition personnalisée sous 48 heures.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E8E5E0] p-8 rounded-xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(
                'text-xs font-medium transition-colors',
                i <= step ? 'text-copper' : 'text-[#999]'
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="h-1 bg-[#E8E5E0] rounded-full overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-[#C75050] bg-[#C75050]/10 px-4 py-3 rounded-lg mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Type */}
        {step === 0 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#1A1A1A] mb-6">
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
                      ? 'border-copper bg-copper/5'
                      : 'border-[#E8E5E0] bg-[#FAFAF7] hover:border-copper/40'
                  )}
                >
                  <p className="font-medium text-sm text-[#1A1A1A]">{t.label}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-[#C75050] mt-2">{errors.type.message}</p>}
          </div>
        )}

        {/* Step 2: Description + Features */}
        {step === 1 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#1A1A1A] mb-6">
              Décrivez votre projet
            </h3>
            <textarea
              {...register('description')}
              rows={5}
              className={cn(
                'w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors resize-none mb-5',
                errors.description && 'border-[#C75050]'
              )}
              placeholder="Décrivez votre projet, vos objectifs, votre public cible..."
            />
            {errors.description && <p className="text-xs text-[#C75050] mb-4">{errors.description.message}</p>}

            <p className="text-sm font-medium text-[#1A1A1A] mb-3">Fonctionnalités souhaitées (optionnel)</p>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                    selectedFeatures.includes(f)
                      ? 'border-copper bg-copper/10 text-copper'
                      : 'border-[#E8E5E0] text-[#6B6B6B] hover:text-[#1A1A1A]'
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
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#1A1A1A] mb-6">
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
                      ? 'border-copper bg-copper/5'
                      : 'border-[#E8E5E0] bg-[#FAFAF7] hover:border-copper/40'
                  )}
                >
                  <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-[#1A1A1A]">{b.label}</p>
                </button>
              ))}
            </div>
            {errors.budget && <p className="text-xs text-[#C75050] mb-4">{errors.budget.message}</p>}

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Délai souhaité (optionnel)</label>
              <input
                {...register('deadline')}
                type="text"
                className="w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                placeholder="Ex: 1 mois, fin mars, ASAP..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact info */}
        {step === 3 && (
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#1A1A1A] mb-6">
              Vos coordonnées
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Nom complet *</label>
                <input
                  {...register('name')}
                  className={cn(
                    'w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors',
                    errors.name && 'border-[#C75050]'
                  )}
                  placeholder="Votre nom complet"
                />
                {errors.name && <p className="text-xs text-[#C75050] mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn(
                      'w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors',
                      errors.email && 'border-[#C75050]'
                    )}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-xs text-[#C75050] mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Téléphone *</label>
                  <input
                    {...register('phone')}
                    className={cn(
                      'w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors',
                      errors.phone && 'border-[#C75050]'
                    )}
                    placeholder="+221 77 xxx xx xx"
                  />
                  {errors.phone && <p className="text-xs text-[#C75050] mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Entreprise / Organisation</label>
                <input
                  {...register('company')}
                  className="w-full bg-[#FAFAF7] border border-[#E8E5E0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                  placeholder="Nom de votre entreprise (optionnel)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E5E0]">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
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
              className="flex items-center gap-2 text-sm font-medium text-copper hover:text-copper-hover transition-colors"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Button type="submit" variant="primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
