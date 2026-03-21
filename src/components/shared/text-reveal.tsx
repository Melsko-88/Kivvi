'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  charDelay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  charDelay = 0.03,
  as: Tag = 'h1',
}: TextRevealProps) {
  const words = text.split(' ')

  return (
    <Tag className={cn('flex flex-wrap justify-center gap-x-[0.3em]', className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-hidden">
          {word.split('').map((char, charIndex) => {
            const totalIndex =
              words
                .slice(0, wordIndex)
                .reduce((acc, w) => acc + w.length, 0) + charIndex

            return (
              <motion.span
                key={charIndex}
                className="inline-block"
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: delay + totalIndex * charDelay,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

interface LineRevealProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function LineReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: LineRevealProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <Tag className={className}>{text}</Tag>
      </motion.div>
    </div>
  )
}
