# Carnet Digital MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 MVP of Kivvi Carnet Digital — an offline-first PWA where African merchants register sales, track customer debts, manage products, and view daily profit.

**Architecture:** Next.js 16 app router with Supabase (auth + PostgreSQL), offline-first via Dexie.js (IndexedDB) with sync-on-open protocol. The carnet lives in `/app/*` routes (light theme default), coexisting with the agency site. Auth via Termii OTP (WhatsApp + SMS fallback) creating Supabase sessions.

**Tech Stack:** Next.js 16, React 19, Supabase SSR, Dexie.js, Tailwind CSS 4, framer-motion, lucide-react, zod, react-hook-form

**Spec:** `docs/superpowers/specs/2026-03-21-carnet-digital-design.md`

---

## File Structure

```
src/
├── app/
│   ├── (public)/          # EXISTING — agency site (unchanged)
│   ├── admin/             # EXISTING — admin dashboard (unchanged)
│   ├── app/               # NEW — Carnet Digital
│   │   ├── layout.tsx     # Auth guard + 4-tab bottom nav + light theme
│   │   ├── sales/
│   │   │   └── page.tsx   # Tab 1: Sales list + FAB to add sale
│   │   ├── debts/
│   │   │   └── page.tsx   # Tab 2: Debt ledger by client
│   │   ├── products/
│   │   │   └── page.tsx   # Tab 3: Product catalog
│   │   ├── dashboard/
│   │   │   └── page.tsx   # Tab 4: Profit dashboard
│   │   └── settings/
│   │       └── page.tsx   # Settings (profile, plan, language, delete account)
│   ├── auth/
│   │   ├── page.tsx       # Phone number input + send OTP
│   │   ├── verify/
│   │   │   └── page.tsx   # OTP verification
│   │   └── onboarding/
│   │       └── page.tsx   # 3-step wizard (name, shop, type)
│   ├── pay/
│   │   └── [id]/
│   │       └── page.tsx   # Public payment page (no auth)
│   └── api/
│       ├── auth/
│       │   ├── send-otp/route.ts      # POST — Termii OTP send
│       │   └── verify-otp/route.ts    # POST — verify + Supabase session
│       ├── webhooks/
│       │   └── wave/route.ts          # POST — Wave payment webhook
│       ├── reminders/
│       │   └── send/route.ts          # POST — WhatsApp reminder (Phase 2)
│       └── sync/
│           ├── push/route.ts          # POST — push offline records
│           └── pull/route.ts          # GET — pull changes since last_sync
├── components/
│   ├── carnet/            # NEW — Carnet Digital components
│   │   ├── bottom-nav.tsx         # 4-tab bottom navigation
│   │   ├── sale-form.tsx          # Add sale bottom sheet
│   │   ├── sale-card.tsx          # Sale list item
│   │   ├── debt-client-card.tsx   # Client debt summary card
│   │   ├── debt-payment-form.tsx  # Record payment form
│   │   ├── product-form.tsx       # Add/edit product form
│   │   ├── product-card.tsx       # Product list item
│   │   ├── stat-card.tsx          # Dashboard stat card
│   │   ├── profit-chart.tsx       # 7-day bar chart
│   │   ├── period-filter.tsx      # Today/Week/Month filter
│   │   ├── phone-input.tsx        # Phone input with country code
│   │   ├── otp-input.tsx          # 6-digit OTP input
│   │   └── onboarding-wizard.tsx  # 3-step onboarding
│   └── ui/                # EXISTING — extend as needed
├── lib/
│   ├── supabase/          # EXISTING — client.ts, server.ts, admin.ts
│   ├── db/                # NEW — Dexie offline database
│   │   ├── index.ts       # Dexie DB definition (tables, schema, version)
│   │   ├── sync.ts        # Sync engine (push/pull, queue, retry)
│   │   └── hooks.ts       # React hooks: useSales, useDebts, useProducts, useClients
│   ├── services/          # NEW — API service layer
│   │   ├── auth.ts        # OTP send/verify
│   │   ├── termii.ts      # Termii API wrapper (server-side only)
│   │   └── wave.ts        # Wave API wrapper (server-side only)
│   ├── carnet-types.ts    # NEW — TypeScript types for carnet entities
│   ├── carnet-schemas.ts  # NEW — Zod schemas for validation
│   └── carnet-constants.ts # NEW — shop types, countries, currencies, categories
├── hooks/
│   └── use-auth.ts        # NEW — auth state hook (Supabase session)
└── middleware.ts          # NEW — auth redirect for /app/* routes
```

---

## Task 1: Install Dependencies & Environment

**Files:**
- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1: Install Dexie.js for offline storage**

```bash
cd /opt/kivvi && npm install dexie dexie-react-hooks
```

- [ ] **Step 2: Install Sentry for error tracking**

```bash
cd /opt/kivvi && npm install @sentry/nextjs
```

- [ ] **Step 3: Add environment variables to `.env.local`**

Append to `/opt/kivvi/.env.local`:

```env
# Termii OTP
TERMII_API_KEY=your_termii_api_key
TERMII_SENDER_ID=Kivvi
TERMII_CHANNEL=whatsapp_otp

# Wave Payments
WAVE_API_KEY=your_wave_api_key
WAVE_WEBHOOK_SECRET=your_wave_webhook_secret

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(carnet): install dexie, sentry dependencies"
```

