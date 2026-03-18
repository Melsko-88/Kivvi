"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText, FolderKanban, Receipt, TrendingUp, ArrowRight,
} from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { DashboardStats, Quote } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([])

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats)
    fetch('/api/admin/quotes').then((r) => r.json()).then((data) => setRecentQuotes(data.slice(0, 5)))
  }, [])

  const statCards = stats
    ? [
        { label: 'Total Devis', value: stats.total_quotes, icon: FileText, color: 'text-primary' },
        { label: 'Nouveaux', value: stats.new_quotes, icon: TrendingUp, color: 'text-gold' },
        { label: 'Acceptés', value: stats.accepted_quotes, icon: FileText, color: 'text-green-500' },
        { label: 'Revenus', value: formatPrice(stats.total_revenue), icon: Receipt, color: 'text-primary' },
        { label: 'Projets', value: stats.total_projects, icon: FolderKanban, color: 'text-gold' },
      ]
    : []

  return (
    <div className="space-y-8">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats ? (
          statCards.map((card) => (
            <div key={card.label} className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <p className="font-[family-name:var(--font-mono)] text-2xl font-bold">{card.value}</p>
            </div>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-5 rounded-xl animate-pulse">
              <div className="h-4 w-20 bg-white/5 rounded mb-3" />
              <div className="h-7 w-16 bg-white/5 rounded" />
            </div>
          ))
        )}
      </div>

      {/* Recent quotes */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold">Derniers devis</h3>
          <Link href="/admin/devis" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentQuotes.length > 0 ? (
            recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/devis/${quote.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{quote.name}</p>
                  <p className="text-xs text-muted-foreground">{quote.type} — {quote.email}</p>
                </div>
                <StatusBadge status={quote.status} />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucun devis pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400',
    contacted: 'bg-yellow-500/10 text-yellow-400',
    in_progress: 'bg-purple-500/10 text-purple-400',
    accepted: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
  }
  const labels: Record<string, string> = {
    new: 'Nouveau',
    contacted: 'Contacté',
    in_progress: 'En cours',
    accepted: 'Accepté',
    rejected: 'Refusé',
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>
      {labels[status] || status}
    </span>
  )
}
