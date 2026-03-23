'use client'

interface TrendChartProps {
  data: { date: string; total: number; profit: number }[]
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`
  return String(Math.round(amount))
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data.length) {
    return (
      <div className="glass rounded-xl p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-muted-foreground">Pas assez de données</p>
      </div>
    )
  }

  const width = 320
  const height = 160
  const padding = { top: 20, right: 10, bottom: 30, left: 45 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxVal = Math.max(...data.map(d => Math.max(d.total, Math.abs(d.profit))), 1)
  const minVal = Math.min(0, ...data.map(d => Math.min(d.total, d.profit)))
  const range = maxVal - minVal || 1

  function x(i: number) {
    return padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  }
  function y(val: number) {
    return padding.top + chartH - ((val - minVal) / range) * chartH
  }

  function line(values: number[]) {
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  }

  const salesPath = line(data.map(d => d.total))
  const profitPath = line(data.map(d => d.profit))

  // Y axis labels
  const yTicks = [0, Math.round(maxVal / 2), maxVal]

  return (
    <div className="glass rounded-xl p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        {yTicks.map(tick => (
          <line
            key={tick}
            x1={padding.left}
            x2={width - padding.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
        ))}

        {/* Y axis labels */}
        {yTicks.map(tick => (
          <text
            key={tick}
            x={padding.left - 5}
            y={y(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontSize={9}
          >
            {formatAmount(tick)}
          </text>
        ))}

        {/* Sales line */}
        <path d={salesPath} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Profit line */}
        <path d={profitPath} fill="none" stroke="#111111" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />

        {/* X axis labels */}
        {data.length <= 10
          ? data.map((d, i) => (
              <text
                key={d.date}
                x={x(i)}
                y={height - 5}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={8}
              >
                {formatDay(d.date)}
              </text>
            ))
          : [0, Math.floor(data.length / 2), data.length - 1].map(i => (
              <text
                key={data[i].date}
                x={x(i)}
                y={height - 5}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={8}
              >
                {formatDay(data[i].date)}
              </text>
            ))
        }

        {/* Dots on last point */}
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].total)} r={3} fill="#22c55e" />
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].profit)} r={3} fill="#111111" />
      </svg>

      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-[#22c55e] rounded" />
          <span className="text-[10px] text-muted-foreground">Ventes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-[#111111] rounded" style={{ borderTop: '1px dashed #111' }} />
          <span className="text-[10px] text-muted-foreground">Profit</span>
        </div>
      </div>
    </div>
  )
}
