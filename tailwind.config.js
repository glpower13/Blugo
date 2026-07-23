/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design-Handschrift (docs/design-handschrift.md): High-End-Glasoberfläche
        // (iPhone-Sperrbildschirm-Anmutung). Flächen sind durchscheinend (weiß-alpha),
        // damit der atmosphärische Hintergrund durch das Milchglas schimmert.
        ink: '#0B0A12', // solides Tiefdunkel — Text AUF hellen/goldenen Flächen
        base: 'rgba(255,255,255,0.04)', // innere Panels (leicht durchscheinend)
        surface: 'rgba(255,255,255,0.06)', // Karten-Fläche (die .glass-Klasse gibt Blur/Kante)
        line: 'rgba(255,255,255,0.12)', // Glaskanten / Ränder
        brand: '#E7C08A', // Champagner-Gold — der eine edle Akzent (glüht auf Glas)
        'brand-soft': 'rgba(231,192,138,0.55)',
        paper: '#F5F5F7', // Apple-Weiß (Haupttext)
        muted: 'rgba(235,235,245,0.62)', // iOS Sekundär-Label
        faint: 'rgba(235,235,245,0.32)', // iOS Tertiär-Label
        success: '#5FD0A0', // veredeltes Mint — nur für BEWIESEN Stabiles (Wahrheitssignal)
        warn: '#F0B354', // „schwer" (Ampel, sparsam)
        danger: '#F28C7C', // „nochmal" / Fehler (Ampel, sparsam)
      },
      fontFamily: {
        // Apple-System-Schrift (SF) — die iPhone-Anmutung; offline-sicher.
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
