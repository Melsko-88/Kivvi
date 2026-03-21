'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LocalSale, type LocalProduct, type LocalClient, type LocalDebt, type LocalDebtPayment } from './index'
import { triggerBackgroundSync } from './sync'
import { getDateRange } from '@/lib/carnet-constants'
import type { Period, ClientWithDebt, DashboardData } from '@/lib/carnet-types'

function now() {
  return new Date().toISOString()
}

function uuid() {
  return crypto.randomUUID()
}

export function useSales(userId: string, period: Period) {
  const { start, end } = getDateRange(period)

  return useLiveQuery(
    () =>
      db.sales
        .where('user_id')
        .equals(userId)
        .filter(
          (s) =>
            new Date(s.created_at) >= start && new Date(s.created_at) <= end
        )
        .reverse()
        .sortBy('created_at'),
    [userId, period]
  )
}

export function useAddSale(userId: string) {
  return async (data: {
    amount: number
    cost_price?: number
    quantity?: number
    payment_method: 'cash' | 'wave' | 'credit'
    product_id?: string
    client_id?: string
    note?: string
  }) => {
    const localId = uuid()
    const timestamp = now()

    const sale: LocalSale = {
      local_id: localId,
      user_id: userId,
      amount: data.amount,
      cost_price: data.cost_price || 0,
      quantity: data.quantity || 1,
      payment_method: data.payment_method,
      product_id: data.product_id,
      client_id: data.client_id,
      note: data.note,
      synced: false,
      created_at: timestamp,
      updated_at: timestamp,
    }

    await db.sales.add(sale)

    if (data.product_id) {
      const product = await db.products.get(data.product_id)
      if (product) {
        await db.products.update(data.product_id, {
          quantity: Math.max(0, product.quantity - (data.quantity || 1)),
          synced: false,
          updated_at: timestamp,
        })
      }
    }

    if (data.payment_method === 'credit' && data.client_id) {
      const debt: LocalDebt = {
        local_id: uuid(),
        user_id: userId,
        client_id: data.client_id,
        sale_id: localId,
        amount: data.amount,
        paid_amount: 0,
        status: 'pending',
        synced: false,
        created_at: timestamp,
        updated_at: timestamp,
      }
      await db.debts.add(debt)
    }

    triggerBackgroundSync()
    return localId
  }
}

export function useProducts(userId: string) {
  return useLiveQuery(
    () =>
      db.products
        .where('user_id')
        .equals(userId)
        .filter((p) => !p.deleted_at)
        .sortBy('name'),
    [userId]
  )
}

export function useAddProduct(userId: string) {
  return async (data: {
    name: string
    sell_price: number
    buy_price?: number
    quantity?: number
    low_stock_threshold?: number
    category?: string
  }) => {
    const timestamp = now()
    const product: LocalProduct = {
      local_id: uuid(),
      user_id: userId,
      name: data.name,
      sell_price: data.sell_price,
      buy_price: data.buy_price || 0,
      quantity: data.quantity || 0,
      low_stock_threshold: data.low_stock_threshold || 5,
      category: data.category,
      synced: false,
      created_at: timestamp,
      updated_at: timestamp,
    }

    await db.products.add(product)
    triggerBackgroundSync()
    return product.local_id
  }
}

export function useUpdateProduct() {
  return async (localId: string, data: Partial<LocalProduct>) => {
    await db.products.update(localId, {
      ...data,
      synced: false,
      updated_at: now(),
    })
    triggerBackgroundSync()
  }
}

export function useDeleteProduct() {
  return async (localId: string) => {
    await db.products.update(localId, {
      deleted_at: now(),
      synced: false,
      updated_at: now(),
    })
    triggerBackgroundSync()
  }
}

export function useClients(userId: string) {
  return useLiveQuery(
    () =>
      db.clients
        .where('user_id')
        .equals(userId)
        .filter((c) => !c.deleted_at)
        .sortBy('name'),
    [userId]
  )
}

export function useAddClient(userId: string) {
  return async (data: { name: string; phone?: string }) => {
    const timestamp = now()
    const client: LocalClient = {
      local_id: uuid(),
      user_id: userId,
      name: data.name,
      phone: data.phone,
      synced: false,
      created_at: timestamp,
      updated_at: timestamp,
    }

    await db.clients.add(client)
    triggerBackgroundSync()
    return client.local_id
  }
}

