"use client"

import { Globe2, Award, Handshake } from 'lucide-react'
import { WHY_KIVVI } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

const iconMap: Record<string, React.ElementType> = { Globe2, Award, Handshake }

export function WhyKivvi() {
  return (
    <SectionWrapper
      title="Pourquoi KIVVI ?"
      subtitle="Une agence qui comprend l'Afrique et livre l'excellence."
      variant="dark"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {WHY_KIVVI.map((item, i) => {
          const Icon = iconMap[item.icon] || Globe2
          return (
            <ScrollReveal key={item.title} delay={i * 0.15}>
              <div className="p-8 rounded-xl bg-[#141414] border border-[#2A2A2A] text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-copper mb-5">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#F5F2ED] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#999] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
