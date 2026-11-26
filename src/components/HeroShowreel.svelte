<script lang="ts">
  import HeroSculpture3D from './HeroSculpture3D.svelte';

  let activeMode = $state<'dna' | 'reel'>('dna');
  let reelModalOpen = $state(false);
</script>

<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container hero-grid">
    <!-- Left Column: Streamlined high-converting CRO Hero -->
    <div class="hero-copy">
      <div class="hero-trust-line">
        <span class="trust-dot" aria-hidden="true"></span>
        <span>Sydney &amp; Melbourne • 100% Client IP Ownership • 24h Response SLA</span>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions<br />
        that move business<br />
        forward.
      </h1>

      <p class="hero-sub">
        Your website shouldn’t merely look impressive—it must convert high-intent visitors into qualified revenue. We unite bespoke UI/UX design, Rust-speed engineering, and Google Ads conversion architecture for ambitious brands.
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
        <a href="#projects" class="text-action">Explore Live Productions →</a>
      </div>
    </div>

    <!-- Right Column: Interactive 4D/5D Kintsugi DNA + Real Live Sites Reel -->
    <div class="hero-visual">
      {#if activeMode === 'dna'}
        <div class="floating-3d-wrap">
          <HeroSculpture3D />
        </div>
      {:else}
        <div class="floating-media-wrap">
          <video
            src="/videos/hero-showreel.mp4"
            poster="/media/mockup-anchialo.webp"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <button
            type="button"
            class="expand-link"
            onclick={() => (reelModalOpen = true)}
          >
            ▶ Fullscreen Reel
          </button>
        </div>
      {/if}

      <div class="mode-switcher" role="tablist" aria-label="Interactive hero showcase modes">
        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'dna'}
          class:active={activeMode === 'dna'}
          onclick={() => (activeMode = 'dna')}
        >
          Interactive 4D/5D DNA
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'reel'}
          class:active={activeMode === 'reel'}
          onclick={() => (activeMode = 'reel')}
        >
          Live Sites Reel
        </button>
      </div>
    </div>
  </div>

  {#if reelModalOpen}
    <div class="reel-modal" role="dialog" aria-modal="true" aria-label="Digital World AU Live Sites Showreel">
      <div class="reel-modal__inner">
        <button type="button" class="reel-modal__close" onclick={() => (reelModalOpen = false)} aria-label="Close showreel">×</button>
        <video src="/videos/hero-showreel.mp4" poster="/media/mockup-anchialo.webp" controls autoplay loop playsinline></video>
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .hero {
    padding-block: clamp(2.8rem, 6vw, 5.2rem) clamp(3.5rem, 6vw, 5.5rem);
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 0.96fr 1.04fr;
      gap: 2rem;
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
    color: rgba(255, 255, 255, 0.74);
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

  .floating-3d-wrap {
    width: 100%;
    max-width: 680px;
  }

  .floating-media-wrap {
    width: 100%;
    max-width: 640px;
    position: relative;
    border-radius: $radius-lg;
    overflow: hidden;
    -webkit-mask-image: radial-gradient(ellipse 88% 88% at 50% 50%, #000 72%, transparent 100%);
    mask-image: radial-gradient(ellipse 88% 88% at 50% 50%, #000 72%, transparent 100%);

    video {
      width: 100%;
      aspect-ratio: 16 / 11;
      object-fit: cover;
    }
  }

  .expand-link {
    position: absolute;
    bottom: 1.25rem;
    right: 1.45rem;
    background: rgba(2, 3, 8, 0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
    border-radius: $radius-pill;
    padding: 0.4rem 0.9rem;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
  }

  .mode-switcher {
    margin-top: 0.7rem;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;

    button {
      background: transparent;
      border: none;
      padding: 0.3rem 0;
      font-family: $font-mono;
      font-size: 0.76rem;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.48);
      cursor: pointer;
      position: relative;
      transition: color $transition-fast;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, #016ad4, #00f5a0);
        transform: scaleX(0);
        transition: transform $transition-fast;
      }

      &:hover,
      &.active {
        color: #ffffff;
      }

      &.active::after {
        transform: scaleX(1);
      }
    }
  }

  .reel-modal {
    position: fixed;
    inset: 0;
    z-index: 120;
    background: rgba(2, 3, 8, 0.92);
    backdrop-filter: blur(14px);
    display: grid;
    place-items: center;
    padding: 1.25rem;

    &__inner {
      position: relative;
      width: min(1040px, 100%);
      border-radius: $radius-lg;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: #000;

      video {
        width: 100%;
        height: auto;
      }
    }

    &__close {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      z-index: 5;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(6, 7, 13, 0.8);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
</style>
