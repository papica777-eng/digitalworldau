// Bridge to the compiled Rust -> WebAssembly engine (public/wasm/agency_wasm.wasm)

export interface AgencyWasmExports {
  audit_score_estimate(lcpMs: number, clsMilli: number, seoChecksPassed: number): number;
  convert_eur_cents_to_aud_cents(eurCents: bigint, rateBps: number): bigint;
  roi_projection_cents(monthlyVisitors: number, convBps: number, aovCents: bigint): bigint;
  compute_wave_displacement(xMilli: number, yMilli: number, timeMs: number): number;
  validate_upload_header(
    b0: number,
    b1: number,
    b2: number,
    b3: number,
    b4: number,
    b5: number,
    b6: number,
    b7: number,
    byteSize: number
  ): number;
  compute_inquiry_ref(nameLen: number, emailHash: number, budgetTier: number, salt: number): number;
}

let wasmPromise: Promise<AgencyWasmExports | null> | null = null;

export async function getAgencyWasm(): Promise<AgencyWasmExports | null> {
  if (typeof window === 'undefined') return null;
  if (!wasmPromise) {
    wasmPromise = (async () => {
      try {
        const res = await fetch('/wasm/agency_wasm.wasm');
        if (!res.ok) return null;
        const bytes = await res.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes);
        return instance.exports as unknown as AgencyWasmExports;
      } catch {
        return null;
      }
    })();
  }
  return wasmPromise;
}

export async function estimateAuditScore(lcpMs: number, clsMilli: number, seoPassed: number): Promise<number> {
  const wasm = await getAgencyWasm();
  if (wasm) {
    return wasm.audit_score_estimate(lcpMs, clsMilli, seoPassed);
  }
  const lcpScore = lcpMs <= 1200 ? 40 : lcpMs >= 4500 ? 5 : Math.max(5, 40 - Math.floor(((lcpMs - 1200) * 35) / 3300));
  const clsScore = clsMilli <= 50 ? 25 : clsMilli >= 300 ? 3 : Math.max(3, 25 - Math.floor(((clsMilli - 50) * 22) / 250));
  const seoScore = Math.floor((Math.min(10, seoPassed) * 35) / 10);
  return Math.min(100, lcpScore + clsScore + seoScore);
}

export async function convertEurCentsToAudCents(eurCents: number, rateBps = 16500): Promise<number> {
  const wasm = await getAgencyWasm();
  if (wasm) {
    return Number(wasm.convert_eur_cents_to_aud_cents(BigInt(eurCents), rateBps));
  }
  return Math.floor((eurCents * rateBps + 5000) / 10000);
}

export async function projectMonthlyRoiCents(
  monthlyVisitors: number,
  convBps: number,
  aovCents: number
): Promise<number> {
  const wasm = await getAgencyWasm();
  if (wasm) {
    return Number(wasm.roi_projection_cents(monthlyVisitors, convBps, BigInt(aovCents)));
  }
  return Math.floor((monthlyVisitors * convBps * aovCents + 5000) / 10000);
}

export type UploadKind = 'invalid' | 'pdf' | 'png' | 'jpg' | 'doc';

const CODE_TO_KIND: Record<number, UploadKind> = {
  0: 'invalid',
  1: 'pdf',
  2: 'png',
  3: 'jpg',
  4: 'doc',
};

export async function validateBriefAttachment(file: File): Promise<{ valid: boolean; kind: UploadKind }> {
  const MAX_BYTES = 10_485_760;
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return { valid: false, kind: 'invalid' };
  }
  const buf = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const b = (i: number) => buf[i] ?? 0;

  const wasm = await getAgencyWasm();
  if (wasm) {
    const code = wasm.validate_upload_header(b(0), b(1), b(2), b(3), b(4), b(5), b(6), b(7), file.size);
    const kind = CODE_TO_KIND[code] ?? 'invalid';
    return { valid: code !== 0, kind };
  }

  if (b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46) return { valid: true, kind: 'pdf' };
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { valid: true, kind: 'png' };
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { valid: true, kind: 'jpg' };
  if ((b(0) === 0x50 && b(1) === 0x4b && b(2) === 0x03 && b(3) === 0x04) || (b(0) === 0xd0 && b(1) === 0xcf)) {
    return { valid: true, kind: 'doc' };
  }
  return { valid: false, kind: 'invalid' };
}

export async function generateInquiryRef(name: string, email: string, budgetTier: number): Promise<string> {
  let emailHash = 2166136261;
  for (let i = 0; i < email.length; i++) {
    emailHash ^= email.charCodeAt(i);
    emailHash = Math.imul(emailHash, 16777619) >>> 0;
  }
  const salt = Date.now() & 0xffff;
  const wasm = await getAgencyWasm();
  const code = wasm
    ? wasm.compute_inquiry_ref(name.length, emailHash, budgetTier, salt) >>> 0
    : ((emailHash ^ (name.length << 8) ^ budgetTier ^ salt) >>> 0);
  return `DWA-${code.toString(16).toUpperCase().padStart(8, '0')}`;
}
