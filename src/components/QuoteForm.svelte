<script lang="ts">
  import { BUDGET_TIERS } from '../data/agencyData';
  import { currencyStore, CURRENCY_EVENT, type CurrencyCode } from '../lib/currency.svelte';
  import { generateInquiryRef, validateBriefAttachment } from '../lib/wasm';

  const SCOPE_OPTIONS = [
    'Free 48-Hour Website Audit',
    'UI/UX & Web Design',
    'E-Commerce Store',
    'Custom Development',
    'SEO & Paid Growth',
  ];

  let selectedScopes = $state<string[]>(['UI/UX & Web Design']);
  let activeCurrency = $state<CurrencyCode>(currencyStore.code);
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let budgetIndex = $state(1);
  let message = $state('');
  let acceptedPrivacy = $state(false);
  let dragging = $state(false);
  let copiedEmail = $state(false);

  let attachmentName = $state('');
  let attachmentKind = $state('');
  let attachmentError = $state('');

  let formError = $state('');
  let submittedRef = $state('');
  let submitting = $state(false);

  function toggleScope(scope: string) {
    if (selectedScopes.includes(scope)) {
      selectedScopes = selectedScopes.filter((s) => s !== scope);
    } else {
      selectedScopes = [...selectedScopes, scope];
    }
  }

  function copyEmail() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText('hello@digitalworldau.com');
      copiedEmail = true;
      setTimeout(() => {
        copiedEmail = false;
      }, 2200);
    }
  }

  $effect(() => {
    activeCurrency = currencyStore.code;
    const onCurrencyChange = (ev: Event) => {
      const next = (ev as CustomEvent<CurrencyCode>).detail;
      if (next === 'AUD' || next === 'EUR') {
        activeCurrency = next;
      }
    };
    window.addEventListener(CURRENCY_EVENT, onCurrencyChange);

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const auditTrigger = target.closest('[data-preset-audit]');
      if (auditTrigger) {
        if (!selectedScopes.includes('Free 48-Hour Website Audit')) {
          selectedScopes = ['Free 48-Hour Website Audit', ...selectedScopes];
        }
        if (!message.trim()) {
          message = 'Requesting the Free 48-Hour Expert Website Audit (UX, Mobile Speed & SEO).';
        }
        return;
      }

      const serviceTrigger = target.closest('[data-preset-service]') as HTMLElement | null;
      if (serviceTrigger) {
        const preset = serviceTrigger.dataset.presetService;
        if (preset && !selectedScopes.includes(preset)) {
          selectedScopes = [preset, ...selectedScopes];
        }
      }
    };

    document.addEventListener('click', onDocumentClick);
    return () => {
      window.removeEventListener(CURRENCY_EVENT, onCurrencyChange);
      document.removeEventListener('click', onDocumentClick);
    };
  });

  async function processFile(file: File | undefined) {
    attachmentError = '';
    attachmentName = '';
    attachmentKind = '';
    if (!file) return;

    const result = await validateBriefAttachment(file);
    if (!result.valid) {
      attachmentError = 'Unsupported file or exceeds 10MB limit. Allowed: .pdf, .doc, .docx, .png, .jpg.';
      return;
    }
    attachmentName = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    attachmentKind = result.kind.toUpperCase();
  }

  function onFileInput(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    void processFile(input.files?.[0]);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    void processFile(e.dataTransfer?.files?.[0]);
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    formError = '';

    if (name.trim().length < 2) {
      formError = 'Please enter your full name.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      formError = 'Please enter a valid work email address.';
      return;
    }
    if (!acceptedPrivacy) {
      formError = 'Please accept our Privacy Policy before submitting.';
      return;
    }

    submitting = true;
    try {
      const refCode = await generateInquiryRef(name.trim(), email.trim(), budgetIndex + 1);
      submittedRef = refCode;

      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'generate_lead', {
          currency: activeCurrency,
          event_label: selectedScopes.join(', '),
        });
      }
    } finally {
      submitting = false;
    }
  }
</script>

