export interface BudgetTier {
  id: number;
  labelEur: string;
  minEurCents: number;
  maxEurCents: number;
}

export const BUDGET_TIERS: BudgetTier[] = [
  { id: 1, labelEur: '€2k–€5k', minEurCents: 200_000, maxEurCents: 500_000 },
  { id: 2, labelEur: '€5k–€10k', minEurCents: 500_000, maxEurCents: 1_000_000 },
  { id: 3, labelEur: '€10k–€20k', minEurCents: 1_000_000, maxEurCents: 2_000_000 },
  { id: 4, labelEur: '€20k–€50k', minEurCents: 2_000_000, maxEurCents: 5_000_000 },
];

export const CLIENT_AVATARS = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=140&q=80',
];

export const MEGA_MENU = {
  design: [
    { label: 'UI/UX Product Design', desc: 'Conversion-focused user journeys & interactive prototypes', href: '#services' },
    { label: 'Bespoke Web Design', desc: 'Awwwards-calibre dark & editorial brand experiences', href: '#services' },
    { label: 'Brand Identity Systems', desc: 'Logo marks, motion guidelines & design tokens', href: '#services' },
  ],
  development: [
    { label: 'Custom Websites & Astro', desc: 'Sub-second static HTML, Svelte 5 & WebAssembly', href: '#services' },
    { label: 'E-Commerce Flagships', desc: 'High-volume WooCommerce, Shopify Plus & headless', href: '#services' },
    { label: 'Maintenance & Security SLA', desc: '24/7 edge monitoring, backups & hardening', href: '#services' },
  ],
  marketing: [
    { label: 'Technical & Local SEO', desc: 'JSON-LD schema, Core Web Vitals & organic pipeline', href: '#services' },
    { label: 'Paid Search & Social PPC', desc: 'ROI-attributed Google, Meta & LinkedIn acquisition', href: '#services' },
    { label: 'Email & Lifecycle Flows', desc: 'Automated retention, VIP tiers & cart recovery', href: '#services' },
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
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'bondi-botanicals',
    title: 'Botanical Elixir — Bondi AU',
    category: 'Online Store',
    metric: '+184% Checkout Conversion',
    region: 'Sydney, Australia',
    image: '/media/mockup-bondi.webp',
    stack: ['Astro 5', 'Headless Commerce', 'Stripe'],
    summary: 'Luxury botanical skincare flagship engineered for sub-second mobile checkout and recurring replenishment.',
  },
  {
    id: 'kestrel-roasters',
    title: 'Kestrel Specialty Roasters',
    category: 'Online Store',
    metric: 'A$2.4M Annualised Run Rate',
    region: 'Melbourne, Australia',
    image: '/media/mockup-roasters.webp',
    stack: ['Shopify Plus', 'Svelte 5', 'Klaviyo'],
    summary: 'Small-batch Melbourne coffee storefront with interactive origin tasting profiles and subscription cadence builder.',
  },
  {
    id: 'southern-cross-wealth',
    title: 'Southern Cross Wealth',
    category: 'Corporate Website',
    metric: '3.4x Qualified Pipeline',
    region: 'Melbourne & APAC',
    image: '/media/mockup-wealth.webp',
    stack: ['TypeScript', 'Rust/Wasm', 'Edge CDN'],
    summary: 'Institutional wealth education & advisory hub with live compound portfolio calculators and executive briefings.',
  },
  {
    id: 'alpen-medtech',
    title: 'Alpen MedTech Diagnostics',
    category: 'Corporate Website',
    metric: '100/100 Core Web Vitals',
    region: 'Zurich, Switzerland',
    image: '/media/mockup-alpen.webp',
    stack: ['Headless CMS', 'Modular SCSS', 'ISO-WCAG'],
    summary: 'Multilingual clinical diagnostics portal engineered for zero-latency global delivery and strict European compliance.',
  },
  {
    id: 'atelier-lumiere',
    title: 'Atelier Lumière Maison',
    category: 'Online Store',
    metric: '+142% International Orders',
    region: 'Paris, France',
    image: '/media/mockup-lumiere.webp',
    stack: ['Custom WebGL', 'WooCommerce', 'Multi-Currency'],
    summary: 'Architectural lighting & sculptural interior gallery with bespoke chiaroscuro lookbooks and trade quoting.',
  },
  {
    id: 'chronos-geneve',
    title: 'Chronos Horology Lab',
    category: 'Web App',
    metric: '4.7m Avg. Session Time',
    region: 'Geneva, Switzerland',
    image: '/media/mockup-chrono.webp',
    stack: ['Three.js', 'React.js', 'REST API'],
    summary: 'Interactive mechanical calibre explorer and bespoke strap/bezel configurator for private collectors.',
  },
  {
    id: 'volt-mobility',
    title: 'Volt Fleet Telemetry OS',
    category: 'Web App',
    metric: '42% Faster Dispatch',
    region: 'Munich, Germany',
    image: '/media/mockup-mobility.webp',
    stack: ['React.js', 'Docker', 'WebSockets'],
    summary: 'Real-time EV charging and logistics dispatch interface connecting European corridors with APAC port hubs.',
  },
  {
    id: 'harbourline-studio',
    title: 'Harbourline Architecture',
    category: 'Corporate Website',
    metric: '2.9x Private Commissions',
    region: 'Sydney, Australia',
    image: '/media/mockup-atelier.webp',
    stack: ['Astro', 'SCSS Motion', 'Schema SEO'],
    summary: 'Editorial monograph website showcasing coastal Australian residential architecture in high-frame-rate motion.',
  },
];

