'use client'

import { PAYMENT_METHODS } from '@/lib/carnet-constants'
import type { PaymentMethod } from '@/lib/carnet-types'

interface SaleCardProps {
  amount: number
  currency?: string
  productName?: string
  paymentMethod: PaymentMethod
  clientName?: string
  createdAt: string
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatAmount(amount: number, currency = 'XOF'): string {
  const symbols: Record<string, string> = {
    XOF: 'F', XAF: 'F', GNF: 'FG', CDF: 'FC', NGN: '\u20a6', GHS: 'GH\u20b5',
  }
  return `${Math.round(amount).toLocaleString('fr-FR')}${symbols[currency] || symbols.XOF}`
}

export function SaleCard({ amount, currency, productName, paymentMethod, clientName, createdAt }: SaleCardProps) {
  const method = PAYMENT_METHODS.find((m) => m.value === paymentMethod)

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold">{formatAmount(amount, currency)}</p>
        {productName && (
          <p className="text-sm text-muted-foreground truncate">{productName}</p>
        )}
        {paymentMethod === 'credit' && clientName && (
          <p className="text-xs text-orange-500 truncate">{clientName}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {method && (
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${method.color}15`, color: method.color }}
          >
            {method.label}
          </span>
        )}
        <span className="text-[11px] text-muted-foreground">
          {formatRelativeTime(createdAt)}
        </span>
      </div>
    </div>
  )
}
