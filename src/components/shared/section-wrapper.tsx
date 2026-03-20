import { cn } from '@/lib/utils'
import { ScrollReveal } from './scroll-reveal'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  id?: string
  variant?: 'light' | 'dark'
}

export function SectionWrapper({ children, className, title, subtitle, id, variant = 'light' }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 md:py-32 px-4 sm:px-6 lg:px-8',
        variant === 'dark' && 'section-dark',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <ScrollReveal className="mb-16 text-center">
            {title && (
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </ScrollReveal>
        )}
        {children}
      </div>
    </section>
  )
}
