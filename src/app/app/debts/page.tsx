'use client'

import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { usePlan } from '@/hooks/use-plan'
import { useClientsWithDebts } from '@/lib/db/hooks'
import { formatCurrency } from '@/lib/carnet-constants'
import { DebtClientCard } from '@/components/carnet/debt-client-card'
import { DebtPaymentForm } from '@/components/carnet/debt-payment-form'
import { UpsellModal } from '@/components/carnet/upsell-modal'

export default function DebtsPage() {
  const { user } = useAuth()
  const clients = useClientsWithDebts(user?.id || '')
  const { planStatus } = usePlan(user?.id)
  const [showUpsell, setShowUpsell] = useState(false)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [payingClient, setPayingClient] = useState<{
    id: string
    name: string
    totalDebt: number
  } | null>(null)

  const totalDebt = clients?.reduce((sum, c) => sum + c.total_debt, 0) ?? 0
  const debtorCount = clients?.length ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dettes</h2>
          {debtorCount > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {debtorCount} débiteur{debtorCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {totalDebt > 0 && (
          <span className="text-lg font-bold text-red-600">
            {formatCurrency(totalDebt)}
          </span>
        )}
      </div>

      {clients && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Inbox className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Aucune dette en cours</p>
          <p className="text-xs text-muted-foreground mt-1">
            Les ventes à crédit apparaîtront ici
          </p>
        </div>
      )}

      <div className="space-y-2">
        {clients?.map((client) => (
          <DebtClientCard
            key={client.local_id ?? client.id}
            client={client}
            expanded={expandedId === (client.local_id ?? client.id)}
            onToggle={() => {
              const id = client.local_id ?? client.id
              setExpandedId(expandedId === id ? null : id)
            }}
            onPay={() => setPayingClient({
              id: client.local_id ?? client.id,
              name: client.name,
              totalDebt: client.total_debt,
            })}
            userId={user?.id || ''}
            onQuotaExceeded={() => setShowUpsell(true)}
          />
        ))}
      </div>

      {user && payingClient && (
        <DebtPaymentForm
          userId={user.id}
          clientId={payingClient.id}
          clientName={payingClient.name}
          totalDebt={payingClient.totalDebt}
          open={!!payingClient}
          onClose={() => setPayingClient(null)}
        />
      )}

      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        type="reminders"
        currentUsage={planStatus ? {
          used: planStatus.remindersUsedToday,
          limit: planStatus.effectiveReminderLimit === Infinity ? 999 : planStatus.effectiveReminderLimit,
        } : undefined}
      />
    </div>
  )
}
