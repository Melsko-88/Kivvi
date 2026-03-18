"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
import { formatDateShort } from '@/lib/format'
import type { Quote } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = ['all', 'new', 'contacted', 'in_progress', 'accepted', 'rejected'] as const
const STATUS_LABELS: Record<string, string> = {
  all: 'Tous',
  new: 'Nouveau',
  contacted: 'Contacté',
  in_progress: 'En cours',
  accepted: 'Accepté',
  rejected: 'Refusé',
}
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-yellow-500/10 text-yellow-400',
  in_progress: 'bg-purple-500/10 text-purple-400',
  accepted: 'bg-green-500/10 text-green-400',
  rejected: 'bg-red-500/10 text-red-400',
}

export default function DevisListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/quotes').then((r) => r.json()).then(setQuotes)
  }, [])

  const filtered = quotes
    .filter((q) => filter === 'all' || q.status === filter)
    .filter((q) =>
      search === '' ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.type.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Devis</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            placeholder="Rechercher par nom, email ou type..."
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                filter === s ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:text-foreground'
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Nom</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Budget</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Statut</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-muted-foreground">{q.type}</td>
                  <td className="px-5 py-4 hidden md:table-cell font-[family-name:var(--font-mono)] text-xs">{q.budget}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[q.status] || ''}`}>
                      {STATUS_LABELS[q.status] || q.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground text-xs">
                    {formatDateShort(q.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/devis/${q.id}`} className="text-primary hover:text-primary/80">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucun devis trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
