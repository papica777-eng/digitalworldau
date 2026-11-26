<script lang="ts">
  import GlobeCanvas from './GlobeCanvas.svelte';
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
    <div class="global-hero-grid" data-reveal>
      <div class="global-copy">
        <span class="eyebrow">Global Reach &amp; Verified Proof</span>
        <h2 class="section-title" id="global-heading">Engineered in Australia. Trusted across 7 international markets.</h2>
        <p class="section-lead">
          From Sydney and Melbourne to Sofia, Munich, Paris, Zurich, New York, and Toronto—our distributed engineering and growth pods ship category-defining digital flagships.
        </p>

        <div class="google-rating-card" data-glow-card>
          <svg class="google-g" width="38" height="38" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <div>
            <div class="stars" aria-label="5.0 out of 5 stars">
              {#each Array(5) as _}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              {/each}
            </div>
            <strong>5.0 Rating / 100+ Reviews</strong>
            <span>Verified Google Client Satisfaction</span>
          </div>
        </div>
      </div>

      <div class="global-visuals">
        <GlobeCanvas />
        <div class="studio-video-card" data-glow-card>
          <video
            src="/videos/studio-atmos.mp4"
            poster="/media/studio-team.webp"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <div class="studio-video-card__caption">
            <span class="tag">Studio Pod Sync</span>
            <strong>Dedicated Senior Design &amp; Engineering Squads</strong>
          </div>
        </div>
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

  .global-hero-grid {
    display: grid;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2.25rem;

    @include respond-up(lg) {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
  }

  .google-rating-card {
    @include interactive-card;
    margin-top: 1.85rem;
    display: inline-flex;
    align-items: center;
    gap: 1.1rem;
    padding: 1.15rem 1.5rem;
    border-radius: $radius-md;
    border-color: rgba(255, 194, 0, 0.3);

    strong {
      display: block;
      margin-top: 0.25rem;
      font-size: 1.1rem;
      color: #ffffff;
    }

    span {
      font-size: 0.78rem;
      color: $text-muted;
    }
  }

  .global-visuals {
    display: grid;
    gap: 1rem;

    @include respond-up(sm) {
      grid-template-columns: 1.1fr 0.9fr;
    }
  }

  .studio-video-card {
    @include interactive-card;
    height: 310px;
    position: relative;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__caption {
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      padding: 1rem;
      background: linear-gradient(to top, rgba(6, 7, 13, 0.95), transparent);

      strong {
        display: block;
        margin-top: 0.4rem;
        font-size: 0.88rem;
      }
    }
  }

  .region-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-bottom: 2.25rem;

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.92rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid $border-subtle;
      color: $text-secondary;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all $transition-fast;

      .code {
        font-family: $font-mono;
        font-size: 0.72rem;
        color: $accent-blue-light;
      }

      small {
        color: $text-muted;
        font-size: 0.72rem;
      }

      &.active,
      &:hover {
        border-color: rgba(0, 245, 160, 0.5);
        background: rgba(1, 106, 212, 0.25);
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

    @include respond-up(lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
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
      color: #f1f5f9;
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

      span {
        font-size: 0.78rem;
        color: $text-muted;
      }
    }
  }
</style>
