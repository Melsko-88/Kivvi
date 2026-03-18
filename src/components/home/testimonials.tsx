"use client"

import { TESTIMONIALS } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { TestimonialCard } from './testimonial-card'

export function Testimonials() {
  return (
    <SectionWrapper
      title="Ce que disent nos clients"
      subtitle="La satisfaction de nos clients est notre meilleure référence."
    >
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
