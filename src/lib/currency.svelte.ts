// Reactive currency store using Svelte 5 Runes + integer-atomic Rust/Wasm conversion
import { convertEurCentsToAudCents } from './wasm';
import { BUDGET_TIERS } from '../data/agencyData';

export type CurrencyCode = 'AUD' | 'EUR';

// 1 EUR = 1.6500 AUD (16500 basis points)
const EUR_TO_AUD_BPS = 16_500;

class CurrencyStore {
  code = $state<CurrencyCode>('AUD');
  audTiers = $state<string[]>([
    'A$3.3k–A$8.3k',
    'A$8.3k–A$16.5k',
    'A$16.5k–A$33k',
    'A$33k–A$82.5k',
  ]);

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
      formatted.push(`${formatCompactAud(minAudCents)}–${formatCompactAud(maxAudCents)}`);
    }
    this.audTiers = formatted;
  }

  getTierLabel(index: number): string {
    const tier = BUDGET_TIERS[index];
    if (!tier) return '';
    if (this.code === 'EUR') return tier.labelEur;
    return `${this.audTiers[index]} (${tier.labelEur})`;
  }
}

function formatCompactAud(cents: number): string {
  const dollars = cents / 100;
  const k = dollars / 1000;
  const clean = Number.isInteger(k) ? k.toString() : k.toFixed(1).replace(/\.0$/, '');
  return `A$${clean}k`;
}

export const currencyStore = new CurrencyStore();
