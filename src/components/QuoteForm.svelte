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

  let {
    defaultScope = 'UI/UX & Web Design',
    eyebrow = 'Start a Conversation',
    heading = 'Book a Call or Request a Tailored Proposal.',
  }: {
    defaultScope?: string;
    eyebrow?: string;
    heading?: string;
  } = $props();

  let selectedScopes = $state<string[]>([defaultScope]);
  let activeCurrency = $state<CurrencyCode>(currencyStore.code);
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let budgetIndex = $state(1);
  let message = $state('');
  let companyWebsite = $state('');
  let acceptedPrivacy = $state(false);
  let dragging = $state(false);
  let copiedEmail = $state(false);

  let attachmentFile = $state<File | null>(null);
  let attachmentName = $state('');
  let attachmentKind = $state('');
  let attachmentError = $state('');

  let formError = $state('');
  let submittedRef = $state('');
  let deliveryChannel = $state('');
  let submittedMailto = $state('');
  let submittedWhatsAppAu = $state('');
  let submittedWhatsAppEu = $state('');
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
    attachmentFile = null;
    attachmentName = '';
    attachmentKind = '';
    if (!file) return;

    const result = await validateBriefAttachment(file);
    if (!result.valid) {
      attachmentError = 'Unsupported file or exceeds 10MB limit. Allowed: .pdf, .doc, .docx, .png, .jpg.';
      return;
    }
    attachmentFile = file;
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
      const scopesText = selectedScopes.join(', ') || 'Custom Scope';
      const budgetText = currencyStore.getTierLabelFor(budgetIndex, activeCurrency);
      const summaryLines = [
        `Reference: ${refCode}`,
        `Name: ${name.trim()}`,
        `Work Email: ${email.trim()}`,
        `Phone: ${phone.trim() || 'Not provided'}`,
        `Selected Services: ${scopesText}`,
        `Estimated Budget (${activeCurrency}): ${budgetText}`,
        `Attachment Verified: ${attachmentName || 'None'}`,
        '',
        'Project Overview:',
        message.trim() || '(No additional notes)',
      ];
      const summaryBody = summaryLines.join('\n');
      submittedMailto = `mailto:hello@digitalworldau.com?subject=${encodeURIComponent(`[${refCode}] Project Inquiry — ${name.trim()}`)}&body=${encodeURIComponent(summaryBody)}`;
      submittedWhatsAppAu = `https://wa.me/61423269586?text=${encodeURIComponent(summaryBody)}`;
      submittedWhatsAppEu = `https://wa.me/359896849882?text=${encodeURIComponent(summaryBody)}`;

      const fd = new FormData();
      fd.set('refCode', refCode);
      fd.set('name', name.trim());
      fd.set('email', email.trim());
      fd.set('phone', phone.trim());
      fd.set('scopes', scopesText);
      fd.set('currency', activeCurrency);
      fd.set('budget', budgetText);
      fd.set('message', message.trim());
      fd.set('companyWebsite', companyWebsite);
      if (typeof window !== 'undefined') {
        fd.set('pageUrl', window.location.href);
      }
      if (attachmentFile) {
        fd.set('attachment', attachmentFile, attachmentFile.name);
      }

      let serverDelivered = false;
      try {
        const res = await fetch('/api/inquiry', {
          method: 'POST',
          body: fd,
        });
        if (res.ok) {
          const json = (await res.json()) as { ok?: boolean; refCode?: string };
          if (json.ok) {
            serverDelivered = true;
            submittedRef = json.refCode || refCode;
            deliveryChannel = 'Direct Studio Inbox & Instant Alert';
          }
        }
      } catch {
        serverDelivered = false;
      }

      if (!serverDelivered) {
        submittedRef = refCode;
        deliveryChannel = 'Direct App Handoff';
      }

      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        __dwTracking?: { gadsId?: string; leadLabel?: string };
      };
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'generate_lead', {
          currency: activeCurrency,
          event_label: scopesText,
        });
        const gadsId = w.__dwTracking?.gadsId;
        const leadLabel = w.__dwTracking?.leadLabel;
        if (gadsId && leadLabel) {
          w.gtag('event', 'conversion', {
            send_to: `${gadsId}/${leadLabel}`,
            currency: activeCurrency,
          });
        }
      }
    } finally {
      submitting = false;
    }
  }
</script>

