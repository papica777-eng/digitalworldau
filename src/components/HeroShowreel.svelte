<script lang="ts">
  import { estimateAuditScore } from '../lib/wasm';

  let activeTab = $state<'showreel' | 'vitals' | 'commerce'>('showreel');
  let lcpMs = $state(920);
  let seoChecks = $state(10);
  let wasmScore = $state(99);

  $effect(() => {
    let cancelled = false;
    void estimateAuditScore(lcpMs, 15, seoChecks).then((score) => {
      if (!cancelled) wasmScore = score;
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container hero-grid">
    <div class="hero-copy">
      <div class="pill-badge">
        <span class="pulse-dot" aria-hidden="true"></span>
        <span>180+ Satisfied Clients Worldwide</span>
      </div>

      <h1 class="hero-title" id="hero-heading">
        Digital solutions that move business forward.
      </h1>

      <p class="hero-sub">
        We blend editorial creativity, Rust-speed web engineering, and data-backed marketing strategy to craft high-converting websites and e-commerce stores for ambitious Australian and global brands.
      </p>

      <div class="hero-actions">
        <a href="#contact" class="btn btn-primary">
          Start Your Project
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <a href="#projects" class="btn btn-ghost">Explore Case Studies</a>
      </div>

      <div class="hero-metrics">
        <div>
          <strong>5.0 / 5.0</strong>
          <span>Google Verified Rating</span>
        </div>
        <div>
          <strong>&lt; 0.9s</strong>
          <span>Median Edge Load</span>
        </div>
        <div>
          <strong>7 Countries</strong>
          <span>AU • EU • North America</span>
        </div>
      </div>
    </div>

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
            Agency Reel
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
            ROI Engine
          </button>
        </div>
      </div>

      {#if activeTab === 'showreel'}
        <div class="stage-reel">
          <img
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80"
            alt="Interactive agency interface showcase on dark canvas"
            loading="eager"
          />
          <div class="stage-overlay">
            <span class="tag">Sydney • Melbourne • Global</span>
            <p>Full-stack design &amp; engineering studio shipping conversion-first digital flagships.</p>
          </div>
        </div>
      {:else if activeTab === 'vitals'}
        <div class="stage-vitals">
          <div class="score-ring">
            <span class="score-ring__num">{wasmScore}</span>
            <span class="score-ring__label">Wasm Audit Score</span>
          </div>
          <div class="sliders">
            <label>
              <span>Target LCP Speed: <strong>{lcpMs} ms</strong></span>
              <input type="range" min="600" max="4200" step="100" bind:value={lcpMs} />
            </label>
            <label>
              <span>Technical SEO Checks Passed: <strong>{seoChecks}/10</strong></span>
              <input type="range" min="1" max="10" step="1" bind:value={seoChecks} />
            </label>
            <p class="wasm-note">Calculated live in-browser by <code>agency_wasm.wasm</code> (Rust).</p>
          </div>
        </div>
      {:else}
        <div class="stage-commerce">
          <div class="kpi-row">
            <div class="kpi-box">
              <span>Checkout Uplift</span>
              <strong>+184%</strong>
            </div>
            <div class="kpi-box">
              <span>Qualified Pipeline</span>
              <strong>3.4x</strong>
            </div>
            <div class="kpi-box">
              <span>Client Retention</span>
              <strong>96%</strong>
            </div>
          </div>
          <p class="commerce-caption">
            Every build combines conversion copywriting, structured JSON-LD schema, and sub-second CDN delivery.
          </p>
          <a href="#contact" class="btn btn-primary stage-btn">Book Your Free 2-Week Audit</a>
        </div>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .hero {
    padding-block: clamp(3rem, 7vw, 5.5rem) clamp(3.5rem, 6vw, 5rem);
    position: relative;
  }

  .hero-grid {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 1.08fr 0.92fr;
      gap: 3.25rem;
    }
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent-emerald;
    box-shadow: 0 0 12px $accent-emerald;
  }

  .hero-title {
    @include heading-display;
    font-size: clamp(2.55rem, 5.4vw, 4.35rem);
    margin: 1.25rem 0 1.2rem;
    background: linear-gradient(125deg, #ffffff 18%, #e2e8f0 56%, #00f5a0 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-sub {
    font-size: clamp(1.03rem, 1.45vw, 1.18rem);
    color: $text-secondary;
    margin: 0 0 2rem;
    max-width: 58ch;
    line-height: 1.68;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.95rem;
    margin-bottom: 2.5rem;
  }

  .hero-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid $border-subtle;

    strong {
      display: block;
      font-size: clamp(1.1rem, 2vw, 1.42rem);
      font-weight: 800;
      color: #ffffff;
    }

    span {
      font-size: 0.8rem;
      color: $text-muted;
    }
  }

  .hero-stage {
    @include interactive-card;
    padding: 1.1rem;
    border-color: rgba(56, 189, 248, 0.22);
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
      background: rgba(255, 255, 255, 0.18);
    }
  }

  .stage-tabs {
    display: flex;
    gap: 0.35rem;
    background: rgba(255, 255, 255, 0.04);
    padding: 0.25rem;
    border-radius: $radius-pill;

    button {
      border: none;
      background: transparent;
      color: $text-muted;
      padding: 0.35rem 0.75rem;
      border-radius: $radius-pill;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      transition: background $transition-fast, color $transition-fast;

      &.active {
        background: rgba(0, 245, 160, 0.16);
        color: $accent-emerald;
      }
    }
  }

  .stage-reel {
    position: relative;
    border-radius: $radius-md;
    overflow: hidden;
    aspect-ratio: 16 / 11;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.84) contrast(1.06);
    }
  }

  .stage-overlay {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 1.25rem;
    background: linear-gradient(to top, rgba(5, 7, 13, 0.95) 10%, transparent);

    p {
      margin: 0.55rem 0 0;
      font-size: 0.9rem;
      color: #e2e8f0;
    }
  }

  .stage-vitals {
    padding: 1.4rem 0.85rem;
    display: grid;
    gap: 1.5rem;
    align-items: center;

    @include respond-up(sm) {
      grid-template-columns: 160px 1fr;
    }
  }

  .score-ring {
    width: 148px;
    height: 148px;
    margin-inline: auto;
    border-radius: 50%;
    border: 4px solid rgba(0, 245, 160, 0.45);
    box-shadow: 0 0 32px rgba(0, 245, 160, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 245, 160, 0.06);

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
      gap: 0.45rem;
      font-size: 0.86rem;
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
    font-size: 0.78rem;
    color: $text-muted;

    code {
      color: $accent-cyan;
      font-family: $font-mono;
    }
  }

  .stage-commerce {
    padding: 1.4rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
  }

  .kpi-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .kpi-box {
    padding: 1rem 0.75rem;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid $border-subtle;
    text-align: center;

    span {
      display: block;
      font-size: 0.74rem;
      color: $text-muted;
      margin-bottom: 0.35rem;
    }

    strong {
      font-size: 1.35rem;
      font-weight: 800;
      color: $accent-emerald;
    }
  }

  .commerce-caption {
    margin: 0;
    font-size: 0.92rem;
    color: $text-secondary;
    text-align: center;
  }

  .stage-btn {
    align-self: center;
  }
</style>
