'use client'

import { useEffect, useState } from 'react'
import type { Invoice } from '@/types'
import { formatDate, formatPrice } from '@/lib/format'
import { generateInvoicePDF } from '@/lib/pdf'
import { Download } from 'lucide-react'

const statusColors: Record<string, string> = {
  draft: 'bg-white/5 text-white/40 border-white/10',
  sent: 'bg-yellow-500/10 text-yellow-400/70 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-400/70 border-green-500/20',
}

export default function AdminFacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/invoices').then(r => r.json()).then(d => { setInvoices(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold">Factures</h1>
      {invoices.length === 0 ? (
        <p className="text-sm text-white/30">Aucune facture.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.04] text-left text-xs text-white/25">
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Échéance</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th>
            </tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/40">{formatDate(inv.created_at)}</td>
                  <td className="px-4 py-3">{inv.client_name}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(inv.total)}</td>
                  <td className="px-4 py-3 text-white/40">{formatDate(inv.due_date)}</td>
                  <td className="px-4 py-3"><span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] ${statusColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="px-4 py-3"><button onClick={() => generateInvoicePDF(inv)} className="text-white/20 hover:text-white/50" title="Télécharger PDF"><Download size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