> **Note:** Never commit `.env.local` — it contains secrets. Ensure it's in `.gitignore`.

---

## Task 2: Database Schema — Supabase Tables + RLS

**Files:**
- Modify: `supabase-schema.sql` (append carnet tables)

- [ ] **Step 1: Add carnet digital tables to schema file**

Append to `supabase-schema.sql` the full schema from the spec: `otp_codes`, `profiles`, `products` (carnet), `clients`, `sales`, `debts`, `debt_payments`, `reminders`, `payment_links` — with all indexes, triggers, and RLS policies.

Key points:
- `profiles` references `auth.users(id)` — Supabase Auth
- Every user-owned table has RLS: `user_id = auth.uid()` for authenticated role
- `payment_links` has public SELECT (anon can view to pay)
- `otp_codes` is service_role only
- All mutable tables get `update_updated_at` trigger
- Sync indexes: `WHERE synced = FALSE` partial indexes

```sql
-- ─── Carnet Digital Tables ─────────────────────────────────

-- OTP codes (auth custom via Termii)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone, expires_at DESC);

-- Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  shop_type TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'SN',
  language TEXT NOT NULL DEFAULT 'fr',
  currency TEXT NOT NULL DEFAULT 'XOF',
  plan TEXT NOT NULL DEFAULT 'free',
  wave_phone TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (carnet catalog)
CREATE TABLE IF NOT EXISTS carnet_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  buy_price DECIMAL(12,2) DEFAULT 0,
  sell_price DECIMAL(12,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category TEXT,
  image_url TEXT,
  synced BOOLEAN DEFAULT TRUE,
  local_id TEXT UNIQUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (merchant's customer contacts)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  last_reminder_at TIMESTAMPTZ,
  synced BOOLEAN DEFAULT TRUE,
  local_id TEXT UNIQUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES carnet_products(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  cost_price DECIMAL(12,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'wave', 'credit')),
  note TEXT,
  synced BOOLEAN DEFAULT TRUE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debts
CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  due_date DATE,
  synced BOOLEAN DEFAULT TRUE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debt payments
CREATE TABLE IF NOT EXISTS debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  debt_id UUID REFERENCES debts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'wave')),
  wave_checkout_id TEXT,
  synced BOOLEAN DEFAULT TRUE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders (Phase 2 — create table now for schema completeness)
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  total_amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  sent_via TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  payment_link_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment links (public)
CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY, -- 22 chars crypto random
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  wave_checkout_id TEXT,
  commission_rate DECIMAL(4,3) DEFAULT 0.02,
  commission_amount DECIMAL(12,2) DEFAULT 0,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

- [ ] **Step 2: Add RLS policies and indexes**

```sql
-- RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carnet_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

-- Service role full access (all carnet tables)
CREATE POLICY "service_role_all" ON otp_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON carnet_products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON clients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON sales FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON debts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON debt_payments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON reminders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON payment_links FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated user policies (own data only)
CREATE POLICY "own_data" ON profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own_data" ON carnet_products FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON clients FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON sales FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON debts FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON debt_payments FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON reminders FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data" ON payment_links FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Public read for payment links (anyone can view to pay)
CREATE POLICY "public_read" ON payment_links FOR SELECT TO anon USING (true);

