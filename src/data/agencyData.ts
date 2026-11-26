export interface BudgetTier {
  id: number;
  labelEur: string;
  minEurCents: number;
  maxEurCents: number;
}

export const BUDGET_TIERS: BudgetTier[] = [
  { id: 1, labelEur: '€2,000 – €5,000', minEurCents: 200_000, maxEurCents: 500_000 },
  { id: 2, labelEur: '€5,000 – €10,000', minEurCents: 500_000, maxEurCents: 1_000_000 },
  { id: 3, labelEur: '€10,000 – €20,000', minEurCents: 1_000_000, maxEurCents: 2_000_000 },
  { id: 4, labelEur: '€20,000 – €50,000', minEurCents: 2_000_000, maxEurCents: 5_000_000 },
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
  // --- ROW 1 (10 Unique Items) ---
  {
    id: 'anchialo-store-tour',
    title: 'ANCHIALO Australia — Storefront & Botanical Blends',
    category: 'Online Store',
    metric: 'Live Walkthrough • 253 g/L MgCl₂',
    region: 'Melbourne, Australia',
    image: '/media/showcase/poster-anchialo-store.webp',
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
    title: 'CPT MMA Melbourne — Fight Camp & Immersion Sessions',
    category: 'Corporate Website',
    metric: 'Live Walkthrough • Immersion Ringwood',
    region: 'Melbourne, Australia',
    image: '/media/showcase/poster-cpt-combat.webp',
    video: '/videos/tour-cpt-combat.mp4',
    stack: ['Live Video Tour', 'ONE Vet Coaching', 'Conversion Funnel'],
    summary:
      'Scrolling walkthrough across Sotir Kichukov’s Three Continents fight chronicle and Inside a Real Session at Immersion MMA Ringwood.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'immersion-lee',
    title: 'Immersion MMA Melbourne — Head Coach Lee Academy',
    category: 'Corporate Website',
    metric: 'Melbourne #1 BJJ & Muay Thai',
    region: 'Ringwood, VIC, Australia',
    image: '/media/showcase/immersion-lee.webp',
    stack: ['High-Performance Mats', 'Championship Roster', 'Mobile Intake'],
    summary:
      'High-converting flagship platform for Melbourne’s elite martial arts and BJJ training facility led by Head Coach Lee in Ringwood.',
    liveUrl: 'https://immersionmma.com.au',
    liveDomain: 'immersionmma.com.au',
    isConcept: false,
  },
  {
    id: 'astro-trappist-1e',
    title: 'ASTRO Interplanetary — 4K TRAPPIST-1e & Stellarium',
    category: 'Web App',
    metric: '4K Optical Planet Render',
    region: 'Deep Space Observatory',
    image: '/media/showcase/astro-trappist-1e.jpg',
    stack: ['WebGL2 Planetarium', 'ERFA WebAssembly', '4K Optical Clarity'],
    summary:
      'Real-time interplanetary observatory and 4K optical clarification showcase rendering habitable-zone exoplanet TRAPPIST-1e and deep-space orbital telemetry.',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
    isConcept: false,
  },
  {
    id: 'painters-of-geelong-interior',
    title: 'Painters of Geelong — Residential & Commercial Painting',
    category: 'Corporate Website',
    metric: 'Geelong & Surf Coast Local SEO',
    region: 'Geelong, VIC, Australia',
    image: '/media/showcase/geelong-interior-hero.webp',
    stack: ['Local SEO', 'Before / After Proof', 'Instant Quote Funnel'],
    summary:
      'High-converting residential and commercial painting website built for Geelong & Armstrong Creek featuring Dulux spec catalogues and rapid mobile quote capture.',
    liveUrl: 'https://www.paintersofgeelong.com.au',
    liveDomain: 'paintersofgeelong.com.au',
    isConcept: false,
  },
  {
    id: 'anchialo-salterns-tour',
    title: 'ANCHIALO — Crimson Salterns & Balneology Journal',
    category: 'Online Store',
    metric: 'Lake Pomorie Origin • Balneology',
    region: 'Black Sea & Australia',
    image: '/media/showcase/poster-anchialo-salterns.webp',
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
    image: '/media/mockup-nasvetlo.png',
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
    image: '/media/showcase/poster-cpt-canine.webp',
    video: '/videos/tour-cpt-canine.mp4',
    stack: ['Dual Division UI', '10-Week Progress Tracker', 'Client Portal'],
    summary:
      'Interactive walkthrough of the Dual Division switcher opening CPT Canine Personal Training Melbourne with its live 10-week K9 progress app.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'anchialo-cert-p1',
    title: 'ANCHIALO — Official Quality Certificate (Page 1)',
    category: 'Online Store',
    metric: '253.14 g/L MgCl₂ Certified',
    region: 'Pomorie & Melbourne',
    image: '/media/anchialo/quality_certificate_page_1.webp',
    isDocument: true,
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    stack: ['Official Lab Analysis', 'Accredited Testing', 'Certificate PDF'],
    summary:
      'Official Bulgarian Ministry of Health accredited lab assay verifying 253.14 g/L magnesium chloride and 70.36 g/L magnesium sulfate concentration.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'aeterna-platform',
    title: 'AETERNA — Sovereign 3D Flagship Platform',
    category: 'Web App',
    metric: 'Interactive Flagship • Instant Load',
    region: 'Global Flagship',
    image: '/media/mockup-aeterna.webp',
    video: '/videos/case-aeterna.mp4',
    stack: ['Custom Web App', 'Interactive 3D', 'Global Speed'],
    summary:
      'High-impact interactive digital flagship built for instant worldwide loading, luxury visual presentation, and effortless navigation on desktop and mobile.',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    isConcept: false,
  },

  // --- ROW 2 (10 Unique Items) ---
  {
    id: 'cpt-pricing-tour',
    title: 'CPT MMA — Coaching Plans & Speed Punching LMS',
    category: 'Corporate Website',
    metric: 'Video Course LMS • 1-on-1 Plans',
    region: 'Melbourne, Australia',
    image: '/media/showcase/poster-cpt-pricing.webp',
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
    metric: 'Certified Lab Purity • PDF Carousel',
    region: 'Pomorie & Melbourne',
    image: '/media/showcase/poster-anchialo-carousel.webp',
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
    id: 'painters-of-geelong-apartment',
    title: 'Painters of Geelong — Surf Coast Architectural Finishes',
    category: 'Corporate Website',
    metric: 'Architectural Spec & Spray Finishes',
    region: 'Torquay & Geelong, VIC',
    image: '/media/showcase/geelong-apartment-hero.webp',
    stack: ['Commercial Painting', 'Architectural Specs', 'Lead Funnel'],
    summary:
      'Luxury apartment and high-end residential interior painting portfolio showcasing precision spray finishes, Dulux wash-and-wear, and rapid lead qualification.',
    liveUrl: 'https://www.paintersofgeelong.com.au',
    liveDomain: 'paintersofgeelong.com.au',
    isConcept: false,
  },
  {
    id: 'astro-exoplanet-orbit',
    title: 'ASTRO Interplanetary — 4K Orbiting Exoplanet',
    category: 'Web App',
    metric: '4K Cinematic Orbital Mechanics',
    region: 'Exoplanetary Systems',
    image: '/media/showcase/astro-exoplanet-orbit.jpg',
    stack: ['Atmospheric Scattering', 'Orbital Physics', '60 FPS WebGL'],
    summary:
      'Photorealistic atmospheric Rayleigh scattering and high-dynamic-range celestial illumination simulation around extra-solar planets.',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
    isConcept: false,
  },
  {
    id: 'pomorie-aerial-sandbar',
    title: 'Lake Pomorie Aerial Sandbar — ANCHIALO',
    category: 'Online Store',
    metric: 'Aerial Drone • Black Sea Coast',
    region: 'Lake Pomorie, Bulgaria & AU',
    image: '/media/anchialo/pomorie-sandbar-drone.webp',
    stack: ['Online Store', 'Aerial Media', 'Fast Mobile Checkout'],
    summary:
      'High-altitude aerial drone photography of the Pomorie sandbar and hypersaline lagoons anchoring ANCHIALO Australia’s authentic origin storytelling.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'cpt-gallery-tour',
    title: 'CPT MMA — Fight Archive & Athlete Recovery Portal',
    category: 'Corporate Website',
    metric: 'ONE Fight Archive • Anchialo Pod',
    region: 'Melbourne, Australia',
    image: '/media/showcase/poster-cpt-gallery.webp',
    video: '/videos/tour-cpt-gallery.mp4',
    stack: ['Live Video Tour', 'Fight Archive', 'Member Recovery'],
    summary:
      'Tour of A Life in the Fight historical archive, verified fighter testimonials, and integrated Anchialo recovery portal.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'anchialo-cert-p2',
    title: 'ANCHIALO — 253.14 g/L MgCl₂ Certified Spec (Page 2)',
    category: 'Online Store',
    metric: 'Accredited Lab Chemical Spec',
    region: 'Pomorie & Melbourne',
    image: '/media/anchialo/quality_certificate_page_2.webp',
    isDocument: true,
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    stack: ['Chemical Composition', 'Heavy Metals Clearance', 'Lab Assay'],
    summary:
      'Page 2 of the official accredited lab dossier detailing complete chemical composition, natural hyper-salinity, and zero heavy metal contamination.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'immersion-mats',
    title: 'Immersion MMA — Ringwood Training Academy & Mats',
    category: 'Corporate Website',
    metric: 'Olympic Mats • Fight Team',
    region: 'Melbourne, Australia',
    image: '/media/anchialo/mma-slide-1.webp',
    stack: ['Elite Facilities', 'Fighter Conditioning', 'Class Schedule'],
    summary:
      'High-performance martial arts facility showcase featuring Olympic tatami mats, cage enclosures, and structured adult and junior coaching schedules.',
    liveUrl: 'https://immersionmma.com.au',
    liveDomain: 'immersionmma.com.au',
    isConcept: false,
  },
  {
    id: 'astro-epic-earth',
    title: 'ASTRO Interplanetary — 4K EPIC Earth & Australia',
    category: 'Web App',
    metric: '4K Photorealistic NASA Telemetry',
    region: 'Low Earth Orbit & AU',
    image: '/media/showcase/astro-epic-earth.jpg',
    stack: ['NASA DSCOVR EPIC', 'Atmospheric Shader', 'Three.js Core'],
    summary:
      'High-altitude true-color planetary Earth rendering showcasing Australian coastlines, cloud dynamics, and real-time solar terminator lines.',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
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
    avatar: '/media/anchialo-gel.webp',
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
    avatar: '/media/sotir-kichukov.webp',
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
    author: 'Sotir Kichukov',
    role: 'Founder & Head Handler — CPT Canine Melbourne',
    avatar: '/media/sotir-kichukov.webp',
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
    author: 'Dimitar Prodromov',
    role: 'Founder & Lead Architect — Digital World AU / AETERNA',
    avatar: '/media/founder-portrait.webp',
    monogram: 'DP',
    stats: [
      { label: 'Page Speed', value: '100/100' },
      { label: 'Smooth Motion', value: '60 FPS' },
      { label: 'Global Load', value: '< 0.8s' },
    ],
  },
  {
    tag: 'Live Melbourne Combat Academy',
    client: 'Immersion Mixed Martial Arts (immersionmma.com.au)',
    liveUrl: 'https://immersionmma.com.au',
    liveDomain: 'immersionmma.com.au',
    video: '/videos/tour-cpt-combat.mp4',
    poster: '/media/showcase/immersion-lee.webp',
    headline: 'Melbourne’s #1 Rated BJJ, Muay Thai & MMA Academy led by Coach Lee',
    quote:
      'Built for instant mobile class discovery, direct coach trust, and frictionless trial bookings across BJJ, Muay Thai, and MMA programs in Melbourne.',
    author: 'Coach Lee',
    role: 'Head Coach & Founder — Immersion Mixed Martial Arts',
    avatar: '/media/showcase/immersion-lee.webp',
    monogram: 'IM',
    stats: [
      { label: 'Academy Rating', value: 'Melbourne #1' },
      { label: 'Core Disciplines', value: 'BJJ • Muay Thai' },
      { label: 'Page Speed', value: '100/100' },
    ],
  },
  {
    tag: 'Live Geelong Trade & Commercial',
    client: 'Painters of Geelong (paintersofgeelong.com.au)',
    liveUrl: 'https://www.paintersofgeelong.com.au',
    liveDomain: 'paintersofgeelong.com.au',
    video: '',
    poster: '/media/showcase/geelong-interior-hero.webp',
    headline: 'Local SEO & High-Converting Residential / Commercial Painting Platform in Geelong & Armstrong Creek',
    quote:
      'Pairing real Geelong project transformations, Dulux specification boards, and instant quote funnels transformed organic searches into booked residential and commercial painting jobs.',
    author: 'Painters of Geelong',
    role: 'House & Commercial Painting — Geelong & Surf Coast, VIC',
    avatar: '/media/showcase/geelong-apartment-hero.webp',
    monogram: 'PG',
    stats: [
      { label: 'Service Region', value: 'Geelong & Surf Coast' },
      { label: 'Visual Proof', value: 'Before / After' },
      { label: 'Mobile Load', value: 'Sub-1s' },
    ],
  },
  {
    tag: 'Live 4K WebGL2 Observatory',
    client: 'ASTRO Interplanetary Observatory (aeterna-cosmic-observatory)',
    liveUrl: 'https://papica777-eng.github.io/aeterna-cosmic-observatory/',
    liveDomain: 'aeterna-cosmic-observatory',
    video: '',
    poster: '/media/showcase/astro-trappist-1e.jpg',
    headline: 'Real-time WebGL2 & WebAssembly Interplanetary Planetarium & 4K Exoplanet Optical Showcase',
    quote:
      'Compiled ERFA astrometry in WebAssembly paired with 4K NASA EPIC Earth and TRAPPIST-1e orbital optical renders demonstrates scientific-grade browser engineering at 60 FPS.',
    author: 'Dimitar Prodromov',
    role: 'Lead Architect — ASTRO Cosmic Observatory & Stellarium Ultra',
    avatar: '/media/founder-portrait.webp',
    monogram: 'AS',
    stats: [
      { label: 'Planet Renders', value: '4K Optical' },
      { label: 'Core Engine', value: 'WebGL2 + Wasm' },
      { label: 'Frame Rate', value: '60 FPS' },
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
    name: 'Dimitar Prodromov',
    role: 'Founder & Lead Architect',
    company: 'Digital World AU / AETERNA',
    country: 'Bulgaria & Australia',
    avatar: '/media/founder-portrait.webp',
    monogram: 'DP',
    accent: '#e879f9',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    quote:
      'Every website and online store we launch is built around three business pillars: unmistakable modern design, instant mobile loading, and higher conversion rates from Google Ads and organic search.',
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
    a: 'We work on fixed-scope, transparent milestones in AUD or EUR—ranging from A$3,300–A$8,250 (€2,000–€5,000) for high-velocity conversion landing systems up to A$33,000–A$82,500 (€20,000–€50,000) for bespoke multi-region e-commerce flagships and custom web platforms.',
  },
];

export const BLOG_POSTS = [
  {
    slug: 'beauty-salon-website-guide',
    tag: 'Booking & UX',
    readTime: '6 min read',
    title: 'How to Build a High-Converting Website for Beauty Salons & Medspas',
    excerpt:
      'Frictionless 3-tap booking flows, treatment menu psychology, and local Australian Google Business SEO that turns social discovery into recurring appointments.',
    image: '/media/blog-salon.webp',
    takeaways: [
      'Surface sticky one-tap treatment booking above the fold on mobile devices.',
      'Combine transparent duration/pricing tiers with verified client visual proof.',
      'Configure Google rich-result business data for local map-pack dominance.',
    ],
  },
  {
    slug: 'scalable-news-portal-architecture',
    tag: 'Media Publishing',
    readTime: '8 min read',
    title: 'Scaling High-Traffic News Portals for Instant Global Delivery',
    excerpt:
      'How modern edge-cached layouts and clean editorial pipelines absorb viral breaking-news spikes with instant page delivery worldwide.',
    image: '/media/blog-news.webp',
    takeaways: [
      'Serve instant-loading article pages globally while keeping live tickers lightweight.',
      'Automate Google News XML sitemaps and strict mobile performance budgets.',
      'Design high-readability dark/light typographic rhythm that lifts ad & subscription retention.',
    ],
  },
  {
    slug: 'launching-classifieds-marketplace',
    tag: 'Marketplaces',
    readTime: '7 min read',
    title: 'Launching a Profitable Classifieds Platform: Search, Trust & Monetisation',
    excerpt:
      'Designing sub-second category search, safe media uploads, and promoted seller tiers that compound marketplace liquidity.',
    image: '/media/blog-classifieds.webp',
    takeaways: [
      'Keep multi-filter category + radius search under 80ms with clean indexable URLs.',
      'Run built-in browser security checks on uploaded listing photos automatically.',
      'Balance free organic listings with featured boosts and verified dealer subscriptions.',
    ],
  },
  {
    slug: 'corporate-website-authority-blueprint',
    tag: 'B2B Strategy',
    readTime: '5 min read',
    title: 'The Modern Corporate Website Blueprint for Enterprise Trust & Pipeline',
    excerpt:
      'Why generic corporate sites leak deals—and how verifiable video case studies, interactive calculators, and executive clarity multiply inbound inquiries.',
    image: '/media/blog-corporate.webp',
    takeaways: [
      'Replace vague slogans with quantified client outcomes and live production case studies.',
      'Pair primary quote forms with a low-friction Free Expert Audit lead magnet.',
      'Enforce crisp contrast, instant media delivery, and full ownership transparency.',
    ],
  },
];
