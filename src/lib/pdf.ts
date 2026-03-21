import type { Invoice, Quote, ProDevisData } from '@/types'
import { formatDateShort, formatDate } from '@/lib/format'
import { SITE_CONFIG, LOGOS } from '@/lib/constants'

type JsPDFInstance = InstanceType<typeof import('jspdf').jsPDF>

// ─── Constants ───────────────────────────────────────────────────────

const M = 20          // page margin
const LOGO_URL = LOGOS.flatBlackHorizontal
const LOGO_URL_FALLBACK = LOGOS.flatBlack
const LOGO_W = 36
const LOGO_H = 10.8
const LOGO_SQUARE_SIZE = 11

const C = {
  black:  [17, 17, 17]     as const,
  dark:   [50, 50, 50]     as const,
  gray:   [110, 110, 110]  as const,
  grayL:  [160, 160, 160]  as const,
  line:   [230, 230, 226]  as const,
  bg:     [248, 248, 245]  as const,
  bgAlt:  [242, 242, 238]  as const,
  white:  [255, 255, 255]  as const,
  accent: [40, 40, 38]     as const,
}

// ─── Image loader ────────────────────────────────────────────────────

async function toBase64(url: string): Promise<string> {
  const r = await fetch(url)
  const b = await r.blob()
  return new Promise((res) => {
    const fr = new FileReader()
    fr.onloadend = () => res(fr.result as string)
    fr.readAsDataURL(b)
  })
}

// ─── Watermark (Kivvi logo, subtle) ─────────────────────────────────

let _watermarkB64: string | null = null

async function preloadWatermark() {
  if (!_watermarkB64) {
    try { _watermarkB64 = await toBase64(LOGO_URL_FALLBACK) } catch { /* silent */ }
  }
}

function drawWatermark(doc: JsPDFInstance) {
  if (!_watermarkB64) return
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  try {
    doc.setGState(doc.GState({ opacity: 0.03 }))
    doc.addImage(_watermarkB64, 'PNG', pw - 70, ph - 70, 55, 55)
    doc.setGState(doc.GState({ opacity: 1 }))
  } catch { /* silent */ }
}

// ─── Dot pattern (subtle, full-width decorative band) ────────────────

function drawDotBand(doc: JsPDFInstance, y: number, h: number) {
  const pw = doc.internal.pageSize.getWidth()
  doc.setFillColor(...C.line)
  const dotSize = 0.4
  const spacing = 4

  for (let dx = M; dx < pw - M; dx += spacing) {
    for (let dy = y; dy < y + h; dy += spacing) {
      doc.circle(dx, dy, dotSize, 'F')
    }
  }
}

// ─── Shared helpers ──────────────────────────────────────────────────

function label(doc: JsPDFInstance, text: string, x: number, y: number) {
  doc.setFillColor(...C.black)
  doc.rect(x, y - 4, 1.2, 5.5, 'F')
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.dark)
  doc.text(text.toUpperCase(), x + 4, y)
}

function sep(doc: JsPDFInstance, y: number) {
  const pw = doc.internal.pageSize.getWidth()
  doc.setDrawColor(...C.line)
  doc.setLineWidth(0.25)
  doc.line(M, y, pw - M, y)
}

async function drawHeader(
  doc: JsPDFInstance,
  type: 'FACTURE' | 'DEVIS',
  ref: string,
  date: string,
  extra: string[]
): Promise<number> {
  const pw = doc.internal.pageSize.getWidth()

  // Logo — try horizontal first, fallback to square, then text
  let logoLoaded = false
  try {
    const b64 = await toBase64(LOGO_URL)
    doc.addImage(b64, 'PNG', M, 14, LOGO_W, LOGO_H)
    logoLoaded = true
  } catch { /* try fallback */ }

  if (!logoLoaded) {
    try {
      const b64 = await toBase64(LOGO_URL_FALLBACK)
      doc.addImage(b64, 'PNG', M, 14, LOGO_SQUARE_SIZE, LOGO_SQUARE_SIZE)
      logoLoaded = true
    } catch { /* text fallback below */ }
  }

  if (!logoLoaded) {
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.black)
    doc.text('Kivvi', M, 23)
  }

  // Tagline
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)
  doc.text(SITE_CONFIG.tagline, M, 28)

  // Doc type (right)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  doc.text(type, pw - M, 18, { align: 'right' })

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text(`Réf. ${ref}`, pw - M, 24, { align: 'right' })
  doc.text(date, pw - M, 29.5, { align: 'right' })
  extra.forEach((l, i) => {
    doc.text(l, pw - M, 35 + i * 5, { align: 'right' })
  })

  // Decorative dot band under header
  drawDotBand(doc, 36, 3)

  return 48
}

