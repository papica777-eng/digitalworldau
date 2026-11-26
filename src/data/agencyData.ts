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

export const MEGA_MENU = {
  design: [
    { label: 'UI/UX Product Design', desc: 'Conversion-focused user journeys & wireframes', href: '#services' },
    { label: 'Bespoke Web Design', desc: 'Awwwards-calibre dark & editorial interfaces', href: '#services' },
    { label: 'Brand Identity Systems', desc: 'Logo marks, typography & design tokens', href: '#services' },
  ],
  development: [
    { label: 'Custom Websites & Astro', desc: 'Sub-second static & WebAssembly builds', href: '#services' },
    { label: 'E-Commerce Stores', desc: 'High-volume WooCommerce, Shopify & headless', href: '#services' },
    { label: 'Maintenance & Security', desc: '24/7 uptime monitoring, SLA & hardening', href: '#services' },
  ],
  marketing: [
    { label: 'Technical & Local SEO', desc: 'Schema, Core Web Vitals & organic growth', href: '#services' },
    { label: 'Paid Search & PPC', desc: 'ROI-tracked Google & Meta acquisition', href: '#services' },
    { label: 'Email & Lifecycle Flows', desc: 'Automated retention & cart recovery', href: '#services' },
  ],
};

export const PORTFOLIO_ITEMS = [
  {
    id: 'bondi-botanicals',
    title: 'Bondi Botanicals',
    category: 'Online Store',
    metric: '+184% Checkout Conversion',
    region: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80',
    stack: ['Astro', 'WooCommerce', 'Stripe'],
    summary: 'Luxury skincare e-commerce platform engineered for sub-second mobile checkout and subscription renewals.',
  },
  {
    id: 'southern-cross-wealth',
    title: 'Southern Cross Wealth',
    category: 'Corporate Website',
    metric: '3.4x Qualified Leads',
    region: 'Melbourne, Australia',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    stack: ['TypeScript', 'Svelte', 'Wasm'],
    summary: 'Financial education and advisory hub with interactive retirement calculators and gated institutional briefings.',
  },
  {
    id: 'alpen-medtech',
    title: 'Alpen MedTech AG',
    category: 'Corporate Website',
    metric: '99/100 Lighthouse',
    region: 'Zurich, Switzerland',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    stack: ['Headless CMS', 'SCSS', 'CDN'],
    summary: 'Multilingual medical diagnostics portal compliant with strict European accessibility and privacy standards.',
  },
  {
    id: 'pacific-roasters',
    title: 'Pacific Roasters Co.',
    category: 'Online Store',
    metric: '$1.8M Annualised Run Rate',
    region: 'Brisbane, Australia',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1000&q=80',
    stack: ['Shopify Plus', 'React', 'Klaviyo'],
    summary: 'Direct-to-consumer specialty coffee storefront with recurring roast cadence builder and wholesale portal.',
  },
  {
    id: 'nordic-freight',
    title: 'Nordic Freight OS',
    category: 'Web App',
    metric: '42% Faster Dispatch',
    region: 'Munich, Germany',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=80',
    stack: ['React.js', 'Docker', 'REST'],
    summary: 'Real-time logistics telemetry dashboard connecting European carriers with Australian port customs.',
  },
];

export const CASE_STUDIES = [
  {
    tag: 'Online Store',
    client: 'Bondi Botanicals AU',
    headline: 'Re-architecting a heritage skincare storefront for 2.4x faster mobile checkout',
    quote:
      'Digital World AU rebuilt our entire e-commerce experience from the ground up. Page load times dropped under 0.9 seconds and our mobile revenue surged 184% within the first quarter.',
    author: 'Charlotte Hayes',
    role: 'Head of Digital Commerce, Bondi Botanicals',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=80',
    stats: [
      { label: 'Conversion Lift', value: '+184%' },
      { label: 'Mobile LCP', value: '0.85s' },
      { label: 'Avg. Order Value', value: '+31%' },
    ],
  },
  {
    tag: 'Corporate Website',
    client: 'Southern Cross Wealth Academy',
    headline: 'Scaling a high-trust financial education platform across Australia & APAC',
    quote:
      'Their team fused razor-sharp financial UI with technical SEO that put us on page one across 40+ high-intent keywords. Demo bookings tripled before our campaign even peaked.',
    author: 'Liam Patterson',
    role: 'Managing Director, Southern Cross Wealth',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80',
    stats: [
      { label: 'Qualified Leads', value: '3.4x' },
      { label: 'Organic Traffic', value: '+260%' },
      { label: 'Core Web Vitals', value: '100/100' },
    ],
  },
];

