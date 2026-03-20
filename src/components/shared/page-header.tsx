import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('bg-[#0A0A0A] pt-32 pb-16 md:pt-40 md:pb-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[#F5F2ED] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-lg text-[#999999] max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
