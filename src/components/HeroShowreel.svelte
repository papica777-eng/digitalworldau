<script lang="ts">
  import HeroDeviceShowcase from './HeroDeviceShowcase.svelte';
</script>

<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container hero-stage">
    <div class="hero-center">
      <div class="hero-trust-pill">
        <span class="stars" aria-label="5 out of 5 stars">
          {#each [0, 1, 2, 3, 4] as _}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5l2.93 5.95 6.57.95-4.75 4.63 1.12 6.54L12 17.48l-5.87 3.09 1.12-6.54L2.5 9.4l6.57-.95L12 2.5z" />
            </svg>
          {/each}
        </span>
        <span>Sydney &amp; Global • 100 / 100 PageSpeed • 4 Live Flagships</span>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions that move business forward.
      </h1>

      <p class="hero-sub">
        Your website shouldn’t merely look impressive—it must turn clicks into booked calls and online sales. We unite crystal-grade luxury design, instant page speed, and high-converting Google Ads funnels for ambitious brands.
      </p>

      <div class="hero-action-row">
        <a href="#contact" class="hero-cobalt-cta">
          <span>Get a Quote</span>
          <span class="cta-arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </a>

        <a href="#contact" class="hero-glass-cta" data-preset-audit>
          Free 48-Hour Website Audit →
        </a>
      </div>

      <div class="hero-sub-links">
        <a href="#projects" class="text-action">Explore Live Projects ↓</a>
        <span class="sep" aria-hidden="true">·</span>
        <a href="#roi-calculator" class="text-action">Calculate Wasm ROI ↓</a>
      </div>
    </div>

    <div class="hero-visual">
      <HeroDeviceShowcase />
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .hero {
    padding-block: clamp(2.8rem, 6vw, 5.2rem) clamp(3.5rem, 7vw, 6rem);
    position: relative;
    overflow: hidden;
  }

  .hero-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-center {
    min-height: 78vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-block: clamp(1.2rem, 3vw, 2.5rem);
  }

  .hero-trust-pill {
    @include glass-surface;
    @include agma-border(80px, 1);
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    padding: 0.55rem 1.25rem;
    border-radius: 80px;
    font-family: $font-sans;
    font-size: 0.84rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.88);
    margin-bottom: 1.85rem;
  }

  .hero-title {
    font-family: $font-display;
    font-weight: 500;
    font-size: clamp(2.35rem, 5.2vw, 4.35rem);
    line-height: 1.09;
    letter-spacing: -0.025em;
    color: #ffffff;
    max-width: 18ch;
    margin: 0 0 1.55rem;
  }

  .hero-sub {
    font-family: $font-sans;
    font-weight: 300;
    font-size: clamp(1.02rem, 1.45vw, 1.18rem);
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.76);
    max-width: 58ch;
    margin: 0 0 2.35rem;
  }

  .hero-action-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem 1.15rem;
    margin-bottom: 1.65rem;
  }

  .hero-cobalt-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.68rem 0.78rem 0.68rem 1.65rem;
    border-radius: $radius-pill;
    background: $accent-cobalt;
    color: #ffffff;
    font-family: $font-display;
    font-weight: 500;
    font-size: 0.84rem;
    box-shadow: 0 12px 34px rgba(1, 106, 212, 0.45);
    transition: transform $transition-fast, background $transition-fast, box-shadow $transition-fast;

    &:hover {
      transform: translateY(-2px);
      background: #0b7ae8;
      box-shadow: 0 16px 42px rgba(1, 106, 212, 0.62);
    }

    .cta-arrow {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      color: #ffffff;
      display: grid;
      place-items: center;
    }
  }

  .hero-glass-cta {
    @include glass-surface;
    @include agma-border(9999px, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.92rem 1.65rem;
    border-radius: $radius-pill;
    font-family: $font-display;
    font-weight: 400;
    font-size: 0.82rem;
    color: #ffffff;
    transition: transform $transition-fast, background $transition-fast;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.09);
    }
  }

  .hero-sub-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem 1.1rem;

    .sep {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .text-action {
    font-family: $font-mono;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.68);
    transition: color $transition-fast;

    &:hover {
      color: $accent-blue-light;
    }
  }

  .hero-visual {
    margin-top: clamp(3.5rem, 7vw, 5.5rem);
    max-width: 820px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
