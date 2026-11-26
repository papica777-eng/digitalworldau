<script lang="ts">
  interface Props {
    compact?: boolean;
    href?: string;
    onclick?: () => void;
  }

  let { compact = false, href = '/', onclick }: Props = $props();
</script>

<a
  {href}
  class="brutal-logo"
  class:compact
  aria-label="Digital World AU Studio Home"
  {onclick}
>
  <svg
    class="brutal-logo__svg"
    width={compact ? 186 : 214}
    height={compact ? 42 : 48}
    viewBox="0 0 248 56"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dwBracketMetal" x1="0" y1="4" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#93c5fd"/>
        <stop offset="28%" stop-color="#0284c7"/>
        <stop offset="56%" stop-color="#016ad4"/>
        <stop offset="82%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#00f5a0"/>
      </linearGradient>

      <linearGradient id="dwWordChrome" x1="40" y1="6" x2="210" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="48%" stop-color="#f8fafc"/>
        <stop offset="72%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>

      <filter id="dwBracketGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.6" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="dwTextDepth" x="-10%" y="-15%" width="120%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.75"/>
      </filter>
    </defs>

    <g filter="url(#dwBracketGlow)">
      <path
        d="M17.5 11.5 L4.5 22.5 L17.5 33.5"
        stroke="url(#dwBracketMetal)"
        stroke-width="4.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.5 11.5 L4.5 22.5 L17.5 33.5"
        stroke="#ffffff"
        stroke-opacity="0.45"
        stroke-width="1.1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M31 9.5 L21.5 35.5"
        stroke="url(#dwBracketMetal)"
        stroke-width="4.2"
        stroke-linecap="round"
      />
      <path
        d="M31 9.5 L21.5 35.5"
        stroke="#e0f2fe"
        stroke-opacity="0.55"
        stroke-width="1"
        stroke-linecap="round"
      />
    </g>

    <g filter="url(#dwTextDepth)">
      <text
        x="36"
        y="30.5"
        fill="url(#dwWordChrome)"
        font-family="Plus Jakarta Sans, -apple-system, sans-serif"
        font-weight="800"
        font-size="25.5"
        letter-spacing="-1.05"
      >
        digitalworld
      </text>
    </g>

    <g filter="url(#dwBracketGlow)">
      <path
        d="M196 11.5 L209 22.5 L196 33.5"
        stroke="url(#dwBracketMetal)"
        stroke-width="4.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M196 11.5 L209 22.5 L196 33.5"
        stroke="#ffffff"
        stroke-opacity="0.45"
        stroke-width="1.1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <text
      x="191"
      y="47.5"
      text-anchor="end"
      fill="rgba(226,232,240,0.84)"
      font-family="Plus Jakarta Sans, sans-serif"
      font-weight="600"
      font-size="11.5"
      letter-spacing="0.4"
    >
      studio
    </text>
    <circle cx="198" cy="43.5" r="2.2" fill="#00f5a0" />
    <text
      x="205"
      y="47.5"
      fill="#84b5e6"
      font-family="JetBrains Mono, monospace"
      font-weight="700"
      font-size="10.5"
      letter-spacing="1.2"
    >
      AU
    </text>
  </svg>
</a>

<style lang="scss">
  .brutal-logo {
    display: inline-flex;
    align-items: center;
    background: transparent;
    border: none;
    padding: 0;
    flex-shrink: 0;
    transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 18px rgba(1, 106, 212, 0.55));
    }

    &__svg {
      display: block;
      overflow: visible;
    }
  }
</style>
