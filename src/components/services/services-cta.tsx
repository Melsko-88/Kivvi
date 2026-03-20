"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared/button'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

export function ServicesCTA() {
  return (
    <section className="py-24 section-dark">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#F5F2ED] sm:text-4xl">
            Un projet en tête ?
          </h2>
          <p className="mt-4 text-[#999]">
            Décrivez votre besoin et recevez un devis personnalisé sous 24h.
          </p>
          <div className="mt-8">
            <Button href="/devis" variant="primary" size="lg">
              Demander un devis gratuit
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
