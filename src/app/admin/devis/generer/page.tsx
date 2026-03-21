'use client'

import { useState } from 'react'
import { Download, FileText, AlertCircle, Eye, Wand2, CheckCircle2, Send, Mail } from 'lucide-react'
import { generateProDevisPDF } from '@/lib/pdf'
import { formatPrice } from '@/lib/format'
import type { ProDevisData } from '@/types'

export default function GenererDevisPage() {
  const [json, setJson] = useState('')
  const [data, setData] = useState<ProDevisData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [emailOverride, setEmailOverride] = useState('')

  const parseJson = () => {
    setError('')
    setData(null)
    setSendSuccess(false)
    try {
      let raw = json.trim()
      // Extract from ```json block if present
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) raw = jsonMatch[1]

      const parsed = JSON.parse(raw) as ProDevisData

      if (!parsed.numero || !parsed.client || !parsed.prestations?.length || !parsed.total) {
        throw new Error('JSON incomplet — il manque numero, client, prestations ou total')
      }
      setData(parsed)
      setEmailOverride('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON invalide — vérifie le format')
    }
  }

  const handleDownload = async () => {
    if (!data) return
    setLoading(true)
    try {
      await generateProDevisPDF(data)
    } finally {
      setLoading(false)
    }
  }

  const recipientEmail = emailOverride || data?.client?.email || ''

  const handleSendEmail = async () => {
    if (!data || !recipientEmail) return
    setSending(true)
    setSendSuccess(false)
    setError('')
    try {
      // Generate PDF and get base64
      const pdfBase64 = await generateProDevisPDF(data)

      const res = await fetch('/api/admin/send-devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          email: recipientEmail,
          devis: {
            numero: data.numero,
            total: data.total,
            validite: data.validite,
            clientNom: data.client.nom,
          },
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi")
      }

      setSendSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'envoi de l'email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <Wand2 size={16} className="text-white/70" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            Générer un devis
          </h1>
        </div>
        <p className="ml-12 text-sm text-white/40">
          Colle le JSON depuis Claude Project → aperçu → télécharge ou envoie par email
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Colonne gauche : Input ── */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={14} className="text-white/50" />
              <span className="text-sm font-medium text-white/70">JSON depuis Claude</span>
            </div>

            <p className="mb-3 text-xs text-white/40 leading-relaxed">
              Colle la réponse complète de Claude Project — le bloc{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-white/60">```json</code>{' '}
              sera extrait automatiquement.
            </p>

            <textarea
              value={json}
              onChange={e => {
                setJson(e.target.value)
                setError('')
                if (data) setData(null)
              }}
              rows={20}
              className="w-full resize-none rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 font-mono text-xs text-white/80 placeholder-white/20 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none transition-all"
              placeholder={'{\n  "numero": "KIVVI-2026-001",\n  "client": { "nom": "...", ... },\n  "prestations": [...],\n  "total": 0\n}'}
            />

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-xs text-red-300/80">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {data && !error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/[0.08] px-3 py-2 text-xs text-green-300/80">
                <CheckCircle2 size={13} className="shrink-0" />
                JSON valide — {data.prestations.length} prestation(s) · {formatPrice(data.total)}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={parseJson}
                disabled={!json.trim()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/[0.10] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Eye size={14} />
                Analyser le JSON
              </button>

              <button
                onClick={handleDownload}
                disabled={!data || loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.09] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/[0.14] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-white/30">Comment utiliser</p>
            <ol className="space-y-2 text-xs text-white/45 leading-relaxed">
              <li className="flex gap-2"><span className="shrink-0 font-medium text-white/60">1.</span>Ouvre Claude Project (instructions dans <code className="text-white/55">/opt/kivvi/claude-project/</code>)</li>
              <li className="flex gap-2"><span className="shrink-0 font-medium text-white/60">2.</span>Décris le projet client — Claude génère un JSON structuré</li>
              <li className="flex gap-2"><span className="shrink-0 font-medium text-white/60">3.</span>Colle la réponse complète ici, clique &ldquo;Analyser&rdquo;</li>
              <li className="flex gap-2"><span className="shrink-0 font-medium text-white/60">4.</span>Vérifie l&apos;aperçu à droite, puis télécharge ou envoie par email</li>
            </ol>
          </div>
        </div>

        {/* ── Colonne droite : Aperçu ── */}
        <div className="space-y-4">
          {!data ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] text-center p-8">
              <FileText size={32} className="mb-3 text-white/15" />
              <p className="text-sm text-white/25">L&apos;aperçu apparaîtra ici</p>
              <p className="mt-1 text-xs text-white/15">après avoir analysé le JSON</p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-5">
              {/* Numéro + Date */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Devis</p>
                  <p className="text-base font-bold text-white">{data.numero}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">{data.date}</p>
                  <p className="text-[11px] text-white/30">Validité : {data.validite}</p>
                </div>
              </div>

              {/* Client */}
              <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Client</p>
                <p className="text-sm font-semibold text-white/85">{data.client.nom}</p>
                {data.client.structure && <p className="text-xs text-white/50">{data.client.structure}</p>}
                <p className="mt-0.5 text-xs text-white/35">{data.client.telephone}{data.client.email ? ` · ${data.client.email}` : ''}</p>
              </div>

              {/* Contexte */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Contexte</p>
                <p className="text-xs leading-relaxed text-white/55">{data.contexte}</p>
              </div>

              {/* Prestations */}
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
                  Prestations <span className="text-white/20">({data.prestations.length})</span>
                </p>
                <div className="space-y-2">
                  {data.prestations.map((p, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/75">{p.titre}</p>
                        <p className="mt-0.5 truncate text-[11px] text-white/35">{p.details}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-white/65">{formatPrice(p.montant)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 space-y-1.5">
                <div className="flex justify-between text-xs text-white/45">
                  <span>Sous-total</span>
                  <span>{formatPrice(data.sousTotal)}</span>
                </div>
                {data.remise && data.remise.montant > 0 && (
                  <div className="flex justify-between text-xs text-green-400/70">
                    <span>Remise ({data.remise.taux}%)</span>
                    <span>-{formatPrice(data.remise.montant)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/[0.07] pt-2 text-sm font-bold text-white/80">
                  <span>TOTAL</span>
                  <span>{formatPrice(data.total)}</span>
                </div>
              </div>

              {/* Échéancier */}
              {data.echeancier.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Paiement</p>
                  <div className="space-y-1">
                    {data.echeancier.map((e, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-white/45">{e.etape}</span>
                        <span className="font-medium text-white/60">{formatPrice(e.montant)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Délai */}
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Délai</span>
                <span className="text-xs font-medium text-white/60">{data.delai}</span>
              </div>

              {/* Inclus */}
              {data.inclus.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Inclus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.inclus.map(item => (
                      <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/45">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {data.options && data.options.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Options recommandées</p>
                  <div className="space-y-1">
                    {data.options.map((opt, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-white/40">{opt.titre}</span>
                        <span className="text-white/50">{formatPrice(opt.montant)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Download */}
              <button
                onClick={handleDownload}
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.08] py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/[0.13] disabled:opacity-50"
              >
                <Download size={15} />
                {loading ? 'Génération du PDF...' : `Télécharger — ${data.numero}.pdf`}
              </button>

              {/* ── Envoi par email ── */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-white/50" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
                    Envoyer par email
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailOverride}
                    onChange={e => { setEmailOverride(e.target.value); setSendSuccess(false) }}
                    placeholder={data.client.email || 'email@client.com'}
                    className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-xs text-white/80 placeholder-white/25 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleSendEmail}
                    disabled={sending || !recipientEmail}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.09] px-5 py-2.5 text-xs font-medium text-white transition-all hover:bg-white/[0.14] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>

                {sendSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/[0.08] px-3 py-2 text-xs text-green-300/80">
                    <CheckCircle2 size={13} className="shrink-0" />
                    Devis envoyé à {recipientEmail}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
