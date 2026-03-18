"use client"

import { ArrowRight } from 'lucide-react'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

export function ServicesCTA() {
  return (
    <section className="py-20 gradient-mesh grain-overlay">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Un projet en tête ?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Décrivez votre besoin et recevez un devis personnalisé sous 24h.
          </p>
          <div className="mt-8">
            <LiquidGlassButton href="/devis" variant="primary" size="lg">
              Demander un devis gratuit
              <ArrowRight className="h-5 w-5" />
            </LiquidGlassButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
