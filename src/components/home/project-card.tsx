"use client"

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { PortfolioProject } from '@/lib/constants'

interface ProjectCardProps {
  project: PortfolioProject
  index: number
  className?: string
}

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative block overflow-hidden rounded-xl ${className}`}
    >
      {/* Gradient placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-card to-gold/10 transition-transform duration-500 group-hover:scale-105" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {project.category}
            </span>
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <ExternalLink className="absolute top-4 right-4 h-5 w-5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.a>
  )
}
