"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { Quote } from '@/types'
import { cn } from '@/lib/utils'

const STATUSES = [
  { value: 'new', label: 'Nouveau', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'contacted', label: 'Contacté', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 'in_progress', label: 'En cours', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { value: 'accepted', label: 'Accepté', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  { value: 'rejected', label: 'Refusé', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
]

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/quotes/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setQuote(data)
        setStatus(data.status)
        setNotes(data.notes || '')
      })
  }, [params.id])

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/admin/quotes/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce devis ?')) return
    await fetch(`/api/admin/quotes/${params.id}`, { method: 'DELETE' })
    router.push('/admin/devis')
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button
        onClick={() => router.push('/admin/devis')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux devis
      </button>

      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
          Devis — {quote.name}
        </h2>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Supprimer
        </button>
      </div>

      {/* Info */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Nom" value={quote.name} />
          <InfoRow label="Email" value={quote.email} />
          <InfoRow label="Téléphone" value={quote.phone} />
          <InfoRow label="Entreprise" value={quote.company || '—'} />
          <InfoRow label="Type" value={quote.type} />
          <InfoRow label="Budget" value={quote.budget} />
          <InfoRow label="Délai" value={quote.deadline || '—'} />
          <InfoRow label="Date" value={formatDate(quote.created_at)} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{quote.description}</p>
        </div>

        {quote.features && quote.features.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fonctionnalités</p>
            <div className="flex flex-wrap gap-1.5">
              {quote.features.map((f) => (
                <span key={f} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status + Notes */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div>
          <p className="text-sm font-medium mb-3">Statut</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  status === s.value ? s.color : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1.5">Notes internes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="Ajouter des notes..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
