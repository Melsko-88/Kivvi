'use client'

interface ProfitChartProps {
  data: { date: string; total: number; profit: number }[]
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3)
}

function formatAmount(amount: number): string {
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`
  return String(Math.round(amount))
}

export function ProfitChart({ data }: ProfitChartProps) {
  if (!data.length) {
    return (
      <div className="glass rounded-xl p-6 flex items-center justify-center min-h-[160px]">
        <p className="text-sm text-muted-foreground">Pas assez de données</p>
      </div>
    )
  }

  const maxProfit = Math.max(...data.map((d) => Math.abs(d.profit)), 1)

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
        {data.map((d) => {
          const heightPct = Math.max((Math.abs(d.profit) / maxProfit) * 100, 4)

          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <span className="text-[10px] font-medium text-muted-foreground truncate">
                {formatAmount(d.profit)}
              </span>
              <div className="w-full flex items-end" style={{ height: 90 }}>
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: d.profit >= 0 ? '#22c55e' : '#ef4444',
                    opacity: 0.85,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{formatDay(d.date)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
