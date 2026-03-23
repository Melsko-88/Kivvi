'use client'

import { useState, useEffect } from 'react'
import { Bell, Loader2 } from 'lucide-react'
import type { AutoReminderSettings } from '@/lib/carnet-types'

interface AutoReminderFormProps {
  isPro: boolean
  onUpgrade: () => void
}

export function AutoReminderForm({ isPro, onUpgrade }: AutoReminderFormProps) {
  const [settings, setSettings] = useState<AutoReminderSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isPro) return
    fetch('/api/reminders/settings')
      .then(r => r.json())
      .then(data => { setSettings(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [isPro])

  async function handleSave(updates: Partial<AutoReminderSettings>) {
    if (!settings) return
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    setSaving(true)
    try {
      await fetch('/api/reminders/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isPro) {
    return (
      <section className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Rappels automatiques
        </h3>
        <button
          onClick={onUpgrade}
          className="w-full glass rounded-xl px-4 py-4 flex items-center gap-3 opacity-60"
        >
          <Bell className="size-4 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Rappels auto WhatsApp</p>
            <p className="text-xs text-muted-foreground">Envoie automatiquement des rappels à vos débiteurs</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background">
            PRO
          </span>
        </button>
      </section>
    )
  }

  if (!loaded) return null

  return (
    <section className="space-y-1">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
        Rappels automatiques
      </h3>
      <div className="glass rounded-xl divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">Activer</p>
            <p className="text-xs text-muted-foreground">Envoyer des rappels automatiquement</p>
          </div>
          <button
            onClick={() => handleSave({ enabled: !settings?.enabled })}
            className={`w-11 h-6 rounded-full transition-colors relative ${settings?.enabled ? 'bg-foreground' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-transform ${settings?.enabled ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {settings?.enabled && (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm">Fréquence</p>
              <select
                value={settings.frequency_days}
                onChange={e => handleSave({ frequency_days: Number(e.target.value) })}
                className="text-sm bg-transparent font-medium text-right"
              >
                {[1, 2, 3, 5, 7, 14, 30].map(d => (
                  <option key={d} value={d}>Tous les {d} jour{d > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm">Ancienneté min</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={settings.min_debt_age_days}
                  onChange={e => handleSave({ min_debt_age_days: Math.max(1, Number(e.target.value)) })}
                  className="w-12 text-sm bg-transparent font-medium text-right"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">jours</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm">Montant min</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={settings.min_amount}
                  onChange={e => handleSave({ min_amount: Math.max(0, Number(e.target.value)) })}
                  className="w-20 text-sm bg-transparent font-medium text-right"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">F</span>
              </div>
            </div>
          </>
        )}
      </div>
      {saving && (
        <div className="flex items-center gap-1 px-1">
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Sauvegarde...</span>
        </div>
      )}
    </section>
  )
}
