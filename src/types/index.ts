export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface NavLink {
  label: string
  href: string
}

export interface DevisType {
  value: string
  label: string
  description: string
}

export interface BudgetRange {
  value: string
  label: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface DevisFormData {
  type: string
  name: string
  email: string
  phone: string
  company?: string
  description: string
  budget: string
  deadline?: string
  features: string[]
}

export interface BriefData {
  projects: string[]
  organization: {
    name: string
    sector: string
    hasWebsite: boolean
    websiteUrl?: string
  }
  sectorQuestions: Record<string, boolean>
  style: string
  identity: {
    hasLogo: boolean
    logoUrl?: string
    colors: string[]
  }
  budget: string
  deadline: string
  contact: {
    name: string
    phone: string
    email?: string
    preferWhatsApp: boolean
  }
}

export interface Quote {
  id: string
  type: string
  name: string
  email: string
  phone: string
  company?: string
  description: string
  budget: string
  deadline?: string
  features: string[]
  status: 'new' | 'contacted' | 'in_progress' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  notes?: string
  brief_data?: BriefData
  brief_token?: string
}

export interface Project {
  id: string
  name: string
  description: string
  url?: string
  technologies: string[]
  category: string
  image: string
  featured: boolean
  created_at: string
}

export interface Invoice {
  id: string
  quote_id?: string
  client_name: string
  client_email: string
  client_address?: string
  items: InvoiceItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid'
  due_date: string
  created_at: string
  paid_at?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface ProDevisData {
  numero: string
  date: string
  validite: string
  client: {
    nom: string
    structure?: string
    telephone: string
    email?: string
  }
  contexte: string
  prestations: {
    titre: string
    details: string
    montant: number
  }[]
  sousTotal: number
  remise?: { taux: number; montant: number } | null
  total: number
  echeancier: {
    etape: string
    montant: number
  }[]
  delai: string
  planning?: {
    etape: string
    duree: string
  }[]
  inclus: string[]
  options?: {
    titre: string
    montant: number
  }[]
}

export interface DashboardStats {
  total_quotes: number
  new_quotes: number
  accepted_quotes: number
  total_revenue: number
  total_projects: number
}
