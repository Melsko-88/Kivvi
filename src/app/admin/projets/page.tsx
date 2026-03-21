'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/types'
import { Trash2, ExternalLink } from 'lucide-react'

export default function AdminProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/projects').then(r => r.json()).then(d => { setProjects(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" /></div>

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold">Projets</h1>
      {projects.length === 0 ? (
        <p className="text-sm text-white/30">Aucun projet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <div key={p.id} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-[family-name:var(--font-heading)] font-semibold">{p.name}</h3>
                <div className="flex gap-2">
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50"><ExternalLink size={14} /></a>}
                  <button onClick={() => handleDelete(p.id)} className="text-white/20 hover:text-red-400/60"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="mb-3 text-xs text-white/40">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.technologies.map(t => <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
