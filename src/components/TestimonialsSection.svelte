<script lang="ts">
  import GlobeCanvas from './GlobeCanvas.svelte';
  import { GLOBAL_REGIONS, TESTIMONIALS } from '../data/agencyData';

  type ContinentKey = 'Asia-Pacific' | 'Europe' | 'North America' | 'Global Enterprise';

  const CONTINENT_GROUPS: Array<{
    key: ContinentKey;
    label: string;
    defaultCode: string;
  }> = [
    { key: 'Europe', label: 'Europe', defaultCode: 'BG' },
    { key: 'North America', label: 'North America', defaultCode: 'US' },
    { key: 'Asia-Pacific', label: 'Asia-Pacific', defaultCode: 'AU' },
    { key: 'Global Enterprise', label: 'Global Enterprise Pods', defaultCode: 'CH' },
  ];

  let selectedRegionCode = $state<string>('AU');
  let openContinent = $state<ContinentKey | null>('Asia-Pacific');

  function regionsFor(key: ContinentKey) {
    if (key === 'Global Enterprise') {
      return GLOBAL_REGIONS.filter((r) => r.code === 'AU' || r.code === 'BG' || r.code === 'CH');
    }
    return GLOBAL_REGIONS.filter((r) => r.regionGroup === key);
  }

  function toggleContinent(group: (typeof CONTINENT_GROUPS)[number]) {
    if (openContinent === group.key) {
      openContinent = null;
    } else {
      openContinent = group.key;
      selectedRegionCode = group.defaultCode;
    }
  }

  function handleGlobeSelect(code: string) {
    selectedRegionCode = code;
    const match = GLOBAL_REGIONS.find((r) => r.code === code);
    if (match) {
      openContinent = match.regionGroup;
    }
  }
</script>

<section class="section global-section" aria-labelledby="global-heading">
  <div class="container">
    <div class="global-hero-grid" data-reveal>
      <div class="global-copy">
        <span class="eyebrow">Global Delivery &amp; Partnerships</span>
        <h2 class="global-title" id="global-heading">Working with clients worldwide</h2>
        <p class="section-lead">
          Beyond Australia and Bulgaria, we rapidly scale digital flagship platforms across international hubs in Germany, France, Switzerland, the USA, and Canada.
        </p>

        <div class="continent-accordion" aria-label="Filter global delivery hubs by continent">
          {#each CONTINENT_GROUPS as group}
            {@const isOpen = openContinent === group.key}
            {@const list = regionsFor(group.key)}
            <div class="acc-item" class:open={isOpen}>
              <button
                type="button"
                class="acc-trigger"
                aria-expanded={isOpen}
                onclick={() => toggleContinent(group)}
              >
                <span>{group.label}</span>
                <span class="acc-plus" aria-hidden="true">+</span>
              </button>

              {#if isOpen}
                <div class="acc-body">
                  {#each list as region}
                    <button
                      type="button"
                      class="acc-country"
                      class:active={selectedRegionCode === region.code}
                      onclick={() => (selectedRegionCode = region.code)}
                    >
                      <span class="acc-code">{region.code}</span>
                      <span class="acc-name">
                        <strong>{region.name}</strong>
                        <small>{region.hub}</small>
                      </span>
                      <span class="acc-domain">{region.projectDomain}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="global-earth-column">
        <GlobeCanvas
          selectedCode={selectedRegionCode}
          onSelectRegion={handleGlobeSelect}
        />
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
    margin-bottom: 3.25rem;

    @include respond-up(lg) {
      grid-template-columns: 0.84fr 1.16fr;
      gap: 2.75rem;
    }
  }

  .global-title {
    font-family: $font-display;
    font-weight: 500;
    font-size: clamp(2.1rem, 4.1vw, 3.25rem);
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: #ffffff;
    margin: 0 0 1rem;
  }

  .continent-accordion {
    margin-top: 1.85rem;
    display: grid;
    gap: 0.72rem;
  }

  .acc-item {
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    overflow: hidden;
    transition: border-color $transition-fast, background $transition-fast;

    &.open {
      background: rgba(255, 255, 255, 0.055);
      border-color: rgba(132, 181, 230, 0.36);

      .acc-plus {
        transform: rotate(45deg);
        color: $accent-blue-light;
      }
    }
  }

  .acc-trigger {
    width: 100%;
    padding: 1.05rem 1.35rem;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
    font-family: $font-display;
    font-size: 0.96rem;
    font-weight: 500;
    color: #ffffff;
    text-align: left;
  }

  .acc-plus {
    font-size: 1.35rem;
    font-weight: 400;
    line-height: 1;
    color: $accent-cobalt;
    transition: transform $transition-fast, color $transition-fast;
  }

  .acc-body {
    padding: 0 0.85rem 0.9rem;
    display: grid;
    gap: 0.45rem;
  }

  .acc-country {
    width: 100%;
    padding: 0.62rem 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.025);
    display: flex;
    align-items: center;
    gap: 0.72rem;
    text-align: left;
    cursor: pointer;
    transition: background $transition-fast, border-color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.075);
    }

    &.active {
      background: rgba(1, 106, 212, 0.28);
      border-color: rgba(132, 181, 230, 0.55);

      .acc-code {
        background: $accent-cobalt;
        color: #ffffff;
      }

      .acc-domain {
        color: #ffffff;
      }
    }
  }

  .acc-code {
    font-family: $font-mono;
    font-size: 0.72rem;
    font-weight: 700;
    width: 32px;
    height: 26px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: $accent-blue-light;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .acc-name {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: 0.84rem;
      font-weight: 600;
      color: #ffffff;
    }

    small {
      font-size: 0.72rem;
      color: $text-muted;
    }
  }

  .acc-domain {
    margin-left: auto;
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $accent-blue-light;
    white-space: nowrap;
  }

  .global-earth-column {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
