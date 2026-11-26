<script lang="ts">
  import HeroScene3D from './HeroScene3D.svelte';
  import { CLIENT_AVATARS } from '../data/agencyData';
  import { estimateAuditScore, projectMonthlyRoiCents } from '../lib/wasm';
  import { currencyStore } from '../lib/currency.svelte';

  let activeTab = $state<'showreel' | 'vitals' | 'commerce'>('showreel');
  let reelModalOpen = $state(false);

  // Live Wasm Audit Controls
  let lcpMs = $state(860);
  let seoChecks = $state(10);
  let wasmScore = $state(100);

  // Live Wasm ROI Simulator Controls
  let visitors = $state(45000);
  let convBps = $state(320); // 3.20%
  let projectedAud = $state('$216,000');

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
  <HeroScene3D />

  <div class="container hero-grid">
    <div class="hero-copy">
      <div class="social-proof-bar">
        <div class="avatar-stack" aria-hidden="true">
          {#each CLIENT_AVATARS as src, idx}
            <img {src} alt="" loading="eager" style={`z-index: ${10 - idx}`} />
          {/each}
        </div>
        <div class="proof-meta">
          <div class="stars" aria-label="5 out of 5 stars">
            {#each Array(5) as _}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            {/each}
          </div>
          <span><strong>180+ Satisfied Clients</strong> • AU &amp; Global</span>
        </div>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions that move business forward.
      </h1>

      <p class="hero-sub">
        We fuse Awwwards-calibre design, Rust-accelerated web engineering, and precision acquisition strategy to build high-converting websites and e-commerce flagships that dominate your category.
      </p>

      <div class="hero-actions">
        <a href="#contact" class="btn btn-primary">
          Get a Quote
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <button type="button" class="btn btn-ghost" onclick={() => (reelModalOpen = true)}>
          <span class="play-dot" aria-hidden="true">▶</span>
          Watch Agency Showreel
        </button>
      </div>

      <div class="hero-metrics">
        <div>
          <strong>5.0 / 5.0</strong>
          <span>100+ Google Reviews</span>
        </div>
        <div>
          <strong>0.85s</strong>
          <span>Median Edge LCP</span>
        </div>
        <div>
          <strong>+184%</strong>
          <span>Avg. E-Com Uplift</span>
        </div>
      </div>
    </div>

    <div class="beam-frame">
      <div class="hero-stage" data-glow-card>
        <div class="stage-chrome">
          <div class="stage-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <div class="stage-tabs" role="tablist" aria-label="Agency interactive preview">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'showreel'}
              class:active={activeTab === 'showreel'}
              onclick={() => (activeTab = 'showreel')}
            >
              Live Showreel
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'vitals'}
              class:active={activeTab === 'vitals'}
              onclick={() => (activeTab = 'vitals')}
            >
              Wasm Audit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'commerce'}
              class:active={activeTab === 'commerce'}
              onclick={() => (activeTab = 'commerce')}
            >
              ROI Simulator
            </button>
          </div>
        </div>

        {#if activeTab === 'showreel'}
          <div class="stage-reel">
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
              class="expand-reel-btn"
              onclick={() => (reelModalOpen = true)}
              aria-label="Expand full agency showreel"
            >
              <span class="pulse-play">▶</span>
              <span>Expand 60fps Reel</span>
            </button>
            <div class="stage-overlay">
              <span class="tag">Sydney • Melbourne • Europe • USA</span>
              <p>Bespoke UI flagships, headless e-commerce &amp; interactive 3D brand worlds.</p>
            </div>
          </div>
        {:else if activeTab === 'vitals'}
          <div class="stage-vitals">
            <div class="score-ring">
              <span class="score-ring__num">{wasmScore}</span>
              <span class="score-ring__label">Wasm Vitals</span>
            </div>
            <div class="sliders">
              <label>
                <span>Largest Contentful Paint: <strong>{lcpMs} ms</strong></span>
                <input type="range" min="600" max="4200" step="100" bind:value={lcpMs} />
              </label>
              <label>
                <span>Technical SEO Signals Passed: <strong>{seoChecks}/10</strong></span>
                <input type="range" min="1" max="10" step="1" bind:value={seoChecks} />
              </label>
              <p class="wasm-note">Computed live in-browser via <code>agency_wasm.wasm</code>.</p>
            </div>
          </div>
        {:else}
          <div class="stage-commerce">
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
            <a href="#contact" class="btn btn-primary stage-btn">Claim Free 2-Week Website Audit</a>
          </div>
        {/if}
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
    padding-block: clamp(3rem, 6.5vw, 5.5rem) clamp(3.5rem, 6vw, 5.25rem);
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    position: relative;
    z-index: 2;
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 1.06fr 0.94fr;
      gap: 3.25rem;
    }
  }

  .social-proof-bar {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.42rem 1rem 0.42rem 0.5rem;
    border-radius: $radius-pill;
    background: rgba(12, 16, 34, 0.78);
    border: 1px solid rgba(132, 181, 230, 0.28);
    backdrop-filter: blur(12px);
  }

  .avatar-stack {
    display: flex;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #06070d;
      margin-left: -8px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .proof-meta {
    display: flex;
    flex-direction: column;
    gap: 0.08rem;
    font-size: 0.77rem;
    color: $text-secondary;

    strong {
      color: #ffffff;
    }
  }

  .hero-title {
    @include heading-display;
    font-size: clamp(2.65rem, 5.6vw, 4.55rem);
    margin: 1.35rem 0 1.2rem;
    background: $gradient-text;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-sub {
    font-size: clamp(1.03rem, 1.45vw, 1.18rem);
    color: $text-secondary;
    margin: 0 0 2.1rem;
    max-width: 56ch;
    line-height: 1.68;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.95rem;
    margin-bottom: 2.5rem;
  }

  .play-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.65rem;
    background: rgba(252, 193, 244, 0.18);
    color: $accent-orchid;
  }

  .hero-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid $border-subtle;

    strong {
      display: block;
      font-size: clamp(1.15rem, 2.1vw, 1.5rem);
      font-weight: 800;
      color: #ffffff;
    }

    span {
      font-size: 0.8rem;
      color: $text-muted;
    }
  }

  .hero-stage {
    @include glass-surface(true);
    border-radius: calc(#{$radius-xl} - 1px);
    padding: 1.15rem;
  }

  .stage-chrome {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.95rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid $border-subtle;
  }

  .stage-dots {
    display: flex;
    gap: 0.4rem;

    span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .stage-tabs {
    display: flex;
    gap: 0.3rem;
    background: rgba(255, 255, 255, 0.04);
    padding: 0.25rem;
    border-radius: $radius-pill;

    button {
      border: none;
      background: transparent;
      color: $text-muted;
      padding: 0.36rem 0.78rem;
      border-radius: $radius-pill;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background $transition-fast, color $transition-fast;

      &.active {
        background: rgba(1, 106, 212, 0.35);
        color: #ffffff;
      }
    }
  }

  .stage-reel {
    position: relative;
    border-radius: $radius-md;
    overflow: hidden;
    aspect-ratio: 16 / 10.5;
    background: #05070d;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .expand-reel-btn {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.42rem 0.85rem;
    border-radius: $radius-pill;
    background: rgba(6, 7, 13, 0.78);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(252, 193, 244, 0.4);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform $transition-fast, border-color $transition-fast;

    &:hover {
      transform: scale(1.04);
      border-color: $accent-emerald;
    }

    .pulse-play {
      color: $accent-emerald;
      font-size: 0.68rem;
    }
  }

  .stage-overlay {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 1.3rem;
    background: linear-gradient(to top, rgba(6, 7, 13, 0.94) 12%, transparent);
    pointer-events: none;

    p {
      margin: 0.5rem 0 0;
      font-size: 0.88rem;
      color: #e2e8f0;
    }
  }

  .stage-vitals {
    padding: 1.5rem 0.85rem;
    display: grid;
    gap: 1.5rem;
    align-items: center;

    @include respond-up(sm) {
      grid-template-columns: 156px 1fr;
    }
  }

  .score-ring {
    width: 146px;
    height: 146px;
    margin-inline: auto;
    border-radius: 50%;
    border: 4px solid rgba(0, 245, 160, 0.55);
    box-shadow: 0 0 36px rgba(0, 245, 160, 0.22);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 245, 160, 0.07);

    &__num {
      font-size: 2.65rem;
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
      font-size: 0.85rem;
      color: $text-secondary;

      strong {
        color: #ffffff;
      }

      input[type='range'] {
        accent-color: $accent-emerald;
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

  .stage-commerce {
    padding: 1.25rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .roi-readout {
    text-align: center;
    padding: 1rem;
    border-radius: $radius-md;
    background: linear-gradient(135deg, rgba(1, 106, 212, 0.2), rgba(0, 245, 160, 0.12));
    border: 1px solid rgba(0, 245, 160, 0.3);

    span {
      display: block;
      font-size: 0.76rem;
      color: $text-secondary;
      margin-bottom: 0.25rem;
    }

    strong {
      font-size: 2rem;
      font-weight: 800;
      color: $accent-emerald;
      letter-spacing: -0.03em;
    }
  }

  .stage-btn {
    align-self: center;
  }

  .reel-modal {
    position: fixed;
    inset: 0;
    z-index: 120;
    background: rgba(3, 4, 10, 0.88);
    backdrop-filter: blur(14px);
    display: grid;
    place-items: center;
    padding: 1.25rem;

    &__inner {
      position: relative;
      width: min(1040px, 100%);
      border-radius: $radius-lg;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.16);
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
