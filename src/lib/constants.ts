// ─── Site Configuration ──────────────────────────────────────────────

export const SITE_CONFIG = {
  name: 'KIVVI',
  tagline: 'Agence Digitale Africaine',
  url: 'https://kivvi.tech',
  email: 'contact@kivvi.tech',
  whatsapp: '221778843598',
  phone: '+221 77 884 35 98',
  location: 'Kaolack, Sénégal',
  locationSecondary: 'Abidjan, Côte d\'Ivoire',
  rccm: 'SN.KLK.2025.A.5766',
  ninea: '012586650',
  founder: {
    name: 'Mbar Cheikh Philippe FAYE',
    role: 'Fondateur & Directeur',
    photo: 'https://res.cloudinary.com/dzi8whann/image/upload/v1773862954/tiak-tiak/icons/transport/xta5jfjaeh40n8j17osm.jpg',
  },
  logo: {
    light: '/logo/kivvi-logo-white.png',
    dark: '/logo/kivvi-logo-black.png',
  },
  social: {
    linkedin: '#',
    twitter: '#',
    instagram: '#',
    facebook: '#',
  },
} as const

// ─── Types ───────────────────────────────────────────────────────────

export type Service = {
  name: string
  description: string
  price: number | string
  icon: string
  features: string[]
}

export type Package = {
  name: string
  subtitle: string
  price: number | string
  priceNote?: string
  features: string[]
  delivery: string
  highlighted?: boolean
}

export type PortfolioProject = {
  name: string
  description: string
  url: string
  technologies: string[]
  category: string
  image: string
}

// ─── Services ────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    name: 'Site Vitrine',
    description: 'Un site professionnel pour présenter votre activité et attirer de nouveaux clients.',
    price: 350000,
    icon: 'Globe',
    features: [
      'Design responsive sur mesure',
      'Jusqu\'à 5 pages',
      'Formulaire de contact',
      'Optimisation SEO de base',
      'Hébergement 1 an inclus',
    ],
  },
  {
    name: 'Site Institutionnel',
    description: 'Une présence en ligne complète pour les organisations, institutions et grandes entreprises.',
    price: 750000,
    icon: 'Building2',
    features: [
      'Design premium multi-pages',
      'Espace actualités / blog',
      'Galerie médias',
      'Multi-langue',
      'Tableau de bord d\'administration',
    ],
  },
  {
    name: 'E-Commerce',
    description: 'Vendez vos produits en ligne avec une boutique performante et sécurisée.',
    price: 800000,
    icon: 'ShoppingCart',
    features: [
      'Catalogue produits illimité',
      'Paiement en ligne (Wave, Orange Money)',
      'Gestion des commandes',
      'Tableau de bord vendeur',
      'Notifications automatiques',
    ],
  },
  {
    name: 'Plateforme E-Learning',
    description: 'Créez et diffusez vos formations en ligne avec une plateforme complète.',
    price: 'Sur devis',
    icon: 'GraduationCap',
    features: [
      'Gestion des cours et modules',
      'Vidéos et contenus interactifs',
      'Suivi de progression',
      'Certificats automatiques',
      'Système de paiement intégré',
    ],
  },
  {
    name: 'Application Mobile',
    description: 'Application native iOS et Android pour toucher vos clients où qu\'ils soient.',
    price: 'Sur devis',
    icon: 'Smartphone',
    features: [
      'Design UI/UX personnalisé',
      'iOS et Android natif',
      'Notifications push',
      'Mode hors-ligne',
      'Publication sur les stores',
    ],
  },
  {
    name: 'Messagerie M365',
    description: 'Emails professionnels avec Microsoft 365 pour votre entreprise.',
    price: 60000,
    icon: 'Mail',
    features: [
      'Adresse email @votredomaine',
      'Microsoft Outlook, Word, Excel',
      '50 Go de stockage par utilisateur',
      'Sécurité avancée',
      'Support technique inclus',
    ],
  },
  {
    name: 'Domaine + Hébergement',
    description: 'Sécurisez votre nom de domaine et hébergez votre site sur des serveurs performants.',
    price: 50000,
    icon: 'Server',
    features: [
      'Nom de domaine .com / .sn / .ci',
      'Hébergement SSD haute performance',
      'Certificat SSL gratuit',
      'Sauvegardes automatiques',
      'Support technique 7j/7',
    ],
  },
  {
    name: 'Maintenance & Support',
    description: 'Gardez votre site à jour, sécurisé et performant avec notre support continu.',
    price: 35000,
    icon: 'Wrench',
    features: [
      'Mises à jour de sécurité',
      'Sauvegardes régulières',
      'Monitoring 24/7',
      'Corrections de bugs',
      'Support par email et WhatsApp',
    ],
  },
]

