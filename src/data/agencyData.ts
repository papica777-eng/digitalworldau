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
    { label: 'Brand Identity Systems', desc: 'Logo marks, motion guidelines & design tokens', href: '/#contact', preset: 'UI/UX & Web Design' },
  ],
  development: [
    { label: 'Custom Websites & Astro', desc: 'Sub-second static HTML, Svelte 5 & WebAssembly', href: '/#contact', preset: 'Custom Development' },
    { label: 'E-Commerce Flagships', desc: 'High-volume D2C stores engineered for mobile speed', href: '/#contact', preset: 'E-Commerce Store' },
    { label: 'Maintenance & Security SLA', desc: '24/7 edge monitoring, backups & hardening', href: '/#contact', preset: 'Custom Development' },
  ],
  marketing: [
    { label: 'Technical & Local SEO', desc: 'JSON-LD schema, Core Web Vitals & organic pipeline', href: '/#contact', preset: 'SEO & Paid Growth' },
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
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'anchialo-australia',
    title: 'ANCHIALO Australia — Magnesium Recovery',
    category: 'Online Store',
    metric: '253 g/L MgCl₂ • Melbourne Dispatch',
    region: 'Melbourne, Australia',
    image: '/media/mockup-anchialo.webp',
    stack: ['E-Commerce Flagship', 'Schema SEO', 'Cloudflare Edge'],
    summary:
      'Official Australian D2C store for certified topical Magnesium Gel & Magnesium Oil (253.14 g/L Magnesium Chloride & 70.36 g/L Magnesium Sulfate from Lake Pomorie) engineered for rapid muscle recovery & joint mobility.',
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
    stack: ['High-Frame Video', 'Application Funnel', 'Local SEO'],
    summary:
      'Elite MMA, K1 kickboxing, wrestling & submission coaching platform in Melbourne led by ONE Championship veteran Sotir Kichukov—featuring 1-on-1 commitment protocols and private group intake.',
    liveUrl: 'https://cptmma.com',
    liveDomain: 'cptmma.com',
    isConcept: false,
  },
  {
    id: 'aeterna-platform',
    title: 'AETERNA — Sovereign AI & WebGL2 Platform',
    category: 'Web App',
    metric: 'WebGL2 SDF • Post-Quantum',
    region: 'Global Sovereign Cloud',
    image: '/media/mockup-aeterna.webp',
    stack: ['WebGL2 Raymarch', 'Rust / Wasm', 'Astro + Svelte 5'],
    summary:
      'Real-time WebGL2 SDF 4D/5D interactive biophysics studio, cryptographic telemetry interface, and zero-latency sovereign engineering portal.',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    isConcept: false,
  },
  {
    id: 'bondi-botanicals',
    title: 'Botanical Elixir — Bondi Skincare',
    category: 'Online Store',
    metric: '0.85s Mobile LCP Architecture',
    region: 'Sydney, Australia',
    image: '/media/mockup-bondi.webp',
    stack: ['Astro 5', 'Headless Commerce', 'Stripe'],
    summary:
      'UI/UX Concept for a luxury Australian botanical skincare storefront engineered for sub-second mobile checkout and subscription renewals.',
    isConcept: true,
  },
  {
    id: 'kestrel-roasters',
    title: 'Kestrel Specialty Roasters',
    category: 'Online Store',
    metric: 'Subscription Cadence Engine',
    region: 'Melbourne, Australia',
    image: '/media/mockup-roasters.webp',
    stack: ['Shopify Plus', 'Svelte 5', 'Klaviyo'],
    summary:
      'UI/UX Concept for a small-batch Melbourne coffee roaster featuring origin tasting notes and a recurring delivery builder.',
    isConcept: true,
  },
  {
    id: 'southern-cross-wealth',
    title: 'Southern Cross Wealth Advisory',
    category: 'Corporate Website',
    metric: 'Interactive Wasm Calculators',
    region: 'Melbourne & APAC',
    image: '/media/mockup-wealth.webp',
    stack: ['TypeScript', 'Rust/Wasm', 'Edge CDN'],
    summary:
      'UI/UX Concept for institutional wealth advisory teams pairing client education hubs with real-time deterministic financial calculators.',
    isConcept: true,
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
      { label: 'Performance', value: '100/100' },
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
      { label: 'Mobile Speed', value: '0.78s LCP' },
      { label: 'Intake Model', value: 'Application' },
    ],
  },
  {
    tag: 'Live WebGL2 & Sovereign Platform',
    client: 'AETERNA Sovereign Platform (aeterna.website)',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    video: '/videos/case-aeterna.mp4',
    poster: '/media/mockup-aeterna.webp',
    headline: 'Interactive 8K WebGL2 SDF 4D/5D visual computation & bare-metal telemetry flagship',
    quote:
      'Combining custom GLSL raymarched shaders, zero-bloat static Astro delivery, and Rust-powered determinism proves how real-time 3D engineering runs at 60fps directly in mobile and desktop browsers.',
    author: 'Dimitar Prodromov',
    role: 'Founder & Principal Systems Architect — AETERNA',
    avatar: '/media/mockup-aeterna.webp',
    monogram: 'AE',
    stats: [
      { label: 'Shader Engine', value: 'WebGL2 SDF' },
      { label: 'Frame Target', value: '60 FPS' },
      { label: 'Core Web Vitals', value: '100/100' },
    ],
  },
];

