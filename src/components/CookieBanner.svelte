<script lang="ts">
  import { onMount } from 'svelte';

  const STORAGE_KEY = 'dw_au_cookie_consent_v1';

  let visible = $state(false);
  let showPrefs = $state(false);
  let analyticsConsent = $state(true);
  let adsConsent = $state(true);

  function applyConsent(analytics: boolean, ads: boolean) {
    const payload = {
      essential: true,
      analytics,
      ads,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage unavailable
    }

    // Google Consent Mode v2 hook for Google Ads & GA4 compliance
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
    };
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: ads ? 'granted' : 'denied',
        ad_user_data: ads ? 'granted' : 'denied',
        ad_personalization: ads ? 'granted' : 'denied',
      });
    }

    visible = false;
    showPrefs = false;
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        visible = true;
      }
    } catch {
      visible = true;
    }

    const reopenHandler = () => {
      visible = true;
      showPrefs = true;
    };
    window.addEventListener('dw:open-cookies', reopenHandler);
    return () => window.removeEventListener('dw:open-cookies', reopenHandler);
  });
</script>

{#if visible}
  <aside class="cookie-banner" role="dialog" aria-label="Cookie and Privacy Consent">
    <div class="cookie-banner__head">
      <span class="cookie-dot" aria-hidden="true"></span>
      <strong>Privacy &amp; Cookie Preferences</strong>
    </div>
    <p>
      We use essential cookies to run this site and optional analytics/Google Ads cookies to measure campaign performance. Review our <a href="/privacy">Privacy Policy</a> at any time.
    </p>

    {#if showPrefs}
      <div class="cookie-prefs">
        <label class="pref-row">
          <input type="checkbox" checked disabled />
          <span><strong>Essential</strong> — Core security, form validation &amp; currency preference</span>
        </label>
        <label class="pref-row">
          <input type="checkbox" bind:checked={analyticsConsent} />
          <span><strong>Analytics</strong> — Aggregated Core Web Vitals &amp; traffic measurement</span>
        </label>
        <label class="pref-row">
          <input type="checkbox" bind:checked={adsConsent} />
          <span><strong>Google Ads Conversion</strong> — Measures quote &amp; audit form submissions</span>
        </label>
      </div>
    {/if}

    <div class="cookie-actions">
      <button type="button" class="c-btn c-btn--ghost" onclick={() => applyConsent(false, false)}>
        Essential Only
      </button>
      {#if showPrefs}
        <button type="button" class="c-btn c-btn--primary" onclick={() => applyConsent(analyticsConsent, adsConsent)}>
          Save Preferences
        </button>
      {:else}
        <button type="button" class="c-btn c-btn--text" onclick={() => (showPrefs = true)}>
          Customise
        </button>
        <button type="button" class="c-btn c-btn--primary" onclick={() => applyConsent(true, true)}>
          Accept All
        </button>
      {/if}
    </div>
  </aside>
{/if}

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .cookie-banner {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 150;
    width: min(420px, calc(100vw - 2rem));
    padding: 1.35rem 1.45rem;
    border-radius: $radius-lg;
    @include glass-surface(true);
    border-color: rgba(132, 181, 230, 0.28);

    &__head {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 0.5rem;
      font-size: 0.94rem;
    }

    p {
      margin: 0 0 1rem;
      font-size: 0.8rem;
      color: $text-secondary;
      line-height: 1.55;

      a {
        color: $accent-blue-light;
        text-decoration: underline;
      }
    }
  }

  .cookie-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent-emerald;
    box-shadow: 0 0 10px $accent-emerald;
  }

  .cookie-prefs {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin-bottom: 1rem;
    padding: 0.8rem;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .pref-row {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    font-size: 0.76rem;
    color: $text-secondary;
    cursor: pointer;

    input {
      margin-top: 2px;
      accent-color: $accent-emerald;
    }

    strong {
      color: #ffffff;
    }
  }

  .cookie-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.55rem;
  }

  .c-btn {
    border-radius: $radius-pill;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.52rem 1rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all $transition-fast;

    &--primary {
      background: #016ad4;
      color: #ffffff;

      &:hover {
        background: #0278ef;
      }
    }

    &--ghost {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.14);
      color: #e2e8f0;

      &:hover {
        border-color: rgba(255, 255, 255, 0.35);
      }
    }

    &--text {
      background: transparent;
      color: $text-secondary;

      &:hover {
        color: #ffffff;
      }
    }
  }
</style>
