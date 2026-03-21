import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { CursorGlow } from '@/components/shared/cursor-glow'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main className="relative min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
