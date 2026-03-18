import { cn } from '@/lib/utils'

interface GradientMeshProps {
  children: React.ReactNode
  className?: string
}

export function GradientMesh({ children, className }: GradientMeshProps) {
  return (
    <div className={cn('gradient-mesh', className)}>
      {children}
    </div>
  )
}
