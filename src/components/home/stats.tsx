'use client'

import { useIntersection } from '@/hooks/use-intersection'
import { useCounter } from '@/hooks/use-counter'
import { STATS } from '@/lib/constants'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

function StatItem({
  label,
  value,
  suffix,
  isVisible,
}: {
  label: string
  value: number
  suffix: string
  isVisible: boolean
}) {
  const count = useCounter(value, isVisible)

  return (
    <div className="flex flex-col items-center px-3 py-5 sm:px-4 sm:py-6 text-center">
      <span className="mb-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {count}
        <span className="text-foreground/30">{suffix}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/30">
        {label}
      </span>
    </div>
  )
}

export function Stats() {
  const { ref, isVisible } = useIntersection({ threshold: 0.3 })

  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="glass rounded-3xl p-2">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={[
                    'border-foreground/[0.04]',
                    index % 2 === 0 ? 'border-r' : '',
                    index < 2 ? 'border-b' : '',
                    index < STATS.length - 1 ? 'lg:border-r' : 'lg:border-r-0',
                    'lg:border-b-0',
                  ].join(' ')}
                >
                  <StatItem
                    label={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
