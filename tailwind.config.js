/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './404.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      colors: {
        bgDark: '#020403',
        bgSurface: '#050806',
        neon: '#00FF88',
        neonGlow: '#00FFA3',
        emergency: '#FF3B5C',
        warn: '#FFC857',
        slateText: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'neon': '0 0 30px rgba(0, 255, 136, 0.25)',
        'neon-lg': '0 0 50px rgba(0, 255, 136, 0.35)',
        'emergency': '0 0 30px rgba(255, 59, 92, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
};
