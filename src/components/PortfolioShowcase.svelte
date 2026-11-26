<script lang="ts">
  import { PORTFOLIO_ITEMS, CASE_STUDIES } from '../data/agencyData';

  const categories = ['All', 'Online Store', 'Corporate Website', 'Web App'] as const;
  let selected = $state<(typeof categories)[number]>('All');

  let filtered = $derived(
    selected === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === selected)
  );
</script>

<section class="section" id="projects" aria-labelledby="projects-heading">
  <div class="container">
    <div class="portfolio-head" data-reveal>
      <div>
        <span class="eyebrow">Selected Works</span>
        <h2 class="section-title" id="projects-heading">Creating digital masterpieces every day.</h2>
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

    <div class="gallery-rail" data-reveal>
      {#each filtered as project (project.id)}
        <article class="project-card" data-glow-card>
          <div class="project-card__media">
            <img src={project.image} alt={`${project.title} UI mockup`} loading="lazy" />
            <span class="project-card__metric">{project.metric}</span>
          </div>
          <div class="project-card__body">
            <div class="project-card__top">
              <span class="tag">{project.category}</span>
              <span class="project-card__region">{project.region}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div class="project-card__stack">
              {#each project.stack as tech}
                <span>{tech}</span>
              {/each}
            </div>
          </div>
        </article>
      {/each}
    </div>

    <div class="case-studies">
      {#each CASE_STUDIES as study}
        <article class="case-card" data-glow-card data-reveal>
          <div class="case-card__visual">
            <img src={study.image} alt={`${study.client} digital platform preview`} loading="lazy" />
          </div>
          <div class="case-card__content">
            <span class="tag">{study.tag}</span>
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

            <div class="case-author">
              <img src={study.avatar} alt={study.author} loading="lazy" />
              <div>
                <strong>{study.author}</strong>
                <span>{study.role}</span>
              </div>
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

  .portfolio-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2.25rem;
  }

  .filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    button {
      padding: 0.5rem 1rem;
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
        border-color: rgba(0, 245, 160, 0.45);
        color: $accent-emerald;
        background: rgba(0, 245, 160, 0.1);
      }
    }
  }

  .gallery-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(295px, 360px);
    gap: 1.35rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 99px;
    }
  }

  .project-card {
    @include interactive-card;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;

    &__media {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform $transition-smooth;
      }
    }

    &:hover &__media img {
      transform: scale(1.04);
    }

    &__metric {
      position: absolute;
      bottom: 0.75rem;
      left: 0.75rem;
      padding: 0.3rem 0.72rem;
      border-radius: $radius-pill;
      background: rgba(5, 7, 13, 0.84);
      border: 1px solid rgba(0, 245, 160, 0.35);
      color: $accent-emerald;
      font-family: $font-mono;
      font-size: 0.73rem;
      font-weight: 600;
    }

    &__body {
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      flex: 1;

      h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      p {
        margin: 0;
        font-size: 0.88rem;
        color: $text-secondary;
        flex: 1;
      }
    }

    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    &__region {
      font-size: 0.75rem;
      color: $text-muted;
    }

    &__stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.25rem;

      span {
        font-family: $font-mono;
        font-size: 0.7rem;
        color: $text-muted;
        padding: 0.18rem 0.5rem;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.04);
      }
    }
  }

  .case-studies {
    margin-top: 3.5rem;
    display: grid;
    gap: 1.75rem;
  }

  .case-card {
    @include interactive-card;
    padding: 1.5rem;
    display: grid;
    gap: 1.75rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 0.92fr 1.08fr;
      padding: 2rem;
    }

    &__visual {
      border-radius: $radius-md;
      overflow: hidden;
      aspect-ratio: 16 / 10;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__content {
      h3 {
        margin: 0.75rem 0 0.4rem;
        font-size: 1.65rem;
        letter-spacing: -0.025em;
      }
    }

    &__headline {
      margin: 0 0 1.25rem;
      color: $text-secondary;
      font-size: 0.98rem;
    }
  }

  .case-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    padding: 1rem;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border-subtle;
    margin-bottom: 1.25rem;

    strong {
      display: block;
      font-size: 1.25rem;
      color: $accent-emerald;
    }

    span {
      font-size: 0.75rem;
      color: $text-muted;
    }
  }

  .case-quote {
    margin: 0 0 1.25rem;
    padding-left: 1rem;
    border-left: 2px solid $accent-emerald;
    color: #e2e8f0;
    font-size: 0.95rem;
    font-style: italic;
  }

  .case-author {
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
      font-size: 0.8rem;
      color: $text-muted;
    }
  }
</style>