export const GLOBAL_REGIONS = [
  { name: 'Australia', code: 'AU', clients: 'Sydney & Melbourne HQ', hub: 'Primary Hub', lat: -33.8688, lng: 151.2093 },
  { name: 'Bulgaria', code: 'BG', clients: 'Engineering Hub', hub: 'Sofia & Burgas', lat: 42.6977, lng: 23.3219 },
  { name: 'Germany', code: 'DE', clients: 'DACH Delivery', hub: 'Berlin & Munich', lat: 48.1351, lng: 11.582 },
  { name: 'France', code: 'FR', clients: 'EU Commerce', hub: 'Paris & Lyon', lat: 48.8566, lng: 2.3522 },
  { name: 'Switzerland', code: 'CH', clients: 'Enterprise Web', hub: 'Zurich & Geneva', lat: 47.3769, lng: 8.5417 },
  { name: 'USA', code: 'US', clients: 'North America', hub: 'New York & Austin', lat: 40.7128, lng: -74.006 },
  { name: 'Canada', code: 'CA', clients: 'North America', hub: 'Toronto & Vancouver', lat: 43.6532, lng: -79.3832 },
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
      'Digital World AU engineered cptmma.com with the exact discipline we demand on the mats—instant video playback, razor-sharp fight protocol breakdowns, and an application funnel built for serious Melbourne athletes.',
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
      'From interactive Lake Pomorie balneology storytelling to sub-second mobile checkout for our 253 g/L Magnesium Gel and Oil collection, anchialo.com delivers a seamless Australian shopping experience.',
  },
  {
    name: 'Dimitar Prodromov',
    role: 'Founder & Principal Systems Architect',
    company: 'AETERNA Technologies',
    country: 'Bulgaria & Australia',
    avatar: '/media/mockup-aeterna.webp',
    monogram: 'AE',
    accent: '#e879f9',
    liveUrl: 'https://aeterna.website',
    liveDomain: 'aeterna.website',
    quote:
      'Every flagship we ship pairs zero-JS static Astro architecture, Dart Sass design systems, Rust/Wasm speed, and interactive WebGL2 geometry—giving ambitious brands measurable speed and authentic engineering ownership.',
  },
];

