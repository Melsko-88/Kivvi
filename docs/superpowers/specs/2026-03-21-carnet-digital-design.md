# Kivvi — Le Carnet Digital de l'Afrique

> Spec validee le 21 Mars 2026. Remplace le plan SaaS multi-outils precedent.

## Vision

Kivvi est le remplacement numerique du cahier papier que 50M+ de commercants africains utilisent chaque jour pour tracker leurs ventes et dettes clients. Modele inspire de Khatabook (Inde, $600M, 10M+ utilisateurs) adapte pour l'Afrique francophone puis tout le continent.

## Probleme

Chaque commercant en Afrique :
- Ne sait pas combien il a gagne aujourd'hui (profit invisible)
- Perd de l'argent sur les ventes a credit (30-50% des transactions) mal trackees dans un cahier papier
- Ne peut pas relancer ses debiteurs sans gene sociale
- N'a aucune visibilite sur son stock
- Ne peut pas prouver son chiffre d'affaires (pas d'acces au credit bancaire)

## Concurrence

| Acteur | Zone | Statut |
|--------|------|--------|
| Khatabook | Inde | $600M, 10M+ users — PREUVE du modele |
| OkCredit | Inde | $250M — meme modele |
| Konnash | Maroc | 200K+ users — FR/AR, Maroc uniquement |
| OZE | Ghana | $3M leve — anglophone, faible penetration |
| Moniepoint/Moniebook | Nigeria | POS+bookkeeping — anglophone, Nigeria only |

**En Afrique subsaharienne francophone : PERSONNE ne domine ce creneau.**

## Solution

Une PWA (Progressive Web App) a kivvi.tech ou le commercant enregistre ses ventes, tracke les dettes clients, envoie des rappels WhatsApp automatiques, et voit son profit quotidien.

### Principes fondateurs

1. **3 taps max** pour enregistrer une vente
2. **Offline-first** — fonctionne sans internet, sync quand le reseau revient
3. **Gratuit** — zero barriere a l'entree
4. **WhatsApp-natif** — tout se partage et se notifie via WhatsApp
5. **Pan-africain** — multi-langue, multi-devise, multi-paiement des le jour 1

## Stack Technique

