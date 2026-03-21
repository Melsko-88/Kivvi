import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = createMetadata({
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité de kivvi.tech',
  path: '/confidentialite',
})

export default function ConfidentialitePage() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-10 font-[family-name:var(--font-heading)] text-3xl font-bold">
          Politique de confidentialité
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-foreground/50">
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Collecte des données
            </h2>
            <p>
              Nous collectons uniquement les données que vous nous fournissez
              volontairement via nos formulaires : nom, email, téléphone, et
              description de projet. Ces données sont utilisées exclusivement
              pour répondre à vos demandes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Utilisation des données
            </h2>
            <p>
              Vos données sont utilisées pour : traiter vos demandes de contact
              et de devis, vous envoyer des confirmations par email, et améliorer
              nos services. Nous ne vendons ni ne partageons vos données
              personnelles avec des tiers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Stockage et sécurité
            </h2>
            <p>
              Vos données sont stockées de manière sécurisée sur les serveurs de
              Supabase (infrastructure européenne). L&apos;accès est protégé par des
              politiques de sécurité strictes (RLS).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Vos droits
            </h2>
            <p>
              Vous pouvez demander la consultation, la modification ou la
              suppression de vos données à tout moment en nous contactant à{' '}
              {SITE_CONFIG.email}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Cookies
            </h2>
            <p>
              Ce site n&apos;utilise pas de cookies de suivi publicitaire. Seuls les
              cookies techniques nécessaires au bon fonctionnement du site sont
              utilisés.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