-- Triggers
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_carnet_products_updated BEFORE UPDATE ON carnet_products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_debts_updated BEFORE UPDATE ON debts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_debt_payments_updated BEFORE UPDATE ON debt_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sales_user_date ON sales(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_synced ON sales(synced) WHERE synced = FALSE;
CREATE INDEX IF NOT EXISTS idx_debts_client ON debts(client_id, status);
CREATE INDEX IF NOT EXISTS idx_debts_user ON debts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_debt_payments_debt ON debt_payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_carnet_products_user ON carnet_products(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status);
CREATE INDEX IF NOT EXISTS idx_sync_carnet_products ON carnet_products(synced) WHERE synced = FALSE;
CREATE INDEX IF NOT EXISTS idx_sync_clients ON clients(synced) WHERE synced = FALSE;
CREATE INDEX IF NOT EXISTS idx_sync_debts ON debts(synced) WHERE synced = FALSE;
CREATE INDEX IF NOT EXISTS idx_sync_debt_payments ON debt_payments(synced) WHERE synced = FALSE;
```

- [ ] **Step 3: Run schema in Supabase SQL Editor**

Go to Supabase Dashboard → SQL Editor → paste and run the carnet tables section.

- [ ] **Step 4: Commit**

```bash
git add supabase-schema.sql
git commit -m "feat(carnet): add carnet digital database schema (9 tables + RLS + indexes)"
```

---

## Task 3: TypeScript Types + Zod Schemas + Constants

**Files:**
- Create: `src/lib/carnet-types.ts`
- Create: `src/lib/carnet-schemas.ts`
- Create: `src/lib/carnet-constants.ts`

- [ ] **Step 1: Create carnet types**

```typescript
// src/lib/carnet-types.ts

export interface Profile {
  id: string
  phone: string
  name: string
  shop_name: string
  shop_type: string
  country: string
  language: string
  currency: string
  plan: 'free' | 'pro' | 'business'
  wave_phone?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface CarnetProduct {
  id: string
  user_id: string
  name: string
  buy_price: number
  sell_price: number
  quantity: number
  low_stock_threshold: number
  category?: string
  image_url?: string
  synced: boolean
  local_id?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  phone?: string
  last_reminder_at?: string
  synced: boolean
  local_id?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}

export type PaymentMethod = 'cash' | 'wave' | 'credit'

export interface Sale {
  id: string
  user_id: string
  product_id?: string
  client_id?: string
  amount: number
  cost_price: number
  quantity: number
  payment_method: PaymentMethod
  note?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
  // Joined fields (optional, for display)
  product?: CarnetProduct
  client?: Client
}

export type DebtStatus = 'pending' | 'partial' | 'paid'

export interface Debt {
  id: string
  user_id: string
  client_id: string
  sale_id?: string
  amount: number
  paid_amount: number
  status: DebtStatus
  due_date?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: string
  user_id: string
  debt_id: string
  amount: number
  method: 'cash' | 'wave'
  wave_checkout_id?: string
  synced: boolean
  local_id?: string
  created_at: string
  updated_at: string
}

export interface PaymentLink {
  id: string
  user_id: string
  client_id?: string
  amount: number
  description?: string
  status: 'pending' | 'paid' | 'expired'
  wave_checkout_id?: string
  commission_rate: number
  commission_amount: number
  paid_at?: string
  expires_at: string
  created_at: string
}

// Client with computed total debt (calculated on the fly)
export interface ClientWithDebt extends Client {
  total_debt: number
  debt_count: number
}

// Dashboard stats
export interface DashboardData {
  total_sales: number
  total_cost: number
  profit: number
  sale_count: number
  total_debt: number
  debtor_count: number
  top_products: { name: string; count: number; revenue: number }[]
  daily_sales: { date: string; total: number; profit: number }[]
}
```

- [ ] **Step 2: Create Zod validation schemas**

```typescript
// src/lib/carnet-schemas.ts
import { z } from 'zod'

export const phoneSchema = z.string()
  .min(8, 'Numéro trop court')
  .max(15, 'Numéro trop long')
  .regex(/^\+?\d+$/, 'Numéro invalide')

export const otpSchema = z.string().length(6, 'Le code doit faire 6 chiffres')

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Prénom requis'),
  shop_name: z.string().min(2, 'Nom de boutique requis'),
  shop_type: z.enum(['boutique', 'restaurant', 'salon', 'atelier', 'autre']),
})

export const saleSchema = z.object({
  amount: z.number().positive('Montant requis'),
  product_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
  quantity: z.number().int().positive().default(1),
  payment_method: z.enum(['cash', 'wave', 'credit']),
  note: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  sell_price: z.number().positive('Prix de vente requis'),
  buy_price: z.number().min(0).default(0),
  quantity: z.number().int().min(0).default(0),
  low_stock_threshold: z.number().int().min(0).default(5),
  category: z.string().optional(),
})

export const clientSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  phone: z.string().optional(),
})

export const debtPaymentSchema = z.object({
  amount: z.number().positive('Montant requis'),
  method: z.enum(['cash', 'wave']),
})
```

- [ ] **Step 3: Create constants**

```typescript
// src/lib/carnet-constants.ts

export const COUNTRIES = [
  { code: 'SN', name: 'Sénégal', dial: '+221', currency: 'XOF', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', currency: 'XOF', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', dial: '+223', currency: 'XOF', flag: '🇲🇱' },
  { code: 'CM', name: 'Cameroun', dial: '+237', currency: 'XAF', flag: '🇨🇲' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', currency: 'XOF', flag: '🇧🇫' },
  { code: 'GN', name: 'Guinée', dial: '+224', currency: 'GNF', flag: '🇬🇳' },
  { code: 'RDC', name: 'RD Congo', dial: '+243', currency: 'CDF', flag: '🇨🇩' },
  { code: 'NG', name: 'Nigeria', dial: '+234', currency: 'NGN', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial: '+233', currency: 'GHS', flag: '🇬🇭' },
] as const

export const SHOP_TYPES = [
  { value: 'boutique', label: 'Boutique', icon: 'Store' },
  { value: 'restaurant', label: 'Restaurant', icon: 'UtensilsCrossed' },
  { value: 'salon', label: 'Salon de coiffure', icon: 'Scissors' },
  { value: 'atelier', label: 'Atelier / Couture', icon: 'Hammer' },
  { value: 'autre', label: 'Autre', icon: 'MoreHorizontal' },
] as const

export const PRODUCT_CATEGORIES: Record<string, string[]> = {
  boutique: ['Alimentation', 'Boissons', 'Hygiène', 'Ménage', 'Téléphonie', 'Autre'],
  restaurant: ['Plats', 'Boissons', 'Desserts', 'Entrées', 'Autre'],
  salon: ['Coupe', 'Tresse', 'Coloration', 'Soin', 'Produit', 'Autre'],
  atelier: ['Couture', 'Retouche', 'Tissu', 'Accessoire', 'Autre'],
  autre: ['Produit', 'Service', 'Autre'],
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: 'Banknote' },
  { value: 'wave', label: 'Wave', icon: 'Smartphone' },
  { value: 'credit', label: 'Crédit', icon: 'Clock' },
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
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/carnet-types.ts src/lib/carnet-schemas.ts src/lib/carnet-constants.ts
git commit -m "feat(carnet): add types, zod schemas, and constants"
```

---

## Task 4: Auth — Termii OTP + Supabase Session

**Files:**
- Create: `src/lib/services/termii.ts`
- Create: `src/lib/services/auth.ts`
- Create: `src/app/api/auth/send-otp/route.ts`
- Create: `src/app/api/auth/verify-otp/route.ts`
- Create: `src/hooks/use-auth.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create Termii service (server-side)**

```typescript
// src/lib/services/termii.ts
// Server-side only — never import in client components

const TERMII_BASE = 'https://v3.api.termii.com'

interface TermiiSendResponse {
  pinId: string
  to: string
  status: string
}

export async function sendOTP(phone: string): Promise<{ pinId: string }> {
  const res = await fetch(`${TERMII_BASE}/api/sms/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      message_type: 'NUMERIC',
      to: phone,
      from: process.env.TERMII_SENDER_ID || 'Kivvi',
      channel: process.env.TERMII_CHANNEL || 'whatsapp_otp',
      pin_attempts: 3,
      pin_time_limit: 10, // minutes
      pin_length: 6,
      pin_placeholder: '< 1234 >',
      message_text: 'Ton code Kivvi est < 1234 >. Valable 10 minutes.',
      pin_type: 'NUMERIC',
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Termii error: ${error}`)
  }

  const data: TermiiSendResponse = await res.json()
  return { pinId: data.pinId }
}

export async function verifyOTP(pinId: string, pin: string): Promise<boolean> {
  const res = await fetch(`${TERMII_BASE}/api/sms/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      pin_id: pinId,
      pin,
    }),
  })

  if (!res.ok) return false

  const data = await res.json()
  return data.verified === 'True' || data.verified === true
}

