'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Quote } from '@/types'
import { formatDate } from '@/lib/format'
import { Eye, Trash2, Download } from 'lucide-react'
import { generateQuotePDF } from '@/lib/pdf'

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400/70 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400/70 border-yellow-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400/70 border-purple-500/20',
  accepted: 'bg-green-500/10 text-green-400/70 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400/70 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  new: 'Nouveau', contacted: 'Contacté', in_progress: 'En cours', accepted: 'Accepté', rejected: 'Refusé',
}

export default function AdminDevisPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/quotes').then(r => r.json()).then(d => { setQuotes(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return
    await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' })
    setQuotes(quotes.filter(q => q.id !== id))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold">Demandes de devis</h1>
      {quotes.length === 0 ? (
        <p className="text-sm text-white/30">Aucun devis pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.04] text-left text-xs text-white/25">
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Nom</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th>
            </tr></thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/40">{formatDate(q.created_at)}</td>
                  <td className="px-4 py-3">{q.name}</td>
                  <td className="px-4 py-3 text-white/50">{q.type}</td>
                  <td className="px-4 py-3 text-white/50">{q.budget}</td>
                  <td className="px-4 py-3"><span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] ${statusColors[q.status]}`}>{statusLabels[q.status]}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    <button onClick={() => generateQuotePDF(q)} className="text-white/20 hover:text-white/50" title="Télécharger PDF"><Download size={14} /></button>
                    <Link href={`/admin/devis/${q.id}`} className="text-white/20 hover:text-white/50"><Eye size={14} /></Link>
                    <button onClick={() => handleDelete(q.id)} className="text-white/20 hover:text-red-400/60"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