export function useClientsWithDebts(userId: string): ClientWithDebt[] | undefined {
  return useLiveQuery(async () => {
    const clients = await db.clients
      .where('user_id')
      .equals(userId)
      .filter((c) => !c.deleted_at)
      .toArray()

    const result: ClientWithDebt[] = []

    for (const client of clients) {
      const debts = await db.debts
        .where('client_id')
        .equals(client.local_id)
        .filter((d) => d.status !== 'paid')
        .toArray()

      if (debts.length > 0) {
        const total_debt = debts.reduce((sum, d) => sum + d.amount - d.paid_amount, 0)
        result.push({ ...client, id: client.local_id, total_debt, debt_count: debts.length })
      }
    }

    return result.sort((a, b) => b.total_debt - a.total_debt)
  }, [userId])
}

export function useClientDebts(clientId: string) {
  return useLiveQuery(
    () =>
      db.debts
        .where('client_id')
        .equals(clientId)
        .reverse()
        .sortBy('created_at'),
    [clientId]
  )
}

export function useAddDebtPayment(userId: string) {
  return async (debtId: string, data: { amount: number; method: 'cash' | 'wave' }) => {
    const timestamp = now()

    const payment: LocalDebtPayment = {
      local_id: uuid(),
      user_id: userId,
      debt_id: debtId,
      amount: data.amount,
      method: data.method,
      synced: false,
      created_at: timestamp,
      updated_at: timestamp,
    }

    await db.debtPayments.add(payment)

    const debt = await db.debts.get(debtId)
    if (debt) {
      const newPaid = debt.paid_amount + data.amount
      const newStatus = newPaid >= debt.amount ? 'paid' : 'partial'

      await db.debts.update(debtId, {
        paid_amount: newPaid,
        status: newStatus,
        synced: false,
        updated_at: timestamp,
      })
    }

    triggerBackgroundSync()
  }
}

export function useDashboardData(userId: string, period: Period): DashboardData | undefined {
  const { start, end } = getDateRange(period)

  return useLiveQuery(async () => {
    const sales = await db.sales
      .where('user_id')
      .equals(userId)
      .filter(
        (s) => new Date(s.created_at) >= start && new Date(s.created_at) <= end
      )
      .toArray()

    const total_sales = sales.reduce((s, v) => s + v.amount, 0)
    const total_cost = sales.reduce((s, v) => s + v.cost_price * v.quantity, 0)

    const debts = await db.debts
      .where('user_id')
      .equals(userId)
      .filter((d) => d.status !== 'paid')
      .toArray()

    const uniqueDebtors = new Set(debts.map((d) => d.client_id))

    const productSales: Record<string, { count: number; revenue: number }> = {}
    for (const sale of sales) {
      if (sale.product_id) {
        const existing = productSales[sale.product_id] || { count: 0, revenue: 0 }
        existing.count += sale.quantity
        existing.revenue += sale.amount
        productSales[sale.product_id] = existing
      }
    }

    const products = await db.products
      .where('user_id')
      .equals(userId)
      .toArray()

    const productMap = new Map(products.map((p) => [p.local_id, p.name]))

    const top_products = Object.entries(productSales)
      .map(([id, data]) => ({
        name: productMap.get(id) || 'Inconnu',
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const dailyMap: Record<string, { total: number; cost: number }> = {}
    for (const sale of sales) {
      const day = sale.created_at.slice(0, 10)
      const existing = dailyMap[day] || { total: 0, cost: 0 }
      existing.total += sale.amount
      existing.cost += sale.cost_price * sale.quantity
      dailyMap[day] = existing
    }

    const daily_sales = Object.entries(dailyMap)
      .map(([date, data]) => ({
        date,
        total: data.total,
        profit: data.total - data.cost,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      total_sales,
      total_cost,
      profit: total_sales - total_cost,
      sale_count: sales.length,
      total_debt: debts.reduce((s, d) => s + d.amount - d.paid_amount, 0),
      debtor_count: uniqueDebtors.size,
      top_products,
      daily_sales,
    }
  }, [userId, period])
}
