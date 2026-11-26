// Reactive currency store using Svelte 5 Runes + integer-atomic Rust/Wasm conversion
import { convertEurCentsToAudCents } from './wasm';
import { BUDGET_TIERS } from '../data/agencyData';

export type CurrencyCode = 'AUD' | 'EUR';

// 1 EUR = 1.6500 AUD (16500 basis points)
const EUR_TO_AUD_BPS = 16_500;

function formatAudDollars(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `A$${dollars.toLocaleString('en-AU')}`;
}

function formatEurEuros(cents: number): string {
  const euros = Math.round(cents / 100);
  return `€${euros.toLocaleString('en-IE')}`;
}

class CurrencyStore {
  code = $state<CurrencyCode>('AUD');
  audTiers = $state<string[]>(
    BUDGET_TIERS.map((t) => {
      const minCents = Math.floor((t.minEurCents * EUR_TO_AUD_BPS + 5000) / 10000);
      const maxCents = Math.floor((t.maxEurCents * EUR_TO_AUD_BPS + 5000) / 10000);
      return `${formatAudDollars(minCents)} – ${formatAudDollars(maxCents)}`;
    })
  );

  constructor() {
    if (typeof window !== 'undefined') {
      void this.recomputeWithWasm();
    }
  }

  toggle() {
    this.code = this.code === 'AUD' ? 'EUR' : 'AUD';
  }

  setCurrency(next: CurrencyCode) {
    this.code = next;
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

  getTierLabel(index: number): string {
    const tier = BUDGET_TIERS[index];
    if (!tier) return '';
    if (this.code === 'EUR') {
      return `${formatEurEuros(tier.minEurCents)} – ${formatEurEuros(tier.maxEurCents)}`;
    }
    return this.audTiers[index];
  }
}

export const currencyStore = new CurrencyStore();
