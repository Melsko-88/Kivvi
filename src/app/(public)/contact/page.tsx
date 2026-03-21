import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { ContactPageContent } from './contact-content'

export const metadata: Metadata = createMetadata({
  title: 'Contact',
  description: 'Contactez KIVVI pour discuter de votre projet digital. Réponse garantie sous 48h.',
  path: '/contact',
})

export default function ContactPage() {
  return <ContactPageContent />
}