export async function sendSMS(phone: string, message: string): Promise<void> {
  await fetch(`${TERMII_BASE}/api/sms/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: process.env.TERMII_SENDER_ID || 'Kivvi',
      sms: message,
      type: 'plain',
      channel: 'generic',
    }),
  })
}
```

- [ ] **Step 2: Create send-otp API route**

```typescript
// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/services/termii'
import { phoneSchema } from '@/lib/carnet-schemas'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const phone = phoneSchema.parse(body.phone)

    const { pinId } = await sendOTP(phone)

    return NextResponse.json({ pinId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur envoi OTP'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
```

- [ ] **Step 3: Create verify-otp API route**

This route verifies the OTP via Termii, then creates/finds the Supabase user and establishes a real Supabase session via cookies.

**Auth strategy:** Each user gets a deterministic email (`{phone}@phone.kivvi.tech`) and a stable password (derived from phone + server secret). After Termii OTP verification, the server creates the user if needed, then signs them in with `signInWithPassword` to produce a real Supabase session. The session cookies are set in the response, making the middleware and all Supabase client calls work seamlessly.

```typescript
// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifyOTP } from '@/lib/services/termii'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { otpSchema } from '@/lib/carnet-schemas'
import crypto from 'crypto'

// Deterministic password from phone + server secret (never exposed to client)
function derivePassword(phone: string): string {
  return crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(phone)
    .digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pin = otpSchema.parse(body.pin)
    const { pinId, phone } = body

    if (!pinId || !phone) {
      return NextResponse.json({ error: 'pinId et phone requis' }, { status: 400 })
    }

    // 1. Verify OTP via Termii
    const verified = await verifyOTP(pinId, pin)
    if (!verified) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 401 })
    }

    const email = `${phone}@phone.kivvi.tech`
    const password = derivePassword(phone)

    // 2. Check if user exists via profiles table (scalable, indexed by phone)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .single()

    if (!existingProfile) {
      // Create new Supabase Auth user
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        phone,
        email_confirm: true,
        phone_confirm: true,
      })
      if (createError && !createError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Erreur création compte' }, { status: 500 })
      }
    }

    // 3. Sign in to get a real Supabase session (sets cookies)
    const response = NextResponse.json({ success: true })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: 'Erreur connexion' }, { status: 500 })
    }

    // 4. Check if profile exists (to determine if onboarding needed)
    const needsOnboarding = !existingProfile

    // Set redirect info in response
    return NextResponse.json(
      { needsOnboarding },
      { headers: response.headers }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur vérification'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
```

**Why this approach works:**
- Termii handles OTP delivery (WhatsApp + SMS fallback) — better UX for African users
- Supabase handles session management (JWT cookies, refresh tokens, RLS)
- The middleware at `/app/*` sees a real Supabase session → auth guard works
- The client Supabase SDK picks up the session from cookies → RLS queries work
- No email is ever shown to users — it's a synthetic email for Supabase internals only

- [ ] **Step 4: Create auth hook**

```typescript
// src/hooks/use-auth.ts
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/lib/carnet-types'

export function useAuth() {
  const [user, setUser] = useState<{ id: string; phone: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, phone: session.user.phone || '' })
          // Fetch profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return { user, profile, loading, signOut }
}
```

- [ ] **Step 5: Create middleware for auth redirect**

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /app/* routes
  if (!pathname.startsWith('/app')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/app/:path*'],
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/services/termii.ts src/app/api/auth/ src/hooks/use-auth.ts src/middleware.ts
git commit -m "feat(carnet): auth flow — Termii OTP + Supabase session + middleware"
```

---

## Task 5: Auth UI — Phone Input + OTP Verification + Onboarding

**Files:**
- Create: `src/components/carnet/phone-input.tsx`
- Create: `src/components/carnet/otp-input.tsx`
- Create: `src/components/carnet/onboarding-wizard.tsx`
- Create: `src/app/auth/page.tsx`
- Create: `src/app/auth/verify/page.tsx`
- Create: `src/app/auth/onboarding/page.tsx`

- [ ] **Step 1: Create phone input component**

Phone input with country code auto-select. Uses `COUNTRIES` from constants. Clean, minimal design following existing glass design system. Light theme (white bg).

Key patterns:
- Country selector dropdown with flag + dial code
- Default country: SN (+221)
- Auto-format as user types
- `glass-input` CSS class for input styling
- `LiquidButton` for submit

- [ ] **Step 2: Create OTP input component**

6-digit input with individual boxes. Auto-focus next box on input. Paste support. Timer for resend (60s countdown).

- [ ] **Step 3: Create auth page (phone input)**

Route: `/auth` — full-screen centered layout. Kivvi logo at top, "Ouvre ton Carnet" heading, phone input, submit button. On submit: POST `/api/auth/send-otp`, store `pinId` in state, redirect to `/auth/verify?phone=XXX`.

- [ ] **Step 4: Create OTP verify page**

Route: `/auth/verify` — shows phone number, OTP input, verify button. On submit: POST `/api/auth/verify-otp`. If `needsOnboarding` → redirect to `/auth/onboarding`. Else → redirect to `/app/sales`.

- [ ] **Step 5: Create onboarding wizard**

Route: `/auth/onboarding` — 3 steps:
1. "Comment tu t'appelles ?" → name input
2. "Ta boutique s'appelle comment ?" → shop_name input
3. "Qu'est-ce que tu vends ?" → grid of SHOP_TYPES with icons

On complete: POST profile to Supabase → redirect to `/app/sales`.

- [ ] **Step 6: Commit**

```bash
git add src/components/carnet/phone-input.tsx src/components/carnet/otp-input.tsx \
  src/components/carnet/onboarding-wizard.tsx src/app/auth/
git commit -m "feat(carnet): auth UI — phone input, OTP verification, onboarding wizard"
```

---

## Task 6: App Shell — Layout + Bottom Navigation + Settings

**Files:**
- Create: `src/app/app/layout.tsx`
- Create: `src/components/carnet/bottom-nav.tsx`
- Create: `src/app/app/settings/page.tsx`

- [ ] **Step 1: Create bottom navigation component**

4 tabs with icons (lucide-react):
- Ventes (`Receipt`) — `/app/sales` (default)
- Dettes (`Users`) — `/app/debts` (badge rouge: nombre de débiteurs)
- Produits (`Package`) — `/app/products`
- Tableau (`BarChart3`) — `/app/dashboard`

Plus settings gear icon in top-right header.

Design:
- Fixed bottom bar, white bg, subtle top border
- Active tab: primary color, bold label
- Inactive: muted-foreground
- Safe area padding bottom (mobile PWA)

- [ ] **Step 2: Create app layout**

```typescript
// src/app/app/layout.tsx
// - Light theme forced (ThemeProvider defaultTheme="light" for /app/*)
// - Header: shop name + settings gear
// - Bottom nav
// - Auth guard (middleware handles redirect, but layout loads profile)
```

Key:
- `<ThemeProvider defaultTheme="light">` wrapping app content (merchants in sunlight)
- Header shows `profile.shop_name` from `useAuth()`
- Body content between header and bottom nav with safe padding

- [ ] **Step 3: Create settings page**

Route: `/app/settings`
- Profile section (name, shop name, phone — read-only phone)
- Plan section (current plan badge, upgrade CTA — Phase 2)
- Language section (FR only for MVP)
- Danger zone: "Supprimer mon compte" (required for stores)
- Sign out button

- [ ] **Step 4: Commit**

```bash
git add src/app/app/layout.tsx src/components/carnet/bottom-nav.tsx src/app/app/settings/
git commit -m "feat(carnet): app shell — layout, bottom nav, settings page"
```

---

## Task 7: Dexie.js — Offline Database + Sync Engine

**Files:**
- Create: `src/lib/db/index.ts`
- Create: `src/lib/db/sync.ts`
- Create: `src/lib/db/hooks.ts`

- [ ] **Step 1: Create Dexie database definition**

```typescript
// src/lib/db/index.ts
import Dexie, { type Table } from 'dexie'

export interface LocalSale {
  id?: string           // server-assigned UUID (set during pull sync)
  local_id: string      // client-side UUID (primary key locally, dedup key on server)
  user_id: string
  product_id?: string
  client_id?: string
  amount: number
  cost_price: number
  quantity: number
  payment_method: 'cash' | 'wave' | 'credit'
  note?: string
  synced: boolean
  created_at: string
  updated_at: string
}

// Similar interfaces for LocalProduct, LocalClient, LocalDebt, LocalDebtPayment
// (mirror the server types but with local_id and synced flag)

export class CarnetDB extends Dexie {
  sales!: Table<LocalSale>
  products!: Table      // LocalProduct
  clients!: Table       // LocalClient
  debts!: Table         // LocalDebt
  debtPayments!: Table  // LocalDebtPayment

  constructor() {
    super('kivvi-carnet')
    this.version(1).stores({
      sales: 'local_id, user_id, synced, created_at, product_id, client_id',
      products: 'local_id, user_id, synced, updated_at, [user_id+deleted_at]',
      clients: 'local_id, user_id, synced, updated_at, [user_id+deleted_at]',
      debts: 'local_id, user_id, client_id, synced, status, updated_at',
      debtPayments: 'local_id, user_id, debt_id, synced, updated_at',
    })
  }
}

export const db = new CarnetDB()
```

- [ ] **Step 2: Create sync engine**

```typescript
// src/lib/db/sync.ts
// Sync protocol:
// 1. Pull: GET /api/sync/pull?since=<last_sync_at>&tables=sales,products,...
//    -> Upsert server records into local DB (by local_id or server id)
// 2. Push: POST /api/sync/push { sales: [...], products: [...], ... }
//    -> Server deduplicates by local_id, returns { synced_ids: [...] }
//    -> Mark local records as synced
//
// Sync-on-open: pull then push on app launch
// Periodic retry: every 30s if unsynced records exist
// Queue persists in IndexedDB (survives refresh)
```

Implement:
- `syncAll(userId: string)` — orchestrates full sync cycle
- `pushUnsynced(table: string)` — batch push unsynced records
- `pullChanges(since: string)` — pull and upsert
- `getSyncStatus()` — returns count of unsynced records per table
- Last sync timestamp stored in `localStorage`

- [ ] **Step 3: Create React hooks for data access**

```typescript
// src/lib/db/hooks.ts
// Hooks that read from local Dexie DB (offline-first)
// and trigger sync after mutations

// useSales(period: 'today' | 'week' | 'month') -> Sale[]
// useAddSale() -> (sale: Omit<LocalSale, 'id' | 'local_id' | 'synced'>) => Promise<void>
// useClients() -> Client[]
// useClientDebts(clientId: string) -> { debts: Debt[], totalDebt: number }
// useProducts() -> CarnetProduct[]
// useAddProduct() -> (product: ...) => Promise<void>
// useDashboardData(period: ...) -> DashboardData

// Pattern: useLiveQuery from dexie-react-hooks for reactive reads
// After mutation: set synced=false, trigger background sync
```

- [ ] **Step 4: Create sync API routes**

Create `src/app/api/sync/push/route.ts` and `src/app/api/sync/pull/route.ts`.

Push: receives batch of records per table, upserts into Supabase (dedup by `local_id`), returns synced IDs.

Pull: receives `since` timestamp, returns all records updated after that timestamp for the authenticated user.

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/ src/app/api/sync/
git commit -m "feat(carnet): offline-first Dexie DB + sync engine + API routes"
```

---

## Task 8: Sales Module — List + Add Sale

**Files:**
- Create: `src/app/app/sales/page.tsx`
- Create: `src/components/carnet/sale-form.tsx`
- Create: `src/components/carnet/sale-card.tsx`
- Create: `src/components/carnet/period-filter.tsx`

- [ ] **Step 1: Create period filter component**

3 buttons: Aujourd'hui / Semaine / Mois. Pill-shaped, active = primary bg.

- [ ] **Step 2: Create sale card component**

List item showing: amount (bold), product name (if any), payment method badge (cash=green, wave=blue, credit=orange), time. If credit: shows client name.

- [ ] **Step 3: Create sale form (bottom sheet)**

Triggered by FAB "+" button. Fields:
1. Amount input (large, numeric keyboard, auto-focus) — **REQUIRED, first thing**
2. Article: auto-suggest from products DB (optional, with quantity stepper)
3. Payment method: 3 toggle buttons (cash / wave / credit)
4. If credit selected: client picker (auto-suggest from clients DB, or "Nouveau client" inline add)
5. Note (optional text)
6. Submit button

On submit:
- Save to Dexie (synced=false, local_id=crypto.randomUUID())
- If product selected: decrement product.quantity locally
- If credit: create a debt record linked to this sale
- Trigger background sync
- Close form, show success toast

- [ ] **Step 4: Create sales page**

Route: `/app/sales`
- Header: "Ventes" + total du jour en grand
- Period filter (today/week/month)
- Sales list (from `useSales` hook, sorted by created_at DESC)
- FAB "+" button (bottom-right, above bottom nav) → opens sale form
- Empty state: "Aucune vente aujourd'hui. Appuie sur + pour commencer"

- [ ] **Step 5: Commit**

```bash
git add src/app/app/sales/ src/components/carnet/sale-form.tsx \
  src/components/carnet/sale-card.tsx src/components/carnet/period-filter.tsx
git commit -m "feat(carnet): sales module — list, add sale form, period filter"
```

---

## Task 9: Debts Module — Client Ledger + Payments

**Files:**
- Create: `src/app/app/debts/page.tsx`
- Create: `src/components/carnet/debt-client-card.tsx`
- Create: `src/components/carnet/debt-payment-form.tsx`

- [ ] **Step 1: Create client debt card**

Shows: client name, total owed (bold red), number of debts, oldest debt date. Tap to expand/navigate to detail view showing individual debts + payment history.

- [ ] **Step 2: Create debt payment form**

Bottom sheet triggered from client detail. Fields:
- Amount (pre-filled with total owed, editable for partial payment)
- Method: cash / wave
- Submit: creates DebtPayment, updates debt.paid_amount and debt.status

Logic for partial vs full payment:
- If payment >= remaining → status = 'paid'
- If payment < remaining → status = 'partial'
- Distribute payment across debts oldest-first (FIFO)

- [ ] **Step 3: Create debts page**

Route: `/app/debts`
- Header: "Dettes" + total owed across all clients
- List of clients with debts (sorted by total_debt DESC)
- Each client card is expandable (shows individual debts)
- "Marquer comme payé" and "Rappel WhatsApp" buttons per client
- WhatsApp reminder: Phase 2 — show button but with "Bientôt disponible" toast
- Badge count on tab = number of debtors with pending debts

- [ ] **Step 4: Commit**

```bash
git add src/app/app/debts/ src/components/carnet/debt-client-card.tsx \
  src/components/carnet/debt-payment-form.tsx
git commit -m "feat(carnet): debts module — client ledger, payment recording"
```

---

## Task 10: Products Module — Catalog CRUD

**Files:**
- Create: `src/app/app/products/page.tsx`
- Create: `src/components/carnet/product-form.tsx`
- Create: `src/components/carnet/product-card.tsx`

- [ ] **Step 1: Create product card**

Shows: name, sell price (bold), buy price (smaller), quantity badge. Orange badge when `quantity <= low_stock_threshold`. Category tag. Tap to edit.

- [ ] **Step 2: Create product form**

Bottom sheet for add/edit. Fields:
- Name (required)
- Prix de vente (required, numeric)
- Prix d'achat (optional, numeric, for profit calculation)
- Quantité en stock (numeric, default 0)
- Seuil d'alerte stock (numeric, default 5)
- Catégorie (dropdown, pre-populated from PRODUCT_CATEGORIES based on shop_type)
- Photo (optional — camera capture via `<input type="file" capture="environment">`, store as base64 locally, upload to Supabase Storage on sync)

- [ ] **Step 3: Create products page**

Route: `/app/products`
- Header: "Produits" + count
- Search bar (filter by name)
- Category filter pills (from shop-specific categories)
- Product grid/list
- FAB "+" → add product form
- Low stock section at top (orange bg, products below threshold)
- Swipe to soft-delete (set deleted_at)

- [ ] **Step 4: Commit**

```bash
git add src/app/app/products/ src/components/carnet/product-form.tsx \
  src/components/carnet/product-card.tsx
git commit -m "feat(carnet): products module — catalog CRUD with stock alerts"
```

---

## Task 11: Dashboard — Profit + Stats

**Files:**
- Create: `src/app/app/dashboard/page.tsx`
- Create: `src/components/carnet/stat-card.tsx`
- Create: `src/components/carnet/profit-chart.tsx`

- [ ] **Step 1: Create stat card component**

Reusable card with: icon, label, value (large), optional trend indicator. Uses glass card styling from existing design system.

- [ ] **Step 2: Create profit chart**

Simple bar chart for 7 last days. Pure CSS/SVG bars (no chart library for MVP — keep bundle small). Each bar shows: date label, amount, colored by profit (green) vs loss (red).

Alternative: use a minimal chart approach with `<div>` bars scaled by max value.

- [ ] **Step 3: Create dashboard page**

Route: `/app/dashboard`
- Period filter (today/week/month)
- Top section: 3 stat cards in row
  - Ventes totales (green)
  - Coûts (gray)
  - PROFIT (large, bold, primary color) = ventes - coûts
- 7-day chart section
- "Top 5 produits" list (by quantity sold)
- "Dettes totales" card (amount owed to you, with debtor count)
- All data computed from local Dexie DB via `useDashboardData` hook

- [ ] **Step 4: Commit**

```bash
git add src/app/app/dashboard/ src/components/carnet/stat-card.tsx \
  src/components/carnet/profit-chart.tsx
git commit -m "feat(carnet): dashboard — profit stats, 7-day chart, top products"
```

---

## Task 12: Payment Links — Public Page + Wave Integration

**Files:**
- Create: `src/app/pay/[id]/page.tsx`
- Create: `src/lib/services/wave.ts`
- Create: `src/app/api/webhooks/wave/route.ts`

- [ ] **Step 1: Create Wave service (server-side)**

```typescript
// src/lib/services/wave.ts
// Wave API integration for creating checkout sessions
// - createCheckout(amount, currency, description) -> { checkout_url, wave_checkout_id }
// - verifyWebhookSignature(body, signature) -> boolean

const WAVE_BASE = 'https://api.wave.com/v1'

export async function createWaveCheckout(params: {
  amount: number
  currency: string
  description: string
  success_url: string
  error_url: string
}): Promise<{ wave_launch_url: string; id: string }> {
  const res = await fetch(`${WAVE_BASE}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount.toString(),
      currency: params.currency,
      client_reference: params.description,
      success_url: params.success_url,
      error_url: params.error_url,
    }),
  })

  if (!res.ok) throw new Error('Wave checkout creation failed')
  return res.json()
}

export function verifyWaveWebhook(body: string, signature: string): boolean {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', process.env.WAVE_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
```

- [ ] **Step 2: Create public payment page**

Route: `/pay/[id]` — server component, no auth required.

```typescript
// src/app/pay/[id]/page.tsx
// Server component — fetches payment_link from Supabase (anon read OK via RLS)
// Displays:
// - Shop logo (or default Kivvi logo)
// - "Fatou, tu dois 7 500F à Boutique Awa"
// - Debt details list
// - [Payer via Wave] button → creates Wave checkout → redirects
// - "Propulsé par Kivvi" footer
// Rate limited: checked via headers (IP-based, 10 req/min)
```

Light theme, clean, mobile-optimized. No glass effects — simple white card.

- [ ] **Step 3: Create Wave webhook handler**

```typescript
// src/app/api/webhooks/wave/route.ts
// POST — receives Wave payment confirmation
// 1. Verify HMAC signature
// 2. Find payment_link by wave_checkout_id
// 3. If paid: update payment_link.status = 'paid', paid_at = NOW()
// 4. Find related debts via client_id, apply payment (FIFO oldest-first)
// 5. Calculate commission (2% default, or based on merchant plan)
// 6. Return 200 OK
```

- [ ] **Step 4: Commit**

```bash
git add src/app/pay/ src/lib/services/wave.ts src/app/api/webhooks/wave/
git commit -m "feat(carnet): payment links — public /pay/[id] page + Wave webhook"
```

---

## Task 13: PWA Configuration

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js` (service worker)
- Modify: `src/app/layout.tsx` (add manifest link + meta tags)

- [ ] **Step 1: Create PWA manifest**

```json
{
  "name": "Kivvi - Carnet Digital",
  "short_name": "Kivvi",
  "description": "Ton carnet de ventes et dettes digital",
  "start_url": "/app/sales",
  "display": "standalone",
  "theme_color": "#111111",
  "background_color": "#ffffff",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- [ ] **Step 2: Create service worker**

Strategies:
- App shell (HTML, CSS, JS, fonts): cache-first
- API calls: network-first with IndexedDB fallback (Dexie handles this)
- Images: cache-first, expire after 7 days
- Update prompt: `self.skipWaiting()` on user confirm

- [ ] **Step 3: Register service worker in root layout**

Add to `src/app/layout.tsx`:
- `<link rel="manifest" href="/manifest.json">`
- `<meta name="theme-color" content="#111111">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- Service worker registration script

- [ ] **Step 4: Create PWA icons**

Generate 192x192 and 512x512 icons from the Kivvi logo. Place in `public/icons/`.

- [ ] **Step 5: Commit**

```bash
git add public/manifest.json public/sw.js public/icons/ src/app/layout.tsx
git commit -m "feat(carnet): PWA — manifest, service worker, icons, meta tags"
```

---

## Task 14: Sentry Error Tracking

**Files:**
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Create: `sentry.edge.config.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Initialize Sentry**

```bash
cd /opt/kivvi && npx @sentry/wizard@latest -i nextjs
```

This auto-generates config files. Key settings:
- DSN from `.env.local`
- `tracesSampleRate: 0.1` (10% for performance)
- `replaysOnErrorSampleRate: 1.0`
- Custom context: attach user_id and phone for debugging sync issues

- [ ] **Step 2: Add sync error tracking**

In `src/lib/db/sync.ts`, wrap sync operations with `Sentry.captureException()` for failed syncs. Add breadcrumb for sync status (queue size, last sync time).

- [ ] **Step 3: Commit**

```bash
git add sentry.*.config.ts next.config.ts src/lib/db/sync.ts
git commit -m "feat(carnet): Sentry error tracking + sync monitoring"
```

---

## Task 15: Integration Testing + Polish

- [ ] **Step 1: Test full flow end-to-end**

Manual testing checklist:
1. Auth: phone → OTP → verify → onboarding → lands on /app/sales
2. Add a sale (cash) → appears in list → total updates
3. Add a sale (credit) → creates debt → appears in debts tab
4. Record payment on debt → debt status updates
5. Add product → appears in products tab → available in sale form
6. Dashboard shows correct totals
7. Offline: disable network → add sale → re-enable → sync triggers
8. /pay/[id] page loads correctly (test with manually created payment link)

- [ ] **Step 2: Fix any issues found during testing**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(carnet): integration fixes and polish"
```

---

## Dependency Graph

```
Task 1 (deps)
  └─> Task 2 (DB schema)
       └─> Task 3 (types)
            ├─> Task 4 (auth backend)
            │    └─> Task 5 (auth UI)
            │         └─> Task 6 (app shell)
            │              ├─> Task 8 (sales)
            │              ├─> Task 9 (debts)
            │              ├─> Task 10 (products)
            │              └─> Task 11 (dashboard)
            ├─> Task 7 (Dexie + sync) -- can start after Task 3
            ├─> Task 12 (payment links) -- can start after Task 3
            └─> Task 13 (PWA) -- independent
Task 14 (Sentry) -- independent, can run anytime
Task 15 (integration) -- after all others
```

**Parallelizable groups after Task 6:**
- Group A: Tasks 8 + 9 + 10 + 11 (all 4 tab screens)
- Group B: Task 7 (Dexie) — connects to Group A
- Group C: Task 12 (payment links) — independent
- Group D: Tasks 13 + 14 (PWA + Sentry) — independent