function drawFooter(doc: JsPDFInstance, note?: string) {
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const fy = ph - 18

  // Dot band above footer
  drawDotBand(doc, fy - 2, 2)

  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)

  const left = `${SITE_CONFIG.name}  —  ${SITE_CONFIG.location}  —  ${SITE_CONFIG.phone}  —  ${SITE_CONFIG.email}`
  const right = `RCCM: ${SITE_CONFIG.rccm}  —  NINEA: ${SITE_CONFIG.ninea}  —  ${SITE_CONFIG.url}`
  doc.text(left, M, fy + 5)
  doc.text(right, M, fy + 9.5)

  if (note) {
    doc.text(note, pw - M, fy + 5, { align: 'right' })
  }
}

// Price formatter — safe for jsPDF (no Unicode narrow no-break space)
function shortPrice(amount: number): string {
  const s = Math.round(amount).toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F'
}

function fullPrice(amount: number): string {
  const s = Math.round(amount).toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' CFA'
}

// ─── INVOICE PDF ─────────────────────────────────────────────────────

export async function generateInvoicePDF(invoice: Invoice) {
  const { jsPDF } = await import('jspdf')
  await preloadWatermark()
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const cw = pw - M * 2

  // Watermark
  drawWatermark(doc)

  // Header
  let y = await drawHeader(
    doc, 'FACTURE',
    invoice.id.slice(0, 8).toUpperCase(),
    formatDateShort(invoice.created_at),
    [`Échéance : ${formatDateShort(invoice.due_date)}`]
  )

  // ── Client ──
  label(doc, 'Facturer à', M, y)
  y += 5.5

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  doc.text(invoice.client_name, M, y)
  y += 5

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text(invoice.client_email, M, y)
  y += 4
  if (invoice.client_address) {
    const lines = doc.splitTextToSize(invoice.client_address, cw * 0.45)
    doc.text(lines, M, y)
    y += lines.length * 4
  }

  y += 8

  // ── Items table ──
  label(doc, 'Prestations', M, y)
  y += 5

  const c1 = M + 4
  const c2 = M + cw * 0.50
  const c3 = M + cw * 0.60
  const c4 = pw - M - 4

  // Header row
  doc.setFillColor(...C.black)
  doc.roundedRect(M, y, cw, 8, 1.5, 1.5, 'F')

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.white)
  doc.text('DESCRIPTION', c1, y + 5.5)
  doc.text('QTÉ', c2, y + 5.5)
  doc.text('PRIX UNIT.', c3, y + 5.5)
  doc.text('TOTAL', c4, y + 5.5, { align: 'right' })

  y += 12

  // Rows
  const items = invoice.items as unknown as Array<{
    description: string; quantity: number; unit_price: number; total: number
  }>

  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...C.bg)
      doc.rect(M, y - 3.5, cw, 9, 'F')
    }

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.black)
    const maxDescW = c2 - c1 - 4
    const descText = doc.splitTextToSize(item.description, maxDescW)
    doc.text(descText[0], c1, y + 2)

    doc.setFontSize(7.5)
    doc.setTextColor(...C.gray)
    doc.text(String(item.quantity), c2, y + 2)

    doc.text(shortPrice(item.unit_price), c3, y + 2)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.black)
    doc.text(shortPrice(item.total), c4, y + 2, { align: 'right' })

    y += 9
  })

  y += 8

  // ── Totals ──
  const tL = M + cw * 0.52
  const tV = c4

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text('Sous-total HT', tL, y)
  doc.setTextColor(...C.black)
  doc.text(shortPrice(invoice.subtotal), tV, y, { align: 'right' })
  y += 5.5

  doc.setTextColor(...C.gray)
  doc.text(`TVA (${invoice.tax_rate}%)`, tL, y)
  doc.setTextColor(...C.black)
  doc.text(shortPrice(invoice.tax_amount), tV, y, { align: 'right' })
  y += 4

  doc.setDrawColor(...C.line)
  doc.setLineWidth(0.25)
  doc.line(tL, y, pw - M, y)
  y += 5

  // TOTAL pill
  const pillW = pw - M - tL + 8
  doc.setFillColor(...C.black)
  doc.roundedRect(tL - 4, y - 4.5, pillW, 12, 2, 2, 'F')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.white)
  doc.text('TOTAL TTC', tL + 2, y + 3)
  doc.text(fullPrice(invoice.total), tV + 1, y + 3, { align: 'right' })

  y += 16

  // ── Montant en lettres ──
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)
  doc.text('Arrêté la présente facture à la somme de :', M, y)
  y += 4.5
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  const words = capitalizeFirst(numberToWordsFr(invoice.total)) + ' francs CFA'
  const wLines = doc.splitTextToSize(words, cw * 0.55)
  doc.text(wLines, M, y)
  y += wLines.length * 4 + 6

  // ── Conditions de paiement ──
  sep(doc, y)
  y += 6
  label(doc, 'Conditions de paiement', M, y)
  y += 5

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.dark)

  const conditions = [
    '•  Paiement accepté par virement bancaire ou Wave Mobile Money',
    '•  Paiement dû à réception de la facture, sauf accord contraire',
    '•  En cas de retard, des pénalités de 1,5% par mois seront appliquées',
    `•  Pour tout règlement par Wave : ${SITE_CONFIG.phone}`,
  ]
  conditions.forEach((c) => {
    doc.text(c, M, y)
    y += 4
  })

  // Footer
  drawFooter(doc, 'Merci pour votre confiance')

  doc.save(`facture-${invoice.id.slice(0, 8)}.pdf`)
}

