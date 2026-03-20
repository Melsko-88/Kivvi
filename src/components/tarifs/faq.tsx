"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/constants'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { cn } from '@/lib/utils'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <SectionWrapper
      title="Questions Fréquentes"
      subtitle="Tout ce que vous devez savoir avant de démarrer votre projet."
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i} className="rounded-xl bg-[#F3F1EE] border border-[#E8E5E0] overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#1A1A1A] pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-[#6B6B6B] transition-transform duration-300',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="px-5 pb-5 text-sm text-[#6B6B6B] leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
