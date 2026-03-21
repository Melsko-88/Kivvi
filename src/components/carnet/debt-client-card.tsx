'use client'

import { useState } from 'react'
import { ChevronDown, Banknote, MessageCircle } from 'lucide-react'
import { useClientDebts } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'
import type { ClientWithDebt } from '@/lib/carnet-types'

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-orange-100 text-orange-700' },
  partial: { label: 'Partiel', className: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Payé', className: 'bg-green-100 text-green-700' },
}

interface DebtClientCardProps {
  client: ClientWithDebt
  expanded: boolean
  onToggle: () => void
  onPay: () => void
}

export function DebtClientCard({ client, expanded, onToggle, onPay }: DebtClientCardProps) {
  const clientId = client.local_id ?? client.id
  const debts = useClientDebts(clientId)
  const [toastVisible, setToastVisible] = useState(false)

  const oldestDate = debts?.length
    ? debts.reduce((oldest, d) => (d.created_at < oldest ? d.created_at : oldest), debts[0].created_at)
    : null

  function handleWhatsApp() {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{client.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">
              {client.debt_count} dette{client.debt_count > 1 ? 's' : ''}
            </span>
            {oldestDate && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  depuis {new Date(oldestDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </>
            )}
          </div>
        </div>
        <span className="text-sm font-bold text-red-600 shrink-0">
          {formatCurrency(client.total_debt)}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-2 space-y-2">
            {debts?.map((debt) => {
              const remaining = debt.amount - debt.paid_amount
              const style = STATUS_STYLES[debt.status] || STATUS_STYLES.pending
              return (
                <div key={debt.local_id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCurrency(remaining)}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${style.className}`}>
                      {style.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(debt.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 px-4 py-3 border-t border-border">
            <button
              onClick={onPay}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-foreground text-background text-sm font-medium transition-opacity"
            >
              <Banknote className="size-4" />
              Payer
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <MessageCircle className="size-4" />
              Rappel WhatsApp
            </button>
          </div>

          {toastVisible && (
            <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-foreground/5 border border-border text-center">
              <p className="text-xs text-muted-foreground">Bientôt disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