// ─── QUOTE / DEVIS PDF ───────────────────────────────────────────────

export async function generateQuotePDF(quote: Quote) {
  const { jsPDF } = await import('jspdf')
  await preloadWatermark()
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const cw = pw - M * 2

  // Watermark
  drawWatermark(doc)

  // Header
  const extra: string[] = []
  if (quote.deadline) extra.push(`Deadline : ${quote.deadline}`)

  let y = await drawHeader(
    doc, 'DEVIS',
    quote.id.slice(0, 8).toUpperCase(),
    formatDateShort(quote.created_at),
    extra
  )

  // ── Client + Project (two columns) ──
  const halfW = cw * 0.47

  // Left: Client
  label(doc, 'Client', M, y)
  y += 5.5

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  doc.text(quote.name, M, y)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text(quote.email, M, y + 5)
  doc.text(quote.phone, M, y + 9.5)
  if (quote.company) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.dark)
    doc.text(quote.company, M, y + 14)
  }

  // Right: Project card
  const rx = M + cw * 0.53
  const rw = cw * 0.47

  label(doc, 'Projet', rx, y - 5.5)

  doc.setFillColor(...C.bg)
  doc.roundedRect(rx, y - 3, rw, 22, 2, 2, 'F')
  doc.setDrawColor(...C.line)
  doc.setLineWidth(0.2)
  doc.roundedRect(rx, y - 3, rw, 22, 2, 2, 'S')

  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.grayL)
  doc.text('TYPE', rx + 5, y + 2)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.black)
  const typeLines = doc.splitTextToSize(quote.type, rw - 12)
  doc.text(typeLines[0], rx + 5, y + 7)

  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.grayL)
  doc.text('BUDGET', rx + 5, y + 13)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.black)
  doc.text(quote.budget, rx + 5, y + 18)

  y += 26

  // ── Description ──
  sep(doc, y)
  y += 7
  label(doc, 'Description du projet', M, y)
  y += 5

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.dark)
  const dLines = doc.splitTextToSize(quote.description, cw)
  doc.text(dLines, M, y)
  y += dLines.length * 4 + 6

  // ── Features ──
  if (quote.features.length > 0) {
    sep(doc, y)
    y += 7
    label(doc, 'Fonctionnalités souhaitées', M, y)
    y += 6

    const cols = 2
    const colW = cw / cols

    quote.features.forEach((feat, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const fx = M + col * colW
      const fy = y + row * 7

      doc.setFillColor(...C.black)
      doc.circle(fx + 1.5, fy - 0.8, 0.8, 'F')

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...C.black)
      const ft = doc.splitTextToSize(feat, colW - 10)
      doc.text(ft[0], fx + 5, fy)
    })

    const rows = Math.ceil(quote.features.length / cols)
    y += rows * 7 + 6
  }

  // ── Status ──
  sep(doc, y)
  y += 7

  const statusLabels: Record<string, string> = {
    new: 'Nouveau', contacted: 'Contacté', in_progress: 'En cours',
    accepted: 'Accepté', rejected: 'Refusé'
  }
  const st = statusLabels[quote.status] || quote.status

  label(doc, 'Status', M, y)

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  const bw = doc.getTextWidth(st.toUpperCase()) + 8
  doc.setFillColor(...C.black)
  doc.roundedRect(M + 24, y - 3.5, bw, 6.5, 1.5, 1.5, 'F')
  doc.setTextColor(...C.white)
  doc.text(st.toUpperCase(), M + 24 + bw / 2, y + 1, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)
  doc.text(`Demande reçue le ${formatDate(quote.created_at)}`, M + 24 + bw + 5, y + 1)

  y += 12

  // ── Conditions ──
  sep(doc, y)
  y += 6
  label(doc, 'Conditions', M, y)
  y += 5

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.dark)
  const qConditions = [
    '•  Ce devis est valable 30 jours à compter de sa date d\'émission',
    '•  Un acompte de 50% est requis pour le démarrage du projet',
    '•  Le solde est dû à la livraison du projet',
    '•  Paiement accepté par virement bancaire ou Wave Mobile Money',
    `•  Conditions générales disponibles sur ${SITE_CONFIG.url}/cgv`,
  ]
  qConditions.forEach((c) => {
    doc.text(c, M, y)
    y += 3.8
  })

  // Footer
  drawFooter(doc, 'Devis valable 30 jours')

  doc.save(`devis-${quote.id.slice(0, 8)}.pdf`)
}

