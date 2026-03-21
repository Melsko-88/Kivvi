import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { BriefContent } from './brief-content'

export const metadata: Metadata = createMetadata({
  title: 'Brief projet',
  description: 'Décrivez votre projet en quelques minutes et recevez une proposition personnalisée sous 24h.',
  path: '/brief/nouveau',
})

export default function BriefPage() {
  return <BriefContent />
}
