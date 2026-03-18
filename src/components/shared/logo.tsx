"use client"

import Image from 'next/image'
import { LOGOS } from '@/lib/constants'

type LogoVariant = 'flat-white' | 'flat-black' | 'glass-3d'

interface LogoProps {
  variant?: LogoVariant
  size?: number
  className?: string
}

const logoSrc: Record<LogoVariant, string> = {
  'flat-white': LOGOS.flatWhite,
  'flat-black': LOGOS.flatBlack,
  'glass-3d': LOGOS.glass3D,
}

export function Logo({ variant = 'flat-white', size = 40, className }: LogoProps) {
  return (
    <Image
      src={logoSrc[variant]}
      alt="KIVVI"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
