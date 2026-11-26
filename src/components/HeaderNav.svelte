<script lang="ts">
  import BrandLogo from './BrandLogo.svelte';
  import { MEGA_MENU } from '../data/agencyData';
  import { currencyStore, CURRENCY_EVENT, type CurrencyCode } from '../lib/currency.svelte';

  let megaOpen = $state(false);
  let mobileOpen = $state(false);
  let scrolled = $state(false);
  let activeCurrency = $state<CurrencyCode>(currencyStore.code);

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 24;
    };
    const onCurrencyChange = (ev: Event) => {
      const next = (ev as CustomEvent<CurrencyCode>).detail;
      if (next === 'AUD' || next === 'EUR') {
        activeCurrency = next;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener(CURRENCY_EVENT, onCurrencyChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(CURRENCY_EVENT, onCurrencyChange);
    };
  });

  function switchCurrency() {
    currencyStore.toggle();
    activeCurrency = currencyStore.code;
  }

  function closeAll() {
    megaOpen = false;
    mobileOpen = false;
  }
</script>

<header class:scrolled class="site-header">
  <div class="header-shell">
    <div class="header-inner">
      <BrandLogo onclick={closeAll} />

      <nav class="desktop-nav" aria-label="Primary navigation">
        <div
          class="mega-trigger-wrap"
          onmouseenter={() => (megaOpen = true)}
          onmouseleave={() => (megaOpen = false)}
        >
          <button
            type="button"
            class="nav-link"
            aria-expanded={megaOpen}
            onclick={() => (megaOpen = !megaOpen)}
          >
            Services
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {#if megaOpen}
            <div class="mega-dropdown" role="menu">
              <div class="mega-col">
                <p class="mega-col__title">01 • Design</p>
                {#each MEGA_MENU.design as item}
                  <a href={item.href} data-preset-service={item.preset} class="mega-item" onclick={closeAll}>
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </a>
                {/each}
              </div>
              <div class="mega-col">
                <p class="mega-col__title">02 • Development</p>
                {#each MEGA_MENU.development as item}
                  <a href={item.href} data-preset-service={item.preset} class="mega-item" onclick={closeAll}>
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </a>
                {/each}
              </div>
              <div class="mega-col">
                <p class="mega-col__title">03 • Marketing</p>
                {#each MEGA_MENU.marketing as item}
                  <a href={item.href} data-preset-service={item.preset} class="mega-item" onclick={closeAll}>
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </a>
                {/each}
              </div>
              <div class="mega-promo">
                <img src="/media/hero-sculpture.webp" alt="" loading="lazy" />
                <div>
                  <span class="tag">Free 48-Hour Diagnostic</span>
                  <strong>Expert UX, Vitals &amp; SEO Audit</strong>
                  <a href="#contact" data-preset-audit class="mega-promo__cta" onclick={closeAll}>Claim Audit →</a>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <a href="/#projects" class="nav-link">Projects</a>
        <a href="/#about" class="nav-link">About Us</a>
        <a href="/#blog" class="nav-link">Blog</a>
        <a href="/#contact" class="nav-link">Contact</a>
      </nav>

      <div class="header-actions">
        <button
          type="button"
          class="currency-text"
          onclick={switchCurrency}
          aria-label="Toggle display currency between AUD and EUR"
          title="Switch currency across pricing & quote form (AUD / EUR)"
        >
          <span class:active={activeCurrency === 'AUD'}>AUD</span>
          <span class="sep">/</span>
          <span class:active={activeCurrency === 'EUR'}>EUR</span>
        </button>

        <a href="/#contact" class="cobalt-quote-cta">
          <span>Get a Quote</span>
          <span class="arrow-circle" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </a>

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
  </div>

  {#if mobileOpen}
    <div class="mobile-drawer">
      <div class="container mobile-drawer__inner">
        <div class="mobile-services">
          <span class="mobile-label">Services</span>
          <div class="mobile-chips">
            <a href="/#services" data-preset-service="UI/UX & Web Design" onclick={closeAll}>Design</a>
            <a href="/#services" data-preset-service="Custom Development" onclick={closeAll}>Development</a>
            <a href="/#services" data-preset-service="SEO & Paid Growth" onclick={closeAll}>Marketing</a>
            <a href="/#contact" data-preset-audit onclick={closeAll}>Free Audit</a>
          </div>
        </div>
        <a href="/#projects" class="mobile-link" onclick={closeAll}>Projects</a>
        <a href="/#about" class="mobile-link" onclick={closeAll}>About Us</a>
        <a href="/#blog" class="mobile-link" onclick={closeAll}>Blog</a>
        <a href="/#contact" class="mobile-link" onclick={closeAll}>Contact</a>
        <a href="/#contact" class="cobalt-quote-cta mobile-cta" onclick={closeAll}>
          <span>Get a Quote</span>
          <span class="arrow-circle" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  {/if}
</header>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .site-header {
    position: sticky;
    top: 12px;
    z-index: 60;
    padding-inline: clamp(0.75rem, 3vw, 1.75rem);
    background: transparent;
    border: none;
    pointer-events: none;

    &.scrolled .header-shell {
      background: rgba(8, 10, 18, 0.72);
      box-shadow: 0 20px 52px rgba(0, 0, 0, 0.65);
    }
  }

  .header-shell {
    @include agma-border(80px, 1);
    max-width: $container-max;
    margin: 4px auto 0;
    padding-inline: clamp(1rem, 2.5vw, 1.85rem);
    border-radius: 80px;
    background: rgba(12, 14, 22, 0.42);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.42);
    pointer-events: auto;
    transition: background $transition-fast, box-shadow $transition-fast;
  }

  .header-inner {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }

  .desktop-nav {
    display: none;
    align-items: center;
    gap: 2.15rem;

    @include respond-up(lg) {
      display: flex;
    }
  }

  .nav-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.78);
    transition: color $transition-fast;
    background: none;
    border: none;
    padding: 0.25rem 0;
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
    top: calc(100% + 1.1rem);
    left: -180px;
    width: 860px;
    padding: 1.5rem;
    border-radius: $radius-lg;
    @include glass-surface(true);
    border-color: rgba(132, 181, 230, 0.26);
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
    color: $accent-blue-light;
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
      background: rgba(1, 106, 212, 0.2);
    }
  }

  .mega-promo {
    border-radius: $radius-md;
    overflow: hidden;
    background: rgba(6, 12, 32, 0.42);
    border: 1px solid rgba(252, 193, 244, 0.22);
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
    gap: 1rem;
  }

  .currency-text {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: $radius-pill;
    padding: 0.34rem 0.68rem;
    font-family: $font-mono;
    font-size: 0.74rem;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: border-color $transition-fast, background $transition-fast;

    &:hover {
      border-color: rgba(0, 245, 160, 0.52);
    }

    span:not(.sep) {
      padding: 0.08rem 0.34rem;
      border-radius: $radius-pill;
      transition: background $transition-fast, color $transition-fast;
    }

    .active {
      background: rgba(1, 106, 212, 0.55);
      color: #ffffff;
      font-weight: 700;
    }

    .sep {
      opacity: 0.35;
    }
  }

  .cobalt-quote-cta {
    display: none;
    align-items: center;
    gap: 0.65rem;
    padding: 0.6rem 0.72rem 0.6rem 1.3rem;
    border-radius: $radius-pill;
    background: $accent-cobalt;
    color: #ffffff;
    font-family: $font-display;
    font-weight: 500;
    font-size: 0.78rem;
    box-shadow: 0 8px 26px rgba(1, 106, 212, 0.42);
    transition: transform $transition-fast, background $transition-fast, box-shadow $transition-fast;

    @include respond-up(sm) {
      display: inline-flex;
    }

    &:hover {
      transform: translateY(-1px);
      background: #0b7ae8;
      box-shadow: 0 12px 32px rgba(1, 106, 212, 0.62);
    }

    .arrow-circle {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: grid;
      place-items: center;
    }
  }

  .mobile-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.16);
    cursor: pointer;

    @include respond-up(lg) {
      display: none;
    }
  }

  .mobile-drawer {
    pointer-events: auto;
    margin-top: 0.65rem;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(6, 8, 14, 0.94);
    backdrop-filter: blur(18px);
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
    color: $accent-blue-light;
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
    display: inline-flex;
    justify-content: center;
    margin-top: 0.5rem;
    width: 100%;
  }
</style>
