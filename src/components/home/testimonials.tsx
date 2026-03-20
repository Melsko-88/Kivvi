"use client"

import { TESTIMONIALS } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { TestimonialCard } from './testimonial-card'

export function Testimonials() {
  return (
    <SectionWrapper
      title="Ce que disent nos clients"
      subtitle="La satisfaction de nos clients est notre meilleure référence."
      variant="dark"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((testimonial, i) => (
          <ScrollReveal key={testimonial.name} delay={i * 0.1}>
            <TestimonialCard
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
            />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
