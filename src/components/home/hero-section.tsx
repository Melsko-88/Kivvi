"use client"

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.2em] text-copper mb-6"
        >
          Agence Digitale Africaine
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-[family-name:var(--font-heading)] text-5xl font-extrabold tracking-tight text-[#F5F2ED] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Votre vision digitale,
          <br />
          <span className="text-copper">notre expertise.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 text-lg text-[#999] max-w-2xl mx-auto sm:text-xl leading-relaxed"
        >
          Nous concevons des sites web, applications mobiles et solutions digitales
          premium pour les entreprises et institutions en Afrique.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/devis" variant="primary" size="lg">
            Demander un devis gratuit
          </Button>
          <Button href="/portfolio" variant="dark" size="lg">
            Voir nos réalisations
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#F5F2ED]/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#F5F2ED]/40"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