export const SERVICES_BENTO = [
  {
    step: '01',
    title: 'Website Audit',
    preset: 'Free 48-Hour Website Audit',
    subtitle: 'Forensic diagnostics before execution',
    items: ['UX Heuristic & Funnel Friction Audit', 'Core Web Vitals & Edge Speed Profiling', 'Full Technical SEO & Schema Crawl'],
    highlight: 'Delivered in 48 Hours',
  },
  {
    step: '02',
    title: 'Design',
    preset: 'UI/UX & Web Design',
    subtitle: 'High-contrast visual authority',
    items: ['UI/UX Product & Journey Architecture', 'Bespoke Dark & Editorial Web Design', 'Component Libraries & Brand Identity'],
    highlight: 'Interactive Figma Systems',
  },
  {
    step: '03',
    title: 'Development',
    preset: 'Custom Development',
    subtitle: 'Sub-second resilient engineering',
    items: ['Custom Websites (Astro, Svelte, React, WP)', 'High-Converting E-Commerce Platforms', 'Managed Security, Backups & SLA'],
    highlight: '99.98% Uptime & Wasm',
  },
  {
    step: '04',
    title: 'Marketing',
    preset: 'SEO & Paid Growth',
    subtitle: 'Compounding traffic & Google Ads CRO',
    items: ['Technical, National & Local SEO', 'Google Ads Landing Pages & PPC CRO', 'Social Content & Lifecycle Email Flows'],
    highlight: 'Verified Attribution',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What does your end-to-end work process look like?',
    a: 'Every engagement runs in four transparent sprints: (1) Forensic Discovery & Technical Audit, (2) Interactive Wireframes & Figma Design System, (3) Full-Stack Engineering, Motion Polish & Device QA, and (4) Zero-Downtime Launch, Core Web Vitals verification, and conversion tracking.',
  },
  {
    q: 'What do you need from us as a client to get started?',
    a: 'Just a 30-minute alignment call, any existing brand guidelines or product photography, and read-only analytics/search console access if we are auditing or migrating an existing domain. Our strategists handle information architecture, UX copy refinement, and technical execution.',
  },
  {
    q: 'How do communication and progress reporting work?',
    a: 'You get a dedicated Slack channel directly with your lead UI/UX designer and principal engineer, weekly recorded video walkthroughs, a live staging preview updated continuously, and clear milestone sign-offs.',
  },
  {
    q: 'Who owns the source code, designs, and intellectual property?',
    a: 'You own 100% of everything. Upon final milestone completion, all Figma design systems, Git repositories, custom WebAssembly/frontend code, and domain configurations belong exclusively to your company with zero vendor lock-in.',
  },
  {
    q: 'Are all websites built mobile-first and Google Ads ready?',
    a: 'Unconditionally. Over 68% of modern paid and organic traffic arrives on mobile viewports. Every layout is engineered for sub-second LCP, clean conversion tracking, Privacy Policy/Cookie compliance, and 95–100 Lighthouse scores.',
  },
  {
    q: 'How is custom project pricing structured?',
    a: 'We work on fixed-scope, transparent milestones in AUD or EUR—ranging from A$3,300–A$8,250 (€2,000–€5,000) for high-velocity conversion landing systems up to A$33,000–A$82,500 (€20,000–€50,000) for bespoke multi-region e-commerce flagships and custom web applications.',
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
      'Deploy HealthAndBeautyBusiness JSON-LD schema for local map-pack dominance.',
    ],
  },
  {
    slug: 'scalable-news-portal-architecture',
    tag: 'Media Engineering',
    readTime: '8 min read',
    title: 'Architecting High-Traffic News Portals for Instant Edge Delivery',
    excerpt:
      'How static-first Astro islands, Cloudflare Anycast caching, and structured editorial pipelines absorb viral breaking-news spikes with sub-50ms TTFB.',
    image: '/media/blog-news.webp',
    takeaways: [
      'Pre-render article shells at the CDN edge while isolating live tickers into tiny islands.',
      'Automate Google News XML sitemaps, NewsArticle schema, and Core Web Vitals budgets.',
      'Design high-readability dark/light typographic rhythm that lifts ad & subscription retention.',
    ],
  },
  {
    slug: 'launching-classifieds-marketplace',
    tag: 'Marketplaces',
    readTime: '7 min read',
    title: 'Launching a Profitable Classifieds Platform: Search, Trust & Monetisation',
    excerpt:
      'Engineering sub-second faceted search, zero-trust media upload checks, and promoted seller tiers that compound marketplace liquidity.',
    image: '/media/blog-classifieds.webp',
    takeaways: [
      'Keep multi-filter category + radius search under 80ms with clean indexable URLs.',
      'Validate uploaded listing photos in-browser via WebAssembly magic-byte inspection.',
      'Balance free organic listings with featured boosts and verified dealer subscriptions.',
    ],
  },
  {
    slug: 'corporate-website-authority-blueprint',
    tag: 'B2B Strategy',
    readTime: '5 min read',
    title: 'The Modern Corporate Website Blueprint for Enterprise Trust & Pipeline',
    excerpt:
      'Why generic corporate sites leak deals—and how verifiable video case studies, interactive ROI models, and executive clarity multiply inbound RFPs.',
    image: '/media/blog-corporate.webp',
    takeaways: [
      'Replace vague slogans with quantified client outcomes and live production case studies.',
      'Pair primary quote forms with a low-friction Free Expert Audit lead magnet.',
      'Enforce strict WCAG AA contrast, instant asset delivery, and full IP transparency.',
    ],
  },
];
