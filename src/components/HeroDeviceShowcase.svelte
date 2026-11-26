<script lang="ts">
  import { onMount } from 'svelte';

  interface DeviceShowcaseSite {
    id: string;
    domain: string;
    label: string;
    url: string;
    video: string;
    poster: string;
    mobileImg: string;
    mobileTitle: string;
    mobileBadge: string;
    mobileCta: string;
  }

  const SITES: DeviceShowcaseSite[] = [
    {
      id: 'anchialo',
      domain: 'anchialo.com',
      label: 'AU Online Store',
      url: 'https://anchialo.com',
      video: '/videos/case-anchialo.mp4',
      poster: '/media/mockup-anchialo.webp',
      mobileImg: '/media/anchialo-gel.webp',
      mobileTitle: 'ANCHIALO AU',
      mobileBadge: '253 g/L MgCl₂ • Melbourne',
      mobileCta: 'Shop Recovery →',
    },
    {
      id: 'cptmma',
      domain: 'cptmma.com',
      label: 'Melbourne Academy',
      url: 'https://cptmma.com',
      video: '/videos/case-cptmma.mp4',
      poster: '/media/mockup-cptmma.webp',
      mobileImg: '/media/sotir-kichukov.webp',
      mobileTitle: 'CPT MMA Melbourne',
      mobileBadge: 'ONE Vet Coaching',
      mobileCta: 'Apply Now →',
    },
    {
      id: 'aeterna',
      domain: 'aeterna.website',
      label: 'Flagship Platform',
      url: 'https://aeterna.website',
      video: '/videos/case-aeterna.mp4',
      poster: '/media/mockup-aeterna.webp',
      mobileImg: '/media/mockup-aeterna.webp',
      mobileTitle: 'AETERNA Platform',
      mobileBadge: 'Interactive Flagship',
      mobileCta: 'Explore Live →',
    },
  ];

  let activeIndex = $state(0);
  let paused = $state(false);
  let activeSite = $derived(SITES[activeIndex]);

  function selectSite(idx: number) {
    activeIndex = idx;
  }

  onMount(() => {
    const timer = setInterval(() => {
      if (!paused) {
        activeIndex = (activeIndex + 1) % SITES.length;
      }
    }, 6000);
    return () => clearInterval(timer);
  });
</script>

<div
  class="device-showcase"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  role="region"
  aria-label="Live responsive client websites showcased on laptop and iPhone"