export const GLOBAL_REGIONS = [
  { name: 'Australia', code: 'AU', clients: '74+ Clients', hub: 'Sydney & Melbourne' },
  { name: 'Bulgaria', code: 'BG', clients: '42+ Clients', hub: 'Sofia & Burgas' },
  { name: 'Germany', code: 'DE', clients: '21+ Clients', hub: 'Berlin & Munich' },
  { name: 'France', code: 'FR', clients: '14+ Clients', hub: 'Paris & Lyon' },
  { name: 'Switzerland', code: 'CH', clients: '12+ Clients', hub: 'Zurich & Geneva' },
  { name: 'USA', code: 'US', clients: '15+ Clients', hub: 'New York & Austin' },
  { name: 'Canada', code: 'CA', clients: '9+ Clients', hub: 'Toronto & Vancouver' },
];

export const TESTIMONIALS = [
  {
    name: 'Amelia Thornton',
    role: 'Founder & CEO',
    company: 'Harbourline Interiors (Sydney)',
    country: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=260&q=80',
    quote:
      'From the initial two-week UX audit to launch day, Digital World AU operated like an embedded product team. Our showroom booking pipeline doubled in eight weeks.',
  },
  {
    name: 'Nikolay Georgiev',
    role: 'CTO',
    company: 'Vitosha FinTech Labs',
    country: 'Bulgaria',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=260&q=80',
    quote:
      'Rarely do you find an agency that obsesses equally over visual craft and clean technical architecture. Zero bloat, rock-solid Docker pipelines, and 99+ Lighthouse scores.',
  },
  {
    name: 'Lukas Weber',
    role: 'VP of Marketing',
    company: 'KronoMed GmbH',
    country: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=260&q=80',
    quote:
      'They migrated our legacy corporate portal without losing a single organic ranking—in fact, non-branded organic impressions grew 145% within 90 days.',
  },
  {
    name: 'Claire Moreau',
    role: 'Brand Director',
    company: 'Atelier Lumière',
    country: 'France',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=260&q=80',
    quote:
      'The interactive lookbook and micro-interactions feel effortlessly bespoke. Our international wholesale buyers constantly compliment the digital experience.',
  },
];

export const TECH_STACK = [
  { name: 'Figma', category: 'Design', badge: 'FG' },
  { name: 'HTML5', category: 'Markup', badge: 'H5' },
  { name: 'CSS3', category: 'Styling', badge: 'C3' },
  { name: 'WordPress', category: 'CMS', badge: 'WP' },
  { name: 'Elementor', category: 'Builder', badge: 'EL' },
  { name: 'PHP', category: 'Backend', badge: 'PHP' },
  { name: 'React.js', category: 'Frontend', badge: 'RE' },
  { name: 'Git', category: 'VCS', badge: 'GIT' },
  { name: 'Docker', category: 'Containers', badge: 'DK' },
  { name: 'Ubuntu', category: 'Infrastructure', badge: 'UB' },
  { name: 'Yoast SEO', category: 'Search', badge: 'YS' },
  { name: 'Slack', category: 'Collaboration', badge: 'SL' },
];

