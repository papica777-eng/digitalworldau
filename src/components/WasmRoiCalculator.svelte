<script lang="ts">
  import { currencyStore, CURRENCY_EVENT, type CurrencyCode } from '../lib/currency.svelte';
  import { estimateAuditScore, projectMonthlyRoiCents } from '../lib/wasm';

  let activeCurrency = $state<CurrencyCode>(currencyStore.code);
  let monthlyVisitors = $state(25000);
  let currentConvPct = $state(1.4);
  let convLiftPct = $state(1.1);
  let aovAmount = $state(400);

  const EUR_TO_AUD_RATE = 1.65;

  function computeRoiCentsSync(visitors: number, convBps: number, aovCents: number): number {
    if (visitors <= 0 || convBps <= 0 || aovCents <= 0) return 0;
    return Math.floor((visitors * convBps * aovCents + 5000) / 10000);
  }

  let baselineRevCents = $state(computeRoiCentsSync(25000, 140, 40000));
  let projectedRevCents = $state(computeRoiCentsSync(25000, 250, 40000));
  let legacyScore = $state(35);
  let modernScore = $state(100);

  function formatMoney(cents: number, currency: CurrencyCode): string {
    const val = Math.round(cents / 100);
    return currency === 'AUD' ? `A$${val.toLocaleString('en-AU')}` : `€${val.toLocaleString('en-IE')}`;
  }

  let displayAovCents = $derived(Math.round(aovAmount * 100));

  let monthlyLiftCents = $derived(Math.max(0, projectedRevCents - baselineRevCents));
  let annualLiftCents = $derived(monthlyLiftCents * 12);

  $effect(() => {
    activeCurrency = currencyStore.code;
    const onCurrencyChange = (ev: Event) => {
      const next = (ev as CustomEvent<CurrencyCode>).detail;
      if ((next === 'AUD' || next === 'EUR') && next !== activeCurrency) {
        const converted = next === 'EUR' ? aovAmount / EUR_TO_AUD_RATE : aovAmount * EUR_TO_AUD_RATE;
        aovAmount = Math.max(100, Math.min(3000, Math.round(converted / 25) * 25));
        activeCurrency = next;
      }
    };
    window.addEventListener(CURRENCY_EVENT, onCurrencyChange);
    return () => {
      window.removeEventListener(CURRENCY_EVENT, onCurrencyChange);
    };
  });

  $effect(() => {
    const vis = monthlyVisitors;
    const baseBps = Math.round(currentConvPct * 100);
    const nextBps = Math.round((currentConvPct + convLiftPct) * 100);
    const aov = displayAovCents;

    baselineRevCents = computeRoiCentsSync(vis, baseBps, aov);
    projectedRevCents = computeRoiCentsSync(vis, nextBps, aov);

    let cancelled = false;
    void (async () => {
      const [bRev, pRev, lScore, mScore] = await Promise.all([
        projectMonthlyRoiCents(vis, baseBps, aov),
        projectMonthlyRoiCents(vis, nextBps, aov),
        estimateAuditScore(4200, 240, 5),
        estimateAuditScore(600, 10, 10),
      ]);
      if (cancelled) return;
      baselineRevCents = bRev;
      projectedRevCents = pRev;
      legacyScore = lScore;
      modernScore = mScore;
    })();

    return () => {
      cancelled = true;
    };
  });
</script>