// ─── Packages ────────────────────────────────────────────────────────

export const PACKAGES: Package[] = [
  {
    name: 'Starter',
    subtitle: 'Lancement',
    price: 499000,
    features: [
      'Site vitrine jusqu\'à 5 pages',
      'Domaine .com inclus',
      'Hébergement 1 an',
      '3 adresses email professionnelles',
      '3 mois de maintenance gratuite',
    ],
    delivery: '2-3 semaines',
  },
  {
    name: 'Pro',
    subtitle: 'Croissance',
    price: 2200000,
    features: [
      'Site institutionnel ou e-commerce',
      'Domaine + hébergement pro 1 an',
      '10 emails M365 Standard',
      'Optimisation SEO avancée',
    ],
    delivery: '4-6 semaines',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'Excellence',
    price: 'Sur devis',
    priceNote: 'À partir de 5 000 000 CFA',
    features: [
      'Plateforme sur mesure',
      'Hébergement entreprise dédié',
      'M365 Business Premium',
      'Chef de projet dédié',
      'SLA garanti',
    ],
    delivery: '8-16 semaines',
  },
]

// ─── Portfolio ────────────────────────────────────────────────────────

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: '4Tree Afrique',
    description: 'Plateforme e-commerce et communautaire pour la reforestation en Afrique.',
    url: 'https://4treeafrique.com/',
    technologies: ['Astro', 'JavaScript', 'CSS'],
    category: 'E-Commerce',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774051272/kivvi/portfolio/4tree-afrique.jpg',
  },
  {
    name: 'Ecoinsight',
    description: 'Plateforme dédiée à l\'écoresponsabilité, aux initiatives durables et à la sensibilisation environnementale.',
    url: 'https://monenvironnement.com/',
    technologies: ['WordPress', 'Elementor'],
    category: 'Site Vitrine',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774051274/kivvi/portfolio/ecoinsight.jpg',
  },
  {
    name: 'Teranga Smile',
    description: 'Boutique en ligne de produits cosmétiques et soins dentaires naturels.',
    url: 'https://terangasmile.store/',
    technologies: ['Astro', 'JavaScript'],
    category: 'E-Commerce',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774051275/kivvi/portfolio/teranga-smile.jpg',
  },
  {
    name: 'Wamana',
    description: 'Cabinet pluridisciplinaire : accompagnement immobilier, coworking, domiciliation et projets de boulangerie.',
    url: 'https://wamana-alppe2xxmkivxvzl.builder-preview.com/',
    technologies: ['Astro', 'JavaScript', 'CSS'],
    category: 'Site Vitrine',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774126218/kivvi/portfolio/wamana.jpg',
  },
  {
    name: 'Consulat du Sénégal à Abidjan',
    description: 'Portail officiel du Consulat Général du Sénégal en Côte d\'Ivoire : services consulaires, passeports et actualités.',
    url: 'https://www.consulsenabidjan.com/',
    technologies: ['Bootstrap', 'JavaScript'],
    category: 'Site Institutionnel',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774126227/kivvi/portfolio/consulsen-abidjan.jpg',
  },
  {
    name: 'Chichastore',
    description: 'Boutique en ligne premium de chichas et accessoires au Sénégal.',
    url: 'https://chichastore-a1a5npdlbvtl3wke.builder-preview.com/',
    technologies: ['Astro', 'JavaScript'],
    category: 'E-Commerce',
    image: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774126234/kivvi/portfolio/chichastore.jpg',
  },
]

