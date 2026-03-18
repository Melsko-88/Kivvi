'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = ['Tous', ...Array.from(new Set(PORTFOLIO_PROJECTS.map((p) => p.category)))]

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered =
    activeCategory === 'Tous'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Filter Buttons */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
              activeCategory === cat
                ? 'bg-primary text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="glass-card group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]"
            >
              {/* Image / Gradient Placeholder */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-[#F59E0B]/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-2xl font-bold text-white/30">
                    {project.name}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0F]/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <ExternalLink className="mb-3 h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">Voir le projet</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {project.category}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/[0.06] bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          Aucun projet dans cette cat&eacute;gorie pour le moment.
        </div>
      )}
    </>
  )
}
