'use client'

import { SERVICES, ILLUSTRATIONS } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import {
  Globe,
  Building2,
  ShoppingCart,
  GraduationCap,
  Smartphone,
  Mail,
  Server,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { ArrowRight, Check } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Building2,
  ShoppingCart,
  GraduationCap,
  Smartphone,
  Mail,
  Server,
  Wrench,
}

const serviceImageMap: Record<string, string> = {
  Globe: ILLUSTRATIONS.services.web,
  Building2: ILLUSTRATIONS.services.institutional,
  ShoppingCart: ILLUSTRATIONS.services.ecommerce,
  Smartphone: ILLUSTRATIONS.services.mobile,
  GraduationCap: ILLUSTRATIONS.services.elearning,
  Mail: ILLUSTRATIONS.services.email,
  Server: ILLUSTRATIONS.services.hosting,
  Wrench: ILLUSTRATIONS.services.maintenance,
}

export function ServicesPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <ScrollReveal className="mb-12 sm:mb-20 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Nos services
          </span>
          <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Solutions digitales
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              sur mesure
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/40">
            De la conception au déploiement, nous vous accompagnons dans chaque
            étape de votre transformation digitale.
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <StaggerContainer className="grid gap-4 sm:gap-6 sm:grid-cols-2" staggerDelay={0.1}>
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Globe

            return (
              <StaggerItem key={service.name}>
                <div className="group overflow-hidden rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] shadow-sm transition-all duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] dark:border-foreground/[0.04] dark:bg-foreground/[0.015] dark:shadow-none dark:hover:border-foreground/[0.08] dark:hover:bg-foreground/[0.03]">
                  {/* Image banner */}
                  {serviceImageMap[service.icon] && (
                    <div className="relative h-32 sm:h-48 w-full overflow-hidden">
                      <Image
                        src={serviceImageMap[service.icon]}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 dark:from-transparent dark:to-transparent" />
                      <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 inline-flex rounded-lg sm:rounded-xl border border-foreground/[0.1] bg-background/80 p-1.5 sm:p-2.5 backdrop-blur-sm">
                        <Icon size={18} className="text-foreground/70 sm:[&]:size-[22px]" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-1 sm:gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="flex-1">
                        {!serviceImageMap[service.icon] && (
                          <div className="mb-3 sm:mb-4 inline-flex rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] p-2 sm:p-3">
                            <Icon size={20} className="text-foreground/50 sm:[&]:size-[24px]" strokeWidth={1.5} />
                          </div>
                        )}
                        <h2 className="mb-1 sm:mb-2 font-[family-name:var(--font-heading)] text-base sm:text-xl font-semibold">
                          {service.name}
                        </h2>
                        <p className="mb-3 sm:mb-6 text-xs sm:text-sm leading-relaxed text-foreground/40 line-clamp-2 sm:line-clamp-none">
                          {service.description}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="font-[family-name:var(--font-heading)] text-sm sm:text-lg font-bold">
                          {formatPrice(service.price)}
                        </span>
                        {typeof service.price === 'number' && (
                          <span className="block text-[10px] sm:text-xs text-foreground/30">à partir de</span>
                        )}
                      </div>
                    </div>

                    <ul className="hidden sm:grid gap-2 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-xs text-foreground/40"
                        >
                          <Check size={12} className="shrink-0 text-foreground/20" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-foreground/[0.015] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* CTA */}
        <ScrollReveal className="mt-12 sm:mt-20 text-center" delay={0.3}>
          <p className="mb-6 text-foreground/40">
            Vous avez un projet en tête ? Parlons-en.
          </p>
          <Link href="/devis">
            <LiquidButton size="xl">
              <span className="flex items-center gap-2">
                Demander un devis gratuit
                <ArrowRight size={16} />
              </span>
            </LiquidButton>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  )
}