// ─── Helpers ─────────────────────────────────────────────────────────

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function numberToWordsFr(n: number): string {
  if (n === 0) return 'zéro'

  const u = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf'
  ]
  const d = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante',
    'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
  ]

  function b100(n: number): string {
    if (n < 20) return u[n]
    if (n < 70) {
      const t = Math.floor(n / 10), r = n % 10
      if (r === 0) return d[t]
      if (r === 1 && t !== 8) return `${d[t]} et un`
      return `${d[t]}-${u[r]}`
    }
    if (n < 80) {
      const r = n - 60
      if (r === 0) return 'soixante'
      if (r === 1) return 'soixante et onze'
      if (r < 20) return `soixante-${u[r]}`
      return `soixante-${b100(r)}`
    }
    const r = n - 80
    if (r === 0) return 'quatre-vingts'
    if (r < 20) return `quatre-vingt-${u[r]}`
    return `quatre-vingt-${b100(r)}`
  }

  function b1000(n: number): string {
    if (n < 100) return b100(n)
    const c = Math.floor(n / 100), r = n % 100
    const p = c === 1 ? 'cent' : `${u[c]} cent${r === 0 ? 's' : ''}`
    return r === 0 ? p : `${p} ${b100(r)}`
  }

  const i = Math.floor(n)
  if (i >= 1000000) {
    const m = Math.floor(i / 1000000), r = i % 1000000
    const p = m === 1 ? 'un million' : `${b1000(m)} millions`
    return r === 0 ? p : `${p} ${numberToWordsFr(r)}`
  }
  if (i >= 1000) {
    const k = Math.floor(i / 1000), r = i % 1000
    const p = k === 1 ? 'mille' : `${b1000(k)} mille`
    return r === 0 ? p : `${p} ${b1000(r)}`
  }
  return b1000(i)
}

