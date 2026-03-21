export interface Profile {
  id: string
  phone: string
  name: string
  shop_name: string
  shop_type: ShopType
  country: string
  language: string
  currency: string
  plan: Plan
  wave_phone?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export type ShopType = 'boutique' | 'restaurant' | 'salon' | 'atelier' | 'autre'
export type Plan = 'free' | 'pro' | 'business'
export type PaymentMethod = 'cash' | 'wave' | 'credit'
export type DebtStatus = 'pending' | 'partial' | 'paid'
export type PaymentLinkStatus = 'pending' | 'paid' | 'expired'
export type ReminderStatus = 'pending' | 'sent' | 'delivered' | 'failed'

export interface CarnetProduct {
  id: string
  user_id: string
  name: string
  buy_price: number
  sell_price: number
  quantity: number
  low_stock_threshold: number
  category?: string
  image_url?: string
  synced: boolean
  local_id?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  phone?: string
  last_reminder_at?: string
  synced: boolean
  local_id?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  user_id: string
  product_id?: string
  client_id?: string
  amount: number
  cost_price: number
  quantity: number
  payment_method: PaymentMethod
  note?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
  product?: CarnetProduct
  client?: Client
}

export interface Debt {
  id: string
  user_id: string
  client_id: string
  sale_id?: string
  amount: number
  paid_amount: number
  status: DebtStatus
  due_date?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: string
  user_id: string
  debt_id: string
  amount: number
  method: 'cash' | 'wave'
  wave_checkout_id?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
}

export interface PaymentLink {
  id: string
  user_id: string
  client_id?: string
  amount: number
  description?: string
  status: PaymentLinkStatus
  wave_checkout_id?: string
  commission_rate: number
  commission_amount: number
  paid_at?: string
  expires_at: string
  created_at: string
}

export interface ClientWithDebt extends Client {
  total_debt: number
  debt_count: number
}

export interface DashboardData {
  total_sales: number
  total_cost: number
  profit: number
  sale_count: number
  total_debt: number
  debtor_count: number
  top_products: { name: string; count: number; revenue: number }[]
  daily_sales: { date: string; total: number; profit: number }[]
}

export type Period = 'today' | 'week' | 'month'
