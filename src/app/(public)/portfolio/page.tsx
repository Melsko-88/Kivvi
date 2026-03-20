import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { Button } from '@/components/shared/button'
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
      <section className="section-dark py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[#F5F2ED] sm:text-4xl">
              Votre projet pourrait être le prochain
            </h2>
            <p className="mt-4 text-lg text-[#999]">
              Parlez-nous de votre vision et transformons-la en réalité digitale.
            </p>
            <div className="mt-8">
              <Button href="/devis" variant="primary" size="lg">
                Démarrer un projet
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
