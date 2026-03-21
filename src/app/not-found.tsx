import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="mb-4 font-[family-name:var(--font-heading)] text-8xl font-bold text-foreground/5">
        404
      </span>
      <h1 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold">
        Page introuvable
      </h1>
      <p className="mb-8 text-sm text-foreground/40">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-6 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.06]"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
