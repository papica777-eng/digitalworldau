export interface BudgetTier {
  id: number;
  labelEur: string;
  minEurCents: number;
  maxEurCents: number;
}

export const BUDGET_TIERS: BudgetTier[] = [
  { id: 1, labelEur: '€300 – €600', minEurCents: 30_303, maxEurCents: 60_000 },
  { id: 2, labelEur: '€600 – €1,500', minEurCents: 60_000, maxEurCents: 150_000 },
  { id: 3, labelEur: '€1,500 – €5,000', minEurCents: 150_000, maxEurCents: 500_000 },
  { id: 4, labelEur: '€5,000 – €10,000', minEurCents: 500_000, maxEurCents: 1_000_000 },
  { id: 5, labelEur: '€10,000 – €25,000+', minEurCents: 1_000_000, maxEurCents: 2_500_000 },
];

export const MEGA_MENU = {
  design: [
    { label: 'UI/UX Product Design', desc: 'Conversion-focused user journeys & interactive prototypes', href: '/#contact', preset: 'UI/UX & Web Design' },
    { label: 'Bespoke Web Design', desc: 'High-contrast dark & editorial brand experiences', href: '/#contact', preset: 'UI/UX & Web Design' },
    { label: 'Brand Identity Systems', desc: 'Logo marks, motion guidelines & visual systems', href: '/#contact', preset: 'UI/UX & Web Design' },
  ],
  development: [
    { label: 'Custom Websites', desc: 'Fast-loading business websites built to convert', href: '/#contact', preset: 'Custom Development' },
    { label: 'E-Commerce Flagships', desc: 'High-volume D2C stores engineered for mobile speed', href: '/#contact', preset: 'E-Commerce Store' },
    { label: 'Maintenance & Security SLA', desc: '24/7 uptime monitoring, backups & hardening', href: '/#contact', preset: 'Custom Development' },
  ],
  marketing: [
    { label: 'Technical & Local SEO', desc: 'Higher Google rankings, local visibility & steady leads', href: '/#contact', preset: 'SEO & Paid Growth' },
    { label: 'Paid Search & Google Ads CRO', desc: 'High-converting landing pages & ROI tracking', href: '/#contact', preset: 'SEO & Paid Growth' },
    { label: 'Email & Lifecycle Flows', desc: 'Automated retention, VIP tiers & cart recovery', href: '/#contact', preset: 'SEO & Paid Growth' },
  ],
};

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Online Store' | 'Corporate Website' | 'Web App';
  metric: string;
  region: string;
  image: string;
  video?: string;
  stack: string[];
  summary: string;
  liveUrl?: string;
  liveDomain?: string;
  isConcept?: boolean;
  pdfUrl?: string;
  isDocument?: boolean;
}

export interface AnchialoShowcaseSlide {
  id: string;
  title: string;
  badge: string;
  image: string;
  video?: string;
  isDocument?: boolean;
  pdfUrl?: string;
  pdfLabel?: string;
}

