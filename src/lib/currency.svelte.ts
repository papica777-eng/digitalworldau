// Reactive currency store using Svelte 5 Runes + cross-island custom event sync + Wasm conversion
import { convertEurCentsToAudCents } from './wasm';
import { BUDGET_TIERS } from '../data/agencyData';

export type CurrencyCode = 'AUD' | 'EUR';
export const CURRENCY_EVENT = 'dw:currency-change';

// 1 EUR = 1.6500 AUD (16500 basis points)
const EUR_TO_AUD_BPS = 16_500;
const STORAGE_KEY = 'dw_currency';

function formatAudDollars(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `A$${dollars.toLocaleString('en-AU')}`;
}

function formatEurEuros(cents: number): string {
  const euros = Math.round(cents / 100);
  return `€${euros.toLocaleString('en-IE')}`;
}

function readInitialCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'AUD';
  const winVal = (window as unknown as { __dwCurrency?: string }).__dwCurrency;
  if (winVal === 'AUD' || winVal === 'EUR') return winVal;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'AUD' || saved === 'EUR') return saved;
  } catch {
    // Ignore storage restriction
  }
  return 'AUD';
}

class CurrencyStore {
  code = $state<CurrencyCode>(readInitialCurrency());
  audTiers = $state<string[]>(
    BUDGET_TIERS.map((t) => {
      const minCents = Math.floor((t.minEurCents * EUR_TO_AUD_BPS + 5000) / 10000);
      const maxCents = Math.floor((t.maxEurCents * EUR_TO_AUD_BPS + 5000) / 10000);
      return `${formatAudDollars(minCents)} – ${formatAudDollars(maxCents)}`;
    })
  );

  constructor() {
    if (typeof window !== 'undefined') {
      (window as unknown as { __dwCurrency?: CurrencyCode }).__dwCurrency = this.code;
      window.addEventListener(CURRENCY_EVENT, (ev: Event) => {
        const next = (ev as CustomEvent<CurrencyCode>).detail;
        if ((next === 'AUD' || next === 'EUR') && next !== this.code) {
          this.code = next;
        }
      });
      void this.recomputeWithWasm();
    }
  }

  toggle() {
    this.setCurrency(this.code === 'AUD' ? 'EUR' : 'AUD');
  }

  setCurrency(next: CurrencyCode) {
    this.code = next;
    if (typeof window !== 'undefined') {
      (window as unknown as { __dwCurrency?: CurrencyCode }).__dwCurrency = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage restriction
      }
      window.dispatchEvent(new CustomEvent<CurrencyCode>(CURRENCY_EVENT, { detail: next }));
    }
  }

  async recomputeWithWasm() {
    const formatted: string[] = [];
    for (const tier of BUDGET_TIERS) {
      const minAudCents = await convertEurCentsToAudCents(tier.minEurCents, EUR_TO_AUD_BPS);
      const maxAudCents = await convertEurCentsToAudCents(tier.maxEurCents, EUR_TO_AUD_BPS);
      formatted.push(`${formatAudDollars(minAudCents)} – ${formatAudDollars(maxAudCents)}`);
    }
    this.audTiers = formatted;
  }

  getTierLabelFor(index: number, currency: CurrencyCode): string {
    const tier = BUDGET_TIERS[index];
    if (!tier) return '';
    if (currency === 'EUR') {
      return `${formatEurEuros(tier.minEurCents)} – ${formatEurEuros(tier.maxEurCents)}`;
    }
    return this.audTiers[index];
  }

  getTierLabel(index: number): string {
    return this.getTierLabelFor(index, this.code);
  }
}

export const currencyStore = new CurrencyStore();
