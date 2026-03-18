"use client"

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { CustomCursor } from '@/components/shared/custom-cursor'
import { GrainOverlay } from '@/components/shared/grain-overlay'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
