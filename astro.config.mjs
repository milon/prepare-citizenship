// @ts-check
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

const site = 'https://preparecitizenship.ca';
const base = '/';

/* Stamped into the bundle so Settings can show which build is installed. */
const buildId = `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`;

export default defineConfig({
  site,
  base,
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    alpinejs({ entrypoint: './src/alpine.ts' }),
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-CA',
          fr: 'fr-CA',
        },
      },
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-512x512-maskable.png',
      ],
      manifest: {
        name: 'Prepare Citizenship',
        short_name: 'Citizenship',
        description:
          'Study for the Canadian citizenship test with original chapter lessons and a growing question bank.',
        theme_color: '#c8102e',
        background_color: '#c8102e',
        display: 'standalone',
        lang: 'en',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: base,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
        // Only crawlers fetch the social card; keep it out of the offline bundle.
        globIgnores: ['og.png'],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    define: {
      __BUILD_ID__: JSON.stringify(buildId),
    },
  },
});
