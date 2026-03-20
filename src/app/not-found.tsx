import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] px-4">
      <div className="text-center">
        <p className="font-[family-name:var(--font-mono)] text-7xl font-bold text-copper mb-4">404</p>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1A1A] mb-2">Page introuvable</h1>
        <p className="text-[#6B6B6B] mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-copper text-white font-medium text-sm hover:bg-copper-hover transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
