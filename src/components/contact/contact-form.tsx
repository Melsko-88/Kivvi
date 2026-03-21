'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormValues } from '@/lib/schemas'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

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

  const onSubmit = async (data: ContactFormValues) => {
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
      <div className="flex flex-col items-center rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-10 text-center">
        <CheckCircle size={40} className="mb-4 text-foreground/30" strokeWidth={1} />
        <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold">
          Message envoyé
        </h3>
        <p className="text-sm text-foreground/40">
          Merci ! Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
            Nom *
          </label>
          <input
            {...register('name')}
            className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
            placeholder="Votre nom"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400/60">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
            placeholder="email@exemple.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400/60">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
            Téléphone
          </label>
          <input
            {...register('phone')}
            className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
            placeholder="+221 77 000 00 00"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
            Sujet *
          </label>
          <input
            {...register('subject')}
            className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
            placeholder="Objet de votre message"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-400/60">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
          Message *
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="glass-input w-full resize-none px-4 py-3 text-sm text-foreground placeholder-foreground/20"
          placeholder="Décrivez votre projet ou posez votre question..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-400/60">{errors.message.message}</p>
        )}
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-400/60">
          <AlertCircle size={14} />
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-7 py-3 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.08] disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
            Envoi...
          </>
        ) : (
          <>
            <Send size={14} />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  )
}
