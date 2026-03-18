"use client"

import { useState, useEffect, useCallback } from 'react'

interface UseCounterOptions {
  end: number
  duration?: number
  start?: number
  enabled?: boolean
}

export function useCounter({ end, duration = 2000, start = 0, enabled = true }: UseCounterOptions) {
  const [count, setCount] = useState(start)

  const animate = useCallback(() => {
    const startTime = performance.now()
    const range = end - start

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(start + range * eased))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [end, duration, start])

  useEffect(() => {
    if (enabled) animate()
  }, [enabled, animate])

  return count
}
