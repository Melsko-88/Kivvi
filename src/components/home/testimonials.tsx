'use client'

import { TESTIMONIALS } from '@/lib/constants'
import { ScrollReveal } from '@/components/shared/scroll-reveal'
import { Star, Quote } from 'lucide-react'

export function Testimonials() {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-24 lg:py-32">
      <div className="section-divider absolute left-0 right-0 top-0" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-10 sm:mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Témoignages
          </span>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
            Ils nous font confiance
          </h2>
        </ScrollReveal>

        <div className="grid gap-3 sm:gap-6 grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1}>
              <div className="group relative rounded-xl sm:rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-3 sm:p-8 transition-all duration-500 hover:border-foreground/[0.08] hover:bg-foreground/[0.03]">
                {/* Quote icon */}
                <Quote
                  size={16}
                  className="mb-2 sm:mb-4 text-foreground/10 hidden sm:block"
                  strokeWidth={1}
                  fill="currentColor"
                />

                {/* Stars */}
                <div className="mb-2 sm:mb-4 flex gap-0.5 sm:gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className="text-foreground/30 sm:[&]:size-[12px]"
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-3 sm:mb-6 text-xs sm:text-sm leading-relaxed text-foreground/50 line-clamp-4 sm:line-clamp-none">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div>
                  <p className="text-xs sm:text-sm font-medium">{testimonial.name}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/30">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
