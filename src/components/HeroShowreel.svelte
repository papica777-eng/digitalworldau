<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="hero-ambient-glow" aria-hidden="true"></div>

  <div class="container hero-stage">
    <div class="hero-center">
      <div class="hero-trust-cluster">
        <div class="trust-top-row">
          <div class="avatar-stack" aria-hidden="true">
            <img src="/media/founder-portrait.webp" alt="" />
            <img src="/media/sotir-kichukov.webp" alt="" />
            <img src="/media/anchialo-gel.webp" alt="" />
          </div>
          <span class="stars" aria-label="5 out of 5 stars">
            {#each [0, 1, 2, 3, 4] as _}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.93 5.95 6.57.95-4.75 4.63 1.12 6.54L12 17.48l-5.87 3.09 1.12-6.54L2.5 9.4l6.57-.95L12 2.5z" />
              </svg>
            {/each}
          </span>
        </div>
        <span class="trust-caption">100 / 100 PageSpeed • Sydney &amp; Global Studio</span>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions that move business forward.
      </h1>

      <p class="hero-sub">
        We unite luxury crystal-grade design, sub-second engineering, and conversion-focused Google Ads funnels to build websites and online stores with real commercial impact.
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

        <a href="#contact" class="hero-ghost-cta" data-preset-audit>
          Free 48-Hour Website Audit →
        </a>
      </div>
    </div>

    <div class="hero-trust-bottom" aria-label="Trusted performance standards and live client platforms">
      <p class="trust-kicker">Trusted by real results</p>
      <div class="hero-trust-tiles">
        <div class="hero-tile">
          <strong>100 / 100</strong>
          <span>Google PageSpeed</span>
        </div>

        <div class="hero-tile">
          <strong>&lt; 0.8 sec</strong>
          <span>Instant Mobile Load</span>
        </div>

        <a href="https://anchialo.com" target="_blank" rel="noopener" class="hero-tile hero-tile--link">
          <strong>anchialo.com ↗</strong>
          <span>Live AU Store</span>
        </a>

        <a href="https://cptmma.com" target="_blank" rel="noopener" class="hero-tile hero-tile--link">
          <strong>cptmma.com ↗</strong>
          <span>Melbourne Academy</span>
        </a>

        <a href="https://aeterna.website" target="_blank" rel="noopener" class="hero-tile hero-tile--link">
          <strong>aeterna.website ↗</strong>
          <span>Flagship Platform</span>
        </a>

        <a href="https://nasvetlo.website" target="_blank" rel="noopener" class="hero-tile hero-tile--link">
          <strong>nasvetlo.website ↗</strong>
          <span>2.23M-Record Audit</span>
        </a>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .hero {
    position: relative;
    padding-block: clamp(1.8rem, 4vw, 3.2rem) clamp(2rem, 4.5vw, 3.25rem);
    overflow: hidden;
  }

  .hero-ambient-glow {
    position: absolute;
    top: -160px;
    left: -120px;
    width: 680px;
    height: 680px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.44) 0%,
      rgba(1, 106, 212, 0.12) 45%,
      transparent 72%
    );
    filter: blur(44px);
    pointer-events: none;
    z-index: 0;
  }

  .hero-stage {
    position: relative;
    z-index: 1;
    min-height: calc(100vh - 110px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: clamp(2rem, 5vw, 3.5rem);
  }

  .hero-center {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: clamp(1rem, 3vw, 2.5rem);
  }

  .hero-trust-cluster {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.48rem;
    margin-bottom: 1.85rem;
  }

  .trust-top-row {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar-stack {
    display: inline-flex;
    align-items: center;

    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #000000;
      margin-left: -8px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .trust-caption {
    font-family: $font-sans;
    font-size: 0.84rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.82);
  }

  .hero-title {
    font-family: $font-display;
    font-weight: 500;
    font-size: clamp(2.45rem, 5.4vw, 4.45rem);
    line-height: 1.09;
    letter-spacing: -0.025em;
    color: #ffffff;
    max-width: 19ch;
    margin: 0 0 1.5rem;
  }

  .hero-sub {
    font-family: $font-sans;
    font-weight: 300;
    font-size: clamp(1rem, 1.4vw, 1.15rem);
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.72);
    max-width: 58ch;
    margin: 0 0 2.15rem;
  }

  .hero-action-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.9rem 1.25rem;
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
    font-size: 0.82rem;
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

  .hero-ghost-cta {
    @include glass-surface;
    @include agma-border(9999px, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.92rem 1.6rem;
    border-radius: $radius-pill;
    font-family: $font-display;
    font-weight: 400;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    transition: transform $transition-fast, background $transition-fast;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.085);
    }
  }

  .hero-trust-bottom {
    width: 100%;
    padding-top: 0.75rem;
  }

  .trust-kicker {
    text-align: center;
    font-family: $font-sans;
    font-size: 0.76rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.56);
    margin: 0 0 1rem;
  }

  .hero-trust-tiles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @include respond-up(md) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @include respond-up(lg) {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  .hero-tile {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 0.95rem 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.25rem;
    transition: border-color $transition-fast, background $transition-fast, transform $transition-fast;

    strong {
      font-family: $font-display;
      font-size: 0.84rem;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    span {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.52);
    }

    &--link:hover {
      border-color: rgba(132, 181, 230, 0.45);
      background: rgba(255, 255, 255, 0.065);
      transform: translateY(-2px);

      strong {
        color: $accent-blue-light;
      }
    }
  }
</style>
