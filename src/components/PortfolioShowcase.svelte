<script lang="ts">
  import { PORTFOLIO_ITEMS, CASE_STUDIES, type PortfolioItem } from '../data/agencyData';

  const categories = ['All', 'Online Store', 'Corporate Website', 'Web App'] as const;
  let selected = $state<(typeof categories)[number]>('All');
  let lightboxItem = $state<PortfolioItem | null>(null);

  let filtered = $derived(
    selected === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === selected)
  );
</script>

<section class="section portfolio-section" id="projects" aria-labelledby="projects-heading">
  <div class="container">
    <div class="portfolio-head" data-reveal>
      <div>
        <span class="eyebrow">Selected Flagships &amp; Own Productions</span>
        <h2 class="section-title" id="projects-heading">Creating digital masterpieces every day.</h2>
        <p class="section-lead">
          Explore our live production platforms—including <a href="https://anchialo.com" target="_blank" rel="noopener" class="inline-domain">anchialo.com ↗</a>, <a href="https://cptmma.com" target="_blank" rel="noopener" class="inline-domain">cptmma.com ↗</a>, and <a href="https://aeterna.website" target="_blank" rel="noopener" class="inline-domain">aeterna.website ↗</a>—alongside clearly marked UI/UX design concepts.
        </p>
      </div>
      <div class="filter-pills" role="tablist" aria-label="Filter projects by type">
        {#each categories as cat}
          <button
            type="button"
            role="tab"
            aria-selected={selected === cat}
            class:active={selected === cat}
            onclick={() => (selected = cat)}
          >
            {cat}
          </button>
        {/each}
      </div>
    </div>

    <!-- Clean zero-duplicate Showcase Grid (each project appears exactly once) -->
    <div class="showcase-grid" data-reveal>
      {#each filtered as project (project.id)}
        <button type="button" class="wall-card" onclick={() => (lightboxItem = project)}>
          <div class="wall-card__img">
            <img src={project.image} alt={`${project.title} desktop UI`} loading="lazy" />
            <span class={project.isConcept ? 'wall-card__status wall-card__status--concept' : 'wall-card__status wall-card__status--live'}>
              {project.isConcept ? 'UI/UX Concept' : '● Live Site'}
            </span>
            <span class="wall-card__badge">{project.metric}</span>
          </div>
          <div class="wall-card__meta">
            <div>
              <strong>{project.title}</strong>
              <span>{project.liveDomain ? `${project.liveDomain} ↗` : `Concept • ${project.region}`}</span>
            </div>
            <span class="tag">{project.category}</span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Featured Video Case Studies -->
    <div class="case-studies">
      {#each CASE_STUDIES as study}
        <article class="case-card" data-glow-card data-reveal>
          <div class="case-card__visual">
            <div class="browser-bar">
              <span></span><span></span><span></span>
              {#if study.liveUrl}
                <a href={study.liveUrl} target="_blank" rel="noopener" class="browser-url">
                  https://{study.liveDomain} ↗
                </a>
              {:else}
                <small>{study.client}</small>
              {/if}
            </div>
            <video
              src={study.video}
              poster={study.poster}
              autoplay
              loop
              muted
              playsinline
            ></video>
          </div>

          <div class="case-card__content">
            <div class="case-card__tags">
              <span class="tag">{study.tag}</span>
              <span class="live-chip">● Live Case Study</span>
            </div>
            <h3>{study.client}</h3>
            <p class="case-card__headline">{study.headline}</p>

            <div class="case-stats">
              {#each study.stats as stat}
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              {/each}
            </div>

            <blockquote class="case-quote">
              “{study.quote}”
            </blockquote>

            <div class="case-card__footer">
              <div class="case-author">
                {#if study.avatar}
                  <img src={study.avatar} alt={study.author} loading="lazy" />
                {:else}
                  <span class="monogram-avatar" aria-hidden="true">{study.monogram}</span>
                {/if}
                <div>
                  <strong>{study.author}</strong>
                  <span>{study.role}</span>
                </div>
              </div>

              {#if study.liveUrl}
                <a href={study.liveUrl} target="_blank" rel="noopener" class="btn btn-primary live-visit-btn">
                  Visit {study.liveDomain} ↗
                </a>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>

  {#if lightboxItem}
    <div class="lightbox" role="dialog" aria-modal="true" aria-label={lightboxItem.title}>
      <div class="lightbox__card">
        <button type="button" class="lightbox__close" onclick={() => (lightboxItem = null)} aria-label="Close preview">×</button>
        <img src={lightboxItem.image} alt={lightboxItem.title} />
        <div class="lightbox__body">
          <div class="lightbox__head">
            <div>
              <span class="tag">
                {lightboxItem.category} • {lightboxItem.isConcept ? 'UI/UX Concept' : 'Live Production'} • {lightboxItem.region}
              </span>
              <h3>{lightboxItem.title}</h3>
            </div>
            <strong class="lightbox__metric">{lightboxItem.metric}</strong>
          </div>
          <p>{lightboxItem.summary}</p>
          <div class="lightbox__footer">
            <div class="chips">
              {#each lightboxItem.stack as tech}
                <span>{tech}</span>
              {/each}
            </div>
            <div class="lightbox__actions">
              {#if lightboxItem.liveUrl}
                <a href={lightboxItem.liveUrl} target="_blank" rel="noopener" class="btn btn-primary">
                  Open {lightboxItem.liveDomain} ↗
                </a>
              {/if}
              <a href="#contact" class="btn btn-ghost" onclick={() => (lightboxItem = null)}>
                Request Similar Build
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .inline-domain {
    color: $accent-emerald;
    font-weight: 700;
    border-bottom: 1px dashed rgba(0, 245, 160, 0.5);
  }

  .portfolio-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2.25rem;

    > div:first-child {
      max-width: 700px;
    }
  }

  .filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    button {
      padding: 0.52rem 1.05rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid $border-subtle;
      color: $text-secondary;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-fast;

      &.active,
      &:hover {
        border-color: rgba(0, 245, 160, 0.5);
        color: #ffffff;
        background: rgba(1, 106, 212, 0.28);
      }
    }
  }

  .showcase-grid {
    display: grid;
    gap: 1.35rem;
    grid-template-columns: 1fr;

    @include respond-up(sm) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include respond-up(lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .wall-card {
    @include interactive-card;
    width: 100%;
    padding: 0.85rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;

    &__img {
      position: relative;
      border-radius: $radius-md;
      overflow: hidden;
      aspect-ratio: 16 / 10;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform $transition-smooth;
      }
    }

    &:hover &__img img {
      transform: scale(1.05);
    }

    &__status {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.26rem 0.65rem;
      border-radius: $radius-pill;
      font-family: $font-mono;
      font-size: 0.68rem;
      font-weight: 700;
      background: rgba(6, 7, 13, 0.88);

      &--live {
        border: 1px solid rgba(0, 245, 160, 0.52);
        color: $accent-emerald;
      }

      &--concept {
        border: 1px solid rgba(252, 193, 244, 0.48);
        color: $accent-orchid;
      }
    }

    &__badge {
      position: absolute;
      bottom: 0.75rem;
      left: 0.75rem;
      padding: 0.3rem 0.72rem;
      border-radius: $radius-pill;
      background: rgba(6, 7, 13, 0.86);
      border: 1px solid rgba(0, 245, 160, 0.42);
      color: $accent-emerald;
      font-family: $font-mono;
      font-size: 0.7rem;
      font-weight: 700;
    }

    &__meta {
      padding: 0.95rem 0.35rem 0.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex: 1;

      strong {
        display: block;
        font-size: 0.98rem;
        color: #ffffff;
      }

      span:not(.tag) {
        font-size: 0.76rem;
        color: $accent-blue-light;
      }
    }
  }

  .case-studies {
    margin-top: 4rem;
    display: grid;
    gap: 2.25rem;
  }

  .case-card {
    @include interactive-card;
    padding: 1.5rem;
    display: grid;
    gap: 2rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 1.05fr 0.95fr;
      padding: 2.15rem;
    }

    &__visual {
      border-radius: $radius-md;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.11);
      background: #04060c;

      video {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
      }
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
    }

    &__content {
      h3 {
        margin: 0.85rem 0 0.45rem;
        font-size: clamp(1.45rem, 2.4vw, 1.85rem);
        letter-spacing: -0.025em;
      }
    }

    &__headline {
      margin: 0 0 1.35rem;
      color: $text-secondary;
      font-size: 0.98rem;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
  }

  .browser-bar {
    height: 36px;
    padding-inline: 0.9rem;
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 0.4rem;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
    }

    small,
    .browser-url {
      margin-left: auto;
      font-family: $font-mono;
      font-size: 0.74rem;
      color: $accent-emerald;
      font-weight: 600;
    }
  }

  .live-visit-btn {
    padding: 0.68rem 1.25rem;
    font-size: 0.84rem;
  }

  .live-chip {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $accent-emerald;
  }

  .case-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    padding: 1.05rem;
    border-radius: $radius-md;
    background: rgba(1, 106, 212, 0.1);
    border: 1px solid rgba(132, 181, 230, 0.2);
    margin-bottom: 1.3rem;

    strong {
      display: block;
      font-size: 1.28rem;
      color: $accent-emerald;
    }

    span {
      font-size: 0.75rem;
      color: $text-muted;
    }
  }

  .case-quote {
    margin: 0 0 1.3rem;
    padding-left: 1rem;
    border-left: 2px solid $accent-orchid;
    color: #f1f5f9;
    font-size: 0.94rem;
    font-style: italic;
  }

  .case-author {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    strong {
      display: block;
      font-size: 0.94rem;
    }

    span {
      font-size: 0.78rem;
      color: $text-muted;
    }
  }

  .monogram-avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-family: $font-mono;
    font-weight: 800;
    font-size: 0.85rem;
    background: rgba(1, 106, 212, 0.24);
    border: 1px solid rgba(132, 181, 230, 0.42);
    color: $accent-emerald;
    flex-shrink: 0;
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 110;
    background: rgba(4, 6, 12, 0.88);
    backdrop-filter: blur(14px);
    display: grid;
    place-items: center;
    padding: 1.25rem;

    &__card {
      @include glass-surface(true);
      border-radius: $radius-lg;
      max-width: 860px;
      width: 100%;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        max-height: 460px;
        object-fit: cover;
      }
    }

    &__close {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(6, 7, 13, 0.8);
      color: #fff;
      font-size: 1.4rem;
      cursor: pointer;
    }

    &__body {
      padding: 1.6rem 1.8rem;

      p {
        color: $text-secondary;
        margin: 0.75rem 0 1.35rem;
      }
    }

    &__head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;

      h3 {
        margin: 0.5rem 0 0;
        font-size: 1.5rem;
      }
    }

    &__metric {
      font-family: $font-mono;
      font-size: 1rem;
      color: $accent-emerald;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    span {
      font-family: $font-mono;
      font-size: 0.75rem;
      padding: 0.28rem 0.65rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
    }
  }
</style>
