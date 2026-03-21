'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LOGOS } from '@/lib/constants'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const ADMIN_EMAIL = 'contact@kivvi.tech'
const ADMIN_PASSWORD = 'Lafayet2018@kivvi'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('kivvi-admin', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Image src={LOGOS.flatWhite} alt="KIVVI" width={80} height={28} className="mx-auto mb-6 h-7 w-auto opacity-60" />
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold">Administration</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/30">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              className="glass-input w-full px-4 py-3 text-sm text-white placeholder-white/20" placeholder="admin@kivvi.tech" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/30">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                className="glass-input w-full px-4 py-3 pr-10 text-sm text-white placeholder-white/20" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="flex items-center gap-2 text-xs text-red-400/60"><AlertCircle size={12} />{error}</p>}

          <button type="submit" className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 text-sm font-medium transition-all hover:bg-white/[0.08]">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
