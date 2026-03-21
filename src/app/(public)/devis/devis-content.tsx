'use client'

import { DevisWizard } from '@/components/devis/devis-wizard'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

export function DevisPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <ScrollReveal className="mb-12 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Devis gratuit
          </span>
          <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
            Décrivez votre projet
          </h1>
          <p className="text-foreground/40">
            Remplissez ce formulaire et recevez un devis détaillé sous 48h.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <DevisWizard />
        </ScrollReveal>
      </div>
    </div>
  )
}
