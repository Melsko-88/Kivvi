"use client"

import { ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { ServiceCard } from './service-card'

export function ServicesPreview() {
  return (
    <SectionWrapper
      title="Nos Services"
      subtitle="Des solutions digitales complètes pour propulser votre activité en ligne."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICES.slice(0, 6).map((service, i) => (
          <ServiceCard key={service.name} service={service} index={i} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <LiquidGlassButton href="/services" variant="primary">
          Voir tous nos services
          <ArrowRight className="h-4 w-4" />
        </LiquidGlassButton>
      </div>
    </SectionWrapper>
  )
}
