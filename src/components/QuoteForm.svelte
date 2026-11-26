<script lang="ts">
  import { BUDGET_TIERS } from '../data/agencyData';
  import { currencyStore } from '../lib/currency.svelte';
  import { generateInquiryRef, validateBriefAttachment } from '../lib/wasm';

  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let budgetIndex = $state(1);
  let message = $state('');
  let acceptedPrivacy = $state(false);
  let dragging = $state(false);

  let attachmentName = $state('');
  let attachmentKind = $state('');
  let attachmentError = $state('');

  let formError = $state('');
  let submittedRef = $state('');
  let submitting = $state(false);

  $effect(() => {
    const auditBtn = document.querySelector('[data-preset-audit]');
    if (!auditBtn) return;
    const handler = () => {
      if (!message.trim()) {
        message = 'Requesting the Free 2-Week Expert Website Audit (UX, Technical Core Web Vitals & SEO).';
      }
    };
    auditBtn.addEventListener('click', handler);
    return () => auditBtn.removeEventListener('click', handler);
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
    } finally {
      submitting = false;
    }
  }
</script>

<section class="section contact-section" id="contact" aria-labelledby="contact-heading">
  <div class="container contact-grid">
    <div class="contact-info" data-reveal>
      <span class="eyebrow">Start a Conversation</span>
      <h2 class="section-title" id="contact-heading">Book a Call or Get a Tailored Quote.</h2>
      <p class="section-lead">
        Share your objectives, timeline, and optional brief. Our Sydney and Melbourne leads respond within 1 business day with a structured scope—or a free 2-week expert audit.
      </p>

      <div class="contact-cards">
        <div class="info-pill">
          <span>Direct Email</span>
          <a href="mailto:hello@digitalworldau.com">hello@digitalworldau.com</a>
        </div>
        <div class="info-pill">
          <span>Sydney Studio</span>
          <strong>Level 14, 275 George St, Sydney NSW 2000</strong>
        </div>
        <div class="info-pill">
          <span>Response SLA</span>
          <strong>Under 24 Hours (AEST/AEDT)</strong>
        </div>
      </div>
    </div>

    <div class="form-card" data-glow-card data-reveal>
      {#if submittedRef}
        <div class="success-box" role="status">
          <span class="pill-badge">Brief Received</span>
          <h3>Thank you, {name}.</h3>
          <p>
            Your project inquiry has been logged and verified with reference <code class="ref-code">{submittedRef}</code>. Our senior strategist will reach out to <strong>{email}</strong> shortly.
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
              <span>Estimated Budget ({currencyStore.code})</span>
              <select bind:value={budgetIndex}>
                {#each BUDGET_TIERS as tier, idx}
                  <option value={idx}>{currencyStore.getTierLabel(idx)}</option>
                {/each}
              </select>
            </label>
          </div>

          <label class="field">
            <span>Project Overview &amp; Goals</span>
            <textarea
              rows="4"
              placeholder="Tell us about your website, e-commerce goals, target launch window, or request a Free 2-Week Expert Audit..."
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
                <strong class="ok">Verified {attachmentKind}: {attachmentName}</strong>
                <span>Validated in-browser via Rust/Wasm magic-byte check.</span>
              {:else}
                <strong>Attach Project Brief or Wireframes</strong>
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
              I agree to the <a href="/privacy">Privacy Policy</a> and consent to Digital World AU storing my inquiry details to respond to my request.
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
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .contact-grid {
    display: grid;
    gap: 2.5rem;
    align-items: start;

    @include respond-up(lg) {
      grid-template-columns: 0.9fr 1.1fr;
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
    padding: 1rem 1.2rem;

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

  .form-card {
    @include interactive-card;
    padding: clamp(1.5rem, 3vw, 2.25rem);

    form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
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
      padding: 0.8rem 0.95rem;
      border-radius: $radius-sm;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(5, 7, 13, 0.72);
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
    border: 1.5px dashed rgba(56, 189, 248, 0.35);
    border-radius: $radius-md;
    padding: 1.15rem;
    text-align: center;
    background: rgba(56, 189, 248, 0.04);
    transition: border-color $transition-fast, background $transition-fast;

    &.dragging,
    &:hover {
      border-color: $accent-emerald;
      background: rgba(0, 245, 160, 0.06);
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
      color: $accent-cyan;
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
    padding-block: 0.98rem;
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
    background: rgba(0, 245, 160, 0.1);
    padding: 0.15rem 0.45rem;
    border-radius: 6px;
  }
</style>
