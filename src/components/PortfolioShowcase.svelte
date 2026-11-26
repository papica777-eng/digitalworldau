<script lang="ts">
  import { PORTFOLIO_ITEMS, CASE_STUDIES, type PortfolioItem } from '../data/agencyData';

  const rowOne = PORTFOLIO_ITEMS.slice(0, 6);
  const rowTwo = PORTFOLIO_ITEMS.slice(6, 12);
  const featuredStudy = CASE_STUDIES[0];
  const clientShowcaseStudies = CASE_STUDIES.slice(1);

  let lightboxItem = $state<PortfolioItem | null>(null);
</script>

<section class="section portfolio-section" id="projects" aria-labelledby="projects-heading">
  <div class="container" data-reveal>
    <div class="marquee-header-frame">
      <h2 class="marquee-title" id="projects-heading">Creating digital masterpieces every day</h2>
      <p class="marquee-subtitle">
        Visuals that convert. Code that performs. Results that captivate visitors.
      </p>
    </div>
  </div>

  <!-- Full-bleed Edge-to-Edge Dual-Row Infinite Marquee -->
  <div class="marquee-viewport" aria-label="Selected client websites and UI/UX showcases">
    <div class="marquee-row">
      <div class="marquee-track marquee-track--left">
        {#each [...rowOne, ...rowOne] as project, idx (`r1-${project.id}-${idx}`)}
          <button
            type="button"
            class="marquee-card"
            onclick={() => (lightboxItem = project)}
            aria-label={`Inspect ${project.title}`}
          >
            <img src={project.image} alt={`${project.title} showcase preview`} loading="lazy" />
            <span class={project.isConcept ? 'marquee-pill marquee-pill--concept' : 'marquee-pill marquee-pill--live'}>
              {project.isConcept ? 'UI/UX Concept' : `● ${project.liveDomain}`}
            </span>
          </button>
        {/each}
      </div>
    </div>

    <div class="marquee-row">
      <div class="marquee-track marquee-track--right">
        {#each [...rowTwo, ...rowTwo] as project, idx (`r2-${project.id}-${idx}`)}
          <button
            type="button"
            class="marquee-card"
            onclick={() => (lightboxItem = project)}
            aria-label={`Inspect ${project.title}`}
          >
            <img src={project.image} alt={`${project.title} showcase preview`} loading="lazy" />
            <span class={project.isConcept ? 'marquee-pill marquee-pill--concept' : 'marquee-pill marquee-pill--live'}>
              {project.isConcept ? 'UI/UX Concept' : `● ${project.liveDomain}`}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- High-Contrast Editorial Case Studies -->
  <div class="container case-stack">
    {#if featuredStudy}
      <article class="case-white-card" data-reveal>
        <div class="case-white-card__copy">
          <div class="white-top-meta">
            <span class="white-kicker">{featuredStudy.tag}</span>
            <span class="stars" aria-label="5 out of 5 stars">
              {#each [0, 1, 2, 3, 4] as _}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.5l2.93 5.95 6.57.95-4.75 4.63 1.12 6.54L12 17.48l-5.87 3.09 1.12-6.54L2.5 9.4l6.57-.95L12 2.5z" />
                </svg>
              {/each}
            </span>
          </div>

          <h3>{featuredStudy.client}</h3>
          <p class="white-headline">{featuredStudy.headline}</p>
          <blockquote class="white-quote">“{featuredStudy.quote}”</blockquote>

          <div class="white-stats">
            {#each featuredStudy.stats as stat}
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            {/each}
          </div>

          <div class="white-footer">
            <div class="white-author">
              {#if featuredStudy.avatar}
                <img src={featuredStudy.avatar} alt={featuredStudy.author} loading="lazy" />
              {/if}
              <div>
                <strong>{featuredStudy.author}</strong>
                <span>{featuredStudy.role}</span>
              </div>
            </div>

            {#if featuredStudy.liveUrl}
              <a href={featuredStudy.liveUrl} target="_blank" rel="noopener" class="white-visit-cta">
                Visit {featuredStudy.liveDomain} ↗
              </a>
            {/if}
          </div>
        </div>

        <div class="case-white-card__visual">
          <div class="white-browser-bar">
            <span></span><span></span><span></span>
            {#if featuredStudy.liveUrl}
              <a href={featuredStudy.liveUrl} target="_blank" rel="noopener">
                https://{featuredStudy.liveDomain} ↗
              </a>
            {/if}
          </div>
          <video
            src={featuredStudy.video}
            poster={featuredStudy.poster}
            autoplay
            loop
            muted
            playsinline
          ></video>
        </div>
      </article>
    {/if}

    <div class="clients-showcase-frame" data-reveal>
      <div class="clients-showcase-head">
        <div>
          <span class="eyebrow">Verified Live Case Studies</span>
          <h3 class="clients-frame-title">Clients on Digital World AU</h3>
        </div>
        <p class="clients-frame-sub">
          Because our best advertisement is our clients’ growth. Real performance metrics shared directly by founders and teams we partner with worldwide.
        </p>
      </div>

      <div class="clients-rows">
        {#each clientShowcaseStudies as study, idx}
          <article class="client-row" class:reversed={idx % 2 === 1}>
            <div class="client-row__copy">
              <div class="client-row__tags">
                <span class="tag">{study.tag}</span>
                <span class="live-chip">● {study.liveDomain}</span>
              </div>
              <h4>{study.client}</h4>
              <p class="client-row__headline">{study.headline}</p>
              <blockquote class="client-row__quote">“{study.quote}”</blockquote>

              <div class="client-row__stats">
                {#each study.stats as stat}
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                {/each}
              </div>

              <div class="client-row__bar">
                <div class="client-author">
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
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener"
                    class="circle-cobalt-btn"
                    aria-label={`Visit ${study.liveDomain}`}
                    title={`Open ${study.liveDomain}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                {/if}
              </div>
            </div>

            <div class="client-row__visual">
              <video
                src={study.video}
                poster={study.poster}
                autoplay
                loop
                muted
                playsinline
              ></video>
            </div>
          </article>
        {/each}
      </div>
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

  @keyframes marqueeLeft {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  @keyframes marqueeRight {
    0% {
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  .marquee-header-frame {
    @include agma-border(40px, 1);
    border-radius: 40px;
    padding: clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 3vw, 2.5rem) clamp(4.5rem, 7vw, 6rem);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    text-align: center;
  }

  .marquee-title {
    font-family: $font-display;
    font-weight: 500;
    font-size: clamp(1.85rem, 3.9vw, 3.05rem);
    line-height: 1.14;
    letter-spacing: -0.025em;
    color: #ffffff;
    margin: 0 0 0.85rem;
  }

  .marquee-subtitle {
    margin: 0;
    font-family: $font-sans;
    font-weight: 300;
    font-size: clamp(0.98rem, 1.35vw, 1.12rem);
    color: rgba(255, 255, 255, 0.68);
  }

  .marquee-viewport {
    position: relative;
    z-index: 3;
    width: 100%;
    margin-top: -3rem;
    margin-bottom: clamp(4rem, 7vw, 6rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: clamp(32px, 6vw, 96px);
      z-index: 4;
      pointer-events: none;
    }

    &::before {
      left: 0;
      background: linear-gradient(90deg, #000000 0%, transparent 100%);
    }

    &::after {
      right: 0;
      background: linear-gradient(270deg, #000000 0%, transparent 100%);
    }

    &:hover .marquee-track {
      animation-play-state: paused;
    }
  }

  .marquee-row {
    width: 100%;
    overflow: hidden;
  }

  .marquee-track {
    display: flex;
    width: max-content;
    gap: 1.15rem;

    &--left {
      animation: marqueeLeft 42s linear infinite;
    }

    &--right {
      animation: marqueeRight 46s linear infinite;
    }
  }

  .marquee-card {
    position: relative;
    width: clamp(290px, 28vw, 410px);
    aspect-ratio: 16 / 10;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: #0d0d0d;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
    transition: transform $transition-smooth, border-color $transition-fast;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform $transition-smooth;
    }

    &:hover {
      border-color: rgba(132, 181, 230, 0.55);

      img {
        transform: scale(1.04);
      }

      .marquee-pill {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .marquee-pill {
    position: absolute;
    left: 0.85rem;
    bottom: 0.85rem;
    padding: 0.28rem 0.72rem;
    border-radius: $radius-pill;
    font-family: $font-mono;
    font-size: 0.68rem;
    font-weight: 600;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0.85;
    transform: translateY(2px);
    transition: opacity $transition-fast, transform $transition-fast;

    &--live {
      background: rgba(1, 106, 212, 0.78);
      border: 1px solid rgba(132, 181, 230, 0.5);
      color: #ffffff;
    }

    &--concept {
      background: rgba(0, 0, 0, 0.62);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.88);
    }
  }

  .case-stack {
    display: grid;
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  .case-white-card {
    background: #ffffff;
    color: #0d0d0d;
    border-radius: 36px;
    padding: clamp(1.75rem, 4vw, 3.25rem);
    display: grid;
    gap: 2.25rem;
    align-items: center;
    box-shadow: 0 30px 72px rgba(0, 0, 0, 0.65);

    @include respond-up(lg) {
      grid-template-columns: 0.92fr 1.08fr;
      gap: 3rem;
    }

    h3 {
      margin: 0.75rem 0 0.5rem;
      font-family: $font-display;
      font-weight: 500;
      font-size: clamp(1.45rem, 2.5vw, 2.05rem);
      letter-spacing: -0.025em;
      color: #0d0d0d;
    }

    &__visual {
      border-radius: 22px;
      overflow: hidden;
      border: 1px solid rgba(13, 13, 13, 0.1);
      background: #f5f5f7;
      box-shadow: 0 20px 44px rgba(13, 13, 13, 0.14);

      video {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        display: block;
      }
    }
  }

  .white-top-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
  }

  .white-kicker {
    font-family: $font-mono;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $accent-cobalt;
  }

  .white-headline {
    margin: 0 0 1.1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #202020;
  }

  .white-quote {
    margin: 0 0 1.35rem;
    padding-left: 1rem;
    border-left: 2px solid $accent-cobalt;
    color: #3f3f46;
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .white-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    padding: 0.95rem 1rem;
    border-radius: 16px;
    background: #f5f5f7;
    border: 1px solid rgba(13, 13, 13, 0.08);
    margin-bottom: 1.45rem;

    strong {
      display: block;
      font-family: $font-display;
      font-size: 1.12rem;
      font-weight: 500;
      color: $accent-cobalt;
    }

    span {
      font-size: 0.74rem;
      color: #52525b;
    }
  }

  .white-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .white-author {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(13, 13, 13, 0.14);
    }

    strong {
      display: block;
      font-size: 0.92rem;
      color: #0d0d0d;
    }

    span {
      font-size: 0.78rem;
      color: #52525b;
    }
  }

  .white-visit-cta {
    padding: 0.72rem 1.35rem;
    border-radius: $radius-pill;
    background: $accent-cobalt;
    color: #ffffff;
    font-family: $font-display;
    font-size: 0.78rem;
    font-weight: 500;
    transition: background $transition-fast, transform $transition-fast;

    &:hover {
      background: #0b7ae8;
      transform: translateY(-2px);
    }
  }

  .white-browser-bar {
    height: 34px;
    padding-inline: 0.9rem;
    background: #e4e4e7;
    border-bottom: 1px solid rgba(13, 13, 13, 0.08);
    display: flex;
    align-items: center;
    gap: 0.38rem;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(13, 13, 13, 0.22);
    }

    a {
      margin-left: auto;
      font-family: $font-mono;
      font-size: 0.72rem;
      font-weight: 600;
      color: $accent-cobalt;
    }
  }

  .clients-showcase-frame {
    @include agma-border(44px, 2);
    border-radius: 44px;
    background: rgba(14, 15, 22, 0.56);
    backdrop-filter: blur(22px) saturate(145%);
    -webkit-backdrop-filter: blur(22px) saturate(145%);
    border: 1px solid rgba(255, 255, 255, 0.09);
    padding: clamp(2rem, 4.5vw, 3.75rem);
  }

  .clients-showcase-head {
    display: grid;
    gap: 1.5rem;
    align-items: end;
    padding-bottom: clamp(2rem, 4vw, 3rem);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: clamp(2rem, 4vw, 3rem);

    @include respond-up(lg) {
      grid-template-columns: 1fr 0.95fr;
      gap: 3rem;
    }
  }

  .clients-frame-title {
    margin: 0;
    font-family: $font-display;
    font-weight: 500;
    font-size: clamp(1.85rem, 3.4vw, 2.75rem);
    line-height: 1.12;
    color: #ffffff;
  }

  .clients-frame-sub {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    font-weight: 300;
    font-size: 1rem;
    line-height: 1.6;
  }

  .clients-rows {
    display: grid;
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  .client-row {
    display: grid;
    gap: 2rem;
    align-items: center;

    @include respond-up(lg) {
      grid-template-columns: 0.95fr 1.05fr;
      gap: 3rem;

      &.reversed .client-row__copy {
        order: 2;
      }

      &.reversed .client-row__visual {
        order: 1;
      }
    }

    h4 {
      margin: 0.85rem 0 0.45rem;
      font-family: $font-display;
      font-weight: 500;
      font-size: clamp(1.35rem, 2.2vw, 1.75rem);
      color: #ffffff;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
    }

    &__headline {
      margin: 0 0 1rem;
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.96rem;
    }

    &__quote {
      margin: 0 0 1.25rem;
      padding-left: 1rem;
      border-left: 2px solid $accent-cobalt;
      color: rgba(255, 255, 255, 0.86);
      font-size: 0.92rem;
      font-style: italic;
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.8rem;
      padding: 0.9rem 1rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      margin-bottom: 1.35rem;

      strong {
        display: block;
        font-family: $font-display;
        font-size: 1.08rem;
        font-weight: 500;
        color: #ffffff;
      }

      span {
        font-size: 0.74rem;
        color: $text-muted;
      }
    }

    &__bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    &__visual {
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: #0d0d0d;
      box-shadow: 0 22px 54px rgba(0, 0, 0, 0.62);

      video {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        display: block;
      }
    }
  }

  .live-chip {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $accent-blue-light;
  }

  .client-author {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.22);
    }

    strong {
      display: block;
      font-size: 0.92rem;
      color: #ffffff;
    }

    span {
      font-size: 0.76rem;
      color: $text-muted;
    }
  }

  .monogram-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-family: $font-mono;
    font-weight: 700;
    font-size: 0.82rem;
    background: rgba(1, 106, 212, 0.24);
    border: 1px solid rgba(132, 181, 230, 0.42);
    color: $accent-blue-light;
    flex-shrink: 0;
  }

  .circle-cobalt-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: $accent-cobalt;
    color: #ffffff;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    box-shadow: 0 10px 28px rgba(1, 106, 212, 0.48);
    transition: transform $transition-fast, background $transition-fast, box-shadow $transition-fast;

    &:hover {
      transform: scale(1.06);
      background: #0b7ae8;
      box-shadow: 0 14px 36px rgba(1, 106, 212, 0.65);
    }
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 110;
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(16px);
    display: grid;
    place-items: center;
    padding: 1.25rem;

    &__card {
      @include glass-surface(true);
      @include agma-border($radius-lg, 1);
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
      background: rgba(0, 0, 0, 0.78);
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
        font-family: $font-display;
        font-size: 1.38rem;
        font-weight: 500;
      }
    }

    &__metric {
      font-family: $font-mono;
      font-size: 0.92rem;
      color: $accent-blue-light;
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
