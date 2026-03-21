'use client'

import { useEffect, useState } from 'react'
import { FileText, CheckCircle, DollarSign, FolderKanban, AlertCircle } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { formatPrice } from '@/lib/format'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  const cards = stats ? [
    { label: 'Devis total', value: stats.total_quotes, icon: FileText },
    { label: 'Nouveaux devis', value: stats.new_quotes, icon: AlertCircle },
    { label: 'Devis acceptés', value: stats.accepted_quotes, icon: CheckCircle },
    { label: 'Revenus', value: formatPrice(stats.total_revenue), icon: DollarSign },
    { label: 'Projets', value: stats.total_projects, icon: FolderKanban },
  ] : []

  if (error) return <p className="text-sm text-red-400/60">Erreur de chargement</p>
  if (!stats) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
              <div className="mb-3 flex items-center gap-2 text-white/30">
                <Icon size={14} strokeWidth={1.5} />
                <span className="text-xs">{card.label}</span>
              </div>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold">{card.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
