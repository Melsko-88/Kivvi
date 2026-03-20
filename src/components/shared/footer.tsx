import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants'
import { Logo } from './logo'

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#F5F2ED]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="light" size={32} />
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#F5F2ED]">KIVVI</span>
            </Link>
            <p className="text-sm text-[#999] leading-relaxed">
              Agence digitale africaine. Nous concevons des solutions web et mobiles premium pour les entreprises et institutions.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider text-[#999] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#999] hover:text-[#F5F2ED] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider text-[#999] mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-2 text-sm text-[#999] hover:text-[#F5F2ED] transition-colors"
                >
                  <Mail className="h-4 w-4 text-copper" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm text-[#999] hover:text-[#F5F2ED] transition-colors"
                >
                  <Phone className="h-4 w-4 text-copper" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#999]">
                <MapPin className="h-4 w-4 text-copper mt-0.5" />
                <span>
                  {SITE_CONFIG.location}
                  <br />
                  {SITE_CONFIG.locationSecondary}
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider text-[#999] mb-4">
              Légal
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#999] hover:text-[#F5F2ED] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-[#666]">
              <p>RCCM : {SITE_CONFIG.rccm}</p>
              <p>NINEA : {SITE_CONFIG.ninea}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
          <p className="text-center text-xs text-[#666]">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
