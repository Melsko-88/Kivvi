'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Package, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProducts, useDeleteProduct } from '@/lib/db/hooks'
import { usePlan } from '@/hooks/use-plan'
import { formatCurrency } from '@/lib/carnet-constants'
import { ProductCard } from '@/components/carnet/product-card'
import { ProductForm } from '@/components/carnet/product-form'
import { UpsellModal } from '@/components/carnet/upsell-modal'
import type { LocalProduct } from '@/lib/db/index'

export default function ProductsPage() {
  const { user, profile } = useAuth()
  const products = useProducts(user?.id || '')
  const deleteProduct = useDeleteProduct()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<LocalProduct | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { canAddProduct, planStatus } = usePlan(user?.id)
  const [showUpsell, setShowUpsell] = useState(false)

  const filtered = useMemo(() => {
    if (!products) return []
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, search])

  const lowStockProducts = useMemo(() => {
    if (!products) return []
    return products.filter((p) => p.quantity <= p.low_stock_threshold)
  }, [products])

  function handleEdit(product: LocalProduct) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function handleAdd() {
    if (!canAddProduct && planStatus) {
      setShowUpsell(true)
      return
    }
    setEditingProduct(undefined)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deletingId) return
    await deleteProduct(deletingId)
    setDeletingId(null)
  }

  if (!user || !profile) return null

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>

        {lowStockProducts.length > 0 && !search && (
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700">
                Stock faible ({lowStockProducts.length})
              </span>
            </div>
            <div className="space-y-1">
              {lowStockProducts.map((p) => (
                <button
                  key={p.local_id}
                  onClick={() => handleEdit(p)}
                  className="w-full flex items-center justify-between text-left py-1 px-1 rounded hover:bg-orange-100 transition-colors"
                >
                  <span className="text-xs font-medium text-orange-800 truncate">
                    {p.name}
                  </span>
                  <span className="text-xs font-bold text-orange-600 shrink-0 ml-2">
                    {p.quantity} restant{p.quantity > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {products && products.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-muted-foreground font-medium">
                {filtered.length} produit{filtered.length > 1 ? 's' : ''}
              </span>
              {products.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  Valeur: {formatCurrency(products.reduce((s, p) => s + p.sell_price * p.quantity, 0))}
                </span>
              )}
            </div>
            {filtered.length > 0 ? (
              <div className="space-y-2">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.local_id}
                    product={product}
                    onEdit={() => handleEdit(product)}
                    onDelete={() => setDeletingId(product.local_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-muted-foreground">
                  Aucun résultat pour &quot;{search}&quot;
                </p>
              </div>
            )}
          </div>
        ) : products ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Aucun produit</p>
            <p className="text-xs text-muted-foreground mb-6">
              Ajoute ton premier article
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium transition-opacity hover:opacity-90"
            >
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="size-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        )}
      </div>

      <button
        onClick={handleAdd}
        className="fixed bottom-24 right-4 z-30 size-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="size-6" />
      </button>

      <ProductForm
        userId={user.id}
        shopType={profile.shop_type}
        product={editingProduct}
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingProduct(undefined)
        }}
      />

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-background rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-semibold">Supprimer ce produit ?</h3>
            <p className="text-sm text-muted-foreground">
              Cette action est irreversible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-medium transition-colors hover:bg-destructive/90"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        type="products"
        currentUsage={planStatus ? {
          used: planStatus.productCount,
          limit: planStatus.effectiveProductLimit === Infinity ? 999 : planStatus.effectiveProductLimit,
        } : undefined}
      />
    </>
  )
}
