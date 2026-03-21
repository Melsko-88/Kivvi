'use client'

import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { ContactForm } from '@/components/contact/contact-form'
import { ScrollReveal } from '@/components/shared/scroll-reveal'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Écrire sur WhatsApp',
    href: `https://wa.me/${SITE_CONFIG.whatsapp}`,
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: `${SITE_CONFIG.location}`,
  },
]

export function ContactPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="mb-12 sm:mb-20 text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-foreground/30">
            Contact
          </span>
          <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-5xl">
            Parlons de votre projet
          </h1>
          <p className="mx-auto max-w-xl text-foreground/40">
            Une question, un projet, une idée ? Notre équipe vous répond sous 48h.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-16">
          {/* Contact Info */}
          <ScrollReveal className="lg:col-span-2" delay={0.1}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                const Comp = item.href ? 'a' : 'div'
                const linkProps = item.href
                  ? {
                      href: item.href,
                      target: item.href.startsWith('http')
                        ? '_blank'
                        : undefined,
                      rel: item.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined,
                    }
                  : {}

                return (
                  <Comp
                    key={item.label}
                    {...linkProps}
                    className="group flex flex-col gap-2 lg:flex-row lg:items-start lg:gap-4 rounded-xl border border-foreground/[0.04] bg-foreground/[0.015] p-3 sm:p-5 transition-all duration-300 hover:border-foreground/[0.08] hover:bg-foreground/[0.03]"
                  >
                    <div className="rounded-lg border border-foreground/[0.06] bg-foreground/[0.03] p-2 sm:p-2.5 w-fit">
                      <Icon size={16} className="text-foreground/40 sm:[&]:size-[18px]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="mb-0.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-foreground/25">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm text-foreground/60 transition-colors group-hover:text-foreground/80 break-all lg:break-normal">
                        {item.value}
                      </span>
                    </div>
                  </Comp>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal className="lg:col-span-3" delay={0.2}>
            <div className="rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-5 sm:p-8 lg:p-10">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
