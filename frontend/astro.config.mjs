// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bytecore.biz.id',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  markdown: {
    shikiConfig: {
      // compact, no heavy language bundles needed
      theme: 'github-light',
    },
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url.includes('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.6;
        }
        if (item.url.includes('/tools/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['pdfjs-dist', '@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util', 'mammoth', 'xlsx'],
    },
    ssr: {
      external: ['pdf-lib', 'mammoth', 'qrcode', 'xlsx'],
    },
  },
});