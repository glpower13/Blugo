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
        paper: '#F7F7FA', // Apple-Weiß (Haupttext)
        // BARRIEREFREIHEITS-AUDIT 2026-07-25: Beide Töne lagen auf dem wandernden
        // Aurora-Hintergrund unter der Lesbarkeitsschwelle — gemessen an echten
        // gerenderten Pixeln bis hinunter auf 2,27:1 (Soll 4,5:1). Ursache war
        // nicht die Schriftgröße, sondern die Durchsichtigkeit: Auf der
        // Einstellungen-Fläche mit deckendem Grund war keine einzige von 20
        // Textstellen zu schwach. Beide Werte sind deshalb angehoben.
        muted: 'rgba(240,240,248,0.88)', // Sekundär-Label
        faint: 'rgba(240,240,248,0.82)', // Tertiär-Label
        success: '#5FD0A0', // veredeltes Mint — nur für BEWIESEN Stabiles (Wahrheitssignal)
        warn: '#F0B354', // „schwer" (Ampel, sparsam)
        danger: '#F28C7C', // „nochmal" / Fehler (Ampel, sparsam)
      },
      fontFamily: {
        // Zwei Stimmen (src/index.css §Schrift-System): die Serife spricht DEUTSCH
        // (Titel/Überschriften), die Grotesk trägt Bedienung UND das Schwedische.
        display: ['"Fraunces Variable"', 'Georgia', 'Times New Roman', 'serif'],
        sans: [
          '"Manrope Variable"',
          '-apple-system',
          'BlinkMacSystemFont',
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
