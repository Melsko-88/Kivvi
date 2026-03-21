'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, WifiOff, BarChart3, Bell, Shield, ArrowRight } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Ventes & Dettes',
    description: 'Enregistre chaque vente en 3 secondes. Suis tes crédits client et reçois les paiements via Wave.',
  },
  {
    icon: WifiOff,
    title: '100% Hors-ligne',
    description: 'Fonctionne sans internet. Tes données se synchronisent automatiquement quand tu te reconnectes.',
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord',
    description: 'Ventes du jour, profit, top produits, dettes totales — tout en un coup d\'oeil.',
  },
  {
    icon: Bell,
    title: 'Rappels WhatsApp',
    description: 'Envoie des rappels de dette à tes clients par WhatsApp en un tap.',
  },
  {
    icon: Shield,
    title: 'Paiement Wave',
    description: 'Génère des liens de paiement Wave pour encaisser tes dettes à distance.',
  },
]

export function CarnetDigital() {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-24 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-foreground/[0.015] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <span className="mb-6 inline-flex items-center rounded-full border border-foreground/[0.06] bg-foreground/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground/30">
            Nouveau — Gratuit
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            Carnet Digital
          </h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/40 sm:text-lg leading-relaxed">
            L&apos;outil gratuit pour les commerçants africains. Remplace ton cahier papier
            par un carnet digital qui fonctionne même sans internet.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12" staggerDelay={0.08}>
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="glass glass-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full group"
              >
                <div className="mb-2 sm:mb-4 inline-flex rounded-lg sm:rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] p-1.5 sm:p-2.5 transition-colors duration-300 group-hover:border-foreground/[0.12] group-hover:bg-foreground/[0.06]">
                  <feature.icon className="size-4 sm:size-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/40 leading-relaxed">
                  {feature.description}
                </p>
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-foreground/[0.02] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            </StaggerItem>
          ))}

          {/* CTA Card */}
          <StaggerItem>
            <Link href="/auth" className="block h-full">
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="glass glass-hover relative rounded-xl sm:rounded-2xl border border-foreground/[0.06] p-4 sm:p-6 h-full flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[180px] cursor-pointer group"
              >
                <div className="mb-3 inline-flex rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] p-3 transition-colors duration-300 group-hover:border-foreground/[0.12] group-hover:bg-foreground/[0.06]">
                  <ArrowRight className="size-6 text-foreground/60 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <span className="text-sm sm:text-lg font-bold mb-1">
                  Ouvre ton carnet
                </span>
                <span className="text-xs sm:text-sm text-foreground/40">
                  Gratuit, sans engagement
                </span>
              </motion.div>
            </Link>
          </StaggerItem>
        </StaggerContainer>

        <ScrollReveal className="text-center">
          <p className="text-xs text-foreground/25">
            PWA installable sur téléphone — Aucun téléchargement requis
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