<section class="section contact-section" id="contact" aria-labelledby="contact-heading">
  <div class="container contact-grid">
    <div class="contact-info" data-reveal>
      <span class="eyebrow">{eyebrow}</span>
      <h2 class="section-title" id="contact-heading">{heading}</h2>
      <p class="section-lead">
        Share your goals, timeline, and optional brief. Our Melbourne, Sydney, and Bulgaria (EU) engineering leads respond within 1 business day with a structured scope—or your complimentary 48-hour expert website audit.
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
          <span>Australia Hub (Melbourne &amp; Sydney)</span>
          <a href="tel:+61423269586">+61 423 269 586</a>
          <small>60 Charter St, Ringwood, Melbourne VIC 3134 &amp; Sydney NSW</small>
        </div>
        <div class="info-pill">
          <span>Europe &amp; Bulgaria HQ (EU)</span>
          <a href="tel:+359896849882">+359 896 849 882</a>
          <small>6 Trapezitsa St, 8200 Pomorie (Burgas) &amp; Sofia, Bulgaria</small>
        </div>
        <div class="info-pill">
          <span>Guaranteed Turnaround</span>
          <strong>Under 24 Hours (AEST / EET / CET)</strong>
        </div>
      </div>
    </div>

    <div class="beam-frame" data-reveal>
      <div class="form-card" data-glow-card>
        {#if submittedRef}
          <div class="success-box" role="status">
            <span class="pill-badge">✓ Delivered • {deliveryChannel}</span>
            <h3>Thank you, {name}.</h3>
            <p>
              Your inquiry ({selectedScopes.join(', ') || 'Custom Scope'}) has been delivered directly to <strong>hello@digitalworldau.com</strong> under reference <code class="ref-code">{submittedRef}</code>. Our senior strategist will reply to <strong>{email}</strong> within one business day—or connect instantly via WhatsApp below.
            </p>
            <div class="success-actions">
              <a href={submittedWhatsAppAu} target="_blank" rel="noopener" class="btn btn-primary">
                WhatsApp Australia (+61) ↗
              </a>
              <a href={submittedWhatsAppEu} target="_blank" rel="noopener" class="btn btn-ghost">
                WhatsApp Europe (+359) ↗
              </a>
              {#if deliveryChannel !== 'Direct Studio Inbox & Instant Alert'}
                <a href={submittedMailto} class="btn btn-ghost">
                  Send via Email App ↗
                </a>
              {/if}
            </div>
            <button
              type="button"
              class="btn btn-ghost"
              onclick={() => {
                submittedRef = '';
                deliveryChannel = '';
                message = '';
                attachmentFile = null;
                attachmentName = '';
              }}
            >
              Submit Another Brief
            </button>
          </div>
        {:else}
          <form onsubmit={onSubmit} novalidate>
            <input
              type="text"
              name="companyWebsite"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              class="honeypot-field"
              bind:value={companyWebsite}
            />
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
      display: block;
      font-size: 0.98rem;
      color: $text-primary;
    }

    small {
      display: block;
      margin-top: 0.2rem;
      font-size: 0.78rem;
      color: $text-muted;
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
    @include agma-border(40px, 2);
    border-radius: 40px;
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
      background: rgba(255, 255, 255, 0.045);
      color: $text-secondary;
      cursor: pointer;
      transition: all $transition-fast;

      &.selected {
        background: $accent-cobalt;
        border-color: rgba(132, 181, 230, 0.65);
        color: #ffffff;
        box-shadow: 0 6px 20px rgba(1, 106, 212, 0.38);
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
      padding: 0.85rem 1.05rem;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: #ffffff;
      transition: border-color $transition-fast, background $transition-fast;

      &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.085);
        border-color: $accent-cobalt;
      }
    }

    select option {
      background: #0d0d0d;
      color: #ffffff;
    }
  }

  .dropzone {
    position: relative;
    border: 1.5px dashed rgba(132, 181, 230, 0.35);
    border-radius: 18px;
    padding: 1.15rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.035);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: border-color $transition-fast, background $transition-fast;

    &.dragging,
    &:hover {
      border-color: $accent-cobalt;
      background: rgba(1, 106, 212, 0.14);
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

  .honeypot-field {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
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
      margin: 0 0 1.35rem;
    }
  }

  .success-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem;
    margin-bottom: 1rem;
  }

  .ref-code {
    font-family: $font-mono;
    color: $accent-emerald;
    background: rgba(0, 245, 160, 0.12);
    padding: 0.15rem 0.45rem;
    border-radius: 6px;
  }
</style>
