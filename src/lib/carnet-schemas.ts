import { z } from 'zod'

export const phoneSchema = z
  .string()
  .min(8, 'Numéro trop court')
  .max(15, 'Numéro trop long')
  .regex(/^\+?\d+$/, 'Numéro invalide')

export const otpSchema = z
  .string()
  .length(6, 'Le code doit faire 6 chiffres')
  .regex(/^\d+$/, 'Chiffres uniquement')

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Prénom requis').max(100),
  shop_name: z.string().min(2, 'Nom de boutique requis').max(100),
  shop_type: z.enum(['boutique', 'restaurant', 'salon', 'atelier', 'autre']),
})

export const saleSchema = z.object({
  amount: z.number().positive('Montant requis'),
  product_id: z.string().optional(),
  client_id: z.string().optional(),
  quantity: z.number().int().positive(),
  payment_method: z.enum(['cash', 'wave', 'credit']),
  note: z.string().max(500).optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  sell_price: z.number().positive('Prix de vente requis'),
  buy_price: z.number().min(0),
  quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
  category: z.string().max(50).optional(),
})

export const clientSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  phone: z
    .string()
    .regex(/^\+?\d+$/, 'Numéro invalide')
    .optional()
    .or(z.literal('')),
})

export const debtPaymentSchema = z.object({
  amount: z.number().positive('Montant requis'),
  method: z.enum(['cash', 'wave']),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
export type SaleData = z.infer<typeof saleSchema>
export type ProductData = z.infer<typeof productSchema>
export type ClientData = z.infer<typeof clientSchema>
export type DebtPaymentData = z.infer<typeof debtPaymentSchema>