export const CASE_STUDIES = [
  {
    tag: 'Online Store',
    client: 'Botanical Elixir — Bondi AU',
    video: '/videos/case-bondi.mp4',
    poster: '/media/mockup-bondi.webp',
    headline: 'Re-architecting an Australian luxury skincare house for 0.85s mobile loads & +184% revenue growth',
    quote:
      'Digital World AU rebuilt our entire e-commerce experience from the ground up. Mobile load times dropped below 0.9 seconds and our recurring subscription checkout surged 184% in the first 90 days.',
    author: 'Charlotte Hayes',
    role: 'Head of Digital Commerce, Bondi Botanicals',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    stats: [
      { label: 'Conversion Lift', value: '+184%' },
      { label: 'Mobile LCP', value: '0.85s' },
      { label: 'Avg. Order Value', value: '+34%' },
    ],
  },
  {
    tag: 'Corporate Website',
    client: 'Southern Cross Wealth Academy',
    video: '/videos/case-wealth.mp4',
    poster: '/media/mockup-wealth.webp',
    headline: 'Scaling a high-trust financial education & analytics platform across Australia, Europe & North America',
    quote:
      'Their team fused razor-sharp financial UI with WebAssembly calculators and technical SEO that put us #1 across 40+ commercial terms. Qualified advisory bookings tripled inside one quarter.',
    author: 'Liam Patterson',
    role: 'Managing Director, Southern Cross Wealth',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    stats: [
      { label: 'Qualified Leads', value: '3.4x' },
      { label: 'Organic Traffic', value: '+260%' },
      { label: 'Core Web Vitals', value: '100/100' },
    ],
  },
];

export const GLOBAL_REGIONS = [
  { name: 'Australia', code: 'AU', clients: '74+ Clients', hub: 'Sydney & Melbourne', lat: -33.8688, lng: 151.2093 },
  { name: 'Bulgaria', code: 'BG', clients: '42+ Clients', hub: 'Sofia & Burgas', lat: 42.6977, lng: 23.3219 },
  { name: 'Germany', code: 'DE', clients: '21+ Clients', hub: 'Berlin & Munich', lat: 48.1351, lng: 11.582 },
  { name: 'France', code: 'FR', clients: '14+ Clients', hub: 'Paris & Lyon', lat: 48.8566, lng: 2.3522 },
  { name: 'Switzerland', code: 'CH', clients: '12+ Clients', hub: 'Zurich & Geneva', lat: 47.3769, lng: 8.5417 },
  { name: 'USA', code: 'US', clients: '15+ Clients', hub: 'New York & Austin', lat: 40.7128, lng: -74.006 },
  { name: 'Canada', code: 'CA', clients: '9+ Clients', hub: 'Toronto & Vancouver', lat: 43.6532, lng: -79.3832 },
];

