import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'

export const metadata = createMetadata({
  title: 'Contact',
  description: 'Contactez KIVVI pour discuter de votre projet digital. Email, téléphone, WhatsApp — nous sommes disponibles pour vous.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contactez-nous"
        description="Une question ? Un projet ? Nous sommes à votre écoute."
      />
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
