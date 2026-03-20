"use client"

import { STATS } from '@/lib/constants'
import { useCounter } from '@/hooks/use-counter'
import { useIntersection } from '@/hooks/use-intersection'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

function StatItem({ label, value, suffix, delay }: { label: string; value: number; suffix: string; delay: number }) {
  const { ref, isInView } = useIntersection({ threshold: 0.5 })
  const count = useCounter({ end: value, duration: 2000, enabled: isInView })

  return (
    <ScrollReveal delay={delay}>
      <div ref={ref} className="text-center">
        <div className="font-[family-name:var(--font-mono)] text-4xl font-bold text-copper sm:text-5xl">
          {count}{suffix}
        </div>
        <div className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      </div>
    </ScrollReveal>
  )
}

export function StatsCounter() {
  return (
    <section className="py-20 bg-[#FAFAF7]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