<section class="section contact-section" id="contact" aria-labelledby="contact-heading">
  <div class="container contact-grid">
    <div class="contact-info" data-reveal>
      <span class="eyebrow">Start a Conversation</span>
      <h2 class="section-title" id="contact-heading">Book a Call or Request a Tailored Proposal.</h2>
      <p class="section-lead">
        Share your goals, timeline, and optional brief. Our Sydney and Melbourne leads respond within 1 business day with a structured scope—or your complimentary 48-hour expert website audit.
      </p>

      <div class="contact-cards">
        <div class="info-pill info-pill--email">
          <div>
            <span>Direct Studio Desk</span>
            <a href="mailto:hello@digitalworldau.com">hello@digitalworldau.com</a>
          </div>
          <button type="button" class="copy-email-btn" onclick={copyEmail}>
            {copiedEmail ? '✓ Copied' : 'Copy Email'}
          </button>
        </div>
        <div class="info-pill">
          <span>Australian Flagship</span>
          <strong>Level 14, 275 George St, Sydney NSW 2000</strong>
        </div>
        <div class="info-pill">
          <span>Guaranteed Turnaround</span>
          <strong>Under 24 Hours (AEST / CET / EST)</strong>
        </div>
      </div>
    </div>

    <div class="beam-frame" data-reveal>
      <div class="form-card" data-glow-card>
        {#if submittedRef}
          <div class="success-box" role="status">
            <span class="pill-badge">Brief Verified &amp; Logged</span>
            <h3>Thank you, {name}.</h3>
            <p>
              Your inquiry ({selectedScopes.join(', ') || 'Custom Scope'}) has been registered under deterministic reference <code class="ref-code">{submittedRef}</code>. Our senior strategist will email <strong>{email}</strong> within one business day.
            </p>
            <button
              type="button"
              class="btn btn-ghost"
              onclick={() => {
                submittedRef = '';
                message = '';
                attachmentName = '';
              }}
            >
              Submit Another Brief
            </button>
          </div>
        {:else}
          <form onsubmit={onSubmit} novalidate>
            <div class="scope-group">
              <span class="scope-label">What can we help you build?</span>
              <div class="scope-pills">
                {#each SCOPE_OPTIONS as scope}
                  <button
                    type="button"
                    class:selected={selectedScopes.includes(scope)}
                    onclick={() => toggleScope(scope)}
                  >
                    {scope}
                  </button>
                {/each}
              </div>
            </div>

            <div class="form-row-2">
              <label class="field">
                <span>Full Name *</span>
                <input type="text" required placeholder="Olivia Bennett" bind:value={name} />
              </label>
              <label class="field">
                <span>Work Email *</span>
                <input type="email" required placeholder="olivia@company.com.au" bind:value={email} />
              </label>
            </div>

            <div class="form-row-2">
              <label class="field">
                <span>Phone Number</span>
                <input type="tel" placeholder="+61 400 000 000" bind:value={phone} />
              </label>
              <label class="field">
                <span>Estimated Budget ({activeCurrency})</span>
                <select id="budget-select" bind:value={budgetIndex}>
                  {#each BUDGET_TIERS as _, idx}
                    <option value={idx}>{currencyStore.getTierLabelFor(idx, activeCurrency)}</option>
                  {/each}
                </select>
              </label>
            </div>

            <label class="field">
              <span>Project Overview &amp; Objectives</span>
              <textarea
                rows="4"
                placeholder="Tell us about your current site, target KPIs, desired launch window, or request the Free 48-Hour Website Audit..."
                bind:value={message}
              ></textarea>
            </label>

            <div
              class="dropzone"
              class:dragging
              ondragover={(e) => {
                e.preventDefault();
                dragging = true;
              }}
              ondragleave={() => (dragging = false)}
              ondrop={onDrop}
            >
              <input
                id="brief-upload"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onchange={onFileInput}
              />
              <label for="brief-upload">
                {#if attachmentName}
                  <strong class="ok">✓ Verified {attachmentKind}: {attachmentName}</strong>
                  <span>Checked privately inside your browser for security.</span>
                {:else}
                  <strong>Attach Project Brief, RFP or Wireframes</strong>
                  <span>Drag &amp; drop or browse — .pdf, .doc, .png, .jpg up to 10MB</span>
                {/if}
              </label>
            </div>

            {#if attachmentError}
              <p class="error-msg" role="alert">{attachmentError}</p>
            {/if}

            <label class="checkbox-field">
              <input type="checkbox" bind:checked={acceptedPrivacy} />
              <span>
                I agree to the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Engagement</a>.
              </span>
            </label>

            {#if formError}
              <p class="error-msg" role="alert">{formError}</p>
            {/if}

            <button type="submit" class="btn btn-primary submit-btn" disabled={submitting}>
              {submitting ? 'Verifying Brief...' : 'Book a Call / Get a Quote'}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .contact-grid {
    display: grid;
    gap: 2.5rem;
    align-items: start;

    @include respond-up(lg) {
      grid-template-columns: 0.88fr 1.12fr;
      gap: 3.25rem;
    }
  }

  .contact-cards {
    margin-top: 2rem;
    display: grid;
    gap: 0.9rem;
  }

  .info-pill {
    @include glass-surface;
    border-radius: $radius-md;
    padding: 1.05rem 1.25rem;

    &--email {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    span {
      display: block;
      font-family: $font-mono;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $accent-emerald;
      margin-bottom: 0.25rem;
    }

    a,
    strong {
      font-size: 0.98rem;
      color: $text-primary;
    }
  }

  .copy-email-btn {
    padding: 0.38rem 0.75rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $accent-blue-light;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      border-color: $accent-emerald;
      color: $accent-emerald;
    }
  }

  .form-card {
    @include glass-surface(true);
    border-radius: calc(#{$radius-xl} - 1px);
    padding: clamp(1.5rem, 3vw, 2.25rem);

    form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
  }

  .scope-label {
    display: block;
    font-size: 0.84rem;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 0.55rem;
  }

  .scope-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    button {
      padding: 0.44rem 0.88rem;
      border-radius: $radius-pill;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: $text-secondary;
      cursor: pointer;
      transition: all $transition-fast;

      &.selected {
        background: rgba(0, 245, 160, 0.14);
        border-color: $accent-emerald;
        color: #ffffff;
      }
    }
  }

  .form-row-2 {
    display: grid;
    gap: 1rem;

    @include respond-up(sm) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.42rem;

    span {
      font-size: 0.84rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.82rem 0.95rem;
      border-radius: $radius-sm;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(6, 7, 13, 0.78);
      color: #ffffff;
      transition: border-color $transition-fast;

      &:focus {
        outline: none;
        border-color: $accent-emerald;
      }
    }
  }

  .dropzone {
    position: relative;
    border: 1.5px dashed rgba(132, 181, 230, 0.35);
    border-radius: $radius-md;
    padding: 1.15rem;
    text-align: center;
    background: rgba(1, 106, 212, 0.06);
    transition: border-color $transition-fast, background $transition-fast;

    &.dragging,
    &:hover {
      border-color: $accent-emerald;
      background: rgba(0, 245, 160, 0.08);
    }

    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    label {
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      strong {
        font-size: 0.9rem;
        color: $text-primary;

        &.ok {
          color: $accent-emerald;
        }
      }

      span {
        font-size: 0.78rem;
        color: $text-muted;
      }
    }
  }

  .checkbox-field {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    font-size: 0.82rem;
    color: $text-secondary;
    cursor: pointer;

    input {
      margin-top: 0.2rem;
      accent-color: $accent-emerald;
    }

    a {
      color: $accent-blue-light;
      text-decoration: underline;
    }
  }

  .error-msg {
    margin: 0;
    color: $accent-rose;
    font-size: 0.84rem;
    font-weight: 600;
  }

  .submit-btn {
    width: 100%;
    padding-block: 1rem;
    font-size: 1rem;
  }

  .success-box {
    text-align: center;
    padding: 2rem 1rem;

    h3 {
      margin: 1rem 0 0.65rem;
      font-size: 1.6rem;
    }

    p {
      color: $text-secondary;
      margin: 0 0 1.5rem;
    }
  }

  .ref-code {
    font-family: $font-mono;
    color: $accent-emerald;
    background: rgba(0, 245, 160, 0.12);
    padding: 0.15rem 0.45rem;
    border-radius: 6px;
  }
</style>
