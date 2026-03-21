'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ChevronDown } from 'lucide-react'
import { productSchema, type ProductData } from '@/lib/carnet-schemas'
import { PRODUCT_CATEGORIES } from '@/lib/carnet-constants'
import { useAddProduct, useUpdateProduct } from '@/lib/db/hooks'
import type { LocalProduct } from '@/lib/db/index'

interface ProductFormProps {
  userId: string
  shopType: string
  product?: LocalProduct
  open: boolean
  onClose: () => void
}

export function ProductForm({ userId, shopType, product, open, onClose }: ProductFormProps) {
  const addProduct = useAddProduct(userId)
  const updateProduct = useUpdateProduct()

  const categories = PRODUCT_CATEGORIES[shopType] || PRODUCT_CATEGORIES['autre']

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sell_price: 0,
      buy_price: 0,
      quantity: 0,
      low_stock_threshold: 5,
      category: undefined,
    },
  })

  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        sell_price: product.sell_price,
        buy_price: product.buy_price,
        quantity: product.quantity,
        low_stock_threshold: product.low_stock_threshold,
        category: product.category || undefined,
      })
    } else if (open) {
      reset({
        name: '',
        sell_price: 0,
        buy_price: 0,
        quantity: 0,
        low_stock_threshold: 5,
        category: undefined,
      })
    }
  }, [open, product, reset])

  async function onSubmit(data: ProductData) {
    if (product) {
      await updateProduct(product.local_id, {
        name: data.name,
        sell_price: data.sell_price,
        buy_price: data.buy_price || 0,
        quantity: data.quantity || 0,
        low_stock_threshold: data.low_stock_threshold || 5,
        category: data.category,
      })
    } else {
      await addProduct(data)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl max-h-[90dvh] overflow-y-auto"
          >
            <div className="max-w-lg mx-auto px-4 pb-[env(safe-area-inset-bottom)] pb-6">
              <div className="flex items-center justify-between py-4 border-b border-border mb-4">
                <h2 className="text-lg font-semibold">
                  {product ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Nom *
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Ex: Riz 5kg"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Prix de vente *
                    </label>
                    <input
                      {...register('sell_price', { valueAsNumber: true })}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                    {errors.sell_price && (
                      <p className="mt-1 text-xs text-destructive">{errors.sell_price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Prix d&apos;achat
                    </label>
                    <input
                      {...register('buy_price', { valueAsNumber: true })}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Quantite en stock
                    </label>
                    <input
                      {...register('quantity', { valueAsNumber: true })}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Seuil d&apos;alerte
                    </label>
                    <input
                      {...register('low_stock_threshold', { valueAsNumber: true })}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="5"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Categorie
                  </label>
                  <div className="relative">
                    <select
                      {...register('category')}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none pr-10"
                    >
                      <option value="">Aucune</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity mt-6"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    product ? 'Enregistrer' : 'Ajouter'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
