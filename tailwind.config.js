/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design-Handschrift (docs/design-handschrift.md): warmes Tinten-Dunkel
        // + ein zurückhaltender Messing-Akzent. Bewusst NICHT das generische
        // KI-Indigo — edel durch Ruhe, nicht durch Effekte.
        base: '#16130F', // warmes Tinten-Schwarz (Hintergrund)
        surface: '#201B15', // leicht gehobene, warme Fläche
        line: '#312A22', // Haarlinien / Ränder
        brand: '#C6A15A', // Messing/Gold — der eine Akzent (die Handschrift)
        'brand-soft': '#8C7746', // gedämpftes Messing (Ränder, dezente Akzente)
        paper: '#ECE3D5', // warmes Off-White (Haupttext)
        muted: '#A99D89', // gedämpfter warmer Text (Sekundär)
        faint: '#786E5F', // sehr zurückhaltend (Hinweise/Meta)
        success: '#77B893', // veredeltes Grün — nur für BEWIESEN Stabiles (Wahrheitssignal)
        warn: '#D8A657', // „schwer" (Ampel, sparsam)
        danger: '#C97A6D', // „nochmal" / Fehler (Ampel, sparsam)
      },
      fontFamily: {
        // Editorial-Serif als Markenstimme (Wortmarke, Überschriften),
        // klare humanistische Sans fürs Funktionale. Systemschriften =
        // offline-sicher, kein Fremd-Server (docs/design-handschrift.md).
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        // Weiche, tiefe Ruhe statt harter „Karten"-Schatten.
        lg: '0 18px 40px -24px rgba(0,0,0,0.75)',
      },
    },
  },
  plugins: [],
};
