'use client'

import Link from 'next/link'
import { Check, ArrowRight, ChevronDown } from 'lucide-react'
import { PACKAGES, FAQ_ITEMS } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-foreground/[0.04]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-foreground/80"
      >
        <span className="pr-4 text-sm font-medium">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-foreground/30 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-foreground/40">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TarifsPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <ScrollReveal className="mb-12 sm:mb-20 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Tarifs
          </span>
          <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Des forfaits
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              pour chaque ambition
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/40">
            Transparence totale. Choisissez le forfait adapté à vos besoins.
          </p>
        </ScrollReveal>

        {/* Pricing Cards */}
        <StaggerContainer
          className="mb-12 sm:mb-24 grid gap-4 sm:gap-6 lg:grid-cols-3"
          staggerDelay={0.15}
        >
          {PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border p-4 transition-all duration-500 sm:p-8 lg:p-10 ${
                  pkg.highlighted
                    ? 'border-foreground/[0.12] bg-foreground/[0.04]'
                    : 'border-foreground/[0.04] bg-foreground/[0.015] hover:border-foreground/[0.08] hover:bg-foreground/[0.03]'
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute right-4 top-4 rounded-full border border-foreground/[0.12] bg-foreground/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/60">
                    Populaire
                  </div>
                )}

                <div className="mb-4 sm:mb-6">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-foreground/30">
                    {pkg.subtitle}
                  </span>
                  <h2 className="mt-1 font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold">
                    {pkg.name}
                  </h2>
                </div>

                <div className="mb-5 sm:mb-8">
                  <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold">
                    {formatPrice(pkg.price)}
                  </span>
                  {pkg.priceNote && (
                    <span className="mt-1 block text-[10px] sm:text-xs text-foreground/30">
                      {pkg.priceNote}
                    </span>
                  )}
                  <span className="mt-1 sm:mt-2 block text-[10px] sm:text-xs text-foreground/30">
                    Livraison : {pkg.delivery}
                  </span>
                </div>

                <ul className="mb-5 sm:mb-8 flex-1 space-y-2 sm:space-y-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-foreground/50"
                    >
                      <Check
                        size={12}
                        className="mt-0.5 shrink-0 text-foreground/25 sm:[&]:size-[14px]"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/devis" className="mt-auto">
                  {pkg.highlighted ? (
                    <LiquidButton size="lg" className="w-full">
                      Choisir ce forfait
                    </LiquidButton>
                  ) : (
                    <button className="w-full rounded-full border border-foreground/10 bg-foreground/[0.03] py-3 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.06]">
                      Choisir ce forfait
                    </button>
                  )}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* FAQ */}
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="mb-6 sm:mb-10 text-center font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold">
            Questions fréquentes
          </h2>
          <div className="rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] px-4 sm:px-8">
            {FAQ_ITEMS.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal className="mt-12 sm:mt-20 text-center" delay={0.2}>
          <p className="mb-6 text-foreground/40">
            Besoin d&apos;une solution personnalisée ?
          </p>
          <Link href="/devis">
            <LiquidButton size="xl">
              <span className="flex items-center gap-2">
                Demander un devis sur mesure
                <ArrowRight size={16} />
              </span>
            </LiquidButton>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  )
}
