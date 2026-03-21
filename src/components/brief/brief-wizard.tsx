'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEVIS_TYPES, BUDGET_RANGES } from '@/lib/constants'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Globe,
  Building2,
  ShoppingCart,
  GraduationCap,
  Smartphone,
  Mail,
  Server,
  Palette,
  Upload,
  Sparkles,
  Briefcase,
  Heart,
  Crown,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────

const STEPS = [
  'Projets',
  'Organisation',
  'Besoins',
  'Style',
  'Identité',
  'Budget',
  'Contact',
  'Récap',
]

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  'site-vitrine': <Globe size={20} />,
  'site-institutionnel': <Building2 size={20} />,
  'e-commerce': <ShoppingCart size={20} />,
  'e-learning': <GraduationCap size={20} />,
  'application-mobile': <Smartphone size={20} />,
  'messagerie-m365': <Mail size={20} />,
  'hebergement': <Server size={20} />,
  'autre': <Sparkles size={20} />,
}

const SECTORS = [
  { value: 'commerce', label: 'Commerce / Boutique' },
  { value: 'ecole', label: 'École / Formation' },
  { value: 'ong', label: 'ONG / Association' },
  { value: 'sante', label: 'Santé' },
  { value: 'restaurant', label: 'Restaurant / Hôtellerie' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'autre', label: 'Autre' },
]

const SECTOR_QUESTIONS: Record<string, { key: string; label: string }[]> = {
  commerce: [
    { key: 'catalogue', label: 'Catalogue de produits en ligne' },
    { key: 'wave', label: 'Paiement Wave / Orange Money' },
    { key: 'livraison', label: 'Suivi des livraisons' },
    { key: 'stock', label: 'Gestion de stock' },
  ],
  ecole: [
    { key: 'inscriptions', label: 'Inscriptions en ligne' },
    { key: 'cours', label: 'Cours / Modules en ligne' },
    { key: 'notes', label: 'Gestion des notes' },
    { key: 'paiement', label: 'Paiement des frais en ligne' },
  ],
  ong: [
    { key: 'rapports', label: 'Rapports d\'activité' },
    { key: 'dons', label: 'Dons en ligne' },
    { key: 'benevoles', label: 'Gestion des bénévoles' },
    { key: 'projets', label: 'Suivi des projets' },
  ],
  sante: [
    { key: 'rdv', label: 'Prise de rendez-vous en ligne' },
    { key: 'dossiers', label: 'Dossiers patients' },
    { key: 'teleconsultation', label: 'Téléconsultation' },
    { key: 'pharmacie', label: 'Catalogue pharmacie' },
  ],
  restaurant: [
    { key: 'menu', label: 'Menu digital' },
    { key: 'reservation', label: 'Réservation en ligne' },
    { key: 'commande', label: 'Commande à emporter / livraison' },
    { key: 'avis', label: 'Gestion des avis' },
  ],
  immobilier: [
    { key: 'annonces', label: 'Annonces immobilières' },
    { key: 'visite', label: 'Visite virtuelle' },
    { key: 'contact', label: 'Formulaire de contact par bien' },
    { key: 'estimation', label: 'Estimation en ligne' },
  ],
}

const STYLE_OPTIONS = [
  {
    value: 'moderne',
    label: 'Moderne & Minimaliste',
    desc: 'Épuré, beaucoup d\'espace blanc, typographie forte',
    icon: <Sparkles size={24} />,
  },
  {
    value: 'corporate',
    label: 'Corporate & Institutionnel',
    desc: 'Professionnel, structuré, inspirant confiance',
    icon: <Briefcase size={24} />,
  },
  {
    value: 'chaleureux',
    label: 'Coloré & Chaleureux',
    desc: 'Vibrant, accueillant, couleurs vives',
    icon: <Heart size={24} />,
  },
  {
    value: 'premium',
    label: 'Premium & Élégant',
    desc: 'Luxueux, raffiné, tons sombres',
    icon: <Crown size={24} />,
  },
]

