<script lang="ts">
  import HeroSculpture3D from './HeroSculpture3D.svelte';
  import { estimateAuditScore, projectMonthlyRoiCents } from '../lib/wasm';
  import { currencyStore } from '../lib/currency.svelte';

  let activeMode = $state<'sculpture' | 'showreel' | 'vitals' | 'commerce'>('sculpture');
  let reelModalOpen = $state(false);

  // Live Wasm Audit Controls
  let lcpMs = $state(860);
  let seoChecks = $state(10);
  let wasmScore = $state(100);

  // Live Wasm ROI Simulator Controls
  let visitors = $state(45000);
  let convBps = $state(320);
  let projectedAud = $state('A$216,000');

  $effect(() => {
    let cancelled = false;
    void estimateAuditScore(lcpMs, 12, seoChecks).then((score) => {
      if (!cancelled) wasmScore = score;
    });
    return () => {
      cancelled = true;
    };
  });

  $effect(() => {
    let cancelled = false;
    const aovCents = currencyStore.code === 'AUD' ? 15_000 : 9_100;
    const sym = currencyStore.code === 'AUD' ? 'A$' : '€';
    void projectMonthlyRoiCents(visitors, convBps, aovCents).then((cents) => {
      if (!cancelled) {
        projectedAud = `${sym}${Math.round(cents / 100).toLocaleString('en-AU')}`;
      }
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container hero-grid">
    <!-- Left Column: Pure frameless typography & proof embedded directly into the cobalt-black canvas -->
    <div class="hero-copy">
      <h1 class="hero-title" id="hero-heading">
        Digital solutions<br />
        that move business<br />
        forward.
      </h1>

      <p class="hero-sub">
        Your website shouldn’t merely look impressive—it must convert effortlessly. We unite Awwwards-grade design, Rust-speed engineering, and precision marketing to build digital flagships and e-commerce stores that dominate their category.
      </p>

      <div class="hero-action-row">
        <!-- Frameless social proof embedded directly onto the dark background (zero box/border) -->
        <div class="inline-proof">
          <span class="inline-proof__clients">180+ Satisfied Clients</span>
          <div class="inline-proof__rating">
            <div class="stars" aria-label="5.0 out of 5 stars">
              {#each Array(5) as _}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              {/each}
            </div>
            <span class="rating-num">5.0</span>
            <span class="google-word">Google<small>Reviews</small></span>
          </div>
        </div>

        <a href="#contact" class="hero-white-cta">Get a Quote</a>
      </div>

      <div class="hero-sub-links">
        <button type="button" class="text-action" onclick={() => (reelModalOpen = true)}>
          <span class="play-icon" aria-hidden="true">▶</span>
          Watch 60fps Showreel
        </button>
        <span class="dot-sep" aria-hidden="true">•</span>
        <a href="https://anchialo.com" target="_blank" rel="noopener" class="text-action">anchialo.com ↗</a>
        <span class="dot-sep" aria-hidden="true">•</span>
        <a href="https://cptmma.com" target="_blank" rel="noopener" class="text-action">cptmma.com ↗</a>
      </div>
    </div>

    <!-- Right Column: Seamless floating Photorealistic 3D Liquid-Glass Sculpture (zero visible box) -->
    <div class="hero-visual">
      {#if activeMode === 'sculpture'}
        <div class="floating-3d-wrap">
          <HeroSculpture3D />
        </div>
      {:else if activeMode === 'showreel'}
        <div class="floating-media-wrap">
          <video
            src="/videos/hero-showreel.mp4"
            poster="/media/hero-sculpture.webp"
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
      {:else if activeMode === 'vitals'}
        <div class="frameless-tool">
          <div class="score-ring">
            <span class="score-ring__num">{wasmScore}</span>
            <span class="score-ring__label">Wasm Vitals</span>
          </div>
          <div class="sliders">
            <label>
              <span>Target LCP Speed: <strong>{lcpMs} ms</strong></span>
              <input type="range" min="600" max="4200" step="100" bind:value={lcpMs} />
            </label>
            <label>
              <span>SEO Signals Passed: <strong>{seoChecks}/10</strong></span>
              <input type="range" min="1" max="10" step="1" bind:value={seoChecks} />
            </label>
            <p class="wasm-note">Computed live in-browser via <code>agency_wasm.wasm</code></p>
          </div>
        </div>
      {:else}
        <div class="frameless-tool frameless-tool--col">
          <div class="roi-readout">
            <span>Projected Monthly Store Revenue ({currencyStore.code})</span>
            <strong>{projectedAud}</strong>
          </div>
          <div class="sliders">
            <label>
              <span>Monthly Qualified Traffic: <strong>{visitors.toLocaleString('en-AU')}</strong></span>
              <input type="range" min="5000" max="150000" step="5000" bind:value={visitors} />
            </label>
            <label>
              <span>Target Conversion Rate: <strong>{(convBps / 100).toFixed(2)}%</strong></span>
              <input type="range" min="80" max="650" step="20" bind:value={convBps} />
            </label>
          </div>
        </div>
      {/if}

      <!-- Ultra-minimal frameless mode switcher below the floating sculpture (zero heavy card chrome) -->
      <div class="mode-switcher" role="tablist" aria-label="Interactive hero views">
        <button type="button" role="tab" aria-selected={activeMode === 'sculpture'} class:active={activeMode === 'sculpture'} onclick={() => (activeMode = 'sculpture')}>
          Live 3D Glass
        </button>
        <button type="button" role="tab" aria-selected={activeMode === 'showreel'} class:active={activeMode === 'showreel'} onclick={() => (activeMode = 'showreel')}>
          Showreel
        </button>
        <button type="button" role="tab" aria-selected={activeMode === 'vitals'} class:active={activeMode === 'vitals'} onclick={() => (activeMode = 'vitals')}>
          Wasm Audit
        </button>
        <button type="button" role="tab" aria-selected={activeMode === 'commerce'} class:active={activeMode === 'commerce'} onclick={() => (activeMode = 'commerce')}>
          ROI Simulator
        </button>
      </div>
    </div>
  </div>

  {#if reelModalOpen}
    <div class="reel-modal" role="dialog" aria-modal="true" aria-label="Digital World AU Showreel">
      <div class="reel-modal__inner">
        <button type="button" class="reel-modal__close" onclick={() => (reelModalOpen = false)} aria-label="Close showreel">×</button>
        <video src="/videos/hero-showreel.mp4" poster="/media/hero-sculpture.webp" controls autoplay loop playsinline></video>
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
    color: rgba(255, 255, 255, 0.72);
    margin: 0 0 2.35rem;
    max-width: 48ch;
    line-height: 1.65;
  }

  .hero-action-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem 2.25rem;
    margin-bottom: 1.75rem;
  }

  .inline-proof {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: transparent;
    border: none;
    padding: 0;

    &__clients {
      font-size: 0.9rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    &__rating {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;

      .stars {
        color: #ffffff;
      }
    }
  }

  .rating-num {
    font-size: 0.92rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.88);
  }

  .google-word {
    display: inline-flex;
    flex-direction: column;
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 0.95;
    color: #ffffff;

    small {
      font-size: 0.62rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.65);
      margin-top: 2px;
    }
  }

  .hero-white-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.92rem 2.1rem;
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
    background: transparent;
    border: none;
    padding: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.66);
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $accent-emerald;
    }
  }

  .play-icon {
    color: $accent-blue-light;
    font-size: 0.72rem;
  }

  .dot-sep {
    color: rgba(255, 255, 255, 0.25);
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

  .frameless-tool {
    width: 100%;
    max-width: 560px;
    min-height: 360px;
    display: grid;
    gap: 1.65rem;
    align-items: center;
    padding: 1.5rem 0.5rem;

    @include respond-up(sm) {
      grid-template-columns: 156px 1fr;
    }

    &--col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
    }
  }

  .mode-switcher {
    margin-top: 0.75rem;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.35rem;

    button {
      background: transparent;
      border: none;
      padding: 0.3rem 0;
      font-family: $font-mono;
      font-size: 0.74rem;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.42);
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

  .score-ring {
    width: 146px;
    height: 146px;
    margin-inline: auto;
    border-radius: 50%;
    border: 3px solid rgba(0, 245, 160, 0.55);
    box-shadow: 0 0 38px rgba(0, 245, 160, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__num {
      font-size: 2.7rem;
      font-weight: 800;
      line-height: 1;
      color: $accent-emerald;
    }

    &__label {
      margin-top: 0.35rem;
      font-family: $font-mono;
      font-size: 0.68rem;
      color: $text-secondary;
    }
  }

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.42rem;
      font-size: 0.86rem;
      color: $text-secondary;

      strong {
        color: #ffffff;
      }

      input[type='range'] {
        accent-color: #016ad4;
        cursor: pointer;
      }
    }
  }

  .wasm-note {
    margin: 0;
    font-size: 0.76rem;
    color: $text-muted;

    code {
      color: $accent-blue-light;
      font-family: $font-mono;
    }
  }

  .roi-readout {
    text-align: center;
    padding-bottom: 0.5rem;

    span {
      display: block;
      font-size: 0.8rem;
      color: $text-secondary;
      margin-bottom: 0.25rem;
    }

    strong {
      font-size: 2.5rem;
      font-weight: 800;
      color: $accent-emerald;
      letter-spacing: -0.03em;
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
