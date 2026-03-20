import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = createMetadata({
  title: 'Mentions Légales',
  description: 'Mentions légales du site kivvi.tech',
  path: '/mentions-legales',
})

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader title="Mentions Légales" />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-neutral prose-sm">
          <h2>Éditeur du site</h2>
          <p>
            <strong>{SITE_CONFIG.name}</strong><br />
            {SITE_CONFIG.founder.name}, {SITE_CONFIG.founder.role}<br />
            {SITE_CONFIG.location}<br />
            {SITE_CONFIG.locationSecondary}<br />
            Email : {SITE_CONFIG.email}<br />
            Téléphone : {SITE_CONFIG.phone}
          </p>

          <h2>Identification</h2>
          <p>
            RCCM : {SITE_CONFIG.rccm}<br />
            NINEA : {SITE_CONFIG.ninea}
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site {SITE_CONFIG.url} est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété
            exclusive de {SITE_CONFIG.name} ou de ses partenaires. Toute reproduction, même partielle,
            est interdite sans autorisation préalable.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations recueillies via les formulaires de contact et de devis sont destinées
            exclusivement à {SITE_CONFIG.name} pour le traitement de votre demande. Conformément à la
            loi sénégalaise sur la protection des données personnelles, vous disposez d&apos;un droit d&apos;accès,
            de rectification et de suppression de vos données en contactant {SITE_CONFIG.email}.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son bon fonctionnement.
            Aucun cookie de pistage ou publicitaire n&apos;est utilisé.
          </p>
        </div>
      </section>
    </>
  )
}
