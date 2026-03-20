import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = createMetadata({
  title: 'Conditions Générales de Vente',
  description: 'CGV de KIVVI — Agence Digitale Africaine',
  path: '/cgv',
})

export default function CGVPage() {
  return (
    <>
      <PageHeader title="Conditions Générales de Vente" />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-neutral prose-sm">
          <h2>1. Objet</h2>
          <p>
            Les présentes conditions générales de vente régissent les relations contractuelles entre
            {' '}{SITE_CONFIG.name} et ses clients dans le cadre de la fourniture de services digitaux
            (création de sites web, applications mobiles, hébergement, maintenance, etc.).
          </p>

          <h2>2. Devis et commande</h2>
          <p>
            Tout projet fait l&apos;objet d&apos;un devis gratuit et détaillé. Le devis est valable 30 jours
            à compter de sa date d&apos;émission. La commande est considérée comme ferme après acceptation
            du devis et versement de l&apos;acompte.
          </p>

          <h2>3. Tarifs et paiement</h2>
          <p>
            Les prix sont exprimés en Francs CFA (XOF) hors taxes. Le paiement s&apos;effectue selon
            l&apos;échéancier suivant : 40% à la commande, 30% à la validation des maquettes,
            30% à la livraison finale. Modes de paiement acceptés : virement bancaire, Wave, Orange Money.
          </p>

          <h2>4. Délais de livraison</h2>
          <p>
            Les délais indiqués dans le devis sont donnés à titre indicatif. Tout retard imputable
            au client (validation tardive, fourniture de contenus) reportera d&apos;autant le délai de livraison.
          </p>

          <h2>5. Propriété intellectuelle</h2>
          <p>
            Le client devient propriétaire des livrables après paiement intégral. {SITE_CONFIG.name}
            {' '}se réserve le droit de mentionner la réalisation dans son portfolio, sauf opposition écrite du client.
          </p>

          <h2>6. Garantie et maintenance</h2>
          <p>
            Une période de garantie est incluse après la livraison (durée selon le forfait choisi).
            Au-delà, un contrat de maintenance peut être souscrit.
          </p>

          <h2>7. Responsabilité</h2>
          <p>
            {SITE_CONFIG.name} s&apos;engage à mettre en œuvre les moyens nécessaires pour fournir un service
            de qualité. La responsabilité est limitée au montant du contrat.
          </p>

          <h2>8. Résiliation</h2>
          <p>
            En cas de résiliation par le client, les sommes déjà versées restent acquises à {SITE_CONFIG.name}.
            En cas de résiliation par {SITE_CONFIG.name}, les sommes versées pour les travaux non réalisés
            seront remboursées.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit sénégalais. Tout litige sera soumis aux tribunaux
            compétents de Kaolack.
          </p>
        </div>
      </section>
    </>
  )
}