<section class="section roi-section" id="roi-calculator" aria-labelledby="roi-heading">
  <div class="container">
    <div class="section-header" data-reveal>
      <span class="eyebrow">Rust + WebAssembly Telemetry</span>
      <h2 class="section-title" id="roi-heading">
        Calculate your <em class="serif-accent">conversion &amp; speed upside.</em>
      </h2>
      <p class="section-lead">
        Powered live in your browser by our compiled Rust/Wasm engine—model the revenue lift of upgrading from a slow legacy build to a sub-second Astro + Svelte conversion architecture.
      </p>
    </div>

    <div class="roi-grid" data-reveal>
      <div class="roi-controls" data-glow-card>
        <div class="slider-group">
          <div class="slider-head">
            <label for="roi-visitors">Monthly Website Visitors</label>
            <strong class="mono-val">{monthlyVisitors.toLocaleString('en-AU')} / mo</strong>
          </div>
          <input
            id="roi-visitors"
            type="range"
            min="5000"
            max="200000"
            step="2500"
            bind:value={monthlyVisitors}
          />
          <div class="slider-scale"><span>5,000</span><span>100,000</span><span>200,000</span></div>
        </div>

        <div class="slider-group">
          <div class="slider-head">
            <label for="roi-conv">Current Conversion Rate &amp; Target Lift</label>
            <strong class="mono-val">{currentConvPct.toFixed(1)}% &rarr; {(currentConvPct + convLiftPct).toFixed(1)}%</strong>
          </div>
          <div class="dual-sliders">
            <label class="mini-field">
              <span>Current ({currentConvPct.toFixed(1)}%)</span>
              <input type="range" min="0.5" max="4.0" step="0.1" bind:value={currentConvPct} />
            </label>
            <label class="mini-field">
              <span>Projected Lift (+{convLiftPct.toFixed(1)}%)</span>
              <input type="range" min="0.4" max="2.5" step="0.1" bind:value={convLiftPct} />
            </label>
          </div>
        </div>

        <div class="slider-group">
          <div class="slider-head">
            <label for="roi-aov">Average Order / Client Value ({activeCurrency})</label>
            <strong class="mono-val">{formatMoney(displayAovCents, activeCurrency)}</strong>
          </div>
          <input
            id="roi-aov"
            type="range"
            min="100"
            max="3000"
            step="25"
            bind:value={aovAmount}
          />
          <div class="slider-scale">
            <span>{formatMoney(10000, activeCurrency)}</span>
            <span>{formatMoney(150000, activeCurrency)}</span>
            <span>{formatMoney(300000, activeCurrency)}</span>
          </div>
        </div>
      </div>

      <div class="beam-frame">
        <div class="roi-telemetry" data-glow-card>
          <div class="telemetry-top">
            <span class="tag">Wasm Integer Precision ({activeCurrency})</span>
            <span class="live-chip">● Real-Time Projection</span>
          </div>

          <div class="kpi-pair">
            <div class="kpi-box kpi-box--accent">
              <span>Projected Monthly Revenue Lift</span>
              <strong>+{formatMoney(monthlyLiftCents, activeCurrency)}</strong>
              <small>Baseline: {formatMoney(baselineRevCents, activeCurrency)} &rarr; {formatMoney(projectedRevCents, activeCurrency)}</small>
            </div>
            <div class="kpi-box">
              <span>Annual Compounding Impact</span>
              <strong>+{formatMoney(annualLiftCents, activeCurrency)}</strong>
              <small>12-month revenue upside from UX &amp; speed</small>
            </div>
          </div>

          <div class="vitals-compare" aria-label="Before and after PageSpeed comparison">
            <div class="vital-row">
              <div class="vital-meta">
                <span>Legacy Bloat (Before • 4.2s LCP)</span>
                <strong class="vital-legacy">{legacyScore} / 100</strong>
              </div>
              <div class="vital-track">
                <div class="vital-fill vital-fill--legacy" style={`width: ${legacyScore}%`}></div>
              </div>
            </div>

            <div class="vital-row">
              <div class="vital-meta">
                <span>Digital World AU Astro + Wasm (After • 0.6s LCP)</span>
                <strong class="vital-modern">{modernScore} / 100</strong>
              </div>
              <div class="vital-track">
                <div class="vital-fill vital-fill--modern" style={`width: ${modernScore}%`}></div>
              </div>
            </div>
          </div>

          <a href="#contact" data-preset-service="SEO & Paid Growth" class="btn btn-primary roi-cta">
            Lock In This Growth Roadmap &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .roi-grid {
    display: grid;
    gap: 2rem;
    align-items: stretch;

    @include respond-up(lg) {
      grid-template-columns: 1fr 1fr;
      gap: 2.25rem;
    }
  }

  .roi-controls {
    @include interactive-card;
    padding: clamp(1.5rem, 3vw, 2.25rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.75rem;
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;

    input[type='range'] {
      width: 100%;
      accent-color: $accent-cobalt;
      cursor: pointer;
    }
  }

  .slider-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    label {
      font-size: 0.92rem;
      font-weight: 700;
      color: $text-primary;
    }
  }

  .mono-val {
    font-family: $font-mono;
    font-size: 0.88rem;
    color: $accent-blue-light;
  }

  .slider-scale {
    display: flex;
    justify-content: space-between;
    font-family: $font-mono;
    font-size: 0.7rem;
    color: $text-muted;
  }

  .dual-sliders {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;

    @include respond-up(sm) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .mini-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    span {
      font-size: 0.76rem;
      color: $text-secondary;
      font-family: $font-mono;
    }
  }

  .roi-telemetry {
    @include glass-surface(true);
    @include agma-border(36px, 2);
    border-radius: 36px;
    padding: clamp(1.5rem, 3vw, 2.25rem);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.45rem;
  }

  .telemetry-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .live-chip {
    font-family: $font-mono;
    font-size: 0.74rem;
    color: $accent-blue-light;
    font-weight: 700;
  }

  .kpi-pair {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;

    @include respond-up(sm) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .kpi-box {
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid $border-subtle;
    border-radius: $radius-md;
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    &--accent {
      border-color: rgba(1, 106, 212, 0.45);
      background: rgba(1, 106, 212, 0.1);
    }

    span {
      font-size: 0.76rem;
      color: $text-secondary;
    }

    strong {
      font-family: $font-display;
      font-size: clamp(1.35rem, 2.3vw, 1.8rem);
      font-weight: 500;
      letter-spacing: -0.025em;
      color: #ffffff;
    }

    small {
      font-family: $font-mono;
      font-size: 0.7rem;
      color: $text-muted;
    }
  }

  .vitals-compare {
    display: grid;
    gap: 0.9rem;
    padding: 1rem 1.1rem;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border-subtle;
  }

  .vital-row {
    display: grid;
    gap: 0.45rem;
  }

  .vital-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: $text-secondary;
  }

  .vital-legacy {
    font-family: $font-mono;
    color: $accent-rose;
  }

  .vital-modern {
    font-family: $font-mono;
    color: $accent-blue-light;
  }

  .vital-track {
    height: 8px;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .vital-fill {
    height: 100%;
    border-radius: $radius-pill;
    transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1);

    &--legacy {
      background: linear-gradient(90deg, #fb7185, #f59e0b);
    }

    &--modern {
      background: linear-gradient(90deg, #016ad4, #38bdf8, #84b5e6);
    }
  }

  .roi-cta {
    width: 100%;
  }
</style>
