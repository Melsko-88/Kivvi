'use client'

import { useState } from 'react'
import { TrendingUp, ArrowDownCircle, Wallet, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useDashboardData } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'
import type { Period } from '@/lib/carnet-types'
import { PeriodFilter } from '@/components/carnet/period-filter'
import { StatCard } from '@/components/carnet/stat-card'
import { ProfitChart } from '@/components/carnet/profit-chart'

export default function DashboardPage() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<Period>('today')
  const data = useDashboardData(user?.id || '', period)

  if (!data) {
    return (
      <div className="space-y-4">
        <PeriodFilter value={period} onChange={setPeriod} />
        <div className="flex items-center justify-center py-20">
          <div className="size-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PeriodFilter value={period} onChange={setPeriod} />

      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Ventes"
          value={formatCurrency(data.total_sales)}
          color="#22c55e"
        />
        <StatCard
          icon={<ArrowDownCircle className="size-4" />}
          label="Coûts"
          value={formatCurrency(data.total_cost)}
          color="#6b7280"
        />
        <StatCard
          icon={<Wallet className="size-4" />}
          label="PROFIT"
          value={formatCurrency(data.profit)}
          color="#111111"
        />
      </div>

      <section>
        <h3 className="text-sm font-semibold mb-2">Profit journalier</h3>
        <ProfitChart data={data.daily_sales} />
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Top 5 produits</h3>
        {data.top_products.length === 0 ? (
          <div className="glass rounded-xl p-6 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Aucune vente produit</p>
          </div>
        ) : (
          <div className="glass rounded-xl divide-y divide-border">
            {data.top_products.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 px-4 py-3">
                <span className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.count} vendu{product.count > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Dettes totales</h3>
        <div className="glass rounded-xl px-4 py-4 flex items-center gap-3">
          <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertCircle className="size-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{formatCurrency(data.total_debt)}</p>
            <p className="text-xs text-muted-foreground">
              {data.debtor_count} débiteur{data.debtor_count > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
