"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'
import { useScrollPosition } from '@/hooks/use-scroll-position'
import { Logo } from './logo'
import { LiquidGlassButton } from './liquid-glass-button'
import { MobileMenu } from './mobile-menu'

export function Navbar() {
  const pathname = usePathname()
  const { isScrolled } = useScrollPosition()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="flat-white" size={36} />
              <span className="font-heading text-xl font-bold tracking-tight">KIVVI</span>
            </Link>

            {/* Desktop nav — pill container */}
            <div className="hidden md:flex items-center">
              <div className="relative flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full',
                        isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full tubelight-indicator" />
                        </motion.div>
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LiquidGlassButton href="/devis" size="default">
                  Demander un devis
                </LiquidGlassButton>
              </div>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-white/5 border border-white/10"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
