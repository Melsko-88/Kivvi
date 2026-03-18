"use client"

import { HeroSection } from '@/components/home/hero-section'
import { StatsCounter } from '@/components/home/stats-counter'
import { ServicesPreview } from '@/components/home/services-preview'
import { WhyKivvi } from '@/components/home/why-kivvi'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { Testimonials } from '@/components/home/testimonials'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <ServicesPreview />
      <WhyKivvi />
      <PortfolioPreview />
      <Testimonials />
      <CTASection />
    </>
  )
}
