/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noc: {
          bg: '#020617',
          panel: '#0f172a',
          card: '#0f172a',
          card2: '#0e1728',
          line: '#22304a',
          accent: '#3b82f6',
          cyan: '#22d3ee'
        }
      },
      boxShadow: {
        noc: '0 0 0 1px rgba(59,130,246,.08), 0 14px 40px rgba(0,0,0,.28)',
        glow: '0 0 22px rgba(59,130,246,.12)'
      }
    }
  },
  plugins: []
};
