"use client"

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
