export function formatPrice(amount: number | string): string {
  if (typeof amount === 'string') return amount
  return new Intl.NumberFormat('fr-FR').format(amount) + ' CFA'
}

export function formatPhone(phone: string): string {
  // Format: +221 77 884 35 98
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('221') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`
  }
  return phone
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
