"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const categories = ['Tous', ...new Set(PORTFOLIO_PROJECTS.map((p) => p.category))]

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = activeCategory === 'Tous'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === cat
                ? 'bg-copper text-white'
                : 'bg-[#F3F1EE] text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#E8E5E0]'
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
              className="group relative block overflow-hidden rounded-xl border border-[#E8E5E0]"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] relative">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-copper/20 via-[#F3F1EE] to-copper/10 transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="inline-block text-xs font-semibold text-white bg-copper px-2.5 py-1 rounded-full w-fit mb-2">
                  {project.category}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
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
    </>
  )
}
