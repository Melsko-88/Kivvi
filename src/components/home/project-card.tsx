"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative block overflow-hidden rounded-xl ${className}`}
    >
      {/* Image or gradient placeholder */}
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

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block text-xs font-semibold text-white bg-copper px-2.5 py-1 rounded-full mb-2">
            {project.category}
          </span>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
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
