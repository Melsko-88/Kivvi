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
    <div className="p-8 rounded-xl bg-[#141414] border border-[#2A2A2A]">
      {/* Decorative quote */}
      <span className="block text-4xl text-copper/40 font-serif leading-none mb-4">&ldquo;</span>
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-copper fill-copper' : 'text-[#2A2A2A]'}`}
          />
        ))}
      </div>
      {/* Quote */}
      <p className="text-sm text-[#999] leading-relaxed mb-6">
        {content}
      </p>
      {/* Author */}
      <div>
        <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#F5F2ED]">{name}</p>
        <p className="text-xs text-[#666]">
          {role}, {company}
        </p>
      </div>
    </div>
  )
}
