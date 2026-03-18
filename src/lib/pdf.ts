import type { Invoice } from '@/types'
import { formatPrice, formatDateShort } from '@/lib/format'
import { SITE_CONFIG } from '@/lib/constants'

export async function generateInvoicePDF(invoice: Invoice) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('KIVVI', 20, y)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(SITE_CONFIG.tagline, 20, y + 6)
  doc.text(`${SITE_CONFIG.email} | ${SITE_CONFIG.phone}`, 20, y + 11)
  doc.text(`RCCM: ${SITE_CONFIG.rccm} | NINEA: ${SITE_CONFIG.ninea}`, 20, y + 16)

  // Invoice title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('FACTURE', pageWidth - 20, y, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`N° ${invoice.id.slice(0, 8).toUpperCase()}`, pageWidth - 20, y + 6, { align: 'right' })
  doc.text(`Date: ${formatDateShort(invoice.created_at)}`, pageWidth - 20, y + 11, { align: 'right' })
  doc.text(`Échéance: ${formatDateShort(invoice.due_date)}`, pageWidth - 20, y + 16, { align: 'right' })

  y += 30

  // Separator
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(20, y, pageWidth - 20, y)
  y += 10

  // Client info
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0)
  doc.text('Facturer à:', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.client_name, 20, y + 6)
  doc.setTextColor(100)
  doc.text(invoice.client_email, 20, y + 11)
  if (invoice.client_address) {
    doc.text(invoice.client_address, 20, y + 16)
  }

  y += 30

  // Table header
  doc.setFillColor(37, 99, 235)
  doc.rect(20, y, pageWidth - 40, 8, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255)
  doc.text('Description', 24, y + 5.5)
  doc.text('Qté', 120, y + 5.5)
  doc.text('Prix unitaire', 138, y + 5.5)
  doc.text('Total', pageWidth - 24, y + 5.5, { align: 'right' })
  y += 12

  // Table rows
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0)
  const items = invoice.items as unknown as Array<{ description: string; quantity: number; unit_price: number; total: number }>
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(20, y - 4, pageWidth - 40, 10, 'F')
    }
    doc.setFontSize(8)
    doc.text(item.description, 24, y + 2)
    doc.text(String(item.quantity), 124, y + 2)
    doc.text(formatPrice(item.unit_price), 138, y + 2)
    doc.text(formatPrice(item.total), pageWidth - 24, y + 2, { align: 'right' })
    y += 10
  })

  y += 5
  doc.setDrawColor(200)
  doc.line(120, y, pageWidth - 20, y)
  y += 8

  // Totals
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text('Sous-total:', 120, y)
  doc.setTextColor(0)
  doc.text(formatPrice(invoice.subtotal), pageWidth - 24, y, { align: 'right' })
  y += 7

  doc.setTextColor(100)
  doc.text(`TVA (${invoice.tax_rate}%):`, 120, y)
  doc.setTextColor(0)
  doc.text(formatPrice(invoice.tax_amount), pageWidth - 24, y, { align: 'right' })
  y += 7

  doc.setDrawColor(37, 99, 235)
  doc.line(120, y, pageWidth - 20, y)
  y += 7

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('TOTAL:', 120, y)
  doc.text(formatPrice(invoice.total), pageWidth - 24, y, { align: 'right' })

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150)
  doc.text(
    `${SITE_CONFIG.name} — ${SITE_CONFIG.location} — ${SITE_CONFIG.url}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )

  doc.save(`facture-${invoice.id.slice(0, 8)}.pdf`)
}
