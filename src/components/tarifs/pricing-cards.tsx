"use client"

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { PACKAGES } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { Button } from '@/components/shared/button'
import { cn } from '@/lib/utils'

export function PricingCards() {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
        {PACKAGES.map((pkg, i) => {
          const isDark = pkg.highlighted
          return (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative flex flex-col p-8 rounded-xl',
                isDark
                  ? 'bg-[#0A0A0A] text-[#F5F2ED] border border-copper/30'
                  : 'bg-[#F3F1EE] border border-[#E8E5E0]'
              )}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-copper text-white px-4 py-1 rounded-full text-xs font-semibold">
                  <Star className="h-3 w-3" fill="currentColor" />
                  Populaire
                </div>
              )}

              <div className="mb-6">
                <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-[#999]" : "text-[#6B6B6B]")}>{pkg.subtitle}</p>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-1">{pkg.name}</h3>
              </div>

              <div className="mb-6">
                <div className="font-[family-name:var(--font-mono)] text-3xl font-bold">
                  {typeof pkg.price === 'number' ? formatPrice(pkg.price) : pkg.price}
                </div>
                {pkg.priceNote && (
                  <p className={cn("text-xs mt-1", isDark ? "text-[#999]" : "text-[#6B6B6B]")}>{pkg.priceNote}</p>
                )}
                <p className={cn("text-xs mt-2", isDark ? "text-[#999]" : "text-[#6B6B6B]")}>
                  Livraison : {pkg.delivery}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className={cn("flex items-start gap-2.5 text-sm", isDark ? "text-[#999]" : "text-[#6B6B6B]")}>
                    <Check className="h-4 w-4 shrink-0 mt-0.5 text-copper" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                href="/devis"
                variant={isDark ? 'dark' : 'primary'}
                className="w-full justify-center"
              >
                Choisir {pkg.name}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
