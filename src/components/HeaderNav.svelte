<script lang="ts">
  import { MEGA_MENU } from '../data/agencyData';
  import { currencyStore } from '../lib/currency.svelte';

  let megaOpen = $state(false);
  let mobileOpen = $state(false);
  let scrolled = $state(false);

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 18;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function closeAll() {
    megaOpen = false;
    mobileOpen = false;
  }
</script>

<header class:scrolled class="site-header">
  <div class="container header-inner">
    <a href="#top" class="brand" aria-label="Digital World AU Home" onclick={closeAll}>
      <svg class="brand__mark" width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#06070d" />
        <rect x="2" y="2" width="60" height="60" rx="14" stroke="url(#navGradV2)" stroke-width="3" />
        <path d="M18 44V20h11c8.2 0 13.5 4.8 13.5 12S37.2 44 29 44H18Zm6.5-5.6h4.3c4.7 0 7.4-2.5 7.4-6.4s-2.7-6.4-7.4-6.4h-4.3v12.8Z" fill="url(#navGradV2)" />
        <circle cx="48" cy="18" r="4.5" fill="#00f5a0" />
        <defs>
          <linearGradient id="navGradV2" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00f5a0" />
            <stop offset="0.52" stop-color="#016ad4" />
            <stop offset="1" stop-color="#fcc1f4" />
          </linearGradient>
        </defs>
      </svg>
      <span class="brand__word">
        <strong>Digital World</strong>
        <span>AU</span>
      </span>
    </a>

    <nav class="desktop-nav" aria-label="Primary navigation">
      <div
        class="mega-trigger-wrap"
        onmouseenter={() => (megaOpen = true)}
        onmouseleave={() => (megaOpen = false)}
      >
        <button
          type="button"
          class="nav-link nav-link--btn"
          aria-expanded={megaOpen}
          onclick={() => (megaOpen = !megaOpen)}
        >
          Services
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {#if megaOpen}
          <div class="mega-dropdown" role="menu">
            <div class="mega-col">
              <p class="mega-col__title">01 • Design</p>
              {#each MEGA_MENU.design as item}
                <a href={item.href} class="mega-item" onclick={closeAll}>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </a>
              {/each}
            </div>
            <div class="mega-col">
              <p class="mega-col__title">02 • Development</p>
              {#each MEGA_MENU.development as item}
                <a href={item.href} class="mega-item" onclick={closeAll}>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </a>
              {/each}
            </div>
            <div class="mega-col">
              <p class="mega-col__title">03 • Marketing</p>
              {#each MEGA_MENU.marketing as item}
                <a href={item.href} class="mega-item" onclick={closeAll}>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </a>
              {/each}
            </div>
            <div class="mega-promo">
              <img src="/media/hero-sculpture.webp" alt="" loading="lazy" />
              <div>
                <span class="tag">Free 2-Week Diagnostic</span>
                <strong>Expert UX, Vitals &amp; SEO Audit</strong>
                <a href="#contact" class="mega-promo__cta" onclick={closeAll}>Claim Audit →</a>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <a href="#projects" class="nav-link">Projects</a>
      <a href="#about" class="nav-link">About Us</a>
      <a href="#blog" class="nav-link">Blog</a>
      <a href="#contact" class="nav-link">Contact</a>
    </nav>

    <div class="header-actions">
      <button
        type="button"
        class="currency-pill"
        onclick={() => currencyStore.toggle()}
        aria-label="Toggle display currency between AUD and EUR"
        title="Switch currency display (AUD / EUR)"
      >
        <span class:active={currencyStore.code === 'AUD'}>AUD</span>
        <span class="sep">/</span>
        <span class:active={currencyStore.code === 'EUR'}>EUR</span>
      </button>

      <a href="#contact" class="btn btn-primary header-cta">Get a Quote</a>

      <button
        type="button"
        class="mobile-toggle"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileOpen}
        onclick={() => (mobileOpen = !mobileOpen)}
      >
        {#if mobileOpen}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        {:else}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="mobile-drawer">
      <div class="container mobile-drawer__inner">
        <div class="mobile-services">
          <span class="mobile-label">Services</span>
          <div class="mobile-chips">
            <a href="#services" onclick={closeAll}>Design</a>
            <a href="#services" onclick={closeAll}>Development</a>
            <a href="#services" onclick={closeAll}>Marketing</a>
            <a href="#services" onclick={closeAll}>Website Audit</a>
          </div>
        </div>
        <a href="#projects" class="mobile-link" onclick={closeAll}>Projects</a>
        <a href="#about" class="mobile-link" onclick={closeAll}>About Us</a>
        <a href="#blog" class="mobile-link" onclick={closeAll}>Blog</a>
        <a href="#contact" class="mobile-link" onclick={closeAll}>Contact</a>
        <a href="#contact" class="btn btn-primary mobile-cta" onclick={closeAll}>Get a Quote</a>
      </div>
    </div>
  {/if}
</header>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .site-header {
    position: sticky;
    top: 0;
    z-index: 60;
    background: rgba(6, 7, 13, 0.72);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    transition: background $transition-fast, border-color $transition-fast;

    &.scrolled {
      background: rgba(6, 7, 13, 0.92);
      border-bottom-color: rgba(132, 181, 230, 0.16);
    }
  }

  .header-inner {
    height: 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.72rem;
    flex-shrink: 0;

    &__word {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
      font-size: 1.14rem;
      letter-spacing: -0.03em;

      strong {
        font-weight: 800;
        color: #ffffff;
      }

      span {
        font-family: $font-mono;
        font-size: 0.78rem;
        font-weight: 700;
        color: $accent-emerald;
      }
    }
  }

  .desktop-nav {
    display: none;
    align-items: center;
    gap: 1.85rem;

    @include respond-up(lg) {
      display: flex;
    }
  }

  .nav-link {
    font-size: 0.93rem;
    font-weight: 600;
    color: $text-secondary;
    transition: color $transition-fast;
    background: none;
    border: none;
    padding: 0.45rem 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;

    &:hover {
      color: #ffffff;
    }
  }

  .mega-trigger-wrap {
    position: relative;
  }

  .mega-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: -210px;
    width: 880px;
    padding: 1.5rem;
    border-radius: $radius-lg;
    @include glass-surface(true);
    border-color: rgba(132, 181, 230, 0.28);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 0.95fr;
    gap: 1.15rem;
    z-index: 80;
  }

  .mega-col__title {
    margin: 0 0 0.75rem;
    font-family: $font-mono;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $accent-emerald;
  }

  .mega-item {
    display: block;
    padding: 0.62rem 0.72rem;
    border-radius: $radius-sm;
    transition: background $transition-fast;

    strong {
      display: block;
      font-size: 0.88rem;
      color: $text-primary;
      margin-bottom: 0.16rem;
    }

    span {
      display: block;
      font-size: 0.75rem;
      color: $text-muted;
      line-height: 1.38;
    }

    &:hover {
      background: rgba(1, 106, 212, 0.18);
    }
  }

  .mega-promo {
    border-radius: $radius-md;
    overflow: hidden;
    background: rgba(2, 9, 50, 0.72);
    border: 1px solid rgba(252, 193, 244, 0.24);
    display: flex;
    flex-direction: column;

    img {
      width: 100%;
      height: 110px;
      object-fit: cover;
    }

    div {
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      flex: 1;

      strong {
        font-size: 0.88rem;
        line-height: 1.35;
      }
    }

    &__cta {
      margin-top: auto;
      font-size: 0.8rem;
      font-weight: 700;
      color: $accent-emerald;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .currency-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.42rem 0.78rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid $border-subtle;
    font-family: $font-mono;
    font-size: 0.75rem;
    color: $text-muted;
    cursor: pointer;

    .active {
      color: $accent-emerald;
      font-weight: 700;
    }

    .sep {
      opacity: 0.4;
    }
  }

  .header-cta {
    display: none;
    padding: 0.68rem 1.3rem;
    font-size: 0.88rem;

    @include respond-up(sm) {
      display: inline-flex;
    }
  }

  .mobile-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid $border-subtle;
    cursor: pointer;

    @include respond-up(lg) {
      display: none;
    }
  }

  .mobile-drawer {
    border-top: 1px solid $border-subtle;
    background: rgba(6, 7, 13, 0.98);
    padding-block: 1.5rem 2rem;

    &__inner {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
  }

  .mobile-label {
    font-family: $font-mono;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $accent-emerald;
    display: block;
    margin-bottom: 0.5rem;
  }

  .mobile-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    a {
      padding: 0.42rem 0.82rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid $border-subtle;
      font-size: 0.84rem;
    }
  }

  .mobile-link {
    padding: 0.65rem 0;
    font-size: 1.05rem;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .mobile-cta {
    margin-top: 0.5rem;
    width: 100%;
  }
</style>
