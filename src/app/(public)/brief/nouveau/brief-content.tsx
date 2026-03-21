'use client'

import { BriefWizard } from '@/components/brief/brief-wizard'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

export function BriefContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <ScrollReveal className="mb-12 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Brief projet
          </span>
          <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
            Décrivez votre vision
          </h1>
          <p className="text-foreground/40">
            Quelques questions pour bien comprendre votre projet.
            Réponse personnalisée sous 24h.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <BriefWizard />
        </ScrollReveal>
      </div>
    </div>
  )
}
