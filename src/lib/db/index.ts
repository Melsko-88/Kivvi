import Dexie, { type Table } from 'dexie'

export interface LocalSale {
  local_id: string
  server_id?: string
  user_id: string
  product_id?: string
  client_id?: string
  amount: number
  cost_price: number
  quantity: number
  payment_method: 'cash' | 'wave' | 'credit'
  note?: string
  synced: boolean
  created_at: string
  updated_at: string
}

export interface LocalProduct {
  local_id: string
  server_id?: string
  user_id: string
  name: string
  buy_price: number
  sell_price: number
  quantity: number
  low_stock_threshold: number
  category?: string
  image_url?: string
  synced: boolean
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface LocalClient {
  local_id: string
  server_id?: string
  user_id: string
  name: string
  phone?: string
  synced: boolean
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface LocalDebt {
  local_id: string
  server_id?: string
  user_id: string
  client_id: string
  sale_id?: string
  amount: number
  paid_amount: number
  status: 'pending' | 'partial' | 'paid'
  due_date?: string
  synced: boolean
  created_at: string
  updated_at: string
}

export interface LocalDebtPayment {
  local_id: string
  server_id?: string
  user_id: string
  debt_id: string
  amount: number
  method: 'cash' | 'wave'
  synced: boolean
  created_at: string
  updated_at: string
}

class CarnetDB extends Dexie {
  sales!: Table<LocalSale, string>
  products!: Table<LocalProduct, string>
  clients!: Table<LocalClient, string>
  debts!: Table<LocalDebt, string>
  debtPayments!: Table<LocalDebtPayment, string>

  constructor() {
    super('kivvi-carnet')
    this.version(1).stores({
      sales: 'local_id, user_id, synced, created_at, payment_method',
      products: 'local_id, user_id, synced, updated_at',
      clients: 'local_id, user_id, synced, updated_at',
      debts: 'local_id, user_id, client_id, synced, status',
      debtPayments: 'local_id, user_id, debt_id, synced',
    })
  }
}

export const db = new CarnetDB()
