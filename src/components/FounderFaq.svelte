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
          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80"
          alt="Founder and CEO of Digital World AU"
          loading="lazy"
        />
      </div>
      <blockquote>
        “A website shouldn’t be a static digital brochure—it should be your hardest-working revenue engineer. We pair design restraint with relentless technical performance so every click earns trust.”
      </blockquote>
      <div class="founder-card__meta">
        <strong>Marcus Vance</strong>
        <span>Founder &amp; CEO, Digital World AU</span>
      </div>
    </aside>

    <div class="faq-panel" data-reveal>
      <span class="eyebrow">Clarity First</span>
      <h2 class="section-title" id="about-heading">Questions answered before we write a line of code.</h2>

      <div class="faq-list">
        {#each FAQ_ITEMS as item, i}
          <div class="faq-item" class:open={openIndex === i}>
            <button
              type="button"
              class="faq-trigger"
              aria-expanded={openIndex === i}
              onclick={() => toggleFaq(i)}
            >
              <span>{item.q}</span>
              <span class="faq-icon" aria-hidden="true">{openIndex === i ? '−' : '+'}</span>
            </button>
            {#if openIndex === i}
              <div class="faq-body">
                <p>{item.a}</p>
              </div>
            {/if}
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
      grid-template-columns: 0.85fr 1.15fr;
      gap: 3rem;
    }
  }

  .founder-card {
    @include interactive-card;
    padding: 1.75rem;

    &__portrait {
      border-radius: $radius-md;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      margin-bottom: 1.35rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    blockquote {
      margin: 0 0 1.25rem;
      font-size: 1.02rem;
      line-height: 1.68;
      color: #e2e8f0;
    }

    &__meta {
      strong {
        display: block;
        font-size: 1.02rem;
      }

      span {
        font-size: 0.84rem;
        color: $accent-emerald;
      }
    }
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
      border-color: rgba(0, 245, 160, 0.35);
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
    justify-content: space-between;
    gap: 1rem;
    font-weight: 700;
    font-size: 0.98rem;
    color: $text-primary;
    cursor: pointer;
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

  .faq-body {
    padding: 0 1.35rem 1.25rem;

    p {
      margin: 0;
      font-size: 0.92rem;
      color: $text-secondary;
      line-height: 1.65;
    }
  }
</style>
