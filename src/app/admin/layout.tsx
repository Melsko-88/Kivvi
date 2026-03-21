'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Receipt, FolderKanban, LogOut, Menu, X, Wand2, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/devis/generer', label: 'Générer devis', icon: Wand2 },
  { href: '/admin/devis', label: 'Devis reçus', icon: FileText },
  { href: '/admin/briefs', label: 'Briefs clients', icon: ClipboardList },
  { href: '/admin/factures', label: 'Factures', icon: Receipt },
  { href: '/admin/projets', label: 'Projets', icon: FolderKanban },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem('kivvi-admin')
    if (auth === 'true') setIsAuth(true)
    else if (pathname !== '/admin/login') router.replace('/admin/login')
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!isAuth) return <div className="flex min-h-screen items-center justify-center bg-[#050505]"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  const logout = () => { sessionStorage.removeItem('kivvi-admin'); router.push('/admin/login') }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[0.04] bg-[#080808] transition-transform lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-14 items-center justify-between border-b border-white/[0.04] px-5">
          <span className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wider">KIVVI ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(item => {
            const Icon = item.icon
            // Exact match for deep paths, prefix match for top-level
            const active = pathname === item.href || (item.href !== '/admin/devis' && pathname.startsWith(item.href)) || (item.href === '/admin/devis' && (pathname === '/admin/devis' || pathname.startsWith('/admin/devis/') && !pathname.startsWith('/admin/devis/generer')))
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors', active ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70')}>
                <Icon size={16} strokeWidth={1.5} />{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-white/[0.04] p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 transition-colors hover:bg-white/[0.03] hover:text-white/50">
            <LogOut size={16} strokeWidth={1.5} />Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-14 items-center border-b border-white/[0.04] px-6">
          <button onClick={() => setSidebarOpen(true)} className="mr-4 lg:hidden"><Menu size={18} /></button>
          <span className="text-xs text-white/50">{navItems.find(n => n.href === pathname || pathname.startsWith(n.href + '/'))?.label || 'Admin'}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
