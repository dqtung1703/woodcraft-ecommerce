/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fafaf5',
        surface: '#fafaf5',
        'on-surface': '#1a1c19',
        'on-surface-variant': '#4d4635',
        primary: '#735c00',
        'primary-container': '#d4af37',
        'on-primary-container': '#554300',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f4ef',
        'surface-container': '#eeeee9',
        'surface-container-high': '#e8e8e3',
        'surface-container-highest': '#e3e3de',
        'outline-variant': '#d0c5af',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      borderRadius: {
        '20px': '1.25rem',
      },
    },
  },
  plugins: [],
};
