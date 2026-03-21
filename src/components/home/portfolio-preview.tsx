'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/shared/scroll-reveal'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'

export function PortfolioPreview() {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-10 sm:mb-16">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Portfolio
          </span>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Nos réalisations
          </h2>
          <p className="max-w-2xl text-foreground/40">
            Chaque projet est une opportunité de repousser les limites du
            digital africain.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.12}
        >
          {PORTFOLIO_PROJECTS.map((project) => (
            <StaggerItem key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl border border-foreground/[0.04] bg-foreground/[0.02]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                  {/* External link icon */}
                  <div className="absolute right-4 top-4 rounded-full border border-foreground/10 bg-foreground/5 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ExternalLink size={14} className="text-foreground/70" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-3 sm:p-6">
                  <h3 className="mb-1 font-[family-name:var(--font-heading)] text-sm font-semibold sm:text-lg">
                    {project.name}
                  </h3>
                  <p className="mb-4 hidden text-sm leading-relaxed text-foreground/40 sm:block">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="hidden flex-wrap gap-2 sm:flex">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-foreground/[0.06] bg-foreground/[0.03] px-2.5 py-0.5 text-xs text-foreground/40"
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

        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
          >
            Voir tous les projets
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
