'use client'

import type { Period } from '@/lib/carnet-types'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
]

interface PeriodFilterProps {
  value: Period
  onChange: (period: Period) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex gap-1 p-1 rounded-full bg-muted/50">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`flex-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            value === p.value
              ? 'bg-foreground text-background shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
