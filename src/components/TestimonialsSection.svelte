<script lang="ts">
  import { GLOBAL_REGIONS, TESTIMONIALS } from '../data/agencyData';

  let activeCountry = $state<string>('All');
  let filteredTestimonials = $derived(
    activeCountry === 'All'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.country === activeCountry)
  );
</script>

<section class="section global-section" aria-labelledby="global-heading">
  <div class="container">
    <div class="global-top" data-reveal>
      <div>
        <span class="eyebrow">Global Reach &amp; Proof</span>
        <h2 class="section-title" id="global-heading">Trusted across Australia, Europe &amp; North America.</h2>
        <p class="section-lead">
          Headquartered in Australia with senior engineering pods serving high-growth teams in Bulgaria, Germany, France, Switzerland, the USA, and Canada.
        </p>
      </div>

      <div class="google-badge" data-glow-card>
        <div class="google-badge__stars stars" aria-label="5.0 out of 5 stars">
          {#each Array(5) as _}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          {/each}
        </div>
        <strong>5.0 Rating / 100+ Reviews</strong>
        <span>Verified Google Business Profile</span>
      </div>
    </div>

    <div class="region-strip" data-reveal>
      <button
        type="button"
        class:active={activeCountry === 'All'}
        onclick={() => (activeCountry = 'All')}
      >
        All Markets (180+)
      </button>
      {#each GLOBAL_REGIONS as region}
        <button
          type="button"
          class:active={activeCountry === region.name}
          onclick={() => (activeCountry = region.name)}
        >
          <span class="code">{region.code}</span>
          <span>{region.name}</span>
          <small>{region.clients}</small>
        </button>
      {/each}
    </div>

    <div class="testimonials-grid" data-reveal>
      {#each (filteredTestimonials.length > 0 ? filteredTestimonials : TESTIMONIALS) as t}
        <article class="testimonial-card" data-glow-card>
          <div class="testimonial-card__top">
            <div class="stars" aria-label="5 star review">
              {#each Array(5) as _}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              {/each}
            </div>
            <span class="tag">{t.country}</span>
          </div>
          <p class="testimonial-card__quote">“{t.quote}”</p>
          <div class="testimonial-card__author">
            <img src={t.avatar} alt={t.name} loading="lazy" />
            <div>
              <strong>{t.name}</strong>
              <span>{t.role}, {t.company}</span>
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

  .global-top {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.75rem;
    margin-bottom: 2rem;

    > div:first-child {
      max-width: 680px;
    }
  }

  .google-badge {
    @include interactive-card;
    padding: 1.15rem 1.45rem;
    border-radius: $radius-md;
    border-color: rgba(251, 191, 36, 0.28);

    strong {
      display: block;
      margin-top: 0.45rem;
      font-size: 1.08rem;
      color: #ffffff;
    }

    span {
      font-size: 0.78rem;
      color: $text-muted;
    }
  }

  .region-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 2.2rem;

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.9rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid $border-subtle;
      color: $text-secondary;
      font-size: 0.83rem;
      cursor: pointer;
      transition: all $transition-fast;

      .code {
        font-family: $font-mono;
        font-size: 0.72rem;
        color: $accent-cyan;
      }

      small {
        color: $text-muted;
        font-size: 0.72rem;
      }

      &.active,
      &:hover {
        border-color: rgba(0, 245, 160, 0.45);
        background: rgba(0, 245, 160, 0.1);
        color: #ffffff;
      }
    }
  }

  .testimonials-grid {
    display: grid;
    gap: 1.35rem;
    grid-template-columns: 1fr;

    @include respond-up(md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .testimonial-card {
    @include interactive-card;
    padding: 1.6rem;
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
      color: #e2e8f0;
      font-size: 0.98rem;
      line-height: 1.65;
      flex: 1;
    }

    &__author {
      display: flex;
      align-items: center;
      gap: 0.85rem;

      img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        object-fit: cover;
      }

      strong {
        display: block;
        font-size: 0.95rem;
      }

      span {
        font-size: 0.8rem;
        color: $text-muted;
      }
    }
  }
</style>
