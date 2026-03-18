import { createMetadata } from '@/lib/metadata'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { PageHeader } from '@/components/shared/page-header'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import {
  Globe,
  Building2,
  ShoppingCart,
  GraduationCap,
  Smartphone,
  Mail,
  Server,
  Wrench,
  Check,
  ArrowRight,
} from 'lucide-react'

export const metadata = createMetadata({
  title: 'Nos Services',
  description:
    'Sites web, applications mobiles, e-commerce, hébergement et maintenance. Découvrez les solutions digitales premium de KIVVI pour votre entreprise en Afrique.',
  path: '/services',
})

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Building2,
  ShoppingCart,
  GraduationCap,
  Smartphone,
  Mail,
  Server,
  Wrench,
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Nos Services"
        description="Des solutions digitales sur mesure pour propulser votre entreprise. Du site vitrine à l'application mobile, nous couvrons tous vos besoins."
      />

      <SectionWrapper>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service, index) => {
            const Icon = ICON_MAP[service.icon]
            return (
              <ScrollReveal key={service.name} delay={index * 0.08}>
                <div className="glass-card group relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]">
                  {/* Icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>

                  {/* Name */}
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="mt-4 mb-5">
                    <span className="font-[family-name:var(--font-mono)] text-xl font-bold text-foreground">
                      {formatPrice(service.price)}
                    </span>
                    {typeof service.price === 'number' && (
                      <span className="ml-1 text-xs text-muted-foreground">HT</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mt-auto space-y-2.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <section className="gradient-mesh grain-overlay py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Un projet en t&ecirc;te ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Demandez un devis gratuit et recevez une proposition personnalis&eacute;e sous 48 heures.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LiquidGlassButton href="/devis" variant="primary" size="lg">
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </LiquidGlassButton>
              <LiquidGlassButton href="/tarifs" variant="gold">
                Voir les tarifs
              </LiquidGlassButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
