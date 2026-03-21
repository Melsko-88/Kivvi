'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import { SITE_CONFIG, LOGOS } from '@/lib/constants'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const footerLinks = {
  services: [
    { label: 'Site Vitrine', href: '/services' },
    { label: 'E-Commerce', href: '/services' },
    { label: 'Application Mobile', href: '/services' },
    { label: 'Messagerie M365', href: '/services' },
  ],
  company: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Tarifs', href: '/tarifs' },
    { label: 'Contact', href: '/contact' },
    { label: 'Demander un devis', href: '/devis' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'CGV', href: '/cgv' },
  ],
}

export function Footer() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const logoSrc = mounted && resolvedTheme === 'light' ? LOGOS.flatBlack : LOGOS.flatWhite

  return (
    <footer className="relative border-t border-foreground/[0.04]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Image
              src={logoSrc}
              alt="KIVVI"
              width={160}
              height={50}
              className="mb-5 h-14 w-auto opacity-90"
            />
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-foreground/40">
              Agence digitale africaine. Nous concevons des expériences
              numériques premium qui font la différence.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2.5 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
              >
                <Mail size={14} className="shrink-0" />
                {SITE_CONFIG.email}
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
              >
                <Phone size={14} className="shrink-0" />
                {SITE_CONFIG.phone}
              </a>
              <span className="flex items-center gap-2.5 text-sm text-foreground/40">
                <MapPin size={14} className="shrink-0" />
                {SITE_CONFIG.location}
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/25">
                Services
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/40 transition-colors hover:text-foreground/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/25">
                Entreprise
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/40 transition-colors hover:text-foreground/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/25">
                Juridique
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/40 transition-colors hover:text-foreground/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-6 sm:flex-row">
          <p className="text-xs text-foreground/25">
            &copy; {new Date().getFullYear()} KIVVI. Tous droits réservés.
          </p>
          <p className="text-xs text-foreground/25">
            RCCM {SITE_CONFIG.rccm} &middot; NINEA {SITE_CONFIG.ninea}
          </p>
        </div>
      </div>
    </footer>
  )
}
