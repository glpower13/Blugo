import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// NEUROLANG — installierbare, offline-fähige PWA (M1-Skelett).
// Technikwahl bei Build-Start per Live-Recherche (siehe docs/05-architecture.md).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'NEUROLANG',
        short_name: 'NEUROLANG',
        description: 'Sprachlernen, das auf messbaren Erhalt optimiert (Deutsch → Schwedisch).',
        lang: 'de',
        theme_color: '#4f46e5',
        background_color: '#0b1020',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: { enabled: true },
    }),
  ],
});
