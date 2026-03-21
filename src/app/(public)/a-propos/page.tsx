import type { Metadata } from 'next'
import Image from 'next/image'
import { createMetadata } from '@/lib/metadata'
import { SITE_CONFIG, ILLUSTRATIONS } from '@/lib/constants'

export const metadata: Metadata = createMetadata({
  title: 'À propos',
  description: 'Découvrez KIVVI, agence digitale africaine basée au Sénégal et en Côte d\'Ivoire.',
  path: '/a-propos',
})

export default function AProposPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 sm:mb-20 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            À propos
          </span>
          <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-5xl">
            L&apos;Afrique mérite le meilleur du digital
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/40">
            KIVVI est née d&apos;une conviction simple : les entreprises
            africaines méritent des solutions digitales à la hauteur de leurs
            ambitions.
          </p>
        </div>

        {/* Founder */}
        <div className="mb-12 sm:mb-20 grid items-center gap-8 sm:gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-48 sm:w-64 overflow-hidden rounded-3xl border border-foreground/[0.06] lg:mx-0">
            <Image
              src={SITE_CONFIG.founder.photo}
              alt={SITE_CONFIG.founder.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div>
            <h2 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold">
              {SITE_CONFIG.founder.name}
            </h2>
            <p className="mb-4 text-sm text-foreground/30">
              {SITE_CONFIG.founder.role}
            </p>
            <p className="text-sm leading-relaxed text-foreground/50">
              Passionné par la technologie et l&apos;innovation, j&apos;ai fondé KIVVI
              avec la mission de démocratiser l&apos;excellence digitale en Afrique.
              Notre équipe conçoit des solutions qui combinent les standards
              internationaux avec une compréhension profonde des réalités
              locales.
            </p>
          </div>
        </div>

        {/* Team Photo */}
        <div className="mb-12 sm:mb-20 overflow-hidden rounded-3xl border border-foreground/[0.06]">
          <div className="relative h-64 w-full sm:h-80">
            <Image
              src={ILLUSTRATIONS.about.team}
              alt="L'équipe KIVVI en action"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-[family-name:var(--font-heading)] text-lg font-semibold">
                Notre équipe
              </p>
              <p className="text-sm text-foreground/50">
                Des passionnés du digital au service de votre croissance
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Excellence',
              text: 'Chaque ligne de code, chaque pixel est pensé pour la qualité.',
            },
            {
              title: 'Proximité',
              text: 'Basés à Kaolack et Abidjan, nous comprenons vos réalités.',
            },
            {
              title: 'Impact',
              text: 'Nos solutions créent de la valeur concrète pour votre business.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-5 sm:p-8"
            >
              <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-semibold">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/40">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