const COLOR_PALETTE = [
  { value: '#1a1a2e', label: 'Marine' },
  { value: '#16213e', label: 'Bleu nuit' },
  { value: '#0f3460', label: 'Bleu royal' },
  { value: '#e94560', label: 'Rouge vif' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Jaune doré' },
  { value: '#22c55e', label: 'Vert' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Rose' },
  { value: '#78716c', label: 'Taupe' },
  { value: '#171717', label: 'Noir' },
]

// ─── Animation config ────────────────────────────────────────────────

const slideVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

const slideTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }

// ─── Types ───────────────────────────────────────────────────────────

interface BriefState {
  projects: string[]
  orgName: string
  sector: string
  hasWebsite: boolean
  websiteUrl: string
  sectorQuestions: Record<string, boolean>
  style: string
  hasLogo: boolean
  logoUrl: string
  colors: string[]
  budget: string
  deadline: string
  contactName: string
  phone: string
  email: string
  preferWhatsApp: boolean
}

// ─── Component ───────────────────────────────────────────────────────

export function BriefWizard() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [data, setData] = useState<BriefState>({
    projects: [],
    orgName: '',
    sector: '',
    hasWebsite: false,
    websiteUrl: '',
    sectorQuestions: {},
    style: '',
    hasLogo: false,
    logoUrl: '',
    colors: [],
    budget: '',
    deadline: '',
    contactName: '',
    phone: '',
    email: '',
    preferWhatsApp: true,
  })

  const update = useCallback(<K extends keyof BriefState>(key: K, value: BriefState[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleProject = (value: string) => {
    update('projects', data.projects.includes(value)
      ? data.projects.filter(p => p !== value)
      : [...data.projects, value]
    )
  }

  const toggleColor = (value: string) => {
    update('colors', data.colors.includes(value)
      ? data.colors.filter(c => c !== value)
      : data.colors.length < 4 ? [...data.colors, value] : data.colors
    )
  }

  const toggleSectorQ = (key: string) => {
    update('sectorQuestions', { ...data.sectorQuestions, [key]: !data.sectorQuestions[key] })
  }

  // ─── Validation per step ──────────────────────────────────────────

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return data.projects.length > 0
      case 1: return data.orgName.trim().length >= 2 && data.sector !== ''
      case 2: return true // optional
      case 3: return data.style !== ''
      case 4: return true // optional
      case 5: return data.budget !== ''
      case 6: return data.contactName.trim().length >= 2 && data.phone.trim().length >= 9
      default: return true
    }
  }

  // Skip sector questions if sector has none
  const effectiveStep = step
  const shouldSkipBesoins = !SECTOR_QUESTIONS[data.sector]

  const nextStep = () => {
    if (!canProceed()) return
    let next = step + 1
    if (next === 2 && shouldSkipBesoins) next = 3
    setStep(next)
  }

  const prevStep = () => {
    let prev = step - 1
    if (prev === 2 && shouldSkipBesoins) prev = 1
    setStep(Math.max(0, prev))
  }

  // ─── Submit ──────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: data.projects,
          organization: {
            name: data.orgName,
            sector: data.sector,
            hasWebsite: data.hasWebsite,
            websiteUrl: data.websiteUrl || undefined,
          },
          sectorQuestions: data.sectorQuestions,
          style: data.style,
          identity: {
            hasLogo: data.hasLogo,
            logoUrl: data.logoUrl || undefined,
            colors: data.colors,
          },
          budget: data.budget,
          deadline: data.deadline || undefined,
          contact: {
            name: data.contactName,
            phone: data.phone,
            email: data.email || undefined,
            preferWhatsApp: data.preferWhatsApp,
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || 'Erreur serveur')
      }
      setStatus('success')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Une erreur est survenue')
      setStatus('error')
    }
  }

  // ─── Success state ────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CheckCircle size={48} className="mb-6 text-foreground/30" strokeWidth={1} />
        </motion.div>
        <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold">
          Brief envoyé !
        </h3>
        <p className="max-w-md text-sm text-foreground/40">
          Merci ! Notre équipe analyse votre projet et vous contactera
          sous 24h pour discuter de votre vision.
        </p>
      </div>
    )
  }

  // ─── Progress dots ────────────────────────────────────────────────

  const totalSteps = shouldSkipBesoins ? STEPS.length - 1 : STEPS.length
  const displayStep = shouldSkipBesoins && step > 2 ? step - 1 : step

  return (
    <div className="rounded-2xl border border-foreground/[0.04] bg-foreground/[0.015] p-6 sm:p-8 lg:p-10">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= displayStep
                ? 'w-6 bg-foreground/25'
                : 'w-1.5 bg-foreground/[0.08]'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Step 0: Projets ──────────────────────────────────── */}
        {effectiveStep === 0 && (
          <motion.div
            key="projects"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Quel type de projet vous intéresse ?
              </h2>
              <p className="text-sm text-foreground/35">
                Sélectionnez un ou plusieurs services
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[...DEVIS_TYPES, { value: 'hebergement', label: 'Hébergement', description: 'Domaine et serveur' }].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleProject(type.value)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    data.projects.includes(type.value)
                      ? 'border-foreground/20 bg-foreground/[0.06]'
                      : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1]'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    data.projects.includes(type.value)
                      ? 'border-foreground/15 bg-foreground/[0.06] text-foreground/70'
                      : 'border-foreground/[0.06] bg-foreground/[0.03] text-foreground/25'
                  }`}>
                    {PROJECT_ICONS[type.value] || <Sparkles size={20} />}
                  </div>
                  <div>
                    <span className="block text-sm font-medium">{type.label}</span>
                    <span className="text-xs text-foreground/30">{type.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 1: Organisation ─────────────────────────────── */}
        {effectiveStep === 1 && (
          <motion.div
            key="org"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Parlez-nous de votre structure
              </h2>
              <p className="text-sm text-foreground/35">
                Ces informations nous aident à personnaliser notre offre
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Nom de la structure *
              </label>
              <input
                value={data.orgName}
                onChange={e => update('orgName', e.target.value)}
                className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                placeholder="Ex: École Mariama Ba, Boutique Awa..."
              />
            </div>

            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Secteur d'activité *
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SECTORS.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update('sector', s.value)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      data.sector === s.value
                        ? 'border-foreground/20 bg-foreground/[0.06] font-medium'
                        : 'border-foreground/[0.06] text-foreground/50 hover:border-foreground/[0.1]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update('hasWebsite', !data.hasWebsite)}
                className={`flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  data.hasWebsite ? 'bg-foreground/20' : 'bg-foreground/[0.08]'
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-foreground/60 transition-transform ${
                  data.hasWebsite ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className="text-sm text-foreground/50">J'ai déjà un site web</span>
            </div>

            {data.hasWebsite && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <input
                  value={data.websiteUrl}
                  onChange={e => update('websiteUrl', e.target.value)}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                  placeholder="https://monsite.com"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── Step 2: Questions adaptatives par secteur ─────── */}
        {effectiveStep === 2 && !shouldSkipBesoins && (
          <motion.div
            key="sector-q"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Quels sont vos besoins spécifiques ?
              </h2>
              <p className="text-sm text-foreground/35">
                Cochez ce qui vous intéresse
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(SECTOR_QUESTIONS[data.sector] || []).map(q => (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => toggleSectorQ(q.key)}
                  className={`rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                    data.sectorQuestions[q.key]
                      ? 'border-foreground/20 bg-foreground/[0.06] font-medium'
                      : 'border-foreground/[0.06] text-foreground/50 hover:border-foreground/[0.1]'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: Style visuel ─────────────────────────────── */}
        {effectiveStep === 3 && (
          <motion.div
            key="style"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Quel style vous correspond ?
              </h2>
              <p className="text-sm text-foreground/35">
                Choisissez l'ambiance visuelle qui vous parle
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {STYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('style', opt.value)}
                  className={`flex items-start gap-3 rounded-xl border p-5 text-left transition-all ${
                    data.style === opt.value
                      ? 'border-foreground/20 bg-foreground/[0.06]'
                      : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1]'
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    data.style === opt.value
                      ? 'border-foreground/15 bg-foreground/[0.06] text-foreground/70'
                      : 'border-foreground/[0.06] bg-foreground/[0.03] text-foreground/25'
                  }`}>
                    {opt.icon}
                  </div>
                  <div>
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-foreground/30">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 4: Identité visuelle ────────────────────────── */}
        {effectiveStep === 4 && (
          <motion.div
            key="identity"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Votre identité visuelle
              </h2>
              <p className="text-sm text-foreground/35">
                Logo et couleurs préférées (optionnel)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update('hasLogo', !data.hasLogo)}
                className={`flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  data.hasLogo ? 'bg-foreground/20' : 'bg-foreground/[0.08]'
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-foreground/60 transition-transform ${
                  data.hasLogo ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className="text-sm text-foreground/50">J'ai déjà un logo</span>
            </div>

            {data.hasLogo && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                  Lien vers votre logo
                </label>
                <div className="flex items-center gap-2">
                  <Upload size={14} className="shrink-0 text-foreground/25" />
                  <input
                    value={data.logoUrl}
                    onChange={e => update('logoUrl', e.target.value)}
                    className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                    placeholder="https://... ou envoyez-le nous par WhatsApp"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Couleurs préférées <span className="normal-case tracking-normal text-foreground/20">(max 4)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleColor(c.value)}
                    className={`group relative h-10 w-10 rounded-xl border-2 transition-all ${
                      data.colors.includes(c.value)
                        ? 'border-foreground/30 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {data.colors.includes(c.value) && (
                      <CheckCircle size={14} className="absolute inset-0 m-auto text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Step 5: Budget & Délai ───────────────────────────── */}
        {effectiveStep === 5 && (
          <motion.div
            key="budget"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Budget et délai
              </h2>
              <p className="text-sm text-foreground/35">
                Aidez-nous à calibrer notre proposition
              </p>
            </div>

            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Budget estimé *
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {BUDGET_RANGES.map(range => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => update('budget', range.value)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      data.budget === range.value
                        ? 'border-foreground/20 bg-foreground/[0.06] font-medium'
                        : 'border-foreground/[0.06] text-foreground/50 hover:border-foreground/[0.1]'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Deadline souhaitée
              </label>
              <input
                value={data.deadline}
                onChange={e => update('deadline', e.target.value)}
                className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                placeholder="Ex: Fin avril 2026, Pas de deadline..."
              />
            </div>
          </motion.div>
        )}

        {/* ─── Step 6: Contact ──────────────────────────────────── */}
        {effectiveStep === 6 && (
          <motion.div
            key="contact"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Comment vous contacter ?
              </h2>
              <p className="text-sm text-foreground/35">
                Nous vous répondons sous 24h
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Votre nom *
              </label>
              <input
                value={data.contactName}
                onChange={e => update('contactName', e.target.value)}
                className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                placeholder="Prénom et nom"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Téléphone *
              </label>
              <input
                value={data.phone}
                onChange={e => update('phone', e.target.value)}
                className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                placeholder="+221 77 000 00 00"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-foreground/30">
                Email <span className="normal-case tracking-normal text-foreground/20">(optionnel)</span>
              </label>
              <input
                value={data.email}
                onChange={e => update('email', e.target.value)}
                type="email"
                className="glass-input w-full px-4 py-3 text-sm text-foreground placeholder-foreground/20"
                placeholder="email@exemple.com"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update('preferWhatsApp', !data.preferWhatsApp)}
                className={`flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  data.preferWhatsApp ? 'bg-foreground/20' : 'bg-foreground/[0.08]'
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-foreground/60 transition-transform ${
                  data.preferWhatsApp ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className="text-sm text-foreground/50">Me contacter par WhatsApp de préférence</span>
            </div>
          </motion.div>
        )}

        {/* ─── Step 7: Récap ────────────────────────────────────── */}
        {effectiveStep === 7 && (
          <motion.div
            key="recap"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
                Récapitulatif
              </h2>
              <p className="text-sm text-foreground/35">
                Vérifiez vos informations avant d'envoyer
              </p>
            </div>

            <div className="space-y-4 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-5">
              <RecapRow label="Projets" value={data.projects.map(p => {
                const found = [...DEVIS_TYPES, { value: 'hebergement', label: 'Hébergement' }].find(t => t.value === p)
                return found?.label || p
              }).join(', ')} />
              <RecapRow label="Structure" value={`${data.orgName} (${SECTORS.find(s => s.value === data.sector)?.label})`} />
              {data.hasWebsite && data.websiteUrl && <RecapRow label="Site existant" value={data.websiteUrl} />}
              <RecapRow label="Style" value={STYLE_OPTIONS.find(s => s.value === data.style)?.label || '—'} />
              {data.colors.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="w-24 shrink-0 text-xs text-foreground/25">Couleurs</span>
                  <div className="flex gap-1.5">
                    {data.colors.map(c => (
                      <div key={c} className="h-5 w-5 rounded-md border border-foreground/10" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              )}
              <RecapRow label="Budget" value={BUDGET_RANGES.find(b => b.value === data.budget)?.label || '—'} />
              {data.deadline && <RecapRow label="Deadline" value={data.deadline} />}
              <RecapRow label="Contact" value={`${data.contactName} — ${data.phone}`} />
              {data.email && <RecapRow label="Email" value={data.email} />}
              {data.preferWhatsApp && <RecapRow label="WhatsApp" value="Oui, de préférence" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Navigation ──────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 text-sm text-foreground/40 transition-colors hover:text-foreground/70"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Suivant
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-foreground/[0.08] disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                Envoi...
              </>
            ) : (
              <>
                <Send size={14} />
                Envoyer le brief
              </>
            )}
          </button>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-400/60">
          <AlertCircle size={14} />
          {errorMsg || 'Une erreur est survenue. Veuillez réessayer.'}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-24 shrink-0 text-xs text-foreground/25">{label}</span>
      <span className="text-sm text-foreground/60">{value}</span>
    </div>
  )
}
