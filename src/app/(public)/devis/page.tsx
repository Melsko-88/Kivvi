import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { DevisWizard } from '@/components/devis/devis-wizard'

export const metadata = createMetadata({
  title: 'Demander un Devis',
  description: 'Obtenez un devis gratuit pour votre projet digital. Remplissez notre formulaire en 4 étapes et recevez une proposition sous 48h.',
  path: '/devis',
})

export default function DevisPage() {
  return (
    <>
      <PageHeader
        title="Demander un Devis Gratuit"
        description="Décrivez votre projet en quelques étapes et recevez une proposition personnalisée."
      />
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <DevisWizard />
        </div>
      </section>
    </>
  )
}
