"use client"

import { useEffect, useState, useCallback } from 'react'
import { Plus, Download, Trash2 } from 'lucide-react'
import { formatPrice, formatDateShort } from '@/lib/format'
import type { Invoice, InvoiceItem } from '@/types'
// PDF generation is dynamically imported to avoid SSR issues
async function downloadPDF(inv: Invoice) {
  const { generateInvoicePDF } = await import('@/lib/pdf')
  await generateInvoicePDF(inv)
}
import { cn } from '@/lib/utils'

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_address: '',
    tax_rate: 18,
    due_date: '',
    items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }] as InvoiceItem[],
  })
  const [saving, setSaving] = useState(false)

  const loadInvoices = useCallback(async () => {
    const data = await fetch('/api/admin/invoices').then((r) => r.json())
    setInvoices(data)
  }, [])

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    const items: InvoiceItem[] = [...form.items]
    const item = { ...items[index], [field]: value }
    item.total = item.quantity * item.unit_price
    items[index] = item
    setForm({ ...form, items })
  }

  function addItem() {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unit_price: 0, total: 0 }],
    })
  }

  function removeItem(index: number) {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
  }

  const subtotal = form.items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (form.tax_rate / 100)
  const total = subtotal + taxAmount

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        subtotal,
        tax_amount: taxAmount,
        total,
        status: 'draft',
      }),
    })
    setShowForm(false)
    setForm({
      client_name: '',
      client_email: '',
      client_address: '',
      tax_rate: 18,
      due_date: '',
      items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }],
    })
    setSaving(false)
    loadInvoices()
  }

  async function toggleStatus(invoice: Invoice) {
    const nextStatus = invoice.status === 'draft' ? 'sent' : invoice.status === 'sent' ? 'paid' : 'draft'
    await fetch(`/api/admin/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    loadInvoices()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Factures</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Nom du client"
              required
            />
            <input
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Email du client"
              required
            />
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Articles</p>
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-end">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                  className="w-20 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Qté"
                  min={1}
                />
                <input
                  type="number"
                  value={item.unit_price || ''}
                  onChange={(e) => updateItem(i, 'unit_price', Number(e.target.value))}
                  className="w-32 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Prix unitaire"
                />
                <span className="w-28 py-2 text-sm font-[family-name:var(--font-mono)] text-right">
                  {formatPrice(item.total)}
                </span>
                {form.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-red-400 p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-sm text-primary hover:underline">
              + Ajouter un article
            </button>
          </div>

          <div className="flex justify-end text-sm space-y-1">
            <div className="w-64 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-[family-name:var(--font-mono)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA ({form.tax_rate}%)</span>
                <span className="font-[family-name:var(--font-mono)]">{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-border">
                <span>Total</span>
                <span className="font-[family-name:var(--font-mono)]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Création...' : 'Créer la facture'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Client</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Total</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Statut</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Échéance</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium">{inv.client_name}</p>
                  <p className="text-xs text-muted-foreground">{inv.client_email}</p>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell font-[family-name:var(--font-mono)]">{formatPrice(inv.total)}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleStatus(inv)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      inv.status === 'draft' && 'bg-white/5 text-muted-foreground',
                      inv.status === 'sent' && 'bg-yellow-500/10 text-yellow-400',
                      inv.status === 'paid' && 'bg-green-500/10 text-green-400'
                    )}
                  >
                    {inv.status === 'draft' ? 'Brouillon' : inv.status === 'sent' ? 'Envoyée' : 'Payée'}
                  </button>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-muted-foreground text-xs">
                  {formatDateShort(inv.due_date)}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => downloadPDF(inv)}
                    className="text-primary hover:text-primary/80"
                    title="Télécharger PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucune facture. Créez-en une pour commencer.
          </div>
        )}
      </div>
    </div>
  )
}