export const TESTIMONIALS = [
  {
    name: 'Amelia Thornton',
    role: 'Founder & CEO',
    company: 'Harbourline Interiors (Sydney)',
    country: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=260&q=80',
    quote:
      'From the initial two-week UX audit to launch day, Digital World AU operated like an embedded product squad. Our private showroom consultations doubled in eight weeks.',
  },
  {
    name: 'Nikolay Georgiev',
    role: 'Chief Technology Officer',
    company: 'Vitosha FinTech Labs',
    country: 'Bulgaria',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=260&q=80',
    quote:
      'Rarely do you find an agency that obsesses equally over Awwwards-level motion craft and clean systems engineering. Zero bloat, hardened Docker pipelines, and 99+ Lighthouse.',
  },
  {
    name: 'Lukas Weber',
    role: 'VP of Global Marketing',
    company: 'KronoMed GmbH',
    country: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=260&q=80',
    quote:
      'They migrated our multi-region corporate platform without losing a single search ranking—non-branded organic impressions climbed 145% within 90 days.',
  },
  {
    name: 'Claire Moreau',
    role: 'Creative Brand Director',
    company: 'Atelier Lumière',
    country: 'France',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=260&q=80',
    quote:
      'Every hover state, transition, and glass detail feels bespoke. International luxury buyers routinely mention our digital flagship on discovery calls.',
  },
  {
    name: 'Marc-Antoine Keller',
    role: 'Managing Partner',
    company: 'Helvetia Private Advisory',
    country: 'Switzerland',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=260&q=80',
    quote:
      'Absolute precision, milestone discipline, and discreet security architecture. They delivered ahead of schedule and exceeded every Core Web Vitals benchmark.',
  },
  {
    name: 'Ethan Brooks',
    role: 'Head of Growth',
    company: 'NorthStar SaaS (NYC & Toronto)',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=260&q=80',
    quote:
      'Combining technical SEO with high-velocity landing architecture cut our paid CAC by 38% while lifting demo-to-close conversion across North America.',
  },
];

export const SERVICES_BENTO = [
  {
    step: '01',
    title: 'Website Audit',
    subtitle: 'Forensic diagnostics before execution',
    items: ['UX Heuristic & Funnel Friction Audit', 'Core Web Vitals & Edge Speed Profiling', 'Full Technical SEO & Schema Crawl'],
    highlight: 'Free 2-Week Audit',
  },
  {
    step: '02',
    title: 'Design',
    subtitle: 'Awwwards-grade visual authority',
    items: ['UI/UX Product & Journey Architecture', 'Bespoke Dark & Editorial Web Design', 'Component Libraries & Brand Identity'],
    highlight: 'Interactive Figma Systems',
  },
  {
    step: '03',
    title: 'Development',
    subtitle: 'Sub-second resilient engineering',
    items: ['Custom Websites (Astro, Svelte, React, WP)', 'High-Converting E-Commerce Platforms', 'Managed Security, Backups & SLA'],
    highlight: '99.98% Uptime & Wasm',
  },
  {
    step: '04',
    title: 'Marketing',
    subtitle: 'Compounding traffic & pipeline ROI',
    items: ['Technical, National & Local SEO', 'High-Intent Google & Meta PPC', 'Social Content & Lifecycle Email Flows'],
    highlight: 'Verified Attribution',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What does your end-to-end work process look like?',
    a: 'Every engagement runs in four transparent sprints: (1) Forensic Discovery & Technical Audit, (2) Interactive Wireframes & Figma Design System, (3) Full-Stack Engineering, Motion Polish & Device QA, and (4) Zero-Downtime Launch, Core Web Vitals verification, and growth tracking.',
  },
  {
    q: 'What do you need from us as a client to get started?',
    a: 'Just a 30-minute alignment call, any existing brand guidelines or product photography, and read-only analytics/search console access if we are auditing or migrating an existing domain. Our strategists handle information architecture, UX copy refinement, and technical execution.',
  },
  {
    q: 'How do communication and progress reporting work?',
    a: 'You get a dedicated Slack channel directly with your lead UI/UX designer and principal engineer, weekly recorded Loom video walkthroughs, a live encrypted staging link updated continuously, and clear milestone sign-offs.',
  },
  {
    q: 'Who owns the source code, designs, and intellectual property?',
    a: 'You own 100% of everything. Upon final milestone completion, all Figma design systems, Git repositories, custom WebAssembly/frontend code, and domain configurations belong exclusively to your company with zero vendor lock-in.',
  },
  {
    q: 'Are all websites built mobile-first and ultra-fast?',
    a: 'Unconditionally. Over 68% of modern traffic arrives on mobile viewports. Every layout, touch target, and video stream is tuned from 360px smartphones up to 4K studio monitors, targeting sub-second LCP and 95–100 Lighthouse scores.',
  },
  {
    q: 'How is custom project pricing structured?',
    a: 'We work on fixed-scope, transparent milestones in AUD or EUR—ranging from €2k–€5k (A$3.3k–A$8.3k) for high-velocity conversion landing systems up to €20k–€50k (A$33k–A$82.5k) for bespoke multi-region e-commerce flagships and custom web applications.',
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
      'Replace vague slogans with quantified client outcomes and video walkthroughs.',
      'Pair primary quote forms with a low-friction Free Expert Audit lead magnet.',
      'Enforce strict WCAG AA contrast, instant asset delivery, and full IP transparency.',
    ],
  },
];
