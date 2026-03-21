'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Quote } from '@/types'
import { formatDate } from '@/lib/format'
import { Eye, Copy, Check, ClipboardList } from 'lucide-react'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-300/70 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-300/70 border-yellow-500/20',
  in_progress: 'bg-purple-500/10 text-purple-300/70 border-purple-500/20',
  accepted: 'bg-green-500/10 text-green-300/70 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-300/70 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  new: 'Nouveau', contacted: 'Contacté', in_progress: 'En cours', accepted: 'Accepté', rejected: 'Refusé',
}

const STYLE_LABELS: Record<string, string> = {
  moderne: 'Moderne', corporate: 'Corporate', chaleureux: 'Chaleureux', premium: 'Premium',
}

export default function AdminBriefsPage() {
  const [briefs, setBriefs] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/briefs')
      .then(r => r.json())
      .then(d => { setBriefs(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const copyPrompt = (q: Quote) => {
    const brief = q.brief_data
    if (!brief) return

    const projectLabels = (brief.projects || []).map((p: string) => {
      return DEVIS_TYPES.find(t => t.value === p)?.label || p
    })
    const budgetLabel = BUDGET_RANGES.find(b => b.value === q.budget)?.label || q.budget
    const activeNeeds = Object.entries(brief.sectorQuestions || {})
      .filter(([, v]) => v)
      .map(([k]) => k)

    const prompt = `Génère un devis pour ce brief client :

PROJETS : ${projectLabels.join(', ')}
STRUCTURE : ${brief.organization?.name} (${brief.organization?.sector})
${brief.organization?.hasWebsite ? `SITE EXISTANT : ${brief.organization?.websiteUrl || 'Oui'}` : 'PAS DE SITE EXISTANT'}
${activeNeeds.length > 0 ? `BESOINS SPÉCIFIQUES : ${activeNeeds.join(', ')}` : ''}
STYLE VISUEL : ${STYLE_LABELS[brief.style] || brief.style}
LOGO : ${brief.identity?.hasLogo ? (brief.identity?.logoUrl || 'Oui, a un logo') : 'Non, pas de logo'}
${brief.identity?.colors?.length > 0 ? `COULEURS : ${brief.identity.colors.join(', ')}` : ''}
BUDGET : ${budgetLabel}
CONTACT : ${brief.contact?.name || q.name}
TÉLÉPHONE : ${brief.contact?.phone || q.phone}
${brief.contact?.email || q.email ? `EMAIL : ${brief.contact?.email || q.email}` : ''}
${q.deadline ? `DEADLINE : ${q.deadline}` : ''}

ID : ${q.id}`

    navigator.clipboard.writeText(prompt)
    setCopiedId(q.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <ClipboardList size={16} className="text-white/70" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">Briefs clients</h1>
            <p className="text-xs text-white/35">{briefs.length} brief{briefs.length !== 1 ? 's' : ''} reçu{briefs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {briefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <ClipboardList size={32} className="mb-3 text-white/15" />
          <p className="text-sm text-white/30">Aucun brief pour le moment</p>
          <p className="mt-1 text-xs text-white/20">Les briefs soumis via <code className="text-white/30">kivvi.tech/brief/nouveau</code> apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {briefs.map(q => {
            const brief = q.brief_data
            const projectLabels = brief?.projects?.map((p: string) => {
              return DEVIS_TYPES.find(t => t.value === p)?.label || p
            }) || []
            const activeNeeds = Object.entries(brief?.sectorQuestions || {})
              .filter(([, v]) => v)
              .map(([k]) => k as string)

            return (
              <div key={q.id} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors hover:bg-white/[0.035]">
                <div className="flex items-start justify-between gap-4">
                  {/* Info principale */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white/80">{q.company || q.name}</p>
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] ${statusColors[q.status]}`}>
                        {statusLabels[q.status]}
                      </span>
                    </div>
                    <p className="text-xs text-white/45">{q.name} · {q.phone}{q.email ? ` · ${q.email}` : ''}</p>
                    {projectLabels.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {projectLabels.map((label: string) => (
                          <span key={label} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/55">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {activeNeeds.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {activeNeeds.slice(0, 4).map((need: string) => (
                          <span key={need} className="rounded-full border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 text-[10px] text-white/35">
                            {need}
                          </span>
                        ))}
                        {activeNeeds.length > 4 && (
                          <span className="text-[10px] text-white/25">+{activeNeeds.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Meta + Actions */}
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-white/40">{q.budget}</p>
                      {brief?.style && (
                        <p className="text-[10px] text-white/25">{STYLE_LABELS[brief.style] || brief.style}</p>
                      )}
                      <p className="mt-0.5 text-[10px] text-white/20">{formatDate(q.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyPrompt(q)}
                        title="Copier prompt Claude"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/80"
                      >
                        {copiedId === q.id ? (
                          <><Check size={12} className="text-green-400" />Copié</>
                        ) : (
                          <><Copy size={12} />Claude</>
                        )}
                      </button>
                      <Link
                        href={`/admin/devis/${q.id}`}
                        title="Voir détail"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/80"
                      >
                        <Eye size={12} />Voir
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Logo preview if exists */}
                {brief?.identity?.logoUrl && (
                  <div className="mt-3 border-t border-white/[0.05] pt-3">
                    <p className="mb-1.5 text-[10px] text-white/25">Logo client</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brief.identity.logoUrl} alt="Logo client" className="h-8 rounded object-contain opacity-70" />
                  </div>
                )}

                {/* Colors if exists */}
                {(brief?.identity?.colors?.length ?? 0) > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-[10px] text-white/25">Couleurs :</p>
                    <div className="flex gap-1">
                      {(brief?.identity?.colors ?? []).map((c: string) => (
                        <div key={c} className="h-4 w-4 rounded border border-white/10" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
