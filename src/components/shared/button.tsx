"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'default',
  className,
  type = 'button',
  disabled,
}: ButtonProps) {
  const variants = {
    primary: 'bg-copper text-white hover:bg-copper-hover',
    secondary: 'bg-transparent text-foreground border border-border hover:border-copper hover:text-copper',
    dark: 'bg-white text-[#0A0A0A] hover:bg-white/90',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-[family-name:var(--font-heading)] font-semibold',
    'transition-all duration-200',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
