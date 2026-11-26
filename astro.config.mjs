import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://digitalworldau.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [svelte()],
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