// ─── Logo Assets ────────────────────────────────────────────────────

export const LOGOS = {
  flatWhite: 'https://res.cloudinary.com/dzi8whann/image/upload/v1773860287/tiak-tiak/icons/transport/weu85knulc6qrlgectbt.png',
  flatBlack: 'https://res.cloudinary.com/dzi8whann/image/upload/v1773860292/tiak-tiak/icons/transport/f9x09jm7erlmiosyqsnr.png',
  flatBlackHorizontal: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774056753/kivvi/logos/kivvi-logo-black-horizontal.png',
  glass3D: 'https://res.cloudinary.com/dzi8whann/image/upload/v1773864166/tiak-tiak/icons/transport/daktlszjwuqzqlebfklm.png',
} as const

// ─── Freepik Illustrations (Cloudinary) ────────────────────────────

export const ILLUSTRATIONS = {
  hero: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774050068/kivvi/images/hero-abstract-tech.jpg',
  services: {
    web: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054725/kivvi/images/v2/svc-web-dev-v2.jpg',
    ecommerce: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054729/kivvi/images/v2/svc-ecommerce-v2.jpg',
    mobile: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054746/kivvi/images/v2/svc-mobile-app-v2.jpg',
    elearning: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054749/kivvi/images/v2/svc-elearning-v2.jpg',
    hosting: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054756/kivvi/images/v2/svc-hosting-v2.jpg',
    email: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774054752/kivvi/images/v2/svc-email-v2.jpg',
    institutional: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774055117/kivvi/images/v2/svc-institutional-v2.jpg',
    maintenance: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774055127/kivvi/images/v2/svc-maintenance-v2.jpg',
  },
  whyKivvi: {
    globe: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774050309/kivvi/images/why-globe-network.jpg',
    quality: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774050312/kivvi/images/why-quality-certification.jpg',
    partnership: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774050315/kivvi/images/why-business-partnership.jpg',
  },
  about: {
    team: 'https://res.cloudinary.com/dzi8whann/image/upload/v1774050338/kivvi/images/about-african-team.jpg',
  },
} as const

// ─── Navigation ─────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
] as const

// ─── Testimonials ───────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    name: 'Amadou Diallo',
    role: 'Directeur Général',
    company: '4Tree Afrique',
    content: 'KIVVI a transformé notre vision en une plateforme digitale élégante et fonctionnelle. Le professionnalisme et la réactivité de l\'équipe ont dépassé nos attentes.',
    rating: 5,
  },
  {
    name: 'Fatou Sow',
    role: 'Fondatrice',
    company: 'Teranga Smile',
    content: 'Notre boutique en ligne a été livrée dans les délais avec une qualité irréprochable. Les ventes ont augmenté de 200% dès le premier mois.',
    rating: 5,
  },
  {
    name: 'Ibrahim Ndiaye',
    role: 'Responsable Communication',
    company: 'Ecoinsight',
    content: 'Un accompagnement de qualité du début à la fin. Le site reflète parfaitement notre mission environnementale avec un design moderne et impactant.',
    rating: 5,
  },
  {
    name: 'Marie Faye',
    role: 'Directrice Administrative',
    company: 'Groupe Sahel',
    content: 'La migration vers Microsoft 365 s\'est faite sans interruption de service. L\'équipe KIVVI maîtrise parfaitement les outils professionnels.',
    rating: 4,
  },
] as const

