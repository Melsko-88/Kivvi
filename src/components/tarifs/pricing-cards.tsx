"use client"

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { PACKAGES } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { cn } from '@/lib/utils'

export function PricingCards() {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
        {PACKAGES.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              'glass-card relative flex flex-col p-8 rounded-xl',
              pkg.highlighted && 'border-gold/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]'
            )}
          >
            {pkg.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gold text-background px-4 py-1 rounded-full text-xs font-semibold">
                <Star className="h-3 w-3" fill="currentColor" />
                Populaire
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{pkg.subtitle}</p>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-1">{pkg.name}</h3>
            </div>

            <div className="mb-6">
              <div className="font-[family-name:var(--font-mono)] text-3xl font-bold">
                {typeof pkg.price === 'number' ? formatPrice(pkg.price) : pkg.price}
              </div>
              {pkg.priceNote && (
                <p className="text-xs text-muted-foreground mt-1">{pkg.priceNote}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Livraison : {pkg.delivery}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className={cn('h-4 w-4 shrink-0 mt-0.5', pkg.highlighted ? 'text-gold' : 'text-primary')} />
                  {feature}
                </li>
              ))}
            </ul>

            <LiquidGlassButton
              href="/devis"
              variant={pkg.highlighted ? 'gold' : 'primary'}
              className="w-full justify-center"
            >
              Choisir {pkg.name}
            </LiquidGlassButton>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
