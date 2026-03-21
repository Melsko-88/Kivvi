import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = createMetadata({
  title: 'Conditions Générales de Vente',
  description: 'CGV de KIVVI — Agence Digitale Africaine',
  path: '/cgv',
})

export default function CGVPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-10 font-[family-name:var(--font-heading)] text-3xl font-bold">
          Conditions Générales de Vente
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-foreground/50">
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Objet
            </h2>
            <p>
              Les présentes CGV régissent les relations commerciales entre{' '}
              {SITE_CONFIG.name}, {SITE_CONFIG.location}, et ses clients dans le
              cadre de prestations de services digitaux.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Devis et commande
            </h2>
            <p>
              Tout projet fait l&apos;objet d&apos;un devis détaillé gratuit. La commande
              est considérée comme ferme après acceptation du devis et versement
              de l&apos;acompte initial (40% du montant total).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Modalités de paiement
            </h2>
            <p>
              Le paiement s&apos;effectue en trois étapes : 40% à la commande, 30% à
              la validation des maquettes, 30% à la livraison. Moyens acceptés :
              virement bancaire, Wave, Orange Money, espèces.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Délais de livraison
            </h2>
            <p>
              Les délais sont indicatifs et communiqués dans le devis. Tout retard
              éventuel sera communiqué au client dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Propriété intellectuelle
            </h2>
            <p>
              Après paiement intégral, le client acquiert la propriété des
              livrables spécifiques à son projet. Les outils, frameworks et
              composants réutilisables restent la propriété de {SITE_CONFIG.name}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Contact
            </h2>
            <p>
              Pour toute question relative aux présentes CGV : {SITE_CONFIG.email}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
