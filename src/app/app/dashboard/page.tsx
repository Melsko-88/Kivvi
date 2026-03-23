'use client'

import { useState } from 'react'
import { TrendingUp, ArrowDownCircle, Wallet, AlertCircle, Crown, Download } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { usePlan } from '@/hooks/use-plan'
import { useDashboardData } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'
import type { Period } from '@/lib/carnet-types'
import { PeriodFilter } from '@/components/carnet/period-filter'
import { StatCard } from '@/components/carnet/stat-card'
import { ProfitChart } from '@/components/carnet/profit-chart'
import { TrendChart } from '@/components/carnet/trend-chart'
import { DonutChart } from '@/components/carnet/donut-chart'
import { UpsellModal } from '@/components/carnet/upsell-modal'

export default function DashboardPage() {
  const { user } = useAuth()
  const { isPro } = usePlan(user?.id)
  const [period, setPeriod] = useState<Period>('today')
  const [showUpsell, setShowUpsell] = useState(false)
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

  const salesChange = data.previous_period
    ? ((data.total_sales - data.previous_period.total_sales) / (data.previous_period.total_sales || 1)) * 100
    : null
  const profitChange = data.previous_period
    ? ((data.profit - data.previous_period.profit) / (data.previous_period.profit || 1)) * 100
    : null

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

      {isPro && salesChange !== null && (
        <div className="flex gap-2 -mt-1 px-1">
          <span className={`text-[10px] font-medium ${salesChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(0)}% ventes vs période préc.
          </span>
          {profitChange !== null && (
            <span className={`text-[10px] font-medium ${profitChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(0)}% profit
            </span>
          )}
        </div>
      )}

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

      {/* Tendances (Pro section) */}
      <section className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Tendances</h3>
          {!isPro && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">PRO</span>
          )}
        </div>
        <div className={!isPro ? 'blur-sm pointer-events-none' : ''}>
          <TrendChart data={data.daily_sales} />
        </div>
        {!isPro && (
          <button
            onClick={() => setShowUpsell(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-2">
              <Crown className="size-4" />
              Débloquer
            </span>
          </button>
        )}
      </section>

      {/* Top clients (Pro section) */}
      <section className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Top clients</h3>
          {!isPro && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">PRO</span>
          )}
        </div>
        <div className={!isPro ? 'blur-sm pointer-events-none' : ''}>
          {data.top_clients && data.top_clients.length > 0 ? (
            <div className="glass rounded-xl divide-y divide-border">
              {data.top_clients.map((client, i) => (
                <div key={client.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.count} achat{client.count > 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">{formatCurrency(client.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-6 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Aucune vente client</p>
            </div>
          )}
        </div>
        {!isPro && (
          <button
            onClick={() => setShowUpsell(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-2">
              <Crown className="size-4" />
              Débloquer
            </span>
          </button>
        )}
      </section>

      {/* Payment distribution donut (Pro section) */}
      <section className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Méthodes de paiement</h3>
          {!isPro && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">PRO</span>
          )}
        </div>
        <div className={!isPro ? 'blur-sm pointer-events-none' : ''}>
          <DonutChart
            data={(data.payment_distribution || []).map(d => ({
              label: d.method === 'cash' ? 'Cash' : d.method === 'wave' ? 'Wave' : 'Crédit',
              value: d.amount,
              color: d.method === 'cash' ? '#22c55e' : d.method === 'wave' ? '#3b82f6' : '#f97316',
            }))}
          />
        </div>
        {!isPro && (
          <button
            onClick={() => setShowUpsell(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-2">
              <Crown className="size-4" />
              Débloquer
            </span>
          </button>
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

      {/* Export button (Pro only) */}
      {isPro && (
        <section>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/export/csv', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'sales' }),
                })
                if (!res.ok) return
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `kivvi-ventes-${new Date().toISOString().slice(0, 10)}.csv`
                a.click()
                URL.revokeObjectURL(url)
              } catch {}
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="size-4" />
            Exporter les ventes (CSV)
          </button>
        </section>
      )}

      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        type="feature"
        featureName="Dashboard avancé"
      />
    </div>
  )
}
