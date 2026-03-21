'use client'

import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { ThemeProvider } from 'next-themes'
import { useAuth } from '@/hooks/use-auth'
import { useClientsWithDebts } from '@/lib/db/hooks'
import { BottomNav } from '@/components/carnet/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const debtClients = useClientsWithDebts(user?.id || '')

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="size-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-dvh bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {profile?.shop_name || 'Kivvi'}
              </h1>
              {profile?.name && (
                <p className="text-xs text-muted-foreground">{profile.name}</p>
              )}
            </div>
            <button
              onClick={() => router.push('/app/settings')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Settings className="size-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-4">{children}</main>

        <BottomNav debtorCount={debtClients?.length ?? 0} />
      </div>
    </ThemeProvider>
  )
}
