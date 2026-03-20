import Image from 'next/image'
import { MapPin, FileText, Building } from 'lucide-react'
import { createMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/shared/page-header'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = createMetadata({
  title: 'À Propos',
  description: 'Découvrez KIVVI, agence digitale africaine basée au Sénégal. Notre mission : rendre l\'excellence digitale accessible en Afrique.',
  path: '/a-propos',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="À Propos de KIVVI"
        description="Une agence digitale née en Afrique, pour l'Afrique — et au-delà."
      />

      {/* Story */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1A1A] mb-6">Notre Histoire</h2>
            <div className="space-y-4 text-[#6B6B6B] leading-relaxed">
              <p>
                KIVVI est née d&apos;un constat simple : les entreprises africaines méritent des solutions digitales
                à la hauteur de leurs ambitions. Trop souvent, les agences proposent des services standardisés
                qui ne tiennent pas compte des réalités locales — paiement mobile, connectivité variable,
                habitudes d&apos;utilisation spécifiques.
              </p>
              <p>
                Fondée à Kaolack, au cœur du Sénégal, KIVVI combine expertise technique internationale
                et compréhension profonde du marché africain. Nous travaillons avec des universités,
                des ministères, des PME et des startups pour transformer leurs visions en produits
                digitaux performants et élégants.
              </p>
              <p>
                Notre présence à Kaolack et Abidjan nous permet de servir des clients dans toute l&apos;Afrique
                de l&apos;Ouest, avec une approche personnalisée et un accompagnement de proximité.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>

      {/* Founder */}
      <section className="py-24 bg-[#F3F1EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
              <div className="shrink-0">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-copper/20">
                  <Image
                    src={SITE_CONFIG.founder.photo}
                    alt={SITE_CONFIG.founder.name}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1A1A] mb-1">
                  {SITE_CONFIG.founder.name}
                </h3>
                <p className="text-copper font-medium mb-4">{SITE_CONFIG.founder.role}</p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Passionné par la technologie et l&apos;innovation, Mbar Cheikh Philippe FAYE a fondé KIVVI
                  avec la conviction que l&apos;Afrique peut et doit être à la pointe du digital.
                  Avec une expertise en développement web, mobile et cloud, il accompagne chaque client
                  avec rigueur et créativité pour livrer des solutions qui font la différence.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <SectionWrapper title="Notre Mission" variant="dark">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: 'Mission',
              description: 'Rendre l\'excellence digitale accessible aux entreprises et institutions africaines, en proposant des solutions sur mesure, performantes et abordables.',
            },
            {
              title: 'Vision',
              description: 'Devenir la référence en Afrique de l\'Ouest pour les solutions digitales premium, en accompagnant la transformation numérique du continent.',
            },
            {
              title: 'Valeurs',
              description: 'Excellence, transparence, proximité. Nous croyons en la qualité sans compromis, la communication ouverte et l\'accompagnement personnalisé.',
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="p-8 rounded-xl bg-[#141414] border border-[#2A2A2A] text-center h-full">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#F5F2ED] mb-3">{item.title}</h3>
                <p className="text-sm text-[#999] leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      {/* Legal Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1A1A] mb-8 text-center">
              Informations Légales
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="p-6 rounded-xl bg-[#F3F1EE] border border-[#E8E5E0] flex items-start gap-3">
                <FileText className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B6B6B] uppercase tracking-wider mb-1">RCCM</p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-[#1A1A1A]">{SITE_CONFIG.rccm}</p>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#F3F1EE] border border-[#E8E5E0] flex items-start gap-3">
                <Building className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B6B6B] uppercase tracking-wider mb-1">NINEA</p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-[#1A1A1A]">{SITE_CONFIG.ninea}</p>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#F3F1EE] border border-[#E8E5E0] flex items-start gap-3">
                <MapPin className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B6B6B] uppercase tracking-wider mb-1">Siège</p>
                  <p className="text-sm text-[#1A1A1A]">{SITE_CONFIG.location}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
