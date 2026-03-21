'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { ILLUSTRATIONS } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative flex min-h-[85dvh] sm:min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Abstract tech background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={ILLUSTRATIONS.hero}
          alt=""
          fill
          className="object-cover opacity-[0.07] dark:opacity-[0.12]"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-gradient-orbit absolute -left-[15%] -top-[10%] h-[70vh] w-[70vh] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(180,200,255,0.4) 0%, transparent 70%)',
            animationDuration: '25s',
          }}
        />
        <div
          className="animate-gradient-orbit absolute -bottom-[10%] -right-[15%] h-[55vh] w-[55vh] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, rgba(200,180,255,0.4) 0%, transparent 70%)',
            animationDuration: '30s',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Noise overlay */}
      <div className="noise pointer-events-none absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground/40 backdrop-blur-sm">
            Agence Digitale Africaine
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-5 sm:mb-6 max-w-4xl font-[family-name:var(--font-heading)] text-[2rem] sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
        >
          On donne vie à vos{' '}
          <span className="text-glow bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
            ambitions digitales
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10 max-w-xl text-sm sm:text-base leading-relaxed text-foreground/40 sm:text-lg"
        >
          Sites web, applications mobiles, solutions sur mesure.
          <br className="hidden sm:block" />
          Conçus pour l&apos;Afrique, aux standards internationaux.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/devis">
            <LiquidButton size="xl">
              Démarrer un projet
            </LiquidButton>
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-foreground/[0.06] bg-foreground/[0.02] px-6 py-3 text-sm font-medium text-foreground/40 transition-all hover:border-foreground/[0.12] hover:bg-foreground/[0.04] hover:text-foreground/70"
          >
            Voir nos réalisations
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown size={20} className="animate-scroll-bounce text-foreground/20" />
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
    </section>
  )
}
