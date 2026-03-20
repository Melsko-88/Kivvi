"use client"

import Image from 'next/image'
import { LOGOS } from '@/lib/constants'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: number
  className?: string
}

export function Logo({ variant = 'dark', size = 40, className }: LogoProps) {
  const src = variant === 'dark' ? LOGOS.flatBlack : LOGOS.flatWhite

  return (
    <Image
      src={src}
      alt="KIVVI"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
