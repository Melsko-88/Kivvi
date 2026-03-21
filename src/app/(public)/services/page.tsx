import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { ServicesPageContent } from './services-content'

export const metadata: Metadata = createMetadata({
  title: 'Services',
  description:
    'Découvrez nos services : sites web, applications mobiles, e-commerce, e-learning, Microsoft 365 et hébergement.',
  path: '/services',
})

export default function ServicesPage() {
  return <ServicesPageContent />
}