export const ANCHIALO_SHOWCASE_SLIDES: AnchialoShowcaseSlide[] = [
  {
    id: 'tour-anchialo-store',
    title: '01 • Full Storefront & Botanical Formulations',
    badge: 'LIVE SITE TOUR',
    image: '/media/showcase/poster-anchialo-store.webp',
    video: '/videos/tour-anchialo-store.mp4',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Product_Guide_AU.pdf',
    pdfLabel: 'Product Guide PDF',
  },
  {
    id: 'tour-anchialo-carousel',
    title: '02 • Combat Recovery Carousel & Lab Certificates',
    badge: 'LAB & BROCHURE TOUR',
    image: '/media/showcase/poster-anchialo-carousel.webp',
    video: '/videos/tour-anchialo-carousel.mp4',
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    pdfLabel: 'Quality Certificate PDF',
  },
  {
    id: 'tour-anchialo-salterns',
    title: '03 • Bulgaria’s Crimson Salterns & Balneology Journal',
    badge: 'ORIGIN & EDITORIAL',
    image: '/media/showcase/poster-anchialo-salterns.webp',
    video: '/videos/tour-anchialo-salterns.mp4',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Partner_Wholesale_Guide_AU.pdf',
    pdfLabel: 'Wholesale Guide PDF',
  },
  {
    id: 'tour-anchialo-hero',
    title: '04 • Red Salt Lakes Hero & AI Concierge',
    badge: 'AI CONCIERGE & HERO',
    image: '/media/showcase/poster-anchialo-hero.webp',
    video: '/videos/tour-anchialo-hero.mp4',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- ROW 1 (10 Real Website Interfaces) ---
  {
    id: 'anchialo-store-tour',
    title: 'ANCHIALO Australia — Storefront & Botanical Blends',
    category: 'Online Store',
    metric: 'Live Storefront • 253 g/L MgCl₂',
    region: 'Melbourne, Australia',
    image: '/media/showcase/site-anchialo.webp',
    video: '/videos/tour-anchialo-store.mp4',
    stack: ['Live Video Tour', 'AU D2C Store', 'Google SEO'],
    summary:
      'Live site walkthrough of ANCHIALO Australia’s five botanical magnesium gel formulations, dose selector, and instant Melbourne checkout.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'cpt-combat-tour',
    title: 'CPT MMA Melbourne — Fight Camp & Athlete Intake',
    category: 'Corporate Website',
    metric: 'Live Website • Melbourne Mats',
    region: 'Melbourne, Australia',
    image: '/media/showcase/site-cptmma.webp',
    video: '/videos/tour-cpt-combat.mp4',
    stack: ['Live Video Tour', 'ONE Vet Coaching', 'Conversion Funnel'],
    summary:
      'Scrolling walkthrough across ONE Championship veteran Sotir Kichukov’s Three Continents fight chronicle, private coaching protocols, and fighter intake funnel.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'original-glazing-melbourne',
    title: 'Original Glazing 24/7 Melbourne — Emergency & Architectural Glass',
    category: 'Corporate Website',
    metric: '24/7 Rapid Glazing • Sub-1s Load',
    region: 'Melbourne, VIC, Australia',
    image: '/media/showcase/site-glazing.webp',
    stack: ['Emergency 24/7 Funnel', 'AGGA Standards', 'Click-to-Call'],
    summary:
      'High-converting 24/7 emergency glazing and architectural double-glazing platform engineered for Melbourne homes and commercial properties with 15-minute dispatch response.',
    liveUrl: 'https://originalglazing.com.au',
    liveDomain: 'originalglazing.com.au',
    isConcept: false,
  },
  {
    id: 'denitsa-salon-studio',
    title: 'Denitsa Hair & Aesthetics — Luxury Salon & Booking Platform',
    category: 'Corporate Website',
    metric: 'Salon Booking • Live Treatments',
    region: 'Melbourne & Sofia',
    image: '/media/showcase/site-denitsa.webp',
    stack: ['Booking Funnel', 'Treatment Catalog', 'Mobile First'],
    summary:
      'High-converting salon and medical aesthetics booking platform with interactive hair wash protocols, treatment pricing, and stylist appointment reservation.',
    liveUrl: 'https://digitalworldau.com/blog/beauty-salon-website-guide/',
    liveDomain: 'denitsa-hair.com',
    isConcept: false,
  },
  {
    id: 'bambuddha-desserts-patisserie',
    title: 'BAMBUDDHA Desserts & Patisserie — Artisan Hospitality Menu',
    category: 'Online Store',
    metric: 'Artisan Menu • Live Table QR',
    region: 'Melbourne, VIC, Australia',
    image: '/media/showcase/site-bambuddha.webp',
    stack: ['Hospitality Platform', 'Visual Dessert Menu', 'Direct Pre-Orders'],
    summary:
      'Artisan dessert and patisserie showcase featuring high-definition gourmet plating, live QR table ordering, and catering reservation funnels.',
    liveUrl: 'https://bambuddha.com.au',
    liveDomain: 'bambuddha.com.au',
    isConcept: false,
  },
  {
    id: 'anchialo-salterns-tour',
    title: 'ANCHIALO — Crimson Salterns & Balneology Journal',
    category: 'Online Store',
    metric: 'Lake Pomorie Origin • Balneology',
    region: 'Black Sea & Australia',
    image: '/media/showcase/site-anchialo.webp',
    video: '/videos/tour-anchialo-salterns.mp4',
    stack: ['Live Video Tour', 'Origin Storytelling', 'Research Journal'],
    summary:
      'Scrolling tour of Bulgaria’s Crimson Salterns origin chronicle, the 20-minute Warm Wrap clinical protocol, and the Balneology Journal.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'nasvetlo-audit',
    title: 'NAsvetlo — 2.23M-Record Civic & Judicial Audit',
    category: 'Web App',
    metric: '2.23M Records • Force-Directed Graph',
    region: 'Bulgaria & EU Open Data',
    image: '/media/showcase/site-nasvetlo.webp',
    stack: ['Big Data Visualization', 'Network Graph', 'Benjamini–Hochberg FDR'],
    summary:
      'Production big-data civic audit cross-referencing 2,234,509 court records across 180 courts and €53.22B in public procurement contracts with interactive 28-region radar maps and a 7-node force-directed network graph.',
    liveUrl: 'https://nasvetlo.website',
    liveDomain: 'nasvetlo.website',
    isConcept: false,
  },
  {
    id: 'cpt-canine-tour',
    title: 'CPT Melbourne — Canine K9 10-Week Training App',
    category: 'Web App',
    metric: 'Dual Division • 10-Week K9 App',
    region: 'Melbourne, Australia',
    image: '/media/showcase/site-cptmma.webp',
    video: '/videos/tour-cpt-canine.mp4',
    stack: ['Dual Division UI', '10-Week Progress Tracker', 'Client Portal'],
    summary:
      'Interactive walkthrough of the Dual Division switcher opening CPT Canine Personal Training Melbourne with its live 10-week K9 progress app.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'medspa-salon-blueprint',
    title: 'Medspa & Aesthetics Studio — Fast Appointment Engine',
    category: 'Corporate Website',
    metric: 'Fresha & Timely Integrated',
    region: 'Melbourne, VIC',
    image: '/media/blog-salon.webp',
    stack: ['Treatment Cards', 'Direct Deposit', 'Speed 100/100'],
    summary:
      'Specialized clinic and medical spa web platform featuring scannable treatment menus, verified before/after client galleries, and automated deposit checkout.',
    liveUrl: 'https://digitalworldau.com/blog/beauty-salon-website-guide/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'aeterna-platform',
    title: 'AETERNA — Sovereign 3D Flagship Platform',
    category: 'Web App',
    metric: 'Interactive Flagship • Instant Load',
    region: 'Global Flagship',
    image: '/media/showcase/site-aeterna.webp',
    video: '/videos/case-aeterna.mp4',
    stack: ['Custom Web App', 'Interactive 3D', 'Global Speed'],
    summary:
      'High-impact interactive digital flagship built for instant worldwide loading, luxury visual presentation, and effortless navigation on desktop and mobile.',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    isConcept: false,
  },

  // --- ROW 2 (10 Real Website Interfaces) ---
  {
    id: 'cpt-pricing-tour',
    title: 'CPT MMA — Coaching Plans & Speed Punching LMS',
    category: 'Corporate Website',
    metric: 'Video Course LMS • 1-on-1 Plans',
    region: 'Melbourne, Australia',
    image: '/media/showcase/site-cptmma.webp',
    video: '/videos/tour-cpt-pricing.mp4',
    stack: ['Live Video Tour', 'Video Course LMS', 'Stripe Ready'],
    summary:
      'Full walkthrough of CPT’s transparent 1-on-1 coaching tiers, Speed Punching Maximizer 6-week video course, and downloadable training PDFs.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'anchialo-carousel-tour',
    title: 'ANCHIALO — Combat Recovery & Lab Purity Dossier',
    category: 'Online Store',
    metric: 'Certified Lab Purity • Store Carousel',
    region: 'Pomorie & Melbourne',
    image: '/media/showcase/site-anchialo.webp',
    video: '/videos/tour-anchialo-carousel.mp4',
    stack: ['Live Video Tour', 'Quality Certificate PDF', 'Combat Recovery'],
    summary:
      'Walkthrough of the ANCHIALO Combat Recovery & Mineral Guide carousel leading directly into verified 253.14 g/L MgCl₂ lab certificates.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    isConcept: false,
  },
  {
    id: 'webdesign-melbourne-hub',
    title: 'Digital World AU — Melbourne Studio & SEO Hub',
    category: 'Corporate Website',
    metric: 'Sub-Second Speed • Google Ads ROI',
    region: 'Rowville & Melbourne VIC',
    image: '/media/showcase/site-webdesign-melbourne.webp',
    stack: ['Victorian Suburb SEO', 'Wasm ROI Tool', 'Instant Audit'],
    summary:
      'Dedicated Melbourne agency platform featuring Victorian suburb schema, transparent fixed-scope milestone pricing, and interactive client ROI projection.',
    liveUrl: 'https://digitalworldau.com/web-design-melbourne/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'ecommerce-australia-platform',
    title: 'E-Commerce Australia — High-Converting Checkout Engine',
    category: 'Online Store',
    metric: 'Apple Pay & Stripe Ready',
    region: 'Sydney & Melbourne AU',
    image: '/media/showcase/site-ecommerce-au.webp',
    stack: ['Headless Storefront', 'Sticky Buy Bar', 'Instant Checkout'],
    summary:
      'Specialized Australian e-commerce engine tuned for high-volume conversion with instant variant selection, free shipping progress bars, and sub-second load times.',
    liveUrl: 'https://digitalworldau.com/ecommerce-australia/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'astro-planetarium-showcase',
    title: 'ASTRO Cosmic Observatory — 4K Stellarium Web Platform',
    category: 'Web App',
    metric: 'WebGL2 • 60 FPS Browser Render',
    region: 'Deep Space Observatory',
    image: '/media/showcase/site-astro.webp',
    stack: ['Atmospheric Scattering', 'Orbital Physics', '60 FPS WebGL'],
    summary:
      'Real-time interplanetary observatory and 4K optical clarification showcase rendering habitable-zone exoplanet TRAPPIST-1e and deep-space orbital telemetry.',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
    isConcept: false,
  },
  {
    id: 'cpt-gallery-tour',
    title: 'CPT MMA — Fight Archive & Athlete Recovery Portal',
    category: 'Corporate Website',
    metric: 'ONE Fight Archive • Member Portal',
    region: 'Melbourne, Australia',
    image: '/media/showcase/site-cptmma.webp',
    video: '/videos/tour-cpt-gallery.mp4',
    stack: ['Live Video Tour', 'Fight Archive', 'Member Recovery'],
    summary:
      'Tour of A Life in the Fight historical archive, verified fighter testimonials, and integrated Anchialo recovery portal.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'audit-tool-engine',
    title: 'Free 48-Hour Website Audit — Diagnostic Tool Engine',
    category: 'Web App',
    metric: 'UX, SEO & Performance Score',
    region: 'National & Global',
    image: '/media/showcase/site-audit-tool.webp',
    stack: ['Automated Audit', 'Speed Benchmark', 'PDF Export'],
    summary:
      'Diagnostic agency engine inspecting client site speed, mobile checkout friction, and Google ranking gaps with 48-hour structured recommendations.',
    liveUrl: 'https://digitalworldau.com/free-website-audit/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'classifieds-marketplace',
    title: 'Classifieds & Marketplace — Peer-to-Peer Directory Platform',
    category: 'Web App',
    metric: 'Verified Seller • Escrow Ready',
    region: 'Australia & International',
    image: '/media/blog-classifieds.webp',
    stack: ['Search & Filter', 'Secure Uploads', 'Buyer Trust Badges'],
    summary:
      'High-throughput marketplace platform with sub-second faceted category search, verified merchant credentials, and zero-drop seller onboarding.',
    liveUrl: 'https://digitalworldau.com/blog/launching-classifieds-marketplace/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'news-portal-architecture',
    title: 'Scalable News & Media — Zero-Latency Publishing Engine',
    category: 'Web App',
    metric: 'Edge-Rendered • Sub-50ms',
    region: 'Global CDN Delivery',
    image: '/media/blog-news.webp',
    stack: ['Global Cloudflare Edge', 'Instant Article Cache', 'Core Web Vitals'],
    summary:
      'Massive scale editorial news publishing platform engineered for breaking traffic spikes with edge caching, zero CLS shift, and 100/100 Core Web Vitals.',
    liveUrl: 'https://digitalworldau.com/blog/scalable-news-portal-architecture/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'corporate-authority-blueprint',
    title: 'Corporate Authority Blueprint — High-Contrast B2B Portal',
    category: 'Corporate Website',
    metric: 'Enterprise RFP • SOC2 Ready',
    region: 'Melbourne & International',
    image: '/media/blog-corporate.webp',
    stack: ['Bespoke Dark Architecture', 'Investor Relations', 'Zero Friction RFP'],
    summary:
      'Institutional enterprise website blueprint establishing immediate market authority with high-contrast typography, governance documentation, and lead routing.',
    liveUrl: 'https://digitalworldau.com/blog/corporate-website-authority-blueprint/',
    liveDomain: 'digitalworldau.com',
    isConcept: false,
  },
  {
    id: 'anchialo-oil-arnica',
    title: 'ANCHIALO Product Guide AU — Magnesium & Arnica',
    category: 'Online Store',
    metric: 'Australian Product PDF',
    region: 'Melbourne, Australia',
    image: '/media/anchialo/anchialo-oil-arnica-promo.webp',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Product_Guide_AU.pdf',
    stack: ['AU Brochure PDF', 'D2C Product Spec', 'Print & Web'],
    summary:
      'Official Australian digital product guide showcasing ANCHIALO Magnesium & Arnica oil formulations for muscle recovery and joint relief.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
];

export const CASE_STUDIES = [
  {
    tag: 'Live Australian Online Store',
    client: 'ANCHIALO Australia (anchialo.com)',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    video: '/videos/case-anchialo.mp4',
    poster: '/media/showcase/poster-anchialo-hero.webp',
    headline: 'Launching Australia’s Lake Pomorie Magnesium Gel & Oil recovery store with Melbourne dispatch',
    quote:
      'Engineered from scratch for speed and scientific credibility—showcasing five signature botanical formulations (253.14 g/L Magnesium Chloride & 70.36 g/L Magnesium Sulfate) dispatched directly from Melbourne for athletes and clinics.',
    author: 'ANCHIALO Australia',
    role: 'Official Australian Store — Melbourne, VIC',
    avatar: '/media/brands/anchialo-brand.webp',
    monogram: 'AN',
    stats: [
      { label: 'MgCl₂ Formula', value: '253 g/L' },
      { label: 'Product Line', value: '5 Blends' },
      { label: 'Page Speed', value: '100/100' },
    ],
  },
  {
    tag: 'Live Melbourne Sports Platform',
    client: 'CPT MMA Melbourne (cptmma.com)',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    video: '/videos/case-cptmma.mp4',
    poster: '/media/showcase/poster-cpt-combat.webp',
    headline: 'High-impact fight protocols & private application platform for ONE Championship veteran Sotir Kichukov',
    quote:
      'Every frame carries the discipline of a real fight camp. The dark video architecture, clear training protocols, and streamlined application funnel keep our Melbourne small-group and 1-on-1 coaching rosters filled with committed athletes.',
    author: 'Sotir Kichukov',
    role: 'Head Coach & ONE Championship Veteran — CPT MMA Melbourne',
    avatar: '/media/brands/cpt-mark.webp',
    monogram: 'CP',
    stats: [
      { label: 'Head Coach', value: 'ONE Vet' },
      { label: 'Mobile Load', value: '0.78 sec' },
      { label: 'Intake Model', value: 'Application' },
    ],
  },
  {
    tag: 'Live Dual-Division K9 Portal',
    client: 'CPT Canine Personal Training (cptmma.com)',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    video: '/videos/tour-cpt-canine.mp4',
    poster: '/media/showcase/poster-cpt-canine.webp',
    headline: 'Dual-Division Platform with an Interactive 10-Week K9 Progress Tracker & Client Portal',
    quote:
      'Built seamlessly inside the CPT Melbourne ecosystem—owners switch straight into CPT Canine Personal Training to follow a 10-week behavioral progression checklist, manual PDFs, and private application intake.',
    author: 'CPT Canine Division',
    role: 'Behavioral & Obedience Division — Melbourne, VIC',
    avatar: '/media/brands/canine-seal.webp',
    monogram: 'K9',
    stats: [
      { label: 'Tracker App', value: '10-Week K9' },
      { label: 'Architecture', value: 'Dual Division' },
      { label: 'Conversion', value: 'Application' },
    ],
  },
  {
    tag: 'Live Interactive Web Platform',
    client: 'AETERNA Digital Platform (aeterna.website)',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    video: '/videos/case-aeterna.mp4',
    poster: '/media/mockup-aeterna.webp',
    headline: 'High-impact interactive flagship built for instant loading and visual authority',
    quote:
      'Combining bold dark-mode design, smooth interactive motion, and instant page speed proves how a premium digital platform commands attention on both mobile and desktop.',
    author: 'AETERNA Technologies',
    role: 'Flagship Engineering — Bulgaria & Australia',
    avatar: '',
    monogram: 'AE',
    stats: [
      { label: 'Page Speed', value: '100/100' },
      { label: 'Smooth Motion', value: '60 FPS' },
      { label: 'Global Load', value: '< 0.8s' },
    ],
  },
  {
    tag: 'Live Melbourne Patisserie & Hospitality',
    client: 'BAMBUDDHA Desserts (bambuddha.com.au)',
    liveUrl: 'https://bambuddha.com.au',
    liveDomain: 'bambuddha.com.au',
    video: '',
    poster: '/media/showcase/bambuddha-tiramisu.webp',
    headline: 'High-Impact Artisan Dessert Showcase & QR Table Ordering Platform for Melbourne Food Lovers',
    quote:
      'Digital World AU created an ultra-crisp culinary experience with fluid animations, visual menu storytelling, and direct reservation funnels that boosted our gourmet dessert engagement.',
    author: 'BAMBUDDHA Patisserie',
    role: 'Artisan Desserts & Hospitality — Melbourne, VIC',
    avatar: '',
    monogram: 'BD',
    stats: [
      { label: 'Menu Imagery', value: '4K Artisan' },
      { label: 'Table Ordering', value: 'Live QR' },
      { label: 'Page Speed', value: '100/100' },
    ],
  },
  {
    tag: 'Live Melbourne Glazing & Trade',
    client: 'Original Glazing Melbourne (originalglazing.com.au)',
    liveUrl: 'https://originalglazing.com.au',
    liveDomain: 'originalglazing.com.au',
    video: '',
    poster: '/media/showcase/glazing-hero.webp',
    headline: '24/7 Emergency Glazing & Architectural Glass Replacement Platform in Greater Melbourne',
    quote:
      'Digital World AU engineered our emergency glass dispatch funnel with lightning-fast mobile loading and instant click-to-call routing, dramatically increasing our qualified callouts across Melbourne suburbs.',
    author: 'Original Glazing Melbourne',
    role: 'Emergency & Architectural Glazier — Melbourne, VIC',
    avatar: '',
    monogram: 'OG',
    stats: [
      { label: 'Service Region', value: 'Melbourne Metro' },
      { label: 'Response Target', value: '15-30 Min' },
      { label: 'Mobile Load', value: '0.68s' },
    ],
  },
  {
    tag: 'Live 4K WebGL2 Observatory',
    client: 'ASTRO Interplanetary Observatory (aeterna-cosmic-observatory)',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
    video: '',
    poster: '/media/showcase/astro-trappist-1e.webp',
    headline: 'Real-time WebGL2 & WebAssembly Interplanetary Planetarium & 4K Exoplanet Optical Showcase',
    quote:
      'Compiled ERFA astrometry in WebAssembly paired with 4K NASA EPIC Earth and TRAPPIST-1e orbital optical renders demonstrates scientific-grade browser engineering at 60 FPS.',
    author: 'ASTRO Cosmic Observatory',
    role: 'WebGL2 + ERFA Astrometry — Open Science Showcase',
    avatar: '',
    monogram: 'AS',
    stats: [
      { label: 'Planet Renders', value: '4K Optical' },
      { label: 'Core Engine', value: 'WebGL2 + Wasm' },
      { label: 'Frame Rate', value: '60 FPS' },
    ],
  },
  {
    tag: 'Live European Open-Data Platform',
    client: 'NAsvetlo Civic & Judicial Audit (nasvetlo.website)',
    liveUrl: 'https://nasvetlo.website',
    liveDomain: 'nasvetlo.website',
    video: '',
    poster: '/media/mockup-nasvetlo.png',
    headline: '2.23M court records & €53.22B procurement cross-referenced in a sub-second force-directed graph',
    quote:
      'Engineered in Bulgaria for instant analytical clarity across 2,234,509 judicial acts, 180 courts, and 28 regional radar maps—proving how static Astro + WebAssembly architectures handle massive datasets effortlessly.',
    author: 'NAsvetlo Open-Data Initiative',
    role: 'Civic & Judicial Analytics — Sofia & Burgas, Bulgaria (EU)',
    avatar: '',
    monogram: 'NS',
    stats: [
      { label: 'Dataset Scale', value: '2.23M Rows' },
      { label: 'Public Tenders', value: '€53.22B' },
      { label: 'Query Speed', value: '< 50 ms' },
    ],
  },
];

export interface GlobalRegion {
  name: string;
  code: string;
  clients: string;
  hub: string;
  regionGroup: 'Asia-Pacific' | 'Europe' | 'North America';
  lat: number;
  lng: number;
  projectLabel: string;
  projectDomain: string;
  projectUrl: string;
}

export const GLOBAL_REGIONS: GlobalRegion[] = [
  {
    name: 'Australia',
    code: 'AU',
    clients: 'Sydney & Melbourne HQ',
    hub: 'Sydney & Melbourne',
    regionGroup: 'Asia-Pacific',
    lat: -33.8688,
    lng: 151.2093,
    projectLabel: 'ANCHIALO AU & CPT MMA Melbourne',
    projectDomain: 'anchialo.com',
    projectUrl: 'https://anchialo.com',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
    clients: 'Engineering & Big Data Hub',
    hub: 'Sofia & Burgas',
    regionGroup: 'Europe',
    lat: 42.6977,
    lng: 23.3219,
    projectLabel: 'AETERNA & NAsvetlo Civic Audit',
    projectDomain: 'nasvetlo.website',
    projectUrl: 'https://nasvetlo.website',
  },
  {
    name: 'Germany',
    code: 'DE',
    clients: 'DACH Delivery',
    hub: 'Berlin & Munich',
    regionGroup: 'Europe',
    lat: 48.1351,
    lng: 11.582,
    projectLabel: 'DACH Enterprise & E-Commerce Pod',
    projectDomain: 'Start DACH Project',
    projectUrl: '#contact',
  },
  {
    name: 'France',
    code: 'FR',
    clients: 'EU Commerce',
    hub: 'Paris & Lyon',
    regionGroup: 'Europe',
    lat: 48.8566,
    lng: 2.3522,
    projectLabel: 'Paris Editorial & Commerce Flagships',
    projectDomain: 'Start EU Project',
    projectUrl: '#contact',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    clients: 'Enterprise Web',
    hub: 'Zurich & Geneva',
    regionGroup: 'Europe',
    lat: 47.3769,
    lng: 8.5417,
    projectLabel: 'Zurich Fintech & Private Wealth UX',
    projectDomain: 'Start CH Project',
    projectUrl: '#contact',
  },
  {
    name: 'USA',
    code: 'US',
    clients: 'North America',
    hub: 'New York & Austin',
    regionGroup: 'North America',
    lat: 40.7128,
    lng: -74.006,
    projectLabel: 'US Performance Funnel & SaaS Builds',
    projectDomain: 'Start US Project',
    projectUrl: '#contact',
  },
  {
    name: 'Canada',
    code: 'CA',
    clients: 'North America',
    hub: 'Toronto & Vancouver',
    regionGroup: 'North America',
    lat: 43.6532,
    lng: -79.3832,
    projectLabel: 'Canadian E-Commerce & Web Portals',
    projectDomain: 'Start CA Project',
    projectUrl: '#contact',
  },
];

export interface ClientTestimonial {
  name: string;
  role: string;
  company: string;
  country: string;
  avatar?: string;
  monogram: string;
  accent: string;
  liveUrl: string;
  liveDomain: string;
  quote: string;
}

export const TESTIMONIALS: ClientTestimonial[] = [
  {
    name: 'Sotir Kichukov',
    role: 'Head Coach & ONE Championship Veteran',
    company: 'CPT MMA Melbourne',
    country: 'Australia',
    avatar: '/media/sotir-kichukov.webp',
    monogram: 'CP',
    accent: '#00f5a0',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    quote:
      'Digital World AU built cptmma.com with the exact discipline we demand on the mats—instant video playback, razor-sharp fight protocol breakdowns, and an application funnel built for serious Melbourne athletes.',
  },
  {
    name: 'ANCHIALO Australia',
    role: 'Official Australian D2C & Wholesale Store',
    company: 'anchialo.com (Melbourne, VIC)',
    country: 'Australia',
    avatar: '/media/anchialo-gel.webp',
    monogram: 'AN',
    accent: '#38bdf8',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    quote:
      'From Lake Pomorie wellness storytelling to effortless mobile checkout for our 253 g/L Magnesium Gel and Oil collection, anchialo.com delivers a seamless Australian shopping experience.',
  },
  {
    name: 'Marcus Vance',
    role: 'Operations Director',
    company: 'Original Glazing Melbourne',
    country: 'Australia',
    avatar: '/media/showcase/glazing-balwyn.webp',
    monogram: 'OG',
    accent: '#10b981',
    liveUrl: 'https://originalglazing.com.au',
    liveDomain: 'originalglazing.com.au',
    quote:
      'When broken glass happens at 2 AM, Melbourne homeowners need instant click-to-call and sub-second loading. Digital World AU built our platform to convert emergency traffic straight into dispatch.',
  },
];

export const SERVICES_BENTO = [
  {
    step: '01',
    title: 'Website Audit',
    preset: 'Free 48-Hour Website Audit',
    subtitle: 'Clear action plan before you invest',
    items: ['UX & Conversion Friction Review', 'Mobile Speed & Checkout Diagnostics', 'Google SEO & Ranking Opportunity Audit'],
    highlight: 'Delivered in 48 Hours',
  },
  {
    step: '02',
    title: 'Design',
    preset: 'UI/UX & Web Design',
    subtitle: 'High-contrast visual authority',
    items: ['UI/UX Product & Journey Architecture', 'Bespoke Dark & Editorial Web Design', 'Brand Identity & Reusable Design Systems'],
    highlight: 'Interactive Prototypes',
  },
  {
    step: '03',
    title: 'Development',
    preset: 'Custom Development',
    subtitle: 'Fast, reliable & built to scale',
    items: ['Custom Business & Corporate Websites', 'High-Converting Online Stores', 'Managed Security, Backups & Support'],
    highlight: '99.98% Uptime & Speed',
  },
  {
    step: '04',
    title: 'Marketing',
    preset: 'SEO & Paid Growth',
    subtitle: 'Compounding traffic & Google Ads ROI',
    items: ['National & Local Google SEO', 'High-ROI Google Ads Landing Pages', 'Social Content & Automated Email Flows'],
    highlight: 'Verified Attribution',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What does your end-to-end work process look like?',
    a: 'Every engagement runs in four transparent sprints: (1) Discovery & Conversion Audit, (2) Interactive Wireframes & Visual Design, (3) Full Website Build, Mobile Polish & Device QA, and (4) Zero-Downtime Launch, Google Speed verification, and conversion tracking.',
  },
  {
    q: 'What do you need from us as a client to get started?',
    a: 'Just a 30-minute alignment call, any existing brand guidelines or product photography, and read-only analytics access if we are upgrading an existing site. Our strategists handle page structure, copy refinement, and launch execution.',
  },
  {
    q: 'How do communication and progress reporting work?',
    a: 'You get a dedicated Slack channel directly with your lead UI/UX designer and senior builder, weekly recorded video walkthroughs, a live staging preview updated continuously, and clear milestone sign-offs.',
  },
  {
    q: 'Who owns the source code, designs, and intellectual property?',
    a: 'You own 100% of everything. Upon final milestone completion, all Figma design files, website code, custom features, and domain configurations belong exclusively to your company with zero lock-in.',
  },
  {
    q: 'Are all websites built mobile-first and Google Ads ready?',
    a: 'Unconditionally. Over 68% of modern paid and organic traffic arrives on mobile phones. Every layout is built for sub-second mobile load times, clean conversion tracking, Privacy Policy/Cookie compliance, and 95–100 Google PageSpeed scores.',
  },
  {
    q: 'How is custom project pricing structured?',
    a: 'We work on transparent, fixed-scope milestones in AUD or EUR—starting from A$500–A$990 (€300–€600) for rapid-turnaround starter launchpads and one-page sprints, through A$990–A$2,475 (€600–€1,500) for multi-page conversion sites, up to A$16,500–A$41,250+ (€10,000–€25,000+) for custom multi-region e-commerce flagships and bespoke web applications.',
  },
];

export const BLOG_POSTS = [
  {
    slug: 'beauty-salon-website-guide',
    tag: 'Booking & UX',
    readTime: '6 min read',
    publishedAt: '2026-11-27',
    title: 'How to Build a High-Converting Website for Beauty Salons & Medspas',
    excerpt:
      'Frictionless 3-tap booking flows, treatment menu psychology, and local Australian Google Business SEO that turns social discovery into recurring appointments.',
    image: '/media/blog-salon.webp',
    takeaways: [
      'Surface sticky one-tap treatment booking above the fold on mobile devices.',
      'Combine transparent duration/pricing tiers with verified client visual proof.',
      'Configure Google rich-result business data for local map-pack dominance.',
    ],
    sections: [
      {
        heading: '1. Why Beauty & Medspa Traffic Leaks on Generic Websites',
        body: 'Over 82% of cosmetic clinic and salon searches happen on smartphones—frequently after an Instagram reel, TikTok post, or Google Maps discovery. When a visitor lands on a slow gallery site without clear treatment pricing or immediate booking buttons, they abandon within 6 seconds and book the next salon on Google Maps.',
      },
      {
        heading: '2. The 3-Tap Booking Architecture',
        body: 'High-performing clinic sites anchor a persistent "Book Consultation" button right inside the sticky header and first mobile screen. Pair scannable treatment cards (Duration, Price Range, Recovery Time) with direct integration into Fresha, Timeless, Cliniko, or a zero-drop custom inquiry form.',
      },
      {
        heading: '3. Local Suburb SEO & Before/After Social Proof',
        body: 'Dedicated suburb & treatment pages—supported by structured LocalBusiness schema, fast compressed WebP visual galleries, and real client reviews—lower your Google Ads cost-per-click while building organic bookings every month.',
      },
    ],
  },
  {
    slug: 'scalable-news-portal-architecture',
    tag: 'Media Publishing',
    readTime: '8 min read',
    publishedAt: '2026-11-27',
    title: 'Scaling High-Traffic News Portals for Instant Global Delivery',
    excerpt:
      'How modern edge-cached layouts and clean editorial pipelines absorb viral breaking-news spikes with instant page delivery worldwide.',
    image: '/media/blog-news.webp',
    takeaways: [
      'Serve instant-loading article pages globally while keeping live tickers lightweight.',
      'Automate Google News XML sitemaps and strict mobile performance budgets.',
      'Design high-readability dark/light typographic rhythm that lifts ad & subscription retention.',
    ],
    sections: [
      {
        heading: '1. Stopping Traffic Spikes From Crashing Your Server',
        body: 'Breaking news alerts send thousands of concurrent readers to the exact same URL within seconds. Traditional uncached CMS setups run repetitive database queries on every view—causing timeouts precisely when editorial attention peaks.',
      },
      {
        heading: '2. Edge-First Publishing + Isolated Live Widgets',
        body: 'By serving pre-built HTML directly from a global CDN edge (Cloudflare) while loading breaking tickers and reader comments as tiny independent widgets, readers experience sub-second article loads anywhere across Sydney, Melbourne, or Europe.',
      },
      {
        heading: '3. Discoverability in Google News & AI Search',
        body: 'Clean NewsArticle schema, fast hero images in WebP, automated XML/RSS feeds, and llms.txt indexing maximise visibility across Google Discover and modern AI assistants.',
      },
    ],
  },
  {
    slug: 'launching-classifieds-marketplace',
    tag: 'Marketplaces',
    readTime: '7 min read',
    publishedAt: '2026-11-27',
    title: 'Launching a Profitable Classifieds Platform: Search, Trust & Monetisation',
    excerpt:
      'Designing sub-second category search, safe media uploads, and promoted seller tiers that compound marketplace liquidity.',
    image: '/media/blog-classifieds.webp',
    takeaways: [
      'Keep multi-filter category + radius search under 80ms with clean indexable URLs.',
      'Run built-in browser security checks on uploaded listing photos automatically.',
      'Balance free organic listings with featured boosts and verified dealer subscriptions.',
    ],
    sections: [
      {
        heading: '1. Liquidity Starts With Frictionless Search & Posting',
        body: 'Every extra filter reload hurts buyer retention. Modern marketplaces keep suburb, radius, category, and price filtering responsive in milliseconds while generating clean canonical category URLs that rank naturally on Google.',
      },
      {
        heading: '2. Zero-Trust Media Uploads & Buyer Confidence',
        body: 'Inspecting uploaded listing files before they reach storage protects your platform against spoofed executables and oversized payloads, while verified seller badges raise buyer inquiry rates.',
      },
      {
        heading: '3. Sustainable Revenue Beyond Display Ads',
        body: 'Combine complimentary core listings (to attract volume) with high-margin featured homepage slots, bump-to-top micro-upgrades, and recurring dealership plans.',
      },
    ],
  },
  {
    slug: 'corporate-website-authority-blueprint',
    tag: 'B2B Strategy',
    readTime: '5 min read',
    publishedAt: '2026-11-27',
    title: 'The Modern Corporate Website Blueprint for Enterprise Trust & Pipeline',
    excerpt:
      'Why generic corporate sites leak deals—and how verifiable video case studies, interactive calculators, and executive clarity multiply inbound inquiries.',
    image: '/media/blog-corporate.webp',
    takeaways: [
      'Replace vague slogans with quantified client outcomes and live production case studies.',
      'Pair primary quote forms with a low-friction Free Expert Audit lead magnet.',
      'Enforce crisp contrast, instant media delivery, and full ownership transparency.',
    ],
    sections: [
      {
        heading: '1. B2B Buyers Verify Before They Enquire',
        body: 'Decision-makers investing A$5,000 to A$50,000+ check your speed, clarity, real client links, and leadership credibility before touching your contact form. Generic stock templates immediately erode authority.',
      },
      {
        heading: '2. Turning Case Studies Into Interactive Proof',
        body: 'Live walkthrough reels, clickable client domains, transparent fixed-scope AUD/EUR tiers, and a zero-drop server form that confirms delivery in-page lift qualified conversion rates dramatically compared to static mailto links.',
      },
      {
        heading: '3. High-Intent Google Ads Alignment',
        body: 'Routing paid search campaigns to tailored city & service URLs—backed by Consent Mode v2 and deterministic conversion events—improves Quality Score and lowers acquisition cost per booked call.',
      },
    ],
  },
];
