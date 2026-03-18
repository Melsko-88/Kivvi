"use client"

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { SITE_CONFIG } from '@/lib/constants'

export function CTASection() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour KIVVI ! Je souhaite discuter d\'un projet.')}`

  return (
    <section className="py-20 md:py-28 gradient-mesh grain-overlay">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          Prêt à lancer votre{' '}
          <span className="text-gradient">projet digital</span> ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Obtenez un devis gratuit en quelques minutes. Notre équipe vous accompagne de A à Z.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <LiquidGlassButton href="/devis" variant="primary" size="lg">
            Demander un devis
            <ArrowRight className="h-5 w-5" />
          </LiquidGlassButton>
          <LiquidGlassButton href={whatsappUrl} variant="gold" size="lg">
            <MessageCircle className="h-5 w-5" />
            Discuter sur WhatsApp
          </LiquidGlassButton>
        </motion.div>
      </div>
    </section>
  )
}
