<script lang="ts">
  import HeroDeviceShowcase from './HeroDeviceShowcase.svelte';
</script>

<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container hero-grid">
    <!-- Left Column: High-converting CRO Hero written for business buyers -->
    <div class="hero-copy">
      <div class="hero-trust-line">
        <span class="trust-dot" aria-hidden="true"></span>
        <span>Sydney &amp; Melbourne • 100% Client Ownership • 24h Response SLA</span>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions<br />
        that move business<br />
        forward.
      </h1>

      <p class="hero-sub">
        Your website shouldn’t merely look impressive—it must turn clicks into booked calls and online sales. We unite modern luxury design, instant page speed, and high-converting Google Ads funnels for ambitious brands.
      </p>

      <div class="hero-action-row">
        <a href="#contact" class="hero-white-cta">Get a Quote</a>
        <a href="#contact" class="hero-audit-cta" data-preset-audit>
          Free 48-Hour Website Audit
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      <div class="hero-sub-links">
        <a href="#projects" class="text-action">Explore Live Projects →</a>
      </div>
    </div>

    <!-- Right Column: Live Laptop + iPhone Device Showcase -->
    <div class="hero-visual">
      <HeroDeviceShowcase />
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .hero {
    padding-block: clamp(2.6rem, 5.5vw, 4.8rem) clamp(3.4rem, 6vw, 5.2rem);
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 0.94fr 1.06fr;
      gap: 2.25rem;
    }
  }

  .hero-trust-line {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-family: $font-mono;
    font-size: 0.74rem;
    color: $accent-blue-light;
    margin-bottom: 1.15rem;
    letter-spacing: 0.02em;
  }

  .trust-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $accent-emerald;
    box-shadow: 0 0 10px $accent-emerald;
    flex-shrink: 0;
  }

  .hero-title {
    @include heading-display;
    font-size: clamp(2.65rem, 5.1vw, 4.35rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin: 0 0 1.45rem;
    color: #ffffff;
  }

  .hero-sub {
    font-size: clamp(0.98rem, 1.32vw, 1.1rem);
    color: rgba(255, 255, 255, 0.76);
    margin: 0 0 2.25rem;
    max-width: 50ch;
    line-height: 1.65;
  }

  .hero-action-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.95rem 1.15rem;
    margin-bottom: 1.5rem;
  }

  .hero-white-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.95rem 2.15rem;
    border-radius: $radius-pill;
    background: #ffffff;
    color: #05070d;
    font-weight: 800;
    font-size: 0.94rem;
    letter-spacing: -0.01em;
    box-shadow: 0 12px 32px rgba(255, 255, 255, 0.16);
    transition: transform $transition-fast, box-shadow $transition-fast, background $transition-fast;

    &:hover {
      transform: translateY(-2px);
      background: #e0f2fe;
      box-shadow: 0 16px 38px rgba(1, 106, 212, 0.36);
    }
  }

  .hero-audit-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.95rem 1.65rem;
    border-radius: $radius-pill;
    background: linear-gradient(135deg, rgba(0, 245, 160, 0.16), rgba(1, 106, 212, 0.28));
    border: 1px solid rgba(0, 245, 160, 0.52);
    color: #ffffff;
    font-weight: 700;
    font-size: 0.92rem;
    transition: transform $transition-fast, background $transition-fast, border-color $transition-fast;

    &:hover {
      transform: translateY(-2px);
      border-color: $accent-emerald;
      background: linear-gradient(135deg, rgba(0, 245, 160, 0.28), rgba(1, 106, 212, 0.42));
    }
  }

  .hero-sub-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.9rem;
  }

  .text-action {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.86rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.72);
    transition: color $transition-fast;

    &:hover {
      color: $accent-emerald;
    }
  }

  .hero-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
