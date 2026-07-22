/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ruhige, fokussierte Palette (siehe docs/04-product.md: "kein Konfetti-Lärm").
        base: '#0b1020',
        surface: '#151b2e',
        brand: '#4f46e5',
      },
    },
  },
  plugins: [],
};
