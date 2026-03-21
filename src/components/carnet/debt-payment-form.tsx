'use client'

import { useState } from 'react'
import { X, Banknote, Smartphone, Loader2 } from 'lucide-react'
import { useAddDebtPayment, useClientDebts } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'

interface DebtPaymentFormProps {
  userId: string
  clientId: string
  clientName: string
  totalDebt: number
  open: boolean
  onClose: () => void
}

export function DebtPaymentForm({ userId, clientId, clientName, totalDebt, open, onClose }: DebtPaymentFormProps) {
  const [amount, setAmount] = useState(String(Math.round(totalDebt)))
  const [method, setMethod] = useState<'cash' | 'wave'>('cash')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addDebtPayment = useAddDebtPayment(userId)
  const debts = useClientDebts(clientId)

  async function handleSubmit() {
    const paymentAmount = Number(amount)
    if (!paymentAmount || paymentAmount <= 0) {
      setError('Montant invalide')
      return
    }
    if (paymentAmount > totalDebt) {
      setError('Le montant dépasse la dette totale')
      return
    }
    if (!debts?.length) return

    setSubmitting(true)
    setError('')

    try {
      const sorted = [...debts]
        .filter((d) => d.status !== 'paid')
        .sort((a, b) => a.created_at.localeCompare(b.created_at))

      let remaining = paymentAmount

      for (const debt of sorted) {
        if (remaining <= 0) break
        const owed = debt.amount - debt.paid_amount
        if (owed <= 0) continue
        const applied = Math.min(remaining, owed)
        await addDebtPayment(debt.local_id, { amount: applied, method })
        remaining -= applied
      }

      onClose()
    } catch {
      setError('Erreur lors du paiement')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-background rounded-t-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-5 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Enregistrer un paiement</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        <div className="glass rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Client</p>
          <p className="text-sm font-semibold">{clientName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Dette totale : <span className="text-red-600 font-medium">{formatCurrency(totalDebt)}</span>
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Montant</label>
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="glass-input w-full px-4 py-3 rounded-xl text-lg font-semibold"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mode de paiement</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMethod('cash')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                method === 'cash'
                  ? 'border-foreground bg-foreground/5'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <Banknote className="size-4" />
              Cash
            </button>
            <button
              onClick={() => setMethod('wave')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                method === 'wave'
                  ? 'border-foreground bg-foreground/5'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <Smartphone className="size-4" />
              Wave
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || !amount}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Enregistrer le paiement'
          )}
        </button>
      </div>
    </div>
  )
}