export const SERVICES_BENTO = [
  {
    step: '01',
    title: 'Website Audit',
    subtitle: 'Diagnostics before execution',
    items: ['UX Heuristic & Funnel Audit', 'Technical Core Web Vitals', 'Full SEO Crawl & Schema Review'],
    highlight: 'Free 2-Week Expert Audit Available',
  },
  {
    step: '02',
    title: 'Design',
    subtitle: 'Editorial clarity & visual authority',
    items: ['UI/UX Product Architecture', 'Bespoke Dark & Brand Web Design', 'Design Systems & Brand Identity'],
    highlight: 'Interactive Figma Prototypes',
  },
  {
    step: '03',
    title: 'Development',
    subtitle: 'Fast, resilient engineering',
    items: ['Custom Websites (Astro, React, WP)', 'High-Converting E-Commerce Stores', 'Managed Maintenance & Security SLA'],
    highlight: '99.98% Uptime & Zero-Bloat Code',
  },
  {
    step: '04',
    title: 'Marketing',
    subtitle: 'Measurable pipeline & revenue',
    items: ['Technical & Local SEO Growth', 'Google & Meta PPC Campaigns', 'Social Media & Email Automation'],
    highlight: 'Transparent ROI Attribution',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What does your end-to-end work process look like?',
    a: 'Every engagement follows four transparent sprints: (1) Discovery & Technical Audit, (2) Interactive Wireframes & Figma UI System, (3) Full-Stack Engineering & QA across real devices, and (4) Launch, Core Web Vitals tuning, and post-launch growth tracking.',
  },
  {
    q: 'What do you need from us as a client to get started?',
    a: 'All we need is a 30-minute discovery call, any existing brand assets or guidelines, and access to current analytics or hosting if we are performing a migration or audit. We handle copy structure, UX architecture, and technical implementation.',
  },
  {
    q: 'How do communication and progress reporting work?',
    a: 'You receive a dedicated Slack channel with our lead designer and senior engineer, weekly async Loom walkthroughs, a live staging preview URL updated continuously, and structured milestone sign-offs.',
  },
  {
    q: 'Who owns the source code, designs, and intellectual property?',
    a: 'You do—100%. Upon final milestone completion, all Figma source files, custom code repositories, domain configurations, and licensed assets are transferred cleanly to your organisation with zero vendor lock-in.',
  },
  {
    q: 'Are all websites built mobile-first and responsive?',
    a: 'Yes. Over 68% of Australian consumer and B2B traffic originates on mobile devices. We design and test every breakpoint from 360px phones up to ultrawide 4K monitors, targeting 95+ mobile Lighthouse scores.',
  },
  {
    q: 'How is custom project pricing structured?',
    a: 'Pricing is fixed-scope and milestone-based, tailored to complexity—from €2k–€5k ($3.3k–$8.2k AUD) for agile landing systems up to €20k–€50k ($33k–$82.5k AUD) for bespoke multi-region e-commerce or web platforms.',
  },
];

export const BLOG_POSTS = [
  {
    slug: 'beauty-salon-website-guide',
    tag: 'Booking & UX',
    readTime: '6 min read',
    title: 'How to Build a High-Converting Website for Beauty Salons & Medspas',
    excerpt:
      'Frictionless online booking flows, treatment menu psychology, and local Australian SEO tactics that turn Instagram browsers into repeat appointments.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    takeaways: [
      'Place one-tap booking CTAs above the fold on mobile viewports.',
      'Pair transparent service duration & pricing with before/after social proof.',
      'Implement LocalBusiness + HealthAndBeautyBusiness JSON-LD schema for Google Maps.',
    ],
  },
  {
    slug: 'scalable-news-portal-architecture',
    tag: 'Media Engineering',
    readTime: '8 min read',
    title: 'Architecting High-Traffic News Portals for Instant Edge Delivery',
    excerpt:
      'How static-first islands, Cloudflare edge caching, and structured editorial workflows handle breaking-news traffic spikes without server meltdowns.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80',
    takeaways: [
      'Serve editorial articles as pre-rendered HTML at the CDN edge for <80ms TTFB.',
      'Use NewsArticle schema, clean pagination, and automated XML news sitemaps.',
      'Isolate comments and live polls into lightweight client islands.',
    ],
  },
  {
    slug: 'launching-classifieds-marketplace',
    tag: 'Marketplaces',
    readTime: '7 min read',
    title: 'Launching a Profitable Classifieds Platform: Search, Trust & Monetisation',
    excerpt:
      'From faceted sub-second filtering and anti-spam verification to featured listing tiers that create sustainable recurring marketplace revenue.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
    takeaways: [
      'Design sub-second location + price faceted search with URL state sync.',
      'Enforce verified seller badges and file magic-byte checks on listing uploads.',
      'Bundle promoted listings and dealer subscriptions for predictable MRR.',
    ],
  },
  {
    slug: 'corporate-website-authority-blueprint',
    tag: 'B2B Strategy',
    readTime: '5 min read',
    title: 'The Modern Corporate Website Blueprint for Enterprise Trust & Lead Gen',
    excerpt:
      'Why generic brochure sites fail—and how sharp positioning, verifiable case studies, and interactive ROI tools multiply inbound enterprise deals.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    takeaways: [
      'Lead with quantifiable client outcomes rather than vague mission statements.',
      'Offer a zero-friction diagnostic or audit magnet alongside standard contact forms.',
      'Maintain strict WCAG AA contrast and sub-second Core Web Vitals across every page.',
    ],
  },
];
