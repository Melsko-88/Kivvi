'use client'

import {
  Globe,
  ShoppingCart,
  Smartphone,
  Server,
  Mail,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Sites Web',
    description: 'Sites vitrine et institutionnels, design sur mesure, responsive et optimisés SEO.',
    span: 'col-span-2 lg:row-span-2',
    featured: true,
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Boutiques en ligne avec paiement mobile Wave et Orange Money.',
    span: 'lg:col-span-1',
  },
  {
    icon: Smartphone,
    title: 'Applications Mobiles',
    description: 'iOS et Android natif, push notifications, hors-ligne.',
    span: 'lg:col-span-1',
  },
  {
    icon: GraduationCap,
    title: 'E-Learning',
    description: 'Formations, suivi de progression, certificats.',
    span: 'lg:col-span-1',
  },
  {
    icon: Mail,
    title: 'Microsoft 365',
    description: 'Emails professionnels, Outlook, collaboration.',
    span: 'lg:col-span-1',
  },
  {
    icon: Server,
    title: 'Hébergement',
    description: 'Domaines, SSL, sauvegardes, monitoring 24/7.',
    span: 'lg:col-span-1',
  },
]

export function ServicesGrid() {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-10 sm:mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Expertise
          </span>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Ce qu&apos;on fait le mieux
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/40">
            Des solutions digitales pensées pour le marché africain, construites
            avec des standards internationaux.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.08}
        >
          {services.map((service) => {
            const Icon = service.icon

            return (
              <StaggerItem
                key={service.title}
                className={`group ${service.span}`}
              >
                <div
                  className={`glass glass-hover relative h-full overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8 ${
                    service.featured ? 'lg:p-10' : ''
                  }`}
                >
                  <div className="mb-3 sm:mb-4 inline-flex rounded-lg sm:rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] p-2 sm:p-3">
                    <Icon
                      size={service.featured ? 28 : 22}
                      className="text-foreground/60"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3
                    className={`mb-1 sm:mb-2 font-[family-name:var(--font-heading)] font-semibold ${
                      service.featured ? 'text-lg sm:text-2xl lg:text-3xl' : 'text-sm sm:text-lg'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-foreground/40 ${
                      service.featured ? 'text-xs sm:text-base lg:text-lg' : 'text-xs sm:text-sm'
                    }`}
                  >
                    {service.description}
                  </p>

                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-foreground/[0.02] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
          >
            Découvrir tous nos services
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
