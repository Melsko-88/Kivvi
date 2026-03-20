"use client"

import { motion } from 'framer-motion'
import {
  Globe, Building2, ShoppingCart, GraduationCap,
  Smartphone, Mail, Server, Wrench,
} from 'lucide-react'
import type { Service } from '@/lib/constants'
import { formatPrice } from '@/lib/format'

const iconMap: Record<string, React.ElementType> = {
  Globe, Building2, ShoppingCart, GraduationCap,
  Smartphone, Mail, Server, Wrench,
}

interface ServiceCardProps {
  service: Service
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Globe

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group p-6 rounded-xl bg-[#F3F1EE] border border-[#E8E5E0] transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper/10 text-copper mb-4 group-hover:bg-copper/20 transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#1A1A1A] mb-2">
        {service.name}
      </h3>
      <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-2">
        {service.description}
      </p>
      <div className="font-[family-name:var(--font-mono)] text-sm font-semibold text-copper">
        {typeof service.price === 'number' ? `À partir de ${formatPrice(service.price)}` : service.price}
      </div>
    </motion.div>
  )
}
