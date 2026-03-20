"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'
import { Logo } from './logo'
import { Button } from './button'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#FAFAF7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-full flex-col px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <Logo variant="dark" size={36} />
                <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#1A1A1A]">KIVVI</span>
              </Link>
              <button
                onClick={onClose}
                className="flex items-center justify-center h-10 w-10 rounded-lg border border-[#E8E5E0] text-[#1A1A1A]"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-1 flex-col items-center justify-center gap-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'block text-center text-3xl font-[family-name:var(--font-heading)] font-bold py-3 transition-colors',
                        isActive ? 'text-copper' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Button href="/devis" size="lg" onClick={onClose}>
                  Demander un devis
                </Button>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
