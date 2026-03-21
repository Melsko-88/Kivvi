'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Trash2, User, Store, Phone, Globe, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/auth')
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').delete().eq('id', user.id)
      }
      await signOut()
      router.push('/auth')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paramètres</h2>

      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Profil
        </h3>
        <div className="glass rounded-xl divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <User className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">Nom</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Store className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.shop_name}</p>
              <p className="text-xs text-muted-foreground">Boutique</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.phone}</p>
              <p className="text-xs text-muted-foreground">Téléphone</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Globe className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Français</p>
              <p className="text-xs text-muted-foreground">Langue</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Abonnement
        </h3>
        <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Plan Gratuit</p>
            <p className="text-xs text-muted-foreground">
              50 produits, 3 rappels/jour
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-muted font-medium">
            Actif
          </span>
        </div>
      </section>

      <section className="space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <LogOut className="size-4" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="size-4" />
            <span className="text-sm font-medium">Supprimer mon compte</span>
          </button>
        ) : (
          <div className="border border-destructive/30 rounded-xl p-4 space-y-3">
            <p className="text-sm">
              Toutes tes données seront supprimées définitivement. Cette action
              est irréversible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium flex items-center justify-center"
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : 'Confirmer'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
