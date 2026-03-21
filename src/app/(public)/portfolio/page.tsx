import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { PortfolioPageContent } from './portfolio-content'

export const metadata: Metadata = createMetadata({
  title: 'Portfolio',
  description: 'Découvrez nos réalisations : sites web, applications et solutions digitales pour l\'Afrique.',
  path: '/portfolio',
})

export default function PortfolioPage() {
  return <PortfolioPageContent />
}
