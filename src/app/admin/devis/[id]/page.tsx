'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Quote } from '@/types'
import { formatDate } from '@/lib/format'
import { ArrowLeft, Save, Download, FileText, Copy, Check } from 'lucide-react'
import type { BriefData } from '@/types'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import Link from 'next/link'
import { generateQuotePDF } from '@/lib/pdf'

const STATUSES = ['new', 'contacted', 'in_progress', 'accepted', 'rejected'] as const

export default function AdminDevisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`).then(r => r.json()).then(q => { setQuote(q); setStatus(q.status); setNotes(q.notes || '') })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/admin/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
    router.push('/admin/devis')
  }

  if (!quote) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  return (
    <div>
      <Link href="/admin/devis" className="mb-6 inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/50"><ArrowLeft size={14} />Retour</Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold">Devis de {quote.name}</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-white/25">Informations</h2>
          {[
            ['Type', quote.type], ['Email', quote.email], ['Téléphone', quote.phone],
            ['Entreprise', quote.company || '—'], ['Budget', quote.budget],
            ['Deadline', quote.deadline || '—'], ['Date', formatDate(quote.created_at)],
          ].map(([l, v]) => (
            <div key={l}><span className="text-xs text-white/25">{l}</span><p className="text-sm text-white/60">{v}</p></div>
          ))}
          {quote.features.length > 0 && (
            <div><span className="text-xs text-white/25">Fonctionnalités</span>
              <div className="mt-1 flex flex-wrap gap-1">{quote.features.map(f => <span key={f} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs text-white/40">{f}</span>)}</div>
            </div>
          )}
          <div><span className="text-xs text-white/25">Description</span><p className="mt-1 text-sm leading-relaxed text-white/50">{quote.description}</p></div>
        </div>
        {quote.brief_data && <BriefDataPanel brief={quote.brief_data} />}
        <div className="space-y-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-white/25">Actions</h2>
          <div>
            <label className="mb-1 block text-xs text-white/30">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="glass-input w-full appearance-none px-3 py-2 text-sm text-white">
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/30">Notes internes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} className="glass-input w-full resize-none px-3 py-2 text-sm text-white" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2 text-sm transition-all hover:bg-white/[0.08] disabled:opacity-50">
              <Save size={14} />{saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button onClick={() => generateQuotePDF(quote)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2 text-sm transition-all hover:bg-white/[0.08]">
              <Download size={14} />PDF
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formatBriefForClaude(quote))
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2 text-sm transition-all hover:bg-white/[0.08]"
            >
              {copied ? <><Check size={14} className="text-green-400" />Copié !</> : <><Copy size={14} />Claude</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Format brief for Claude Project ─────────────────────────────────

function formatBriefForClaude(quote: Quote): string {
  const brief = quote.brief_data
  const budgetLabel = BUDGET_RANGES.find(b => b.value === quote.budget)?.label || quote.budget

  // If it's a brief form submission
  if (brief) {
    const projectLabels = (brief.projects || []).map(p => {
      const found = DEVIS_TYPES.find(t => t.value === p)
      return found?.label || p
    })
    const activeNeeds = Object.entries(brief.sectorQuestions || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
    const styleLabel = STYLE_LABELS[brief.style] || brief.style

    return `Génère un devis pour ce brief client :

