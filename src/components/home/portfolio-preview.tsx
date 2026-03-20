"use client"

import { ArrowRight } from 'lucide-react'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { Button } from '@/components/shared/button'
import { ProjectCard } from './project-card'

export function PortfolioPreview() {
  return (
    <SectionWrapper
      title="Nos Réalisations"
      subtitle="Des projets qui font la différence pour nos clients."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PORTFOLIO_PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={i}
          />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/portfolio" variant="secondary">
          Voir tout le portfolio
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionWrapper>
  )
}
