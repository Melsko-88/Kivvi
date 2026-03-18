import { cn } from '@/lib/utils'
import { ScrollReveal } from './scroll-reveal'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  id?: string
}

export function SectionWrapper({ children, className, title, subtitle, id }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28 px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <ScrollReveal className="mb-14 text-center">
            {title && (
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
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
