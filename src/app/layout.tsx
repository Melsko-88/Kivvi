import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KIVVI — Agence Digitale Africaine",
    template: "%s | KIVVI",
  },
  description:
    "KIVVI conçoit des sites web, applications mobiles et solutions digitales pour les entreprises, institutions et organisations en Afrique.",
  metadataBase: new URL("https://kivvi.tech"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://kivvi.tech",
    siteName: "KIVVI",
    title: "KIVVI — Agence Digitale Africaine",
    description:
      "Sites web, applications mobiles et solutions digitales premium pour l'Afrique.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KIVVI — Agence Digitale Africaine",
    description:
      "Sites web, applications mobiles et solutions digitales premium pour l'Afrique.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)] bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
