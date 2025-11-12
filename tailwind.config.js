/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
  colors: {
    bg: '#0d0f0d',
    card: '#171a17',
    outline: '#303730',
    accent: '#4ade80', // verde-claro
    danger: '#f87171'
  },
      boxShadow: {
        soft: '0 18px 40px rgba(15,23,42,0.55)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
}
