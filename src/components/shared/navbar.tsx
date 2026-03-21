'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LOGOS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'py-3'
            : 'py-5'
        )}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div
            className={cn(
              'flex items-center justify-between rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 transition-all duration-500',
              isScrolled
                ? 'glass-strong shadow-lg shadow-black/20'
                : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-3">
              <Image
                src={LOGOS.glass3D}
                alt="KIVVI"
                width={200}
                height={60}
                className="h-12 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.06)] sm:h-12 md:h-14"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-300',
                      isActive
                        ? 'text-foreground'
                        : 'text-foreground/50 hover:text-foreground/80'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 -z-10 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08]"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        {/* Tubelight glow */}
                        <div className="absolute -top-px left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-foreground/40">
                          <div className="absolute -top-1 left-1/2 h-4 w-12 -translate-x-1/2 rounded-full bg-foreground/10 blur-md" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTA + Theme Toggle */}
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10"
              >
                Carnet Digital
              </Link>
              <Link
                href="/devis"
                className="flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90"
              >
                Demander un devis
              </Link>
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="relative z-10 p-2 text-foreground/70 transition-colors hover:text-foreground"
                aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/98 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'text-2xl font-[family-name:var(--font-heading)] font-bold tracking-wide transition-colors',
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-foreground/40 hover:text-foreground/70'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: NAV_ITEMS.length * 0.08, duration: 0.4 }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-8 py-3 text-lg font-medium text-foreground transition-all hover:bg-foreground/10"
                >
                  Carnet Digital
                </Link>
                <Link
                  href="/devis"
                  className="inline-block rounded-full border border-foreground/20 bg-foreground/5 px-8 py-3 text-lg font-medium text-foreground transition-all hover:bg-foreground/10"
                >
                  Demander un devis
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
