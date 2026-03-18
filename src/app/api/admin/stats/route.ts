import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { DashboardStats } from '@/types'

export async function GET() {
  try {
    // Fetch all counts in parallel
    const [quotesRes, newQuotesRes, acceptedQuotesRes, projectsRes, invoicesRes] = await Promise.all([
      supabaseAdmin.from('quotes').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabaseAdmin.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
      supabaseAdmin.from('projects').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('invoices').select('total').eq('status', 'paid'),
    ])

    // Calculate total revenue from paid invoices
    const totalRevenue = (invoicesRes.data || []).reduce(
      (sum: number, invoice: { total: number }) => sum + (invoice.total || 0),
      0
    )

    const stats: DashboardStats = {
      total_quotes: quotesRes.count ?? 0,
      new_quotes: newQuotesRes.count ?? 0,
      accepted_quotes: acceptedQuotesRes.count ?? 0,
      total_revenue: totalRevenue,
      total_projects: projectsRes.count ?? 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
