"use client"

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour KIVVI ! Je souhaite en savoir plus sur vos services.')}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-ping" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white" />
    </motion.a>
  )
}
