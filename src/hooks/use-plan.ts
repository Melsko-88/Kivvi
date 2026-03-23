'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PlanStatus } from '@/lib/carnet-types'

interface UsePlanReturn {
  planStatus: PlanStatus | null
  loading: boolean
  refresh: () => Promise<void>
  canAddProduct: boolean
  canSendReminder: boolean
  isPro: boolean
}

export function usePlan(userId: string | undefined): UsePlanReturn {
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch('/api/plan/status')
      if (!res.ok) return
      const data = await res.json()
      // Deserialize -1 back to Infinity
      setPlanStatus({
        ...data,
        effectiveProductLimit: data.effectiveProductLimit === -1 ? Infinity : data.effectiveProductLimit,
        effectiveReminderLimit: data.effectiveReminderLimit === -1 ? Infinity : data.effectiveReminderLimit,
      })
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const isPro = planStatus?.plan === 'pro' || planStatus?.plan === 'business'

  return {
    planStatus,
    loading,
    refresh: fetchStatus,
    canAddProduct: !planStatus ? true : (isPro || planStatus.productCount < planStatus.effectiveProductLimit),
    canSendReminder: !planStatus ? true : (isPro || planStatus.remindersUsedToday < planStatus.effectiveReminderLimit),
    isPro,
  }
}
