'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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
                ? 'bg-copper text-white'
                : 'bg-[#F3F1EE] text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#E8E5E0]'
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
              className="group relative block overflow-hidden rounded-xl border border-[#E8E5E0] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image / Gradient Placeholder */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-copper/20 via-[#F3F1EE] to-copper/10" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ExternalLink className="mb-3 h-6 w-6 text-copper" />
                  <span className="text-sm font-medium text-[#F5F2ED]">Voir le projet</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-white">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#1A1A1A]">
                    {project.name}
                  </h3>
                  <span className="rounded-full bg-copper/10 px-3 py-1 text-xs font-medium text-copper">
                    {project.category}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#6B6B6B]">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#E8E5E0] bg-[#F3F1EE] px-2.5 py-1 text-xs text-[#6B6B6B]"
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
        <div className="py-16 text-center text-[#6B6B6B]">
          Aucun projet dans cette catégorie pour le moment.
        </div>
      )}
    </>
  )
}
