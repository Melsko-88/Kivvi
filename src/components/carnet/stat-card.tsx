'use client'

import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  color?: string
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-3 flex flex-col gap-1.5 min-w-0">
      <div
        className="size-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color ? `${color}14` : 'var(--muted)' }}
      >
        <span style={{ color: color || 'var(--foreground)' }}>{icon}</span>
      </div>
      <p className="text-xs text-muted-foreground truncate">{label}</p>
      <p className="text-lg font-bold leading-tight truncate">{value}</p>
    </div>
  )
}
