<script lang="ts">
  import GlobeCanvas from './GlobeCanvas.svelte';
  import { GLOBAL_REGIONS, TESTIMONIALS } from '../data/agencyData';
</script>

<section class="section global-section" aria-labelledby="global-heading">
  <div class="container">
    <div class="global-hero-grid" data-reveal>
      <div class="global-copy">
        <span class="eyebrow">Global Reach &amp; Production Proof</span>
        <h2 class="section-title" id="global-heading">Engineered in Australia. Trusted across 7 international markets.</h2>
        <p class="section-lead">
          From Sydney and Melbourne to Sofia, Munich, Paris, Zurich, New York, and Toronto—our distributed engineering and growth pods ship category-defining digital flagships.
        </p>

        <div class="proof-card" data-glow-card>
          <span class="proof-card__kicker">Verifiable Live Productions</span>
          <strong>
            <a href="https://anchialo.com" target="_blank" rel="noopener">anchialo.com ↗</a>
            <span>•</span>
            <a href="https://cptmma.com" target="_blank" rel="noopener">cptmma.com ↗</a>
            <span>•</span>
            <a href="https://aeterna.website" target="_blank" rel="noopener">aeterna.website ↗</a>
          </strong>
          <span class="proof-card__sub">100% Fixed-Scope Milestones • Full IP Ownership</span>
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

    <div class="region-strip" data-reveal aria-label="Global delivery hubs">
      {#each GLOBAL_REGIONS as region}
        <div class="hub-pill">
          <span class="code">{region.code}</span>
          <span>{region.name}</span>
          <small>{region.clients}</small>
        </div>
      {/each}
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
    gap: 2rem;
    align-items: center;
    margin-bottom: 2.25rem;

    @include respond-up(lg) {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
  }

  .proof-card {
    @include interactive-card;
    margin-top: 1.85rem;
    display: inline-flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.15rem 1.5rem;
    border-radius: $radius-md;
    border-color: rgba(0, 245, 160, 0.32);

    &__kicker {
      font-family: $font-mono;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $accent-blue-light;
    }

    strong {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.04rem;
      color: #ffffff;

      a {
        color: $accent-emerald;
      }

      span {
        color: $text-muted;
        font-weight: 500;
      }
    }

    &__sub {
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
  }

  .hub-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.5rem 0.92rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid $border-subtle;
    color: $text-secondary;
    font-size: 0.82rem;

    .code {
      font-family: $font-mono;
      font-size: 0.72rem;
      color: $accent-blue-light;
    }

    small {
      color: $text-muted;
      font-size: 0.72rem;
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

      .company-link {
        font-size: 0.78rem;
        color: $accent-blue-light;
      }
    }
  }

  .live-link {
    font-family: $font-mono;
    font-size: 0.74rem;
    color: $accent-emerald;
    font-weight: 700;
  }
</style>
