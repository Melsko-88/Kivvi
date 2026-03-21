'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'

export function PortfolioPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="mb-12 sm:mb-20 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Portfolio
          </span>
          <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Nos réalisations
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/40">
            Chaque projet raconte une histoire. Voici quelques-unes de nos
            collaborations les plus marquantes.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-3 sm:gap-8 grid-cols-2" staggerDelay={0.15}>
          {PORTFOLIO_PROJECTS.map((project) => (
            <StaggerItem key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl border border-foreground/[0.04] bg-foreground/[0.015] transition-all duration-500 hover:border-foreground/[0.08]"
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-70" />

                  <div className="absolute right-3 top-3 sm:right-5 sm:top-5 rounded-full border border-foreground/10 bg-foreground/5 p-1.5 sm:p-2.5 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ExternalLink size={12} className="text-foreground/70 sm:[&]:size-[16px]" />
                  </div>
                </div>

                <div className="relative p-3 sm:p-8">
                  <span className="mb-1 sm:mb-2 inline-block text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-foreground/25">
                    {project.category}
                  </span>
                  <h2 className="mb-1 sm:mb-2 font-[family-name:var(--font-heading)] text-sm sm:text-2xl font-bold">
                    {project.name}
                  </h2>
                  <p className="mb-3 sm:mb-5 text-xs sm:text-sm leading-relaxed text-foreground/40 hidden sm:block">
                    {project.description}
                  </p>
                  <div className="flex-wrap gap-1.5 sm:gap-2 hidden sm:flex">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-foreground/[0.06] bg-foreground/[0.03] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-foreground/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
