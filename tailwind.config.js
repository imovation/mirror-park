/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#0a1628',
          panel: 'rgba(0, 0, 0, 0.35)',
          accent: '#4a9eff',
          warning: '#ff6d00',
          success: '#00c853',
          danger: '#ff1744',
        },
      },
    },
  },
  plugins: [],
}
