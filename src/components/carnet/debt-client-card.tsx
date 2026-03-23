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
  userId: string
  onQuotaExceeded: () => void
}

export function DebtClientCard({ client, expanded, onToggle, onPay, userId, onQuotaExceeded }: DebtClientCardProps) {
  const clientId = client.local_id ?? client.id
  const debts = useClientDebts(clientId)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ type: 'success' | 'error' | 'no_phone'; message: string } | null>(null)
  const [cooldown, setCooldown] = useState(false)

  const oldestDate = debts?.length
    ? debts.reduce((oldest, d) => (d.created_at < oldest ? d.created_at : oldest), debts[0].created_at)
    : null

  async function handleSendReminder() {
    if (cooldown) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.local_id ?? client.id }),
      })

      if (res.status === 429) {
        onQuotaExceeded()
        return
      }

      const data = await res.json()
      if (data.success) {
        setSendResult({ type: 'success', message: `Rappel envoyé par ${data.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}` })
        setCooldown(true)
        setTimeout(() => setCooldown(false), 30000)
      } else if (data.error === 'Le client n\'a pas de numéro de téléphone') {
        setSendResult({ type: 'no_phone', message: 'Ajoutez un numéro au client' })
      } else {
        setSendResult({ type: 'error', message: 'Échec de l\'envoi' })
      }
    } catch {
      setSendResult({ type: 'error', message: 'Erreur réseau' })
    } finally {
      setSending(false)
      setTimeout(() => setSendResult(null), 3000)
    }
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
              onClick={handleSendReminder}
              disabled={sending || cooldown}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {sending ? (
                <div className="size-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              ) : (
                <MessageCircle className="size-4" />
              )}
              {cooldown ? 'Envoyé' : 'Rappel WhatsApp'}
            </button>
          </div>

          {sendResult && (
            <div className={`mx-4 mb-3 px-3 py-2 rounded-lg text-center ${
              sendResult.type === 'success' ? 'bg-green-50 border border-green-200' :
              sendResult.type === 'no_phone' ? 'bg-orange-50 border border-orange-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-xs ${
                sendResult.type === 'success' ? 'text-green-700' :
                sendResult.type === 'no_phone' ? 'text-orange-700' :
                'text-red-700'
              }`}>{sendResult.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
