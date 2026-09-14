// @ts-check
import alpinejs from '@astrojs/alpinejs';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPagesBuild && repositoryName ? `/${repositoryName}/` : '/';

export default defineConfig({
  site: 'https://milon.github.io',
  base,
  output: 'static',
  integrations: [
    alpinejs({ entrypoint: './src/alpine.ts' }),
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
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
});
