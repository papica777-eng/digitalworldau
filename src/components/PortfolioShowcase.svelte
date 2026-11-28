<script lang="ts">
  import { onMount } from 'svelte';
  import {
    PORTFOLIO_ITEMS,
    CASE_STUDIES,
    ANCHIALO_SHOWCASE_SLIDES,
    type PortfolioItem,
  } from '../data/agencyData';

  const half = Math.ceil(PORTFOLIO_ITEMS.length / 2);
  const rowOne = PORTFOLIO_ITEMS.slice(0, half);
  const rowTwo = PORTFOLIO_ITEMS.slice(half);
  const featuredStudy = CASE_STUDIES[0];
  const clientShowcaseStudies = CASE_STUDIES.slice(1);

  let lightboxItem = $state<PortfolioItem | null>(null);
  let activeSlideIdx = $state(0);
  let slidePaused = $state(false);
  let deckStageEl: HTMLDivElement | undefined = $state();
  let currentSlide = $derived(ANCHIALO_SHOWCASE_SLIDES[activeSlideIdx]);

  function prevSlide() {
    activeSlideIdx =
      (activeSlideIdx - 1 + ANCHIALO_SHOWCASE_SLIDES.length) % ANCHIALO_SHOWCASE_SLIDES.length;
  }

  function nextSlide() {
    activeSlideIdx = (activeSlideIdx + 1) % ANCHIALO_SHOWCASE_SLIDES.length;
  }

  onMount(() => {
    const timer = setInterval(() => {
      if (!slidePaused) {
        activeSlideIdx = (activeSlideIdx + 1) % ANCHIALO_SHOWCASE_SLIDES.length;
      }
    }, 7500);
    return () => clearInterval(timer);
  });

  $effect(() => {
    const idx = activeSlideIdx;
    if (!deckStageEl) return;
    const slides = deckStageEl.querySelectorAll('.deck-slide');
    slides.forEach((slideEl, sIdx) => {
      const vid = slideEl.querySelector('video');
      if (!vid) return;
      if (sIdx === idx) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape' && lightboxItem) {
      lightboxItem = null;
    }
  }}
/>

<section class="section portfolio-section" id="projects" aria-labelledby="projects-heading">
  <div class="container" data-reveal>
    <div class="marquee-header-frame">
      <h2 class="marquee-title" id="projects-heading">Creating digital masterpieces every day</h2>
      <p class="marquee-subtitle">
        Live interactive website tours, 4K interplanetary renders, and high-converting flagships engineered for speed.
      </p>
    </div>
  </div>

  <!-- Full-bleed Edge-to-Edge Dual-Row Synchronized Showcase Wall (1x unique render per item) -->
  <div class="marquee-viewport" aria-label="Selected live client website tours and showcases">
    <div class="marquee-row">
      <div class="marquee-track marquee-track--left">
        {#each rowOne as project (project.id)}
          <button
            type="button"
            class="marquee-card"
            onclick={() => (lightboxItem = project)}
            onmouseenter={(e) => {
              const v = e.currentTarget.querySelector('video');
              if (v) v.play().catch(() => {});
            }}
            onmouseleave={(e) => {
              const v = e.currentTarget.querySelector('video');
              if (v) { v.pause(); v.currentTime = 0; }
            }}
            aria-label={`Inspect ${project.title}`}
          >
            <!-- Browser Bar Chrome -->
            <div class="card-browser-bar">
              <div class="browser-dots" aria-hidden="true">
                <span class="b-dot b-dot--red"></span>
                <span class="b-dot b-dot--yellow"></span>
                <span class="b-dot b-dot--green"></span>
              </div>
              <div class="browser-url-pill">
                <svg class="lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>https://{project.liveDomain || 'digitalworldau.com'}</span>
              </div>
              <span class="browser-badge">{project.category}</span>
            </div>

            <div class="card-media-viewport">
              <img
                src={project.image}
                alt={`${project.title} live website showcase`}
                loading="lazy"
                decoding="async"
                width="417"
                height="260"
              />
              {#if project.video}
                <video
                  src={project.video}
                  poster={project.image}
                  loop
                  muted
                  playsinline
                  preload="none"
                  class="marquee-video"
                ></video>
              {/if}
            </div>

            <div class="card-caption-bar">
              <div class="card-titles">
                <strong>{project.title.split('—')[0].trim()}</strong>
                <small>{project.metric}</small>
              </div>
              <span class="marquee-pill marquee-pill--live">
                {project.video ? `▶ LIVE TOUR` : `● VIEW SITE`}
              </span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="marquee-row">
      <div class="marquee-track marquee-track--right">
        {#each rowTwo as project (project.id)}
          <button
            type="button"
            class="marquee-card"
            onclick={() => (lightboxItem = project)}
            onmouseenter={(e) => {
              const v = e.currentTarget.querySelector('video');
              if (v) v.play().catch(() => {});
            }}
            onmouseleave={(e) => {
              const v = e.currentTarget.querySelector('video');
              if (v) { v.pause(); v.currentTime = 0; }
            }}
            aria-label={`Inspect ${project.title}`}
          >
            <!-- Browser Bar Chrome -->
            <div class="card-browser-bar">
              <div class="browser-dots" aria-hidden="true">
                <span class="b-dot b-dot--red"></span>
                <span class="b-dot b-dot--yellow"></span>
                <span class="b-dot b-dot--green"></span>
              </div>
              <div class="browser-url-pill">
                <svg class="lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>https://{project.liveDomain || 'digitalworldau.com'}</span>
              </div>
              <span class="browser-badge">{project.category}</span>
            </div>

            <div class="card-media-viewport">
              <img
                src={project.image}
                alt={`${project.title} live website showcase`}
                loading="lazy"
                decoding="async"
                width="417"
                height="260"
              />
              {#if project.video}
                <video
                  src={project.video}
                  poster={project.image}
                  loop
                  muted
                  playsinline
                  preload="none"
                  class="marquee-video"
                ></video>
              {/if}
            </div>

            <div class="card-caption-bar">
              <div class="card-titles">
                <strong>{project.title.split('—')[0].trim()}</strong>
                <small>{project.metric}</small>
              </div>
              <span class="marquee-pill marquee-pill--live">
                {project.video ? `▶ LIVE TOUR` : `● VIEW SITE`}
              </span>
            </div>
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
            <span class="stars" role="img" aria-label="5 out of 5 stars">
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

          <!-- Quick-Access Official PDF Document Strip -->
          <div class="white-pdf-strip" aria-label="Official ANCHIALO PDF Dossiers">
            <a
              href="https://anchialo.com/assets/official_drive_assets/Quality_Certificate.docx.pdf"
              target="_blank"
              rel="noopener"
              class="pdf-pill"
            >
              Quality Certificate PDF ↗
            </a>
            <a
              href="https://anchialo.com/assets/brochures/ANCHIALO_Product_Guide_AU.pdf"
              target="_blank"
              rel="noopener"
              class="pdf-pill"
            >
              AU Product Guide PDF ↗
            </a>
            <a
              href="https://anchialo.com/assets/brochures/ANCHIALO_Partner_Wholesale_Guide_AU.pdf"
              target="_blank"
              rel="noopener"
              class="pdf-pill"
            >
              Wholesale Guide PDF ↗
            </a>
          </div>

          <div class="white-footer">
            <div class="white-author">
              {#if featuredStudy.avatar}
                <img
                  src={featuredStudy.avatar}
                  alt={`${featuredStudy.client} brand mark`}
                  class="brand-badge-img"
                  loading="lazy"
                />
              {:else}
                <span class="monogram-avatar" aria-hidden="true">{featuredStudy.monogram}</span>
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

        <!-- Rotating Aerial Red Salt Lakes + Official Lab Certificate PDF Deck -->
        <div
          class="case-white-card__visual"
          onmouseenter={() => (slidePaused = true)}
          onmouseleave={() => (slidePaused = false)}
          role="region"
          aria-label="ANCHIALO aerial red salt lakes photography and certified PDF documents carousel"
        >
          <div class="white-browser-bar">
            <div class="browser-dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <a href="https://anchialo.com" target="_blank" rel="noopener" class="browser-domain">
              https://anchialo.com ↗
            </a>
            <span class="slide-counter">
              {String(activeSlideIdx + 1).padStart(2, '0')} / {String(ANCHIALO_SHOWCASE_SLIDES.length).padStart(2, '0')}
            </span>
            {#if currentSlide.pdfUrl}
              <a href={currentSlide.pdfUrl} target="_blank" rel="noopener" class="bar-pdf-btn">
                Open Official PDF ↗
              </a>
            {/if}
          </div>

          <div class="deck-stage" class:is-doc={currentSlide.isDocument} bind:this={deckStageEl}>
            {#each ANCHIALO_SHOWCASE_SLIDES as slide, idx (slide.id)}
              <div
                class="deck-slide"
                class:active={idx === activeSlideIdx}
                class:is-doc={slide.isDocument}
                aria-hidden={idx !== activeSlideIdx}
              >
                {#if slide.video}
                  <video
                    src={slide.video}
                    poster={slide.image}
                    loop
                    muted
                    playsinline
                    preload="none"
                  ></video>
                {:else}
                  <img src={slide.image} alt={slide.title} loading="lazy" decoding="async" />
                {/if}
              </div>
            {/each}

            <button
              type="button"
              class="deck-nav deck-nav--prev"
              onclick={prevSlide}
              aria-label="Previous visual or document"
            >
              ‹
            </button>
            <button
              type="button"
              class="deck-nav deck-nav--next"
              onclick={nextSlide}
              aria-label="Next visual or document"
            >
              ›
            </button>

            <div class="deck-overlay">
              <div class="deck-caption">
                <span class="deck-badge">{currentSlide.badge}</span>
                <strong>{currentSlide.title}</strong>
              </div>

              <div class="deck-dots" role="tablist" aria-label="Select ANCHIALO photo or PDF slide">
                {#each ANCHIALO_SHOWCASE_SLIDES as slide, idx (slide.id)}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={idx === activeSlideIdx}
                    aria-label={slide.title}
                    class:active={idx === activeSlideIdx}
                    onclick={() => (activeSlideIdx = idx)}
                  ></button>
                {/each}
              </div>
            </div>
          </div>
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
              {#if study.video}
                <video
                  src={study.video}
                  poster={study.poster}
                  loop
                  muted
                  playsinline
                  preload="none"
                ></video>
              {:else}
                <img src={study.poster} alt={study.client} loading="lazy" decoding="async" width="627" height="352" />
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>

  {#if lightboxItem}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={lightboxItem.title}
      onclick={(e) => {
        if (e.target === e.currentTarget) lightboxItem = null;
      }}
      onkeydown={(e) => {
        if (e.key === 'Escape') lightboxItem = null;
      }}
    >
      <div class="lightbox__card">
        <button type="button" class="lightbox__close" onclick={() => (lightboxItem = null)} aria-label="Close preview">×</button>
        <div class="lightbox__media" class:is-doc={lightboxItem.isDocument}>
          {#if lightboxItem.video}
            <video
              src={lightboxItem.video}
              poster={lightboxItem.image}
              autoplay
              loop
              muted
              playsinline
              controls
            ></video>
          {:else}
            <img src={lightboxItem.image} alt={lightboxItem.title} />
          {/if}
        </div>
        <div class="lightbox__body">
          <div class="lightbox__head">
            <div>
              <span class="tag">
                {lightboxItem.category} • {lightboxItem.isDocument ? 'Official PDF' : 'Live Production'} • {lightboxItem.region}
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
              {#if lightboxItem.pdfUrl}
                <a href={lightboxItem.pdfUrl} target="_blank" rel="noopener" class="btn btn-primary">
                  Open Official PDF ↗
                </a>
              {/if}
              {#if lightboxItem.liveUrl}
                <a
                  href={lightboxItem.liveUrl}
                  target="_blank"
                  rel="noopener"
                  class={lightboxItem.pdfUrl ? 'btn btn-ghost' : 'btn btn-primary'}
                >
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
      transform: translate3d(calc(-100% + 100vw), 0, 0);
    }
  }

  @keyframes marqueeRight {
    0% {
      transform: translate3d(calc(-100% + 100vw), 0, 0);
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
    min-width: 100vw;
    padding-inline: 1.25rem;
    gap: 1.25rem;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    contain: layout style paint;

    &--left {
      animation: marqueeLeft 52s ease-in-out infinite alternate;
    }

    &--right {
      animation: marqueeRight 52s ease-in-out infinite alternate;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-row {
      overflow-x: auto;
    }
  }

  .marquee-card {
    position: relative;
    width: clamp(320px, 31vw, 450px);
    aspect-ratio: 16 / 11;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: #090d14;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    transition: transform $transition-smooth, border-color $transition-fast, box-shadow $transition-smooth;

    &:hover {
      border-color: rgba(0, 245, 160, 0.55);
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.8), 0 0 28px rgba(0, 245, 160, 0.15);

      .card-media-viewport img {
        transform: scale(1.03);
      }

      .marquee-video {
        opacity: 1;
        transform: scale(1.03);
      }
    }
  }

  .card-browser-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 12px;
    background: rgba(16, 22, 34, 0.96);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 2;
    flex-shrink: 0;
    font-family: $font-mono;
  }

  .browser-dots {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .b-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--red { background: #ff5f56; }
    &--yellow { background: #ffbd2e; }
    &--green { background: #27c93f; }
  }

  .browser-url-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.66rem;
    color: rgba(255, 255, 255, 0.75);

    .lock-svg {
      width: 10px;
      height: 10px;
      stroke: #10b981;
    }

    span {
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .browser-badge {
    font-size: 0.6rem;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  .card-media-viewport {
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
    background: #05070b;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
      transition: transform $transition-smooth;
    }

    .marquee-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease, transform $transition-smooth;
    }
  }

  .card-caption-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(10, 14, 22, 0.96);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
    z-index: 2;
  }

  .card-titles {
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 1px;

    strong {
      font-size: 0.78rem;
      color: #ffffff;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 230px;
    }

    small {
      font-size: 0.66rem;
      color: rgba(255, 255, 255, 0.55);
      font-family: $font-mono;
    }
  }

  .marquee-pill {
    padding: 0.22rem 0.62rem;
    border-radius: $radius-pill;
    font-family: $font-mono;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;

    &--live {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #10b981;
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
      border: 1px solid rgba(13, 13, 13, 0.14);
      background: #0b0e16;
      box-shadow: 0 22px 48px rgba(13, 13, 13, 0.22);
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
    margin-bottom: 1.15rem;

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

  .white-pdf-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-bottom: 1.35rem;
  }

  .pdf-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.36rem 0.76rem;
    border-radius: $radius-pill;
    background: #eff6ff;
    border: 1px solid rgba(1, 106, 212, 0.28);
    font-family: $font-mono;
    font-size: 0.71rem;
    font-weight: 600;
    color: $accent-cobalt;
    transition: background $transition-fast, color $transition-fast, transform $transition-fast;

    &:hover {
      background: $accent-cobalt;
      color: #ffffff;
      transform: translateY(-1px);
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
      border-radius: 12px;
      object-fit: contain;
      padding: 5px;
      background: #0d111a;
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
    height: 38px;
    padding-inline: 0.9rem;
    background: #0f1420;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .browser-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.24);
    }
  }

  .browser-domain {
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 600;
    color: $accent-blue-light;
    margin-right: auto;
  }

  .slide-counter {
    font-family: $font-mono;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.56);
  }

  .bar-pdf-btn {
    padding: 0.24rem 0.62rem;
    border-radius: $radius-pill;
    background: rgba(1, 106, 212, 0.85);
    border: 1px solid rgba(132, 181, 230, 0.55);
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 600;
    color: #ffffff;
    transition: background $transition-fast;

    &:hover {
      background: #0b7ae8;
    }
  }

  .deck-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background: #0b0e16;
    overflow: hidden;
  }

  .deck-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: scale(1.02);
    transition: opacity 550ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;

    &.active {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
      z-index: 1;
    }

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &.is-doc img {
      object-fit: contain;
      padding: 0.65rem 0.65rem 3.2rem;
    }
  }

  .deck-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background: rgba(8, 12, 22, 0.66);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #ffffff;
    font-size: 1.25rem;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background $transition-fast, transform $transition-fast;

    &:hover {
      background: $accent-cobalt;
      transform: translateY(-50%) scale(1.08);
    }

    &--prev {
      left: 0.7rem;
    }

    &--next {
      right: 0.7rem;
    }
  }

  .deck-overlay {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    z-index: 4;
    padding: 0.85rem 1rem;
    background: linear-gradient(to top, rgba(6, 9, 16, 0.94) 30%, rgba(6, 9, 16, 0.62) 78%, transparent);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.55rem 0.85rem;
  }

  .deck-caption {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;

    strong {
      font-size: 0.78rem;
      font-weight: 500;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .deck-badge {
    padding: 0.2rem 0.55rem;
    border-radius: $radius-pill;
    background: rgba(1, 106, 212, 0.85);
    border: 1px solid rgba(132, 181, 230, 0.5);
    font-family: $font-mono;
    font-size: 0.62rem;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .deck-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.32rem;

    button {
      width: 14px;
      height: 5px;
      border-radius: $radius-pill;
      border: none;
      padding: 0;
      background: rgba(255, 255, 255, 0.28);
      cursor: pointer;
      transition: width $transition-fast, background $transition-fast;

      &.active {
        width: 24px;
        background: $accent-blue-light;
      }
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

      video,
      img {
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
      border-radius: 12px;
      object-fit: contain;
      padding: 5px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.18);
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
    }

    &__media {
      background: #0a0d14;

      img,
      video {
        width: 100%;
        max-height: 480px;
        object-fit: cover;
        display: block;
      }

      &.is-doc img {
        object-fit: contain;
        padding: 1rem;
      }
    }

    &__close {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      z-index: 5;
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