>
  <div class="device-aura" aria-hidden="true"></div>

  <div class="device-stage">
    <!-- MacBook Pro Dark Titanium Frame -->
    <div class="laptop-frame">
      <div class="laptop-lid">
        <div class="laptop-bar">
          <div class="traffic-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <a href={activeSite.url} target="_blank" rel="noopener" class="laptop-url">
            <span class="live-dot" aria-hidden="true"></span>
            <span>https://{activeSite.domain} ↗</span>
          </a>
          <span class="device-tag">{activeSite.label}</span>
        </div>

        <div class="laptop-screen">
          {#key activeSite.id}
            <video
              src={activeSite.video}
              poster={activeSite.poster}
              autoplay
              loop
              muted
              playsinline
            ></video>
          {/key}
          <div class="screen-sheen" aria-hidden="true"></div>
        </div>
      </div>
      <div class="laptop-base" aria-hidden="true">
        <div class="laptop-notch"></div>
      </div>
    </div>

    <!-- Overlapping iPhone 16 Pro Frame -->
    <a
      href={activeSite.url}
      target="_blank"
      rel="noopener"
      class="iphone-frame"
      aria-label={`Open ${activeSite.domain} mobile preview in new tab`}
    >
      <div class="iphone-island" aria-hidden="true"></div>
      <div class="iphone-screen">
        {#key activeSite.id}
          <img src={activeSite.mobileImg} alt={`${activeSite.domain} mobile view`} loading="eager" />
        {/key}
        <div class="iphone-overlay">
          <span class="iphone-badge">{activeSite.mobileBadge}</span>
          <strong>{activeSite.mobileTitle}</strong>
          <span class="iphone-cta">{activeSite.mobileCta}</span>
        </div>
      </div>
      <div class="iphone-homebar" aria-hidden="true"></div>
    </a>
  </div>

  <!-- 3 Clean Interactive Site Switcher Pills -->
  <div class="site-pills" role="tablist" aria-label="Switch live website preview">
    {#each SITES as site, idx}
      <button
        type="button"
        role="tab"
        aria-selected={activeIndex === idx}
        class:active={activeIndex === idx}
        onclick={() => selectSite(idx)}
      >
        <span class="pill-dot" aria-hidden="true"></span>
        <span>{site.domain}</span>
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .device-showcase {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .device-aura {
    position: absolute;
    inset: 6% 8% 14%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.28) 0%,
      rgba(0, 245, 160, 0.12) 45%,
      rgba(95, 31, 87, 0.14) 70%,
      transparent 85%
    );
    filter: blur(44px);
    pointer-events: none;
    z-index: 0;
  }

  .device-stage {
    position: relative;
    z-index: 1;
    width: 100%;
    padding-bottom: 1.5rem;
    padding-right: clamp(0.75rem, 3vw, 2.2rem);
  }

  .laptop-frame {
    width: 100%;
    filter: drop-shadow(0 28px 56px rgba(0, 0, 0, 0.68));
  }

  .laptop-lid {
    background: linear-gradient(160deg, #1e293b 0%, #0b1120 42%, #05070d 100%);
    border: 1.5px solid rgba(148, 163, 184, 0.28);
    border-bottom: none;
    border-radius: 18px 18px 4px 4px;
    padding: 0.55rem 0.55rem 0.5rem;
  }

  .laptop-bar {
    height: 30px;
    padding-inline: 0.65rem;
    background: rgba(6, 9, 19, 0.92);
    border-radius: 10px 10px 0 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .traffic-dots {
    display: inline-flex;
    gap: 5px;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.24);
    }
  }

  .laptop-url {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-inline: auto;
    padding: 0.18rem 0.72rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    font-family: $font-mono;
    font-size: 0.7rem;
    color: $accent-emerald;
    font-weight: 600;
    transition: border-color $transition-fast, background $transition-fast;

    &:hover {
      border-color: $accent-emerald;
      background: rgba(0, 245, 160, 0.12);
    }
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $accent-emerald;
    box-shadow: 0 0 8px $accent-emerald;
  }

  .device-tag {
    display: none;
    font-family: $font-mono;
    font-size: 0.66rem;
    color: rgba(255, 255, 255, 0.54);

    @include respond-up(sm) {
      display: inline;
    }
  }

  .laptop-screen {
    position: relative;
    overflow: hidden;
    border-radius: 0 0 8px 8px;
    background: #020308;
    aspect-ratio: 16 / 10;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .screen-sheen {
    position: absolute;
    inset: 0;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.09) 0%, transparent 42%);
    pointer-events: none;
  }

  .laptop-base {
    width: 104%;
    margin-left: -2%;
    height: 13px;
    background: linear-gradient(180deg, #475569 0%, #1e293b 55%, #0f172a 100%);
    border-radius: 2px 2px 14px 14px;
    display: flex;
    justify-content: center;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.7);
  }

  .laptop-notch {
    width: 74px;
    height: 5px;
    background: #0f172a;
    border-radius: 0 0 6px 6px;
  }

  .iphone-frame {
    position: absolute;
    right: 0;
    bottom: 0;
    width: clamp(118px, 27%, 172px);
    aspect-ratio: 9 / 19.2;
    background: linear-gradient(155deg, #334155 0%, #0b1120 45%, #020308 100%);
    border: 2px solid rgba(203, 213, 225, 0.34);
    border-radius: 24px;
    padding: 0.38rem;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.85), 0 0 28px rgba(1, 106, 212, 0.24);
    display: flex;
    flex-direction: column;
    transition: transform $transition-smooth, border-color $transition-fast;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      border-color: rgba(0, 245, 160, 0.65);
    }
  }

  .iphone-island {
    position: absolute;
    top: 0.68rem;
    left: 50%;
    transform: translateX(-50%);
    width: 34%;
    height: 9px;
    border-radius: $radius-pill;
    background: #020308;
    z-index: 4;
  }

  .iphone-screen {
    position: relative;
    flex: 1;
    border-radius: 18px;
    overflow: hidden;
    background: #04060d;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .iphone-overlay {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 0.7rem 0.55rem 0.75rem;
    background: linear-gradient(to top, rgba(2, 3, 8, 0.96) 24%, rgba(2, 3, 8, 0.68) 72%, transparent);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    strong {
      font-size: 0.74rem;
      line-height: 1.15;
      color: #ffffff;
    }
  }

  .iphone-badge {
    font-family: $font-mono;
    font-size: 0.56rem;
    color: $accent-blue-light;
    line-height: 1.2;
  }

  .iphone-cta {
    margin-top: 0.18rem;
    align-self: flex-start;
    padding: 0.2rem 0.48rem;
    border-radius: $radius-pill;
    background: rgba(0, 245, 160, 0.16);
    border: 1px solid rgba(0, 245, 160, 0.45);
    font-family: $font-mono;
    font-size: 0.58rem;
    font-weight: 700;
    color: $accent-emerald;
  }

  .iphone-homebar {
    position: absolute;
    bottom: 0.62rem;
    left: 50%;
    transform: translateX(-50%);
    width: 36%;
    height: 3px;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.55);
    z-index: 4;
  }

  .site-pills {
    margin-top: 0.9rem;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.55rem;

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.44rem 0.92rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-family: $font-mono;
      font-size: 0.74rem;
      color: rgba(255, 255, 255, 0.62);
      cursor: pointer;
      transition: all $transition-fast;

      .pill-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        transition: background $transition-fast, box-shadow $transition-fast;
      }

      &:hover,
      &.active {
        color: #ffffff;
        border-color: rgba(0, 245, 160, 0.55);
        background: rgba(1, 106, 212, 0.24);

        .pill-dot {
          background: $accent-emerald;
          box-shadow: 0 0 8px $accent-emerald;
        }
      }
    }
  }
</style>
