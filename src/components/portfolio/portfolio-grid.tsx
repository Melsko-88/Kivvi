"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { cn } from '@/lib/utils'

const categories = ['Tous', ...new Set(PORTFOLIO_PROJECTS.map((p) => p.category))]

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = activeCategory === 'Tous'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory)

  return (
    <SectionWrapper>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative block overflow-hidden rounded-xl glass-card"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-card to-gold/10 transition-transform duration-500 group-hover:scale-105" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mb-2">
                  {project.category}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <ExternalLink className="absolute top-4 right-4 h-5 w-5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
