import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = createMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site kivvi.tech',
  path: '/mentions-legales',
})

export default function MentionsLegalesPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-10 font-[family-name:var(--font-heading)] text-3xl font-bold">
          Mentions légales
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-foreground/50">
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Éditeur du site
            </h2>
            <p>
              Le site kivvi.tech est édité par {SITE_CONFIG.name}, entreprise
              individuelle enregistrée au RCCM sous le numéro{' '}
              {SITE_CONFIG.rccm}, NINEA {SITE_CONFIG.ninea}.
            </p>
            <p className="mt-2">
              Siège social : {SITE_CONFIG.location}
              <br />
              Directeur de la publication : {SITE_CONFIG.founder.name}
              <br />
              Email : {SITE_CONFIG.email}
              <br />
              Téléphone : {SITE_CONFIG.phone}
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Hébergement
            </h2>
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground/80">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus (textes, images, logos, design) présents
              sur ce site sont la propriété exclusive de {SITE_CONFIG.name} et
              sont protégés par le droit d&apos;auteur. Toute reproduction non
              autorisée est interdite.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
