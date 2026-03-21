import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { TarifsPageContent } from './tarifs-content'

export const metadata: Metadata = createMetadata({
  title: 'Tarifs',
  description: 'Découvrez nos forfaits : Starter, Pro et Enterprise. Solutions adaptées à chaque budget.',
  path: '/tarifs',
})

export default function TarifsPage() {
  return <TarifsPageContent />
}
