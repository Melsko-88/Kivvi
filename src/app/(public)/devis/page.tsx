import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { DevisPageContent } from './devis-content'

export const metadata: Metadata = createMetadata({
  title: 'Demander un devis',
  description: 'Obtenez un devis gratuit pour votre projet digital en 48h. Sites web, applications, e-commerce.',
  path: '/devis',
})

export default function DevisPage() {
  return <DevisPageContent />
}
