'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Receipt, Users, Package, BarChart3 } from 'lucide-react'

const TABS = [
  { href: '/app/sales', label: 'Ventes', icon: Receipt },
  { href: '/app/debts', label: 'Dettes', icon: Users },
  { href: '/app/products', label: 'Produits', icon: Package },
  { href: '/app/dashboard', label: 'Tableau', icon: BarChart3 },
] as const

interface BottomNavProps {
  debtorCount?: number
}

export function BottomNav({ debtorCount = 0 }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href)
          const Icon = tab.icon
          const showBadge = tab.href === '/app/debts' && debtorCount > 0

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] transition-colors ${
                active ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="relative">
                <Icon className="size-5" strokeWidth={active ? 2.5 : 1.5} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">
                    {debtorCount > 99 ? '99+' : debtorCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
