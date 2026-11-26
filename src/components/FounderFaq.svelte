<script lang="ts">
  import { FAQ_ITEMS } from '../data/agencyData';

  let openIndex = $state<number>(0);

  function toggleFaq(idx: number) {
    openIndex = openIndex === idx ? -1 : idx;
  }
</script>

<section class="section" id="about" aria-labelledby="about-heading">
  <div class="container founder-faq-grid">
    <aside class="founder-card" data-glow-card data-reveal>
      <span class="eyebrow">Founder Spotlight</span>
      <div class="founder-card__portrait">
        <img
          src="/media/founder-portrait.webp"
          alt="Marcus Vance — Founder and CEO of Digital World AU"
          loading="lazy"
        />
        <span class="founder-badge">Sydney &amp; Melbourne HQ</span>
      </div>
      <blockquote>
        “A website shouldn’t be a passive digital brochure—it should be your hardest-working revenue engineer. We pair Awwwards-level visual craft with relentless engineering speed so every interaction earns trust.”
      </blockquote>
      <div class="founder-card__footer">
        <div class="founder-card__meta">
          <strong>Marcus Vance</strong>
          <span>Founder &amp; CEO, Digital World AU</span>
        </div>
        <svg class="signature-svg" width="118" height="36" viewBox="0 0 140 42" fill="none" aria-hidden="true">
          <path d="M8 31C18 11 26 9 29 27C32 14 42 10 46 28C54 20 65 18 72 25C82 14 96 9 104 24C112 21 123 19 134 22" stroke="#fcc1f4" stroke-width="2.1" stroke-linecap="round" opacity="0.85"/>
        </svg>
      </div>
    </aside>

    <div class="faq-panel" data-reveal>
      <span class="eyebrow">Clarity First</span>
      <h2 class="section-title" id="about-heading">Every key question answered upfront.</h2>

      <div class="faq-list">
        {#each FAQ_ITEMS as item, i}
          <div class="faq-item" class:open={openIndex === i}>
            <button
              type="button"
              class="faq-trigger"
              aria-expanded={openIndex === i}
              onclick={() => toggleFaq(i)}
            >
              <span class="faq-num">0{i + 1}</span>
              <span class="faq-q">{item.q}</span>
              <span class="faq-icon" aria-hidden="true">{openIndex === i ? '−' : '+'}</span>
            </button>
            <div class="faq-collapse" aria-hidden={openIndex !== i}>
              <div class="faq-collapse__inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .founder-faq-grid {
    display: grid;
    gap: 2.25rem;
    align-items: start;

    @include respond-up(lg) {
      grid-template-columns: 0.86fr 1.14fr;
      gap: 3rem;
    }
  }

  .founder-card {
    @include interactive-card;
    padding: 1.75rem;

    &__portrait {
      position: relative;
      border-radius: $radius-md;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      margin-bottom: 1.4rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    blockquote {
      margin: 0 0 1.4rem;
      font-size: 1.02rem;
      line-height: 1.68;
      color: #f1f5f9;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid $border-subtle;
    }

    &__meta {
      strong {
        display: block;
        font-size: 1.04rem;
      }

      span {
        font-size: 0.82rem;
        color: $accent-emerald;
      }
    }
  }

  .founder-badge {
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    padding: 0.28rem 0.72rem;
    border-radius: $radius-pill;
    background: rgba(6, 7, 13, 0.84);
    border: 1px solid rgba(132, 181, 230, 0.35);
    font-family: $font-mono;
    font-size: 0.7rem;
    color: #e0f2fe;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-top: 1.5rem;
  }

  .faq-item {
    @include glass-surface;
    border-radius: $radius-md;
    overflow: hidden;
    transition: border-color $transition-fast;

    &.open {
      border-color: rgba(0, 245, 160, 0.42);
    }
  }

  .faq-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 1.2rem 1.35rem;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    font-weight: 700;
    font-size: 0.98rem;
    color: $text-primary;
    cursor: pointer;
  }

  .faq-num {
    font-family: $font-mono;
    font-size: 0.76rem;
    color: $accent-blue-light;
  }

  .faq-q {
    flex: 1;
  }

  .faq-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.06);
    color: $accent-emerald;
    font-family: $font-mono;
    flex-shrink: 0;
  }

  .faq-collapse {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 320ms cubic-bezier(0.22, 1, 0.36, 1);

    &__inner {
      overflow: hidden;

      p {
        margin: 0;
        padding: 0 1.35rem 1.3rem 3.1rem;
        font-size: 0.92rem;
        color: $text-secondary;
        line-height: 1.65;
      }
    }
  }

  .faq-item.open .faq-collapse {
    grid-template-rows: 1fr;
  }
</style>
