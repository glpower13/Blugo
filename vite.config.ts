import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// NEUROLANG — installierbare, offline-fähige PWA (M1-Skelett).
// Technikwahl bei Build-Start per Live-Recherche (siehe docs/05-architecture.md).
//
// base: '/' lokal; auf GitHub Pages läuft die App unter /<repo>/ — der
// Deploy-Workflow reicht BASE_PATH (z. B. "/Blugo/") herein. start_url/scope
// und navigateFallback müssen demselben Pfad folgen, sonst bricht die
// Installation/Offline-Navigation im Unterpfad.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
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
        theme_color: '#06060a',
        background_color: '#06060a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${base}index.html`,
      },
      devOptions: { enabled: true },
    }),
  ],
});