PROJETS : ${projectLabels.join(', ')}
STRUCTURE : ${brief.organization?.name} (${brief.organization?.sector})
${brief.organization?.hasWebsite ? `SITE EXISTANT : ${brief.organization?.websiteUrl || 'Oui'}` : 'PAS DE SITE EXISTANT'}
${activeNeeds.length > 0 ? `BESOINS SPÉCIFIQUES : ${activeNeeds.join(', ')}` : ''}
STYLE VISUEL : ${styleLabel}
LOGO : ${brief.identity?.hasLogo ? (brief.identity?.logoUrl || 'Oui, a un logo') : 'Non, pas de logo'}
${brief.identity?.colors && brief.identity.colors.length > 0 ? `COULEURS : ${brief.identity.colors.join(', ')}` : ''}
BUDGET : ${budgetLabel}
${brief.contact?.name ? `CONTACT : ${brief.contact.name}` : `CONTACT : ${quote.name}`}
TÉLÉPHONE : ${brief.contact?.phone || quote.phone}
${brief.contact?.email || quote.email ? `EMAIL : ${brief.contact?.email || quote.email}` : ''}
WHATSAPP : ${brief.contact?.preferWhatsApp ? 'Oui' : 'Non'}
${quote.deadline ? `DEADLINE : ${quote.deadline}` : ''}
${quote.description ? `DESCRIPTION : ${quote.description}` : ''}

ID Devis : ${quote.id}`
  }

  // Fallback for classic devis form
  return `Génère un devis pour ce client :

TYPE : ${DEVIS_TYPES.find(t => t.value === quote.type)?.label || quote.type}
NOM : ${quote.name}
${quote.company ? `ENTREPRISE : ${quote.company}` : ''}
TÉLÉPHONE : ${quote.phone}
${quote.email ? `EMAIL : ${quote.email}` : ''}
BUDGET : ${budgetLabel}
${quote.deadline ? `DEADLINE : ${quote.deadline}` : ''}
${quote.features.length > 0 ? `FONCTIONNALITÉS : ${quote.features.join(', ')}` : ''}
DESCRIPTION : ${quote.description}

ID Devis : ${quote.id}`
}

const STYLE_LABELS: Record<string, string> = {
  moderne: 'Moderne & Minimaliste',
  corporate: 'Corporate & Institutionnel',
  chaleureux: 'Coloré & Chaleureux',
  premium: 'Premium & Élégant',
}

function BriefDataPanel({ brief }: { brief: BriefData }) {
  const activeNeeds = Object.entries(brief.sectorQuestions || {})
    .filter(([, v]) => v)
    .map(([k]) => k)

  return (
    <div className="space-y-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-6 lg:col-span-2">
      <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-white/25">
        <FileText size={14} /> Brief détaillé
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><span className="text-xs text-white/25">Projets</span><p className="text-sm text-white/60">{brief.projects?.join(', ')}</p></div>
        <div><span className="text-xs text-white/25">Structure</span><p className="text-sm text-white/60">{brief.organization?.name} ({brief.organization?.sector})</p></div>
        {brief.organization?.hasWebsite && <div><span className="text-xs text-white/25">Site existant</span><p className="text-sm text-white/60">{brief.organization?.websiteUrl || 'Oui'}</p></div>}
        <div><span className="text-xs text-white/25">Style visuel</span><p className="text-sm text-white/60">{STYLE_LABELS[brief.style] || brief.style}</p></div>
        <div><span className="text-xs text-white/25">Logo</span><p className="text-sm text-white/60">{brief.identity?.hasLogo ? (brief.identity?.logoUrl || 'Oui') : 'Non'}</p></div>
        {brief.identity?.colors && brief.identity.colors.length > 0 && (
          <div>
            <span className="text-xs text-white/25">Couleurs</span>
            <div className="mt-1 flex gap-1.5">
              {brief.identity.colors.map(c => (
                <div key={c} className="h-5 w-5 rounded-md border border-white/10" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}
        {activeNeeds.length > 0 && (
          <div className="sm:col-span-2">
            <span className="text-xs text-white/25">Besoins spécifiques</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {activeNeeds.map(n => <span key={n} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs text-white/40">{n}</span>)}
            </div>
          </div>
        )}
        <div><span className="text-xs text-white/25">WhatsApp préféré</span><p className="text-sm text-white/60">{brief.contact?.preferWhatsApp ? 'Oui' : 'Non'}</p></div>
      </div>
    </div>
  )
}
