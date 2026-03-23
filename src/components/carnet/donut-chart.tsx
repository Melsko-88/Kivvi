'use client'

import { formatCurrency } from '@/lib/carnet-constants'

interface DonutChartProps {
  data: { label: string; value: number; color: string }[]
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div className="glass rounded-xl p-6 flex items-center justify-center min-h-[160px]">
        <p className="text-sm text-muted-foreground">Pas de données</p>
      </div>
    )
  }

  const size = 120
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let offset = 0

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          {data.map((d) => {
            const pct = d.value / total
            const dashLength = pct * circumference
            const dashOffset = -offset * circumference
            offset += pct

            return (
              <circle
                key={d.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="round"
              />
            )
          })}
          <text x={center} y={center - 4} textAnchor="middle" className="fill-foreground" fontSize={14} fontWeight="bold">
            {data.length}
          </text>
          <text x={center} y={center + 10} textAnchor="middle" className="fill-muted-foreground" fontSize={8}>
            méthodes
          </text>
        </svg>

        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-medium">{d.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatCurrency(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
