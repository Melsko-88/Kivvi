import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = createMetadata({
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité de KIVVI — Comment nous protégeons vos données.',
  path: '/confidentialite',
})

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader title="Politique de Confidentialité" />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-invert prose-sm">
          <p>
            Dernière mise à jour : mars 2026
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est {SITE_CONFIG.name},
            représenté par {SITE_CONFIG.founder.name}, joignable à {SITE_CONFIG.email}.
          </p>

          <h2>2. Données collectées</h2>
          <p>
            Nous collectons les données que vous nous fournissez volontairement via nos formulaires :
          </p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Nom d&apos;entreprise (optionnel)</li>
            <li>Description de projet</li>
          </ul>

          <h2>3. Finalité du traitement</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact</li>
            <li>Établir des devis personnalisés</li>
            <li>Assurer le suivi des projets</li>
            <li>Émettre des factures</li>
          </ul>

          <h2>4. Durée de conservation</h2>
          <p>
            Les données de contact sont conservées 3 ans après le dernier échange.
            Les données de facturation sont conservées conformément aux obligations légales (10 ans).
          </p>

          <h2>5. Partage des données</h2>
          <p>
            Vos données ne sont jamais vendues ni cédées à des tiers. Elles peuvent être partagées
            uniquement avec nos sous-traitants techniques (hébergement, email) dans le cadre strict
            de la fourniture de nos services.
          </p>

          <h2>6. Sécurité</h2>
          <p>
            Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour
            protéger vos données contre tout accès non autorisé, modification ou destruction.
          </p>

          <h2>7. Vos droits</h2>
          <p>
            Conformément à la réglementation applicable, vous disposez des droits suivants :
            accès, rectification, suppression, portabilité et opposition. Pour exercer ces droits,
            contactez-nous à {SITE_CONFIG.email}.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Ce site n&apos;utilise que des cookies techniques strictement nécessaires au fonctionnement
            du site. Aucun cookie publicitaire ou de suivi n&apos;est utilisé.
          </p>
        </div>
      </section>
    </>
  )
}
