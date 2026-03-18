"use client"

import { useEffect, useState } from 'react'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', url: '', technologies: '', category: '', image: '', featured: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const data = await fetch('/api/admin/projects').then((r) => r.json())
    setProjects(data)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    })
    setForm({ name: '', description: '', url: '', technologies: '', category: '', image: '', featured: false })
    setShowForm(false)
    setSaving(false)
    loadProjects()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce projet ?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    loadProjects()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Projets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Nom du projet"
              required
            />
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Catégorie (E-Commerce, Site Vitrine...)"
              required
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            rows={3}
            placeholder="Description"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="URL du projet"
            />
            <input
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              className="bg-white/5 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Technologies (séparées par virgule)"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              Mis en avant
            </label>
            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-card p-5 rounded-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-sm">{project.name}</h3>
                <p className="text-xs text-muted-foreground">{project.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech) => (
                <span key={tech} className="text-xs bg-white/5 px-2 py-0.5 rounded">{tech}</span>
              ))}
            </div>
            {project.featured && (
              <span className="inline-block mt-2 text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                En vedette
              </span>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-card p-8 rounded-xl text-center text-sm text-muted-foreground">
          Aucun projet. Cliquez sur &ldquo;Nouveau projet&rdquo; pour commencer.
        </div>
      )}
    </div>
  )
}
