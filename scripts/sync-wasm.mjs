import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const src = resolve('rust-agency-wasm/target/wasm32-unknown-unknown/release/agency_wasm.wasm');
const dest = resolve('public/wasm/agency_wasm.wasm');

if (!existsSync(src)) {
  throw new Error(`Compiled Wasm binary not found at ${src}`);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`Synced Wasm artifact -> ${dest}`);
