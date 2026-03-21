'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { devisSchema, type DevisFormValues } from '@/lib/schemas'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

const STEPS = ['Projet', 'Détails', 'Contact']

const FEATURES_OPTIONS = [
  'Design responsive',
  'Paiement en ligne',
  'Multi-langue',
  'Blog / Actualités',
  'Espace membre',
  'Tableau de bord',
  'Notifications push',
  'API / Intégrations',
  'SEO avancé',
  'Maintenance',
]

export function DevisWizard() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<DevisFormValues>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      features: [],
    },
  })

  const selectedFeatures = watch('features') || []
  const selectedType = watch('type')

  const toggleFeature = (feature: string) => {
    const current = selectedFeatures
    setValue(
      'features',
      current.includes(feature)
        ? current.filter((f) => f !== feature)
        : [...current, feature]
    )
  }

  const nextStep = async () => {
    let valid = false
    if (step === 0) valid = await trigger(['type', 'description', 'budget'])
    else if (step === 1) valid = await trigger(['features'])
    else valid = true

    if (valid) setStep(step + 1)
  }

  const onSubmit = async (data: DevisFormValues) => {
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
      <div className="flex flex-col items-center rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-12 text-center">
        <CheckCircle size={48} className="mb-6 text-foreground/30" strokeWidth={1} />
        <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold">
          Demande envoyée !
        </h3>
        <p className="max-w-md text-sm text-foreground/40">
          Merci pour votre demande. Nous analysons votre projet et vous
          enverrons un devis détaillé sous 48h.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-8 lg:p-10">
      {/* Progress */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-all ${
                i <= step
                  ? 'border-foreground/20 bg-foreground/[0.06] text-foreground'
                  : 'border-foreground/[0.06] text-foreground/25'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-xs sm:inline ${
                i <= step ? 'text-foreground/60' : 'text-foreground/20'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px w-8 ${
                  i < step ? 'bg-foreground/20' : 'bg-foreground/[0.06]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Type de projet *
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DEVIS_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        selectedType === type.value
                          ? 'border-foreground/20 bg-foreground/[0.06]'
                          : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1]'
                      }`}
                    >
                      <input
                        {...register('type')}
                        type="radio"
                        value={type.value}
                        className="hidden"
                      />
                      <span className="block text-sm font-medium">
                        {type.label}
                      </span>
                      <span className="text-xs text-foreground/30">
                        {type.description}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.type && (
                  <p className="mt-2 text-xs text-red-400/60">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Description du projet *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="glass-input w-full resize-none px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                  placeholder="Décrivez votre projet, vos objectifs, votre cible..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-400/60">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Budget estimé *
                </label>
                <select
                  {...register('budget')}
                  className="glass-input w-full appearance-none px-4 py-3 text-sm text-foreground"
                >
                  <option value="" className="bg-card">
                    Sélectionnez un budget
                  </option>
                  {BUDGET_RANGES.map((range) => (
                    <option
                      key={range.value}
                      value={range.value}
                      className="bg-card"
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-400/60">{errors.budget.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Features */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Fonctionnalités souhaitées
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FEATURES_OPTIONS.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                        selectedFeatures.includes(feature)
                          ? 'border-foreground/20 bg-foreground/[0.06] text-foreground'
                          : 'border-foreground/[0.06] text-foreground/40 hover:border-foreground/[0.1]'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Deadline souhaitée
                </label>
                <input
                  {...register('deadline')}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                  placeholder="Ex: Fin mars 2026, Pas de deadline..."
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                    Nom *
                  </label>
                  <input
                    {...register('name')}
                    className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                    placeholder="Votre nom"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400/60">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                    placeholder="email@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400/60">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                    Téléphone *
                  </label>
                  <input
                    {...register('phone')}
                    className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                    placeholder="+221 77 000 00 00"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400/60">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                    Entreprise
                  </label>
                  <input
                    {...register('company')}
                    className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
            >
              <ArrowLeft size={14} />
              Retour
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.08]"
            >
              Suivant
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.08] disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Envoyer la demande
                </>
              )}
            </button>
          )}
        </div>

        {status === 'error' && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400/60">
            <AlertCircle size={14} />
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}
      </form>
    </div>
  )
}
