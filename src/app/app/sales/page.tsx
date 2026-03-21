'use client'

import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSales, useProducts, useClients } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'
import type { Period } from '@/lib/carnet-types'
import { PeriodFilter } from '@/components/carnet/period-filter'
import { SaleCard } from '@/components/carnet/sale-card'
import { SaleForm } from '@/components/carnet/sale-form'

export default function SalesPage() {
  const { user, profile } = useAuth()
  const [period, setPeriod] = useState<Period>('today')
  const [formOpen, setFormOpen] = useState(false)

  const userId = user?.id || ''
  const sales = useSales(userId, period)
  const products = useProducts(userId)
  const clients = useClients(userId)

  const productMap = new Map((products || []).map((p) => [p.local_id, p.name]))
  const clientMap = new Map((clients || []).map((c) => [c.local_id, c.name]))

  const totalAmount = (sales || []).reduce((sum, s) => sum + s.amount, 0)
  const currency = profile?.currency || 'XOF'

  return (
    <div className="space-y-4">
      <PeriodFilter value={period} onChange={setPeriod} />

      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">Total ventes</p>
        <p className="text-3xl font-bold">{formatCurrency(totalAmount, currency)}</p>
      </div>

      {sales === undefined ? (
        <div className="flex justify-center py-12">
          <div className="size-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      ) : sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Receipt className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Aucune vente pour cette période
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Appuie sur + pour enregistrer ta première vente
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sales.map((sale) => (
            <SaleCard
              key={sale.local_id}
              amount={sale.amount}
              currency={currency}
              productName={sale.product_id ? productMap.get(sale.product_id) : undefined}
              paymentMethod={sale.payment_method}
              clientName={sale.client_id ? clientMap.get(sale.client_id) : undefined}
              createdAt={sale.created_at}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setFormOpen(true)}
        className="fixed bottom-24 right-4 size-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center z-30 active:scale-95 transition-transform"
      >
        <Plus className="size-6" strokeWidth={2.5} />
      </button>

      {userId && (
        <SaleForm userId={userId} open={formOpen} onClose={() => setFormOpen(false)} />
      )}
    </div>
  )
}