// ─── FAQ ────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    question: 'Quels sont vos délais de livraison ?',
    answer: 'Les délais varient selon le projet : 2-3 semaines pour un site vitrine, 4-6 semaines pour un site institutionnel ou e-commerce, et 8-16 semaines pour les plateformes sur mesure. Nous établissons un calendrier précis dès la validation du devis.',
  },
  {
    question: 'Proposez-vous un accompagnement après la livraison ?',
    answer: 'Oui, tous nos projets incluent une période de maintenance gratuite (1 à 3 mois selon le forfait). Ensuite, nous proposons des contrats de maintenance mensuels à partir de 35 000 CFA/mois.',
  },
  {
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons les virements bancaires, Wave, Orange Money et le paiement en espèces. Le paiement se fait généralement en 3 étapes : 40% à la commande, 30% à la maquette validée, 30% à la livraison.',
  },
  {
    question: 'Travaillez-vous avec des clients hors du Sénégal ?',
    answer: 'Absolument ! Nous travaillons avec des clients dans toute l\'Afrique de l\'Ouest et au-delà. Nos équipes sont basées à Kaolack (Sénégal) et Abidjan (Côte d\'Ivoire), et nous collaborons à distance avec des outils professionnels.',
  },
  {
    question: 'Comment se déroule un projet avec KIVVI ?',
    answer: '1) Échange initial et devis gratuit, 2) Validation du cahier des charges, 3) Création des maquettes, 4) Développement et tests, 5) Livraison et formation, 6) Maintenance et support continu.',
  },
  {
    question: 'Est-ce que le nom de domaine et l\'hébergement sont inclus ?',
    answer: 'Oui, nos forfaits Starter et Pro incluent le nom de domaine et l\'hébergement pour la première année. Le renouvellement annuel est à partir de 50 000 CFA.',
  },
] as const

// ─── Devis Types ────────────────────────────────────────────────────

export const DEVIS_TYPES = [
  { value: 'site-vitrine', label: 'Site Vitrine', description: 'Présentez votre activité en ligne' },
  { value: 'site-institutionnel', label: 'Site Institutionnel', description: 'Présence complète pour organisations' },
  { value: 'e-commerce', label: 'E-Commerce', description: 'Vendez vos produits en ligne' },
  { value: 'e-learning', label: 'Plateforme E-Learning', description: 'Formations en ligne' },
  { value: 'application-mobile', label: 'Application Mobile', description: 'iOS et Android' },
  { value: 'messagerie-m365', label: 'Messagerie M365', description: 'Emails professionnels' },
  { value: 'autre', label: 'Autre projet', description: 'Décrivez votre besoin' },
] as const

// ─── Budget Ranges ──────────────────────────────────────────────────

export const BUDGET_RANGES = [
  { value: 'moins-300k', label: 'Moins de 300 000 CFA' },
  { value: '300k-500k', label: '300 000 - 500 000 CFA' },
  { value: '500k-1m', label: '500 000 - 1 000 000 CFA' },
  { value: '1m-3m', label: '1 000 000 - 3 000 000 CFA' },
  { value: '3m-5m', label: '3 000 000 - 5 000 000 CFA' },
  { value: 'plus-5m', label: 'Plus de 5 000 000 CFA' },
] as const

// ─── Stats ──────────────────────────────────────────────────────────

export const STATS = [
  { label: 'Projets livrés', value: 25, suffix: '+' },
  { label: 'Clients satisfaits', value: 20, suffix: '+' },
  { label: 'Pays couverts', value: 3, suffix: '' },
  { label: 'Années d\'expérience', value: 4, suffix: '+' },
] as const

// ─── Why KIVVI ──────────────────────────────────────────────────────

export const WHY_KIVVI = [
  {
    title: 'Expertise Africaine',
    description: 'Nous comprenons les réalités du marché africain : paiement mobile, connectivité variable, habitudes locales. Nos solutions sont conçues pour performer ici.',
    icon: 'Globe2',
  },
  {
    title: 'Qualité Premium',
    description: 'Design soigné, code propre, performance optimale. Nous appliquons les standards internationaux pour livrer des produits dont vous serez fiers.',
    icon: 'Award',
  },
  {
    title: 'Accompagnement Total',
    description: 'Du conseil initial à la maintenance continue, nous vous accompagnons à chaque étape. Votre succès digital est notre priorité.',
    icon: 'Handshake',
  },
] as const
