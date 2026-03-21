import type { Metadata } from 'next'
import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'KIVVI — Agence Digitale Africaine',
    template: '%s | KIVVI',
  },
  description:
    'KIVVI conçoit des expériences digitales premium pour l\'Afrique. Sites web, applications mobiles, solutions sur mesure.',
  metadataBase: new URL('https://kivvi.tech'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kivvi',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://kivvi.tech',
    siteName: 'KIVVI',
    title: 'KIVVI — Agence Digitale Africaine',
    description:
      'KIVVI conçoit des expériences digitales premium pour l\'Afrique.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIVVI — Agence Digitale Africaine',
    description:
      'KIVVI conçoit des expériences digitales premium pour l\'Afrique.',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-background text-foreground font-[family-name:var(--font-body)] antialiased transition-colors duration-300 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  )
}
