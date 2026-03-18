"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LiquidGlassButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'gold'
  size?: 'default' | 'lg'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function LiquidGlassButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'default',
  className,
  type = 'button',
  disabled,
}: LiquidGlassButtonProps) {
  const gradients = {
    primary: 'from-blue-600 via-blue-500 to-blue-700',
    gold: 'from-amber-500 via-yellow-500 to-amber-600',
  }

  const glows = {
    primary: 'shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]',
    gold: 'shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]',
  }

  const sizes = {
    default: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-xl font-heading font-semibold text-white',
    'bg-gradient-to-r backdrop-blur-sm',
    'border border-white/20',
    'transition-all duration-300',
    gradients[variant],
    glows[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const content = (
    <motion.span
      className={classes}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-50" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-flex">
      {content}
    </button>
  )
}
