"use client"

import { motion } from 'framer-motion'
import {
  Globe, Building2, ShoppingCart, GraduationCap,
  Smartphone, Mail, Server, Wrench, Check,
} from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { SectionWrapper } from '@/components/shared/section-wrapper'

const iconMap: Record<string, React.ElementType> = {
  Globe, Building2, ShoppingCart, GraduationCap,
  Smartphone, Mail, Server, Wrench,
}

export function ServicesGrid() {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SERVICES.map((service, i) => {
          const Icon = iconMap[service.icon] || Globe
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group p-8 rounded-xl bg-[#F3F1EE] border border-[#E8E5E0]"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-copper/10 text-copper group-hover:bg-copper/20 transition-colors">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#1A1A1A] mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                        <Check className="h-4 w-4 text-copper shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="font-[family-name:var(--font-mono)] text-lg font-semibold text-copper">
                    {typeof service.price === 'number'
                      ? `À partir de ${formatPrice(service.price)}`
                      : service.price}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
