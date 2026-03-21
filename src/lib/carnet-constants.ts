export const COUNTRIES = [
  { code: 'SN', name: 'Sénégal', dial: '+221', currency: 'XOF' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', currency: 'XOF' },
  { code: 'ML', name: 'Mali', dial: '+223', currency: 'XOF' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', currency: 'XOF' },
  { code: 'GN', name: 'Guinée', dial: '+224', currency: 'GNF' },
  { code: 'CM', name: 'Cameroun', dial: '+237', currency: 'XAF' },
  { code: 'RDC', name: 'RD Congo', dial: '+243', currency: 'CDF' },
  { code: 'NG', name: 'Nigeria', dial: '+234', currency: 'NGN' },
  { code: 'GH', name: 'Ghana', dial: '+233', currency: 'GHS' },
] as const

export const SHOP_TYPES = [
  { value: 'boutique' as const, label: 'Boutique', icon: 'Store' },
  { value: 'restaurant' as const, label: 'Restaurant', icon: 'UtensilsCrossed' },
  { value: 'salon' as const, label: 'Salon de coiffure', icon: 'Scissors' },
  { value: 'atelier' as const, label: 'Atelier / Couture', icon: 'Hammer' },
  { value: 'autre' as const, label: 'Autre', icon: 'MoreHorizontal' },
] as const

export const PRODUCT_CATEGORIES: Record<string, string[]> = {
  boutique: ['Alimentation', 'Boissons', 'Hygiène', 'Ménage', 'Téléphonie', 'Autre'],
  restaurant: ['Plats', 'Boissons', 'Desserts', 'Entrées', 'Autre'],
  salon: ['Coupe', 'Tresse', 'Coloration', 'Soin', 'Produit', 'Autre'],
  atelier: ['Couture', 'Retouche', 'Tissu', 'Accessoire', 'Autre'],
  autre: ['Produit', 'Service', 'Autre'],
}

export const PAYMENT_METHODS = [
  { value: 'cash' as const, label: 'Cash', icon: 'Banknote', color: '#22c55e' },
  { value: 'wave' as const, label: 'Wave', icon: 'Smartphone', color: '#3b82f6' },
  { value: 'credit' as const, label: 'Crédit', icon: 'Clock', color: '#f97316' },
] as const

export const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  XOF: { symbol: 'F', name: 'Franc CFA (BCEAO)' },
  XAF: { symbol: 'F', name: 'Franc CFA (BEAC)' },
  GNF: { symbol: 'FG', name: 'Franc Guinéen' },
  CDF: { symbol: 'FC', name: 'Franc Congolais' },
  NGN: { symbol: '₦', name: 'Naira' },
  GHS: { symbol: 'GH₵', name: 'Cedi' },
}

export function formatCurrency(amount: number, currency = 'XOF'): string {
  const cur = CURRENCIES[currency] || CURRENCIES.XOF
  return `${Math.round(amount).toLocaleString('fr-FR')}${cur.symbol}`
}

export function getDateRange(period: 'today' | 'week' | 'month'): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const start = new Date(end)

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break
  }

  return { start, end }
}

export const PLAN_LIMITS = {
  free: { products: 50, reminders_per_day: 3, commission: 0.02 },
  pro: { products: Infinity, reminders_per_day: Infinity, commission: 0.01 },
  business: { products: Infinity, reminders_per_day: Infinity, commission: 0.005 },
} as const
