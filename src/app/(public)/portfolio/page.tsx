import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { ArrowRight } from 'lucide-react'
import { PortfolioGrid } from './portfolio-grid'

export const metadata = createMetadata({
  title: 'Notre Portfolio',
  description:
    'Découvrez nos réalisations : sites e-commerce, sites vitrines et plateformes digitales pour des entreprises en Afrique.',
  path: '/portfolio',
})

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        title="Notre Portfolio"
        description="Chaque projet raconte une histoire. Découvrez les solutions digitales que nous avons créées pour nos clients."
      />

      <SectionWrapper>
        <PortfolioGrid />
      </SectionWrapper>

      {/* CTA Section */}
      <section className="gradient-mesh grain-overlay py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Votre projet pourrait &ecirc;tre le prochain
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Parlez-nous de votre vision et transformons-la en r&eacute;alit&eacute; digitale.
            </p>
            <div className="mt-8">
              <LiquidGlassButton href="/devis" variant="primary" size="lg">
                D&eacute;marrer un projet
                <ArrowRight className="h-4 w-4" />
              </LiquidGlassButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
