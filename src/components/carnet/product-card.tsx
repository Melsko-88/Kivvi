'use client'

import { Package, Tag, Pencil, Trash2 } from 'lucide-react'
import type { LocalProduct } from '@/lib/db/index'
import { formatCurrency } from '@/lib/carnet-constants'

interface ProductCardProps {
  product: LocalProduct
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const isLowStock = product.quantity <= product.low_stock_threshold

  return (
    <div
      onClick={onEdit}
      className="glass glass-hover rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold">
            {formatCurrency(product.sell_price)}
          </span>
          {product.buy_price > 0 && (
            <span className="text-xs text-muted-foreground">
              achat {formatCurrency(product.buy_price)}
            </span>
          )}
        </div>
        {product.category && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Tag className="size-2.5" />
            {product.category}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isLowStock
              ? 'bg-orange-100 text-orange-700'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Package className="size-3" />
          {product.quantity}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <Pencil className="size-3.5 text-muted-foreground" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-3.5 text-destructive" />
        </button>
      </div>
    </div>
  )
}
