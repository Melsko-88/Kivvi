"use client"

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function CTASection() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour KIVVI ! Je souhaite discuter d\'un projet.')}`

  return (
    <section className="py-24 md:py-32 bg-copper">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Prêt à lancer votre projet digital ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-lg text-white/80 max-w-2xl mx-auto"
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
          <a
            href="/devis"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#0A0A0A] font-[family-name:var(--font-heading)] font-semibold px-8 py-4 text-base transition-all hover:bg-white/90"
          >
            Demander un devis
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent text-white border border-white/40 font-[family-name:var(--font-heading)] font-semibold px-8 py-4 text-base transition-all hover:bg-white/10"
          >
            <MessageCircle className="h-5 w-5" />
            Discuter sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
