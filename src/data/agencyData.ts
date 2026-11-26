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
  isDocument?: boolean;
  pdfUrl?: string;
  pdfLabel?: string;
}

export const ANCHIALO_SHOWCASE_SLIDES: AnchialoShowcaseSlide[] = [
  {
    id: 'pomorie-drone',
    title: 'Aerial Drone • Lake Pomorie Sandbar',
    badge: 'AERIAL DRONE',
    image: '/media/anchialo/pomorie-sandbar-drone.webp',
  },
  {
    id: 'red-salt-harvest',
    title: 'Crimson Salt Lakes • Natural Lye Harvest',
    badge: 'RED SALT LAKES',
    image: '/media/anchialo/pomorie-lye-harvest.webp',
  },
  {
    id: 'quality-cert-p1',
    title: 'Official Quality Certificate — Lab Analysis (Page 1)',
    badge: 'OFFICIAL PDF',
    image: '/media/anchialo/quality_certificate_page_1.webp',
    isDocument: true,
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    pdfLabel: 'Quality Certificate PDF',
  },
  {
    id: 'quality-cert-p2',
    title: '253.14 g/L MgCl₂ Certified Spec (Page 2)',
    badge: 'OFFICIAL PDF',
    image: '/media/anchialo/quality_certificate_page_2.webp',
    isDocument: true,
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    pdfLabel: 'Quality Certificate PDF',
  },
  {
    id: 'pomorie-floating',
    title: 'Lake Pomorie Hypersaline Mineral Basin',
    badge: 'RED SALT LAKES',
    image: '/media/anchialo/pomorie-lye-floating.webp',
  },
  {
    id: 'product-guide-au',
    title: 'Australian Product Guide — Magnesium Oil & Arnica',
    badge: 'AU BROCHURE PDF',
    image: '/media/anchialo/anchialo-oil-arnica-promo.webp',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Product_Guide_AU.pdf',
    pdfLabel: 'Product Guide PDF',
  },
  {
    id: 'mma-wholesale-deck',
    title: 'Partner & MMA Athlete Recovery Deck',
    badge: 'WHOLESALE PDF',
    image: '/media/anchialo/mma-slide-1.webp',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Partner_Wholesale_Guide_AU.pdf',
    pdfLabel: 'Wholesale Guide PDF',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'pomorie-aerial-sandbar',
    title: 'Lake Pomorie Aerial Sandbar — ANCHIALO',
    category: 'Online Store',
    metric: 'Aerial Drone • Black Sea Coast',
    region: 'Lake Pomorie, Bulgaria & AU',
    image: '/media/anchialo/pomorie-sandbar-drone.webp',
    stack: ['Online Store', 'Aerial Media', 'Fast Mobile Checkout'],
    summary:
      'High-altitude aerial photography of the Pomorie sandbar and hypersaline lagoons anchoring ANCHIALO Australia’s authentic origin storytelling.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'crimson-salt-harvest',
    title: 'Crimson Salt Lakes — Pomorie Lye Harvest',
    category: 'Online Store',
    metric: '253.14 g/L MgCl₂ Origin',
    region: 'Pomorie Salt Pans',
    image: '/media/anchialo/pomorie-lye-harvest.webp',
    stack: ['Editorial Commerce', 'Google SEO', 'Origin Proof'],
    summary:
      'Striking red hypersaline evaporation basins where Black Sea magnesium-rich lye and medical peloids are naturally concentrated.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'pomorie-mineral-basin',
    title: 'Hypersaline Lake Pomorie Mineral Basin',
    category: 'Online Store',
    metric: '70.36 g/L Magnesium Sulfate',
    region: 'Melbourne & Pomorie',
    image: '/media/anchialo/pomorie-lye-floating.webp',
    stack: ['D2C E-Commerce', 'Visual Storytelling', 'AU Fulfillment'],
    summary:
      'Aerial view of mineral-dense red salt waters powering ANCHIALO Australia’s topical Magnesium Gel and Oil recovery range.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    isConcept: false,
  },
  {
    id: 'cpt-mma-melbourne',
    title: 'CPT MMA Melbourne — Sotir Kichukov',
    category: 'Corporate Website',
    metric: 'ONE Championship Veteran Academy',
    region: 'Melbourne, Australia',
    image: '/media/mockup-cptmma.webp',
    stack: ['Video Showcase', 'Lead Funnel', 'Local SEO'],
    summary:
      'Elite MMA, K1 kickboxing, wrestling & submission coaching platform in Melbourne led by ONE Championship veteran Sotir Kichukov—featuring 1-on-1 commitment protocols and private group intake.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'aeterna-platform',
    title: 'AETERNA — Digital Flagship Platform',
    category: 'Web App',
    metric: 'Interactive Flagship • Instant Load',
    region: 'Global Flagship',
    image: '/media/mockup-aeterna.webp',
    stack: ['Custom Web App', 'Interactive 3D', 'Global Speed'],
    summary:
      'High-impact interactive digital flagship built for instant worldwide loading, luxury visual presentation, and effortless navigation on desktop and mobile.',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
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
    id: 'quality-cert-page-1',
    title: 'Official Quality Certificate — Lab Analysis (Page 1)',
    category: 'Online Store',
    metric: 'Certified Lab Documentation',
    region: 'Bulgaria & Australia',
    image: '/media/anchialo/quality_certificate_page_1.webp',
    stack: ['Official PDF', 'Lab Certificate', 'Compliance Proof'],
    summary:
      'Official laboratory Quality Certificate Page 1 verifying mineral composition and purity for ANCHIALO Black Sea Magnesium & Peloid formulations.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    isDocument: true,
    isConcept: false,
  },
  {
    id: 'quality-cert-page-2',
    title: 'Official Quality Certificate — 253.14 g/L MgCl₂ (Page 2)',
    category: 'Online Store',
    metric: '253.14 g/L MgCl₂ Assay',
    region: 'Bulgaria & Australia',
    image: '/media/anchialo/quality_certificate_page_2.webp',
    stack: ['Official PDF', 'Mineral Assay', 'Clinical Data'],
    summary:
      'Page 2 of the official lab dossier detailing exact ion concentrations: 253.14 g/L Magnesium Chloride and 70.36 g/L Magnesium Sulfate.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    isDocument: true,
    isConcept: false,
  },
  {
    id: 'quality-cert-page-3',
    title: 'Official Quality Certificate — Certified Peloid Spec (Page 3)',
    category: 'Online Store',
    metric: 'Medical Peloid Spec',
    region: 'Bulgaria & Australia',
    image: '/media/anchialo/quality_certificate_page_3.webp',
    stack: ['Official PDF', 'ISO Quality', 'Regulatory Dossier'],
    summary:
      'Page 3 of the official ANCHIALO certification confirming batch consistency, heavy-metal safety limits, and accredited testing signatures.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf',
    isDocument: true,
    isConcept: false,
  },
  {
    id: 'anchialo-product-guide-au',
    title: 'ANCHIALO Product Guide AU — Magnesium & Arnica',
    category: 'Online Store',
    metric: 'Australian Product PDF',
    region: 'Melbourne, Australia',
    image: '/media/anchialo/anchialo-oil-arnica-promo.webp',
    stack: ['AU Brochure PDF', 'D2C Product Spec', 'Print & Web'],
    summary:
      'Official Australian digital product guide showcasing ANCHIALO Magnesium & Arnica oil formulations for muscle recovery and joint relief.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Product_Guide_AU.pdf',
    isConcept: false,
  },
  {
    id: 'anchialo-lye-brochure',
    title: 'ANCHIALO Black Sea Lye Editorial Brochure',
    category: 'Online Store',
    metric: 'Wholesale Partner PDF',
    region: 'Australia & Global',
    image: '/media/anchialo/anchialo-oil-lye-promo.webp',
    stack: ['Partner Guide PDF', 'Clinic Distribution', 'Brand System'],
    summary:
      'Bespoke ANCHIALO wholesale brochure built for physiotherapy clinics, pharmacies, and recovery studios across Australia.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Partner_Wholesale_Guide_AU.pdf',
    isConcept: false,
  },
  {
    id: 'anchialo-mma-recovery-deck',
    title: 'ANCHIALO × MMA Athlete Recovery Deck',
    category: 'Online Store',
    metric: 'Combat Sports Recovery PDF',
    region: 'Melbourne, VIC',
    image: '/media/anchialo/mma-slide-1.webp',
    stack: ['MMA Recovery Deck', 'Wholesale PDF', 'Sports Performance'],
    summary:
      'High-impact combat sports recovery presentation connecting Lake Pomorie magnesium transdermal therapy with Melbourne MMA athletes.',
    liveUrl: 'https://anchialo.com',
    liveDomain: 'anchialo.com',
    pdfUrl: 'https://anchialo.com/assets/brochures/ANCHIALO_Partner_Wholesale_Guide_AU.pdf',
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
    poster: '/media/mockup-anchialo.webp',
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
    poster: '/media/mockup-cptmma.webp',
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
