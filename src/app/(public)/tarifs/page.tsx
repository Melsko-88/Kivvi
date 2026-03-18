import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { PricingCards } from '@/components/tarifs/pricing-cards'
import { FAQ } from '@/components/tarifs/faq'
import { ServicesCTA } from '@/components/services/services-cta'

export const metadata = createMetadata({
  title: 'Tarifs',
  description: 'Découvrez nos forfaits et tarifs transparents. Du Starter au Enterprise, trouvez l\'offre adaptée à votre budget.',
  path: '/tarifs',
})

export default function TarifsPage() {
  return (
    <>
      <PageHeader
        title="Nos Tarifs"
        description="Des forfaits transparents et adaptés à chaque budget. Pas de frais cachés."
      />
      <PricingCards />
      <FAQ />
      <ServicesCTA />
    </>
  )
}
