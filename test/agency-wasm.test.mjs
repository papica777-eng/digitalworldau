import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const wasmBytes = readFileSync(resolve('public/wasm/agency_wasm.wasm'));
const { instance } = await WebAssembly.instantiate(wasmBytes);
const wasm = instance.exports;

test('audit_score_estimate calculates bounded UX/Tech/SEO scores', () => {
  assert.equal(wasm.audit_score_estimate(1000, 20, 10), 100);
  const mid = wasm.audit_score_estimate(2500, 150, 6);
  assert.ok(mid >= 40 && mid <= 80, `Expected mid score, got ${mid}`);
});

test('convert_eur_cents_to_aud_cents and roi_projection_cents use integer atomic rounding', () => {
  const aud = wasm.convert_eur_cents_to_aud_cents(200_000n, 16_500);
  assert.equal(aud, 330_000n);
  const roi = wasm.roi_projection_cents(40_000, 250, 15_000n);
  assert.equal(roi, 15_000_000n);
});

test('compute_wave_displacement stays bounded in [-1000, 1000]', () => {
  const d = wasm.compute_wave_displacement(420, -280, 1600);
  assert.ok(d >= -1000 && d <= 1000);
});

test('validate_upload_header rejects executables and oversized files', () => {
  assert.equal(wasm.validate_upload_header(0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, 50_000), 1);
  assert.equal(wasm.validate_upload_header(0x4d, 0x5a, 0x90, 0x00, 0, 0, 0, 0, 50_000), 0);
  assert.equal(wasm.validate_upload_header(0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, 11_000_000), 0);
});

test('compute_inquiry_ref returns deterministic non-zero hash', () => {
  const r1 = wasm.compute_inquiry_ref(12, 0x123456, 2, 2026);
  const r2 = wasm.compute_inquiry_ref(12, 0x123456, 2, 2026);
  assert.equal(r1, r2);
  assert.notEqual(r1, 0);
});
