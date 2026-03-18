"use client"

import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

export function TestimonialCard({ name, role, company, content, rating }: TestimonialCardProps) {
  return (
    <div className="glass-card p-6 rounded-xl min-w-[300px] max-w-[360px] flex-shrink-0 snap-center">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-gold fill-gold' : 'text-white/10'}`}
          />
        ))}
      </div>
      {/* Quote */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        &ldquo;{content}&rdquo;
      </p>
      {/* Author */}
      <div>
        <p className="font-[family-name:var(--font-heading)] text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">
          {role}, {company}
        </p>
      </div>
    </div>
  )
}