// ─── PRO DEVIS PDF (from Claude JSON) ─────────────────────────────────

export async function generateProDevisPDF(data: ProDevisData) {
  const { jsPDF } = await import('jspdf')
  await preloadWatermark()
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const cw = pw - M * 2

  // Watermark
  drawWatermark(doc)

  // Header
  let y = await drawHeader(
    doc, 'DEVIS',
    data.numero,
    data.date,
    [`Validité : ${data.validite}`]
  )

  // ── Client ──
  label(doc, 'Client', M, y)
  y += 5.5

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  doc.text(data.client.nom, M, y)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text(data.client.telephone, M, y + 5)
  if (data.client.email) doc.text(data.client.email, M, y + 9.5)
  if (data.client.structure) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.dark)
    doc.text(data.client.structure, M, y + (data.client.email ? 14 : 9.5))
  }

  y += 20

  // ── Contexte & Objectifs ──
  sep(doc, y)
  y += 7
  label(doc, 'Contexte & Objectifs', M, y)
  y += 5

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.dark)
  const ctxLines = doc.splitTextToSize(data.contexte, cw)
  doc.text(ctxLines, M, y)
  y += ctxLines.length * 4 + 6

  // ── Prestations ──
  sep(doc, y)
  y += 7
  label(doc, 'Prestations détaillées', M, y)
  y += 5

  // Table header
  const priceCol = pw - M - 4
  doc.setFillColor(...C.black)
  doc.roundedRect(M, y, cw, 8, 1.5, 1.5, 'F')
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.white)
  doc.text('PRESTATION', M + 4, y + 5.5)
  doc.text('MONTANT', priceCol, y + 5.5, { align: 'right' })
  y += 12

  data.prestations.forEach((p, i) => {
    // Check page overflow
    if (y > ph - 60) {
      drawFooter(doc)
      doc.addPage()
      drawWatermark(doc)
      y = 20
    }

    if (i % 2 === 0) {
      doc.setFillColor(...C.bg)
      doc.rect(M, y - 4, cw, 14, 'F')
    }

    // Title (clamped width to prevent overlapping price)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.black)
    const maxTitleW = cw * 0.62
    const titleLines = doc.splitTextToSize(p.titre, maxTitleW)
    doc.text(titleLines[0], M + 4, y + 1)

    // Price (right-aligned)
    doc.text(shortPrice(p.montant), priceCol, y + 1, { align: 'right' })

    // Details (same clamped width)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.gray)
    const detLines = doc.splitTextToSize(p.details, cw * 0.62)
    doc.text(detLines[0], M + 4, y + 6)

    y += 14
  })

  y += 4

  // ── Totals ──
  const tL = M + cw * 0.52
  const tV = priceCol

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.gray)
  doc.text('Sous-total', tL, y)
  doc.setTextColor(...C.black)
  doc.text(shortPrice(data.sousTotal), tV, y, { align: 'right' })
  y += 5.5

  if (data.remise && data.remise.montant > 0) {
    doc.setTextColor(...C.gray)
    doc.text(`Remise (${data.remise.taux}%)`, tL, y)
    doc.setTextColor(180, 40, 40)
    doc.text(`-${shortPrice(data.remise.montant)}`, tV, y, { align: 'right' })
    y += 5.5
  }

  // Total pill
  doc.setDrawColor(...C.line)
  doc.setLineWidth(0.25)
  doc.line(tL, y - 1, pw - M, y - 1)
  y += 4

  const pillW = pw - M - tL + 8
  doc.setFillColor(...C.black)
  doc.roundedRect(tL - 4, y - 4.5, pillW, 12, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.white)
  doc.text('TOTAL', tL + 2, y + 3)
  doc.text(fullPrice(data.total), tV + 1, y + 3, { align: 'right' })

  y += 16

  // ── Montant en lettres ──
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)
  doc.text('Arrêté le présent devis à la somme de :', M, y)
  y += 4.5
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.black)
  const words = capitalizeFirst(numberToWordsFr(data.total)) + ' francs CFA'
  const wLines = doc.splitTextToSize(words, cw * 0.55)
  doc.text(wLines, M, y)
  y += wLines.length * 4 + 6

  // ── Échéancier de paiement ──
  if (y > ph - 80) { drawFooter(doc); doc.addPage(); drawWatermark(doc); y = 20 }
  sep(doc, y)
  y += 7
  label(doc, 'Échéancier de paiement', M, y)
  y += 5

  data.echeancier.forEach(e => {
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.dark)
    doc.text(`•  ${e.etape}`, M, y)
    doc.setFont('helvetica', 'bold')
    doc.text(shortPrice(e.montant), tV, y, { align: 'right' })
    y += 5
  })

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.grayL)
  doc.text('Moyens : Wave, Orange Money, virement bancaire, espèces', M, y + 2)
  y += 8

  // ── Délai & Planning ──
  if (y > ph - 60) { drawFooter(doc); doc.addPage(); drawWatermark(doc); y = 20 }
  sep(doc, y)
  y += 7
  label(doc, `Délai de livraison : ${data.delai}`, M, y)
  y += 5

  if (data.planning && data.planning.length > 0) {
    data.planning.forEach(p => {
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...C.dark)
      doc.text(`•  ${p.etape}`, M, y)
      doc.setTextColor(...C.gray)
      doc.text(p.duree, M + cw * 0.6, y)
      y += 5
    })
  }
  y += 4

  // ── Ce qui est inclus ──
  if (y > ph - 50) { drawFooter(doc); doc.addPage(); drawWatermark(doc); y = 20 }
  sep(doc, y)
  y += 7
  label(doc, 'Inclus dans cette offre', M, y)
  y += 5

  const cols = 2
  const colW = cw / cols
  data.inclus.forEach((item, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const fx = M + col * colW
    const fy = y + row * 5

    doc.setFillColor(...C.black)
    doc.circle(fx + 1.5, fy - 0.8, 0.6, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.dark)
    const t = doc.splitTextToSize(item, colW - 8)
    doc.text(t[0], fx + 4, fy)
  })
  y += Math.ceil(data.inclus.length / cols) * 5 + 6

  // ── Options recommandées ──
  if (data.options && data.options.length > 0) {
    if (y > ph - 40) { drawFooter(doc); doc.addPage(); drawWatermark(doc); y = 20 }
    sep(doc, y)
    y += 7
    label(doc, 'Options recommandées (non incluses)', M, y)
    y += 5

    data.options.forEach(opt => {
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...C.dark)
      doc.text(`•  ${opt.titre}`, M, y)
      doc.setTextColor(...C.gray)
      doc.text(shortPrice(opt.montant), tV, y, { align: 'right' })
      y += 5
    })
    y += 4
  }

  // ── Conditions ──
  if (y > ph - 35) { drawFooter(doc); doc.addPage(); drawWatermark(doc); y = 20 }
  sep(doc, y)
  y += 6
  label(doc, 'Conditions', M, y)
  y += 5

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.dark)
  const conditions = [
    `•  Ce devis est valable ${data.validite} à compter de sa date d'émission`,
    '•  Paiement accepté par virement bancaire, Wave ou Orange Money',
    '•  Le client acquiert la propriété des livrables après paiement intégral',
    '•  3 mois de maintenance corrective inclus après livraison',
    `•  Conditions générales disponibles sur ${SITE_CONFIG.url}/cgv`,
  ]
  conditions.forEach(c => { doc.text(c, M, y); y += 3.8 })

  // Footer
  drawFooter(doc, `Devis ${data.numero}`)

  doc.save(`devis-${data.numero}.pdf`)

  // Return base64 for email sending
  return doc.output('datauristring')
}
