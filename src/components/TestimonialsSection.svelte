<script lang="ts">
  import GlobeCanvas from './GlobeCanvas.svelte';
  import { GLOBAL_REGIONS, TESTIMONIALS } from '../data/agencyData';

  let selectedRegionCode = $state<string>('AU');
</script>

<section class="section global-section" aria-labelledby="global-heading">
  <div class="container">
    <div class="global-hero-grid" data-reveal>
      <div class="global-copy">
        <span class="eyebrow">Global Reach &amp; Production Proof</span>
        <h2 class="section-title" id="global-heading">Engineered in Australia. Trusted across 7 international markets.</h2>
        <p class="section-lead">
          From Sydney and Melbourne to Sofia, Munich, Paris, Zurich, New York, and Toronto—select any market below to spin our 3D Earth straight to its live production hub.
        </p>

        <div class="markets-selector" role="listbox" aria-label="Select global delivery market to focus Earth">
          {#each GLOBAL_REGIONS as region}
            <button
              type="button"
              role="option"
              aria-selected={selectedRegionCode === region.code}
              class="market-row"
              class:active={selectedRegionCode === region.code}
              onclick={() => (selectedRegionCode = region.code)}
            >
              <span class="market-row__code">{region.code}</span>
              <span class="market-row__info">
                <strong>{region.name}</strong>
                <small>{region.hub} • {region.clients}</small>
              </span>
              <span class="market-row__domain">{region.projectDomain}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="global-earth-column">
        <GlobeCanvas
          selectedCode={selectedRegionCode}
          onSelectRegion={(code) => (selectedRegionCode = code)}
        />
      </div>
    </div>

    <div class="proof-banner" data-glow-card data-reveal>
      <div class="proof-banner__copy">
        <span class="proof-banner__kicker">Verifiable Live Productions • 100% IP Ownership</span>
        <div class="proof-banner__links">
          <a href="https://anchialo.com" target="_blank" rel="noopener">anchialo.com ↗</a>
          <span>·</span>
          <a href="https://cptmma.com" target="_blank" rel="noopener">cptmma.com ↗</a>
          <span>·</span>
          <a href="https://aeterna.website" target="_blank" rel="noopener">aeterna.website ↗</a>
          <span>·</span>
          <a href="https://nasvetlo.website" target="_blank" rel="noopener">nasvetlo.website ↗</a>
        </div>
      </div>

      <div class="studio-pod-chip">
        <video
          src="/videos/studio-atmos.mp4"
          poster="/media/studio-team.webp"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <div>
          <span class="tag">Studio Pod Sync</span>
          <strong>Dedicated Senior Design &amp; Engineering</strong>
        </div>
      </div>
    </div>

    <div class="testimonials-grid" data-reveal>
      {#each TESTIMONIALS as t}
        <article class="testimonial-card" data-glow-card>
          <div class="testimonial-card__top">
            <span class="tag">{t.country}</span>
            <a href={t.liveUrl} target="_blank" rel="noopener" class="live-link">
              {t.liveDomain} ↗
            </a>
          </div>
          <p class="testimonial-card__quote">“{t.quote}”</p>
          <div class="testimonial-card__author">
            {#if t.avatar}
              <img src={t.avatar} alt={t.name} loading="lazy" />
            {/if}
            <div>
              <strong>{t.name}</strong>
              <a href={t.liveUrl} target="_blank" rel="noopener" class="company-link">
                {t.role}, {t.company} ↗
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .global-hero-grid {
    display: grid;
    gap: 2.25rem;
    align-items: center;
    margin-bottom: 2.75rem;

    @include respond-up(lg) {
      grid-template-columns: 1fr 1.18fr;
      gap: 3rem;
    }
  }

  .markets-selector {
    margin-top: 1.75rem;
    display: grid;
    gap: 0.55rem;
  }

  .market-row {
    @include glass-surface;
    @include agma-border($radius-sm, 1);
    width: 100%;
    padding: 0.72rem 1rem;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    text-align: left;
    cursor: pointer;
    transition: transform $transition-fast, background $transition-fast, border-color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.085);
      transform: translateX(4px);
    }

    &.active {
      background: rgba(1, 106, 212, 0.24);
      border-color: rgba(132, 181, 230, 0.55);

      .market-row__code {
        background: $accent-cobalt;
        color: #ffffff;
        box-shadow: 0 0 14px rgba(1, 106, 212, 0.65);
      }

      .market-row__domain {
        color: #ffffff;
      }
    }

    &__code {
      font-family: $font-mono;
      font-size: 0.74rem;
      font-weight: 700;
      width: 34px;
      height: 28px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.07);
      color: $accent-blue-light;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      transition: background $transition-fast, color $transition-fast, box-shadow $transition-fast;
    }

    &__info {
      display: flex;
      flex-direction: column;
      min-width: 0;

      strong {
        font-family: $font-display;
        font-size: 0.86rem;
        font-weight: 500;
        color: #ffffff;
      }

      small {
        font-size: 0.74rem;
        color: $text-muted;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &__domain {
      margin-left: auto;
      font-family: $font-mono;
      font-size: 0.72rem;
      color: $accent-blue-light;
      white-space: nowrap;
      flex-shrink: 0;
    }
  }

  .global-earth-column {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .proof-banner {
    @include interactive-card;
    padding: 1.15rem 1.45rem;
    margin-bottom: 2.25rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;

    &__kicker {
      display: block;
      font-family: $font-mono;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $accent-blue-light;
      margin-bottom: 0.45rem;
    }

    &__links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem 0.7rem;
      font-family: $font-mono;
      font-size: 0.92rem;
      font-weight: 600;

      a {
        color: #ffffff;
        transition: color $transition-fast;

        &:hover {
          color: $accent-blue-light;
        }
      }

      span {
        color: $text-muted;
      }
    }
  }

  .studio-pod-chip {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    video {
      width: 68px;
      height: 52px;
      border-radius: 12px;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.14);
      flex-shrink: 0;
    }

    strong {
      display: block;
      margin-top: 0.28rem;
      font-size: 0.82rem;
      color: #ffffff;
    }
  }

  .testimonials-grid {
    display: grid;
    gap: 1.35rem;
    grid-template-columns: 1fr;

    @include respond-up(md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include respond-up(lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .testimonial-card {
    @include interactive-card;
    padding: 1.65rem;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;

    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__quote {
      margin: 0;
      color: rgba(255, 255, 255, 0.86);
      font-size: 0.94rem;
      line-height: 1.65;
      flex: 1;
    }

    &__author {
      display: flex;
      align-items: center;
      gap: 0.85rem;

      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
      }

      strong {
        display: block;
        font-size: 0.92rem;
      }

      .company-link {
        font-size: 0.78rem;
        color: $accent-blue-light;
      }
    }
  }

  .live-link {
    font-family: $font-mono;
    font-size: 0.74rem;
    color: $accent-blue-light;
    font-weight: 600;
  }
</style>
