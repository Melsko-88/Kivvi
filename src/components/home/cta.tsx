'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.015] blur-[100px]" />

        <ScrollReveal className="relative">
          <h2 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Prêt à transformer votre
            <br className="hidden sm:block" />
            {' '}<span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              présence digitale ?
            </span>
          </h2>
          <p className="mx-auto mb-6 sm:mb-10 max-w-xl text-sm sm:text-base text-foreground/40">
            Discutons de votre projet. Devis gratuit en 48h, accompagnement
            personnalisé, résultats concrets.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/devis">
              <LiquidButton size="xl">
                <span className="flex items-center gap-2">
                  Démarrer un projet
                  <ArrowRight size={16} />
                </span>
              </LiquidButton>
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-7 py-3.5 text-sm font-medium text-foreground/60 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.06] hover:text-foreground"
            >
              Nous contacter
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
