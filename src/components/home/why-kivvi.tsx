'use client'

import { Globe2, Award, Handshake } from 'lucide-react'
import Image from 'next/image'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'

const reasons = [
  {
    icon: Globe2,
    title: 'Expertise Africaine',
    description:
      'Nous comprenons les réalités du marché africain : paiement mobile, connectivité variable, habitudes locales. Nos solutions performent ici.',
  },
  {
    icon: Award,
    title: 'Qualité Premium',
    description:
      'Design soigné, code propre, performance optimale. Standards internationaux pour des produits dont vous serez fiers.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement Total',
    description:
      'Du conseil initial à la maintenance continue. Votre succès digital est notre priorité absolue.',
  },
]

export function WhyKivvi() {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-20 lg:py-32">
      <div className="section-divider absolute left-0 right-0 top-0" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-20">
          {/* Left: Image (2/5) */}
          <ScrollReveal className="hidden lg:block lg:col-span-2">
            <div className="relative mx-auto max-w-sm lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-foreground/[0.06]">
                <Image
                  src="https://res.cloudinary.com/dzi8whann/image/upload/v1774052117/kivvi/images/v2/hero-ai-woman.jpg"
                  alt="Professionnelle souriante avec tablette"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 70vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-section-alt-2/80 via-transparent to-transparent" />
              </div>
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-foreground/[0.02] blur-2xl" />
            </div>
          </ScrollReveal>

          {/* Right: Content (3/5) */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
                Pourquoi nous
              </span>
              <h2 className="mb-6 sm:mb-10 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Pourquoi KIVVI
              </h2>
            </ScrollReveal>

            <StaggerContainer className="flex flex-col gap-4 sm:gap-8" staggerDelay={0.15}>
              {reasons.map((reason) => {
                const Icon = reason.icon
                return (
                  <StaggerItem key={reason.title}>
                    <div className="group flex gap-3 sm:gap-5 rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-4 sm:p-6 transition-all duration-500 hover:border-foreground/[0.08] hover:bg-foreground/[0.03]">
                      <div className="shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] transition-colors duration-300 group-hover:border-foreground/[0.12] group-hover:bg-foreground/[0.06]">
                        <Icon className="size-5 sm:size-[22px] text-foreground/50" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="mb-1 sm:mb-1.5 font-[family-name:var(--font-heading)] text-base sm:text-lg font-semibold">
                          {reason.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/40">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
