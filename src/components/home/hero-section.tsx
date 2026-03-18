"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh grain-overlay">
      {/* Geometric floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-[10%] w-24 h-24 border border-primary/20 rounded-2xl"
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-[15%] w-16 h-16 border border-gold/20 rounded-full"
          animate={{ y: [10, -15, 10], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[20%] w-12 h-12 bg-primary/5 rounded-lg"
          animate={{ y: [-8, 12, -8], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[10%] w-20 h-20 border border-primary/10 rounded-xl rotate-45"
          animate={{ y: [5, -10, 5], rotate: [45, 55, 45] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Glass 3D Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-3xl">
            <Logo variant="glass-3d" size={144} className="drop-shadow-2xl" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Votre Vision Digitale,{' '}
          <span className="text-gradient">Notre Expertise</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto sm:text-xl"
        >
          Agence digitale africaine. Nous concevons des sites web, applications mobiles
          et solutions digitales premium pour les entreprises et institutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <LiquidGlassButton href="/devis" variant="primary" size="lg">
            <Sparkles className="h-5 w-5" />
            Demander un devis gratuit
          </LiquidGlassButton>
          <LiquidGlassButton href="/portfolio" variant="gold" size="lg">
            Voir nos réalisations
            <ArrowRight className="h-5 w-5" />
          </LiquidGlassButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