| Couche | Techno | Raison |
|--------|--------|--------|
| Frontend | Next.js 16 (existant) + PWA manifest + Service Worker | Deja en place sur kivvi.tech |
| Offline | IndexedDB via Dexie.js + sync-on-open + periodic retry | Fiabilite reseau africain |
| Backend | Supabase Pro ($25/mois) — auth + PostgreSQL + realtime + storage | Deja configure, free tier trop limite |
| Auth | Termii OTP -> Supabase session server-side | Les marchands n'ont pas d'email |
| WhatsApp | Termii API (templates pre-approuves Meta) | Deja integre dans Nopal |
| Paiements | Wave API (phase 1), PayDunya/Orange Money (phase 2) | Wave dominant en Afrique de l'Ouest |
| i18n | next-intl (locale en cookie, pas dans l'URL) | Multi-langue des le depart |
| Monitoring | Sentry (free tier) | Erreurs sync critiques a detecter |
| Hosting | Vercel | Deja configure pour kivvi.tech |
| Natif (futur) | Capacitor | Wrapper PWA -> iOS + Android sans reecriture |

### Architecture Offline — Protocole de Sync

```
[Marchand utilise l'app]
    |
    v
[IndexedDB (Dexie.js)] -- stockage local de toutes les ventes/dettes
    |
    v (quand internet disponible)
[Sync-on-open] --> Pull server changes (WHERE updated_at > last_sync_at)
    |                puis Push local unsynced records
    v
[Supabase PostgreSQL] -- source of truth
    |
    v (quand app en foreground)
[Supabase Realtime] --> Live updates (multi-appareils)
```

**Strategie de sync par type de donnee :**

| Type | Strategie | Raison |
|------|-----------|--------|
| sales, debts, debt_payments | **Append-only** — push vers serveur, dedup par `local_id` | Jamais editees apres creation, pas de conflit possible |
| products, clients, profiles | **Last-write-wins** (par `updated_at`) | Mutables mais rarement edites en parallele |

**Regles sync :**
- Sync-on-open : pull puis push a chaque ouverture de l'app
- Periodic retry : toutes les 30s si des records non-synces existent
- Pas de Background Sync API (non supporte sur Safari/iOS) — fallback sync-on-open
- Chaque entite offline a : `synced: boolean`, `local_id: TEXT` (UUID client), `updated_at: TIMESTAMPTZ`
- Queue de sync persistante dans IndexedDB (survit au refresh)
- Monitoring : Sentry alerte si queue > 100 records non-synces

### Auth Flow Detail

```
1. Marchand entre son numero de telephone
2. API Route POST /api/auth/send-otp
   -> Termii envoie OTP WhatsApp (fallback SMS)
   -> Stocke OTP hash + expiry en Supabase (table otp_codes)
3. Marchand entre le code OTP
4. API Route POST /api/auth/verify-otp
   -> Verifie OTP hash
   -> Si nouvel utilisateur : supabase.auth.admin.createUser({ phone })
   -> Si existant : supabase.auth.admin.generateLink({ type: 'magiclink' })
   -> Retourne session Supabase (access_token + refresh_token)
5. Client stocke la session, refresh auto via Supabase SDK
```

## Auth & Onboarding

```
Ecran 1 : Numero de telephone (+indicatif auto-detecte par IP/locale)
    -> OTP WhatsApp (Termii), fallback SMS
Ecran 2 : Prenom + Nom de ta boutique
Ecran 3 : Qu'est-ce que tu vends ? (Boutique / Restaurant / Salon / Atelier / Autre)
    -> Pre-configure les categories de produits
TERMINE — dans le carnet en < 60 secondes
```

- Pas de mot de passe. OTP a chaque nouvelle connexion.
- Session longue : 90 jours (JWT refresh via Supabase)
- Profil completable plus tard (adresse, logo, Wave number)
- Multi-pays jour 1 : +221 (SN), +225 (CI), +223 (ML), +237 (CM), +243 (RDC), +234 (NG), +233 (GH)
- Suppression de compte dans les parametres (requis App Store / Play Store)

## Interface — 4 Onglets

### Onglet 1 : Ventes (ecran principal)

Bouton "+" flottant -> enregistre une vente :

```
[+] -> Montant : 2 500F
    -> Article : Savon x3 (optionnel, auto-suggest depuis produits, quantite)
    -> Paiement : Cash | Wave | Credit

    Si "Credit" :
        -> Client : Fatou Diallo (auto-suggest ou nouveau)
        -> Enregistre. Fatou doit maintenant 2 500F.
        -> [Envoyer rappel WhatsApp ?]

    Done — stock de Savon : 47 -> 44 (x3)
```

Vue : liste des ventes du jour, total en haut, filtre par jour/semaine/mois.

### Onglet 2 : Dettes

- Liste de clients avec solde du (trie par montant decroissant)
- Tap sur un client -> historique des dettes + paiements
- Bouton "Rappel WhatsApp" par client
- Bouton "Marquer comme paye" (total ou partiel)
- Badge rouge avec nombre de debiteurs sur l'onglet

### Onglet 3 : Produits

- Liste simple : nom, prix d'achat, prix de vente, quantite
- Ajout rapide (nom + prix, c'est tout)
- Badge orange quand stock < seuil d'alerte
- Photo optionnelle (camera du telephone)
- Categories par type de commerce (pre-configurees a l'onboarding)

### Onglet 4 : Tableau de bord

- **Chiffre du jour** : ventes totales, couts, PROFIT (en gros, bien visible)
- **Graphique** : 7 derniers jours (barres simples)
- **Top produits** : les 5 plus vendus
- **Dettes totales** : combien on te doit au total
- **Filtre** : aujourd'hui / cette semaine / ce mois

## Rappels WhatsApp — Killer Feature

### Template Meta (a faire approuver)

Template `kivvi_debt_reminder` (UTILITY, fr) :

```
Bonjour {{1}}, ceci est un rappel de {{2}}.
Tu as un solde de {{3}} (depuis le {{4}}).
Paye facilement ici : {{5}}
Merci !
```

Params : client_name, shop_name, amount, date, payment_link

### Flow

1. Marchand appuie sur "Rappel" a cote du nom du client
2. Kivvi envoie le WhatsApp via Termii (template pre-approuve)
3. Le lien kivvi.tech/pay/[id] ouvre une page de paiement Wave
4. Quand le client paie -> webhook Wave -> dette mise a jour automatiquement
5. Notification au marchand : "Fatou a paye 5 000F !"

### Regles

- Plan gratuit : 3 rappels/jour (reduit de 5 pour controler les couts)
- Plan pro : illimite + auto-rappels programmables (tous les 7 jours)
- Rate limit : max 1 rappel par client par 24h (anti-spam)
- Le marchand peut personnaliser le message (dans les limites du template)
- Un seul message par client regroupant TOUTES ses dettes (pas un par dette)

### Couts messaging

```
Hypothese M6 : 5 000 marchands, 50% utilisent rappels, 2 rappels/jour en moyenne
= 5 000 messages/jour x 4 FCFA (WhatsApp template via Termii)
= 20 000 FCFA/jour = 600 000 FCFA/mois (~915 EUR)
```

Le plan Pro a 3 000F/mois couvre largement le cout messaging par marchand Pro.
Les 3 rappels gratuits/jour = cout d'acquisition client (marketing).

## Page de paiement publique

`kivvi.tech/pay/[id]` — page publique (pas besoin de compte) :

```
+---------------------------+
|  Logo Boutique Awa        |
|                           |
|  Fatou, tu dois 7 500F    |
|  a Boutique Awa           |
|                           |
|  Detail :                 |
|  - 15 mars : Savon 2500F  |
|  - 18 mars : Riz 5000F    |
|                           |
|  [Payer 7 500F via Wave]  |
|                           |
|  Propulse par Kivvi       |
+---------------------------+
```

- `id` = token cryptographique 22 caracteres (16 bytes base62, non-devinable)
- Expiration par defaut : 7 jours
- Rate limiting : 10 requetes/minute par IP sur /pay/[id]
- Bouton Wave -> checkout Wave API -> webhook -> dette soldee

### Commission breakdown

```
Client paie 7 500F via Wave :
- Wave preleve ~1% = 75F (paye par le client, transparent)
- Kivvi preleve 2% = 150F (sur le montant recu)
- Marchand recoit : 7 275F
- Affiche clairement au marchand : "Commission Kivvi : 150F"
```

## Base de donnees (Supabase PostgreSQL)

```sql
-- Table OTP (auth custom via Termii)
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL, -- bcrypt hash
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_otp_phone ON otp_codes(phone, expires_at DESC);

-- Utilisateurs (extend Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  shop_type TEXT NOT NULL, -- boutique, restaurant, salon, atelier, autre
  country TEXT NOT NULL DEFAULT 'SN',
  language TEXT NOT NULL DEFAULT 'fr',
  currency TEXT NOT NULL DEFAULT 'XOF',
  plan TEXT NOT NULL DEFAULT 'free', -- free, pro, business
  wave_phone TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produits / catalogue
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  buy_price DECIMAL(12,2) DEFAULT 0,
  sell_price DECIMAL(12,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category TEXT,
  image_url TEXT,
  synced BOOLEAN DEFAULT FALSE,
  local_id TEXT UNIQUE,
  deleted_at TIMESTAMPTZ, -- soft delete
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (carnet de contacts)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  last_reminder_at TIMESTAMPTZ,
  synced BOOLEAN DEFAULT FALSE,
  local_id TEXT UNIQUE,
  deleted_at TIMESTAMPTZ, -- soft delete
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Note: total_debt toujours calcule a la volee via SUM(debts) - pas de cache
-- pour eviter les problemes de coherence offline/multi-appareils

-- Ventes
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  cost_price DECIMAL(12,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  payment_method TEXT NOT NULL, -- cash, wave, credit
  note TEXT,
  synced BOOLEAN DEFAULT FALSE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dettes (une par vente a credit)
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, partial, paid
  due_date DATE,
  synced BOOLEAN DEFAULT FALSE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paiements de dettes (quand un client rembourse)
CREATE TABLE debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  debt_id UUID REFERENCES debts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL, -- cash, wave
  wave_checkout_id TEXT,
  synced BOOLEAN DEFAULT FALSE,
  local_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rappels WhatsApp
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  total_amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  sent_via TEXT DEFAULT 'whatsapp', -- whatsapp, sms
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed
  payment_link_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liens de paiement publics
CREATE TABLE payment_links (
  id TEXT PRIMARY KEY, -- 22 chars crypto random (16 bytes base62)
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, paid, expired
  wave_checkout_id TEXT,
  commission_rate DECIMAL(4,3) DEFAULT 0.02,
  commission_amount DECIMAL(12,2) DEFAULT 0,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_debts_updated_at BEFORE UPDATE ON debts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_debt_payments_updated_at BEFORE UPDATE ON debt_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index
CREATE INDEX idx_sales_user_date ON sales(user_id, created_at DESC);
CREATE INDEX idx_sales_synced ON sales(synced) WHERE synced = FALSE;
CREATE INDEX idx_debts_client ON debts(client_id, status);
CREATE INDEX idx_debts_user ON debts(user_id, status);
CREATE INDEX idx_debt_payments_user ON debt_payments(user_id);
CREATE INDEX idx_debt_payments_debt ON debt_payments(debt_id);
CREATE INDEX idx_products_user ON products(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_clients_user ON clients(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_payment_links_status ON payment_links(status);
CREATE INDEX idx_sync_products ON products(synced) WHERE synced = FALSE;
CREATE INDEX idx_sync_clients ON clients(synced) WHERE synced = FALSE;
CREATE INDEX idx_sync_debts ON debts(synced) WHERE synced = FALSE;
CREATE INDEX idx_sync_debt_payments ON debt_payments(synced) WHERE synced = FALSE;
```

### Row Level Security

- Chaque table : `user_id = auth.uid()` pour SELECT/INSERT/UPDATE/DELETE
- `payment_links` : SELECT public (pas besoin de compte pour payer), rate limited
- `otp_codes` : service role uniquement (jamais expose au client)
- Service role pour webhooks Wave et envoi WhatsApp

## Internationalisation

### Jour 1 (lancement)

- **Francais** : langue par defaut
- **Devises** : XOF (Senegal, CI, Mali, Burkina, Togo, Benin, Niger), XAF (Cameroun, Congo, Gabon, Tchad)

### Phase 2

- **Wolof** (Senegal), **Anglais** (Nigeria, Ghana, Kenya)
- **Devises** : NGN, GHS, KES

### Phase 3

- **Bambara** (Mali), **Arabe** (Mauritanie, Tchad)
- Autres langues selon adoption

### Implementation

- `next-intl` avec fichiers JSON par locale
- Locale stockee dans le profil utilisateur + cookie (pas dans l'URL)
- Detection auto de la langue via locale du navigateur au premier acces
- Changement de langue dans les parametres
- Les messages WhatsApp sont dans la langue du marchand

## Business Model

| | Gratuit | Pro (3 000F/mois) | Business (10 000F/mois) |
|--|---------|-------------------|-------------------------|
| Ventes/mois | Illimitees | Illimitees | Illimitees |
| Produits | 50 | Illimites | Illimites |
| Rappels WhatsApp | 3/jour | Illimites + auto | Illimites + auto |
| Commission paiement | 2% | 1% | 0.5% |
| Employes | 1 | 3 | 10 |
| Export PDF/Excel | Non | Oui | Oui |
| Branding Kivvi | Oui | Non | Non |
| Stock avance | Basique | Alertes + historique | + fournisseurs |
| Analytics | Jour/semaine/mois | + tendances, comparaisons | + API |

### Projection de revenus

**Scenario conservateur** : 5 000 marchands actifs apres 12 mois

```
Commissions : 5 000 marchands x 30 000F paiements/mois x 2% = 3M FCFA/mois
Abonnements : 5% conversion pro x 5 000 = 250 x 3 000F = 750K FCFA/mois
Total conservateur : ~3.75M FCFA/mois (~5 700 EUR/mois)
```

**Scenario optimiste** : 20 000 marchands actifs apres 12 mois

```
Commissions : 20 000 x 50 000F x 2% = 20M FCFA/mois
Abonnements : 5% x 20 000 = 1 000 x 3 000F = 3M FCFA/mois
Total optimiste : ~23M FCFA/mois (~35 000 EUR/mois)
```

### Couts infrastructure (M12)

```
Supabase Pro : $25/mois = 16 000 FCFA
Vercel Pro : $20/mois = 13 000 FCFA
Termii (WhatsApp) : ~600 000 FCFA/mois (scenario conservateur)
Sentry : gratuit (free tier)
Domaine : ~10 000 FCFA/an
Total : ~640 000 FCFA/mois (~975 EUR/mois)
```

## Phases d'implementation

### Phase 1 — MVP (4-6 semaines)

1. Auth phone OTP (Termii + Supabase session)
2. Onboarding 3 ecrans
3. PWA manifest + service worker + offline (IndexedDB/Dexie.js + sync)
4. Enregistrement de ventes (cash/Wave/credit) avec quantite
5. Carnet de dettes + paiements manuels (cash)
6. Tableau de bord basique (profit jour/semaine/mois)
7. Page de paiement publique (kivvi.tech/pay/[id])
8. Webhook Wave pour confirmer paiements
9. Sentry error tracking

### Phase 2 — WhatsApp + Growth (2-3 semaines)

10. Template Meta `kivvi_debt_reminder` (approbation)
11. Rappels WhatsApp via Termii
12. Auto-rappels programmables (pro)
13. Catalogue produits + gestion stock basique
14. i18n (Wolof + Anglais)
15. Plan Pro + systeme d'abonnement

### Phase 3 — Scale (2-3 semaines)

16. Multi-employes (vendeurs sur le meme compte)
17. Export PDF/Excel
18. Orange Money via PayDunya
19. Capacitor wrapper (iOS + Android stores)
20. Analytics avances
21. Suppression de compte (requis stores)

### Phase 4 — Fintech (futur)

22. Credit scoring depuis donnees de transactions
23. Partenariats microfinance/banques
24. B2B commandes fournisseurs

## Routes Next.js

```
/ .......................... Landing page (presentation Kivvi Carnet)
/auth ...................... Login phone OTP
/auth/verify ............... Verification OTP
/auth/onboarding ........... Onboarding 3 etapes

/app ....................... Layout app (4 onglets, theme light par defaut)
/app/sales ................. Onglet Ventes (defaut)
/app/debts ................. Onglet Dettes
/app/products .............. Onglet Produits
/app/dashboard ............. Onglet Tableau de bord
/app/settings .............. Parametres (profil, plan, langue, supprimer compte)

/pay/[id] .................. Page de paiement publique (rate limited)

/api/auth/send-otp ......... Envoi OTP via Termii
/api/auth/verify-otp ....... Verification OTP + session Supabase
/api/webhooks/wave ......... Webhook Wave (paiements)
/api/reminders/send ........ Envoi rappels WhatsApp (cron Vercel)
/api/sync/push ............. Push records offline -> server (batch)
/api/sync/pull ............. Pull changes since last_sync_at

# Routes existantes inchangees
/services, /tarifs, /portfolio, /a-propos, /contact, /devis, /cgv, /confidentialite
/admin/* ................... Admin agence (inchange)
```

## PWA Configuration

### Service Worker

- **App shell** : cache-first (HTML, CSS, JS, fonts)
- **API calls** : network-first avec fallback IndexedDB
- **Images** : cache-first avec expiration 7 jours
- **Update** : prompt utilisateur "Nouvelle version disponible, mettre a jour ?"

### Manifest

```json
{
  "name": "Kivvi - Carnet Digital",
  "short_name": "Kivvi",
  "start_url": "/app/sales",
  "display": "standalone",
  "theme_color": "#1a1a1a",
  "background_color": "#ffffff",
  "icons": [{ "src": "/icons/icon-192.png" }, { "src": "/icons/icon-512.png" }]
}
```

## Conformite Legale

- **Senegal** : Loi n 2008-12 protection donnees personnelles — enregistrement CDP requis
- **Cote d'Ivoire** : Loi relative a la protection des donnees a caractere personnel
- **ECOWAS** : Supplementary Act on data protection
- **Requis** : page confidentialite en francais, consentement au signup, export/suppression donnees
- **App Stores** : flow de suppression de compte obligatoire (Settings)

## Coexistence avec le site vitrine

Le site vitrine actuel (kivvi.tech) reste intact :
- Les routes publiques existantes (/services, /tarifs, /portfolio, etc.) ne changent pas
- L'admin existant (/admin/*) reste pour la gestion de l'agence
- Le Carnet Digital vit dans /app/* (nouvelle section, theme light par defaut)
- La landing page / est mise a jour pour presenter le Carnet Digital comme produit principal
- Un CTA "Ouvre ton Carnet gratuit" remplace ou s'ajoute au hero actuel

## Metriques de succes

| Metrique | Objectif M1 | Objectif M6 | Objectif M12 |
|----------|-------------|-------------|--------------|
| Inscriptions | 500 | 5 000 | 20 000 |
| Marchands actifs/jour | 100 | 1 500 | 8 000 |
| Ventes enregistrees/jour | 2 000 | 30 000 | 150 000 |
| Paiements via liens | 50/mois | 1 000/mois | 10 000/mois |
| Revenue | ~0 | 3M FCFA/mois | 15M FCFA/mois |
| Pays actifs | 1 (SN) | 3 (SN, CI, ML) | 6+ |
