"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/schemas'
import { LiquidGlassButton } from '@/components/shared/liquid-glass-button'
import { cn } from '@/lib/utils'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormValues) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card p-10 rounded-xl text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 rounded-xl space-y-5">
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">Envoyez-nous un message</h2>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nom complet *</label>
          <input
            {...register('name')}
            className={cn(
              'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
              errors.name && 'border-red-500'
            )}
            placeholder="Votre nom"
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email *</label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
              errors.email && 'border-red-500'
            )}
            placeholder="votre@email.com"
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Téléphone</label>
          <input
            {...register('phone')}
            className="w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="+221 77 xxx xx xx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Sujet *</label>
          <input
            {...register('subject')}
            className={cn(
              'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
              errors.subject && 'border-red-500'
            )}
            placeholder="Sujet de votre message"
          />
          {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Message *</label>
        <textarea
          {...register('message')}
          rows={5}
          className={cn(
            'w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none',
            errors.message && 'border-red-500'
          )}
          placeholder="Décrivez votre besoin..."
        />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
      </div>

      <LiquidGlassButton type="submit" variant="primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
        <Send className="h-4 w-4" />
      </LiquidGlassButton>
    </form>
  )
}
