"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, AlertCircle } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo variant="light" size={64} className="mx-auto mb-4" />
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">Connectez-vous pour accéder au panneau</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 rounded-xl space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
                errors.email && 'border-red-500'
              )}
              placeholder="admin@kivvi.tech"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
            <input
              {...register('password')}
              type="password"
              className={cn(
                'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
                errors.password && 'border-red-500'
              )}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-semibold px-6 py-3 text-sm transition-colors hover:bg-primary/80 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
            <LogIn className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
