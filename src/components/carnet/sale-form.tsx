'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Search, Plus, Minus, Loader2, UserPlus } from 'lucide-react'
import { useProducts, useClients, useAddClient, useAddSale } from '@/lib/db/hooks'
import { PAYMENT_METHODS } from '@/lib/carnet-constants'
import type { PaymentMethod } from '@/lib/carnet-types'
import type { LocalProduct, LocalClient } from '@/lib/db/index'

interface SaleFormProps {
  userId: string
  open: boolean
  onClose: () => void
}

export function SaleForm({ userId, open, onClose }: SaleFormProps) {
  const products = useProducts(userId)
  const clients = useClients(userId)
  const addSale = useAddSale(userId)
  const addClient = useAddClient(userId)

  const [amount, setAmount] = useState('')
  const [costPrice, setCostPrice] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [selectedClient, setSelectedClient] = useState<LocalClient | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [productSearch, setProductSearch] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [addingClient, setAddingClient] = useState(false)

  const amountRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => amountRef.current?.focus(), 300)
    }
  }, [open])

  function resetForm() {
    setAmount('')
    setCostPrice(0)
    setSelectedProduct(null)
    setQuantity(1)
    setPaymentMethod('cash')
    setSelectedClient(null)
    setNote('')
    setProductSearch('')
    setClientSearch('')
    setShowNewClient(false)
    setNewClientName('')
  }

  function handleSelectProduct(product: LocalProduct) {
    setSelectedProduct(product)
    setProductSearch(product.name)
    setShowProductDropdown(false)
    setAmount(String(product.sell_price * quantity))
    setCostPrice(product.buy_price)
  }

  function handleQuantityChange(delta: number) {
    const next = Math.max(1, quantity + delta)
    setQuantity(next)
    if (selectedProduct) {
      setAmount(String(selectedProduct.sell_price * next))
    }
  }

  function handleSelectClient(client: LocalClient) {
    setSelectedClient(client)
    setClientSearch(client.name)
    setShowClientDropdown(false)
  }

  async function handleAddNewClient() {
    if (!newClientName.trim()) return
    setAddingClient(true)
    const localId = await addClient({ name: newClientName.trim() })
    const created = (clients || []).find((c) => c.local_id === localId) || {
      local_id: localId,
      user_id: userId,
      name: newClientName.trim(),
      synced: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setSelectedClient(created as LocalClient)
    setClientSearch(newClientName.trim())
    setShowNewClient(false)
    setNewClientName('')
    setShowClientDropdown(false)
    setAddingClient(false)
  }

  async function handleSubmit() {
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) return
    if (paymentMethod === 'credit' && !selectedClient) return

    setSubmitting(true)
    try {
      await addSale({
        amount: parsedAmount,
        cost_price: costPrice,
        quantity,
        payment_method: paymentMethod,
        product_id: selectedProduct?.local_id,
        client_id: selectedClient?.local_id,
        note: note.trim() || undefined,
      })
      resetForm()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredClients = (clients || []).filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const canSubmit = parseFloat(amount) > 0 && (paymentMethod !== 'credit' || selectedClient)

  return (
    <>
      <div
        ref={backdropRef}
        onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[90dvh] overflow-y-auto transition-transform duration-300 ease-out ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="sticky top-0 bg-background z-10 flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-lg font-semibold">Nouvelle vente</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
              <X className="size-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Montant</label>
              <input
                ref={amountRef}
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-semibold"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Produit</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value)
                    setShowProductDropdown(true)
                    if (!e.target.value) setSelectedProduct(null)
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  placeholder="Rechercher un produit"
                  className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                />
                {showProductDropdown && productSearch && filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto z-20">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.local_id}
                        onClick={() => handleSelectProduct(p)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex justify-between"
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          {Math.round(p.sell_price).toLocaleString('fr-FR')}F
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted-foreground">Quantité</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Paiement</label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
                    style={
                      paymentMethod === m.value
                        ? { backgroundColor: `${m.color}15`, borderColor: m.color, color: m.color }
                        : { borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }
                    }
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Client</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value)
                      setShowClientDropdown(true)
                      if (!e.target.value) setSelectedClient(null)
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    placeholder="Rechercher un client"
                    className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                  />
                  {showClientDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto z-20">
                      {filteredClients.map((c) => (
                        <button
                          key={c.local_id}
                          onClick={() => handleSelectClient(c)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                        >
                          {c.name}
                        </button>
                      ))}
                      {!showNewClient && (
                        <button
                          onClick={() => setShowNewClient(true)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-foreground font-medium border-t border-border"
                        >
                          <UserPlus className="size-4" />
                          Nouveau client
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {showNewClient && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Nom du client"
                      autoFocus
                      className="glass-input flex-1 px-3 py-2 rounded-xl text-sm"
                    />
                    <button
                      onClick={handleAddNewClient}
                      disabled={!newClientName.trim() || addingClient}
                      className="px-3 py-2 rounded-xl bg-foreground text-background text-sm font-medium disabled:opacity-40 transition-opacity"
                    >
                      {addingClient ? <Loader2 className="size-4 animate-spin" /> : 'Ajouter'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note optionnelle"
                rows={2}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full py-3.5 rounded-xl bg-foreground text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            >
              {submitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                'Enregistrer la vente'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
