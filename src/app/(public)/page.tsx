import { Hero } from '@/components/home/hero'
import { ServicesGrid } from '@/components/home/services-grid'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { WhyKivvi } from '@/components/home/why-kivvi'
import { CarnetDigital } from '@/components/home/carnet-digital'
import { Stats } from '@/components/home/stats'
import { Testimonials } from '@/components/home/testimonials'
import { CTA } from '@/components/home/cta'

export default function HomePage() {
  return (
    <>
      {/* Hero — base background */}
      <Hero />

      {/* Services — card surface */}
      <div className="relative bg-card">
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <ServicesGrid />
      </div>

      {/* Portfolio — alt surface + ambient glow */}
      <div className="relative bg-section-alt overflow-hidden">
        <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/[0.02] blur-[120px]" />
        <PortfolioPreview />
      </div>

      {/* Why Kivvi — alt-2 surface */}
      <div className="bg-section-alt-2">
        <WhyKivvi />
      </div>

      {/* Carnet Digital — card surface with emerald accent */}
      <div className="relative bg-card">
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <CarnetDigital />
      </div>

      {/* Stats — alt surface */}
      <div className="bg-section-alt">
        <Stats />
      </div>

      {/* Testimonials — card surface with subtle texture */}
      <div className="relative bg-card overflow-hidden">
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-purple-500/[0.015] blur-[100px]" />
        <Testimonials />
      </div>

      {/* CTA — alt surface */}
      <div className="bg-section-alt">
        <CTA />
      </div>
    </>
  )
}
