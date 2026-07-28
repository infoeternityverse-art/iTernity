/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgba(45, 232, 196, 0.10)',
          100: 'rgba(45, 232, 196, 0.16)',
          400: '#2DE8C4',
          500: '#2DE8C4',
          600: '#2DE8C4',
          700: '#0E1310',
        },
        accent: {
          500: '#2DE8C4',
          600: '#2DE8C4',
        },
        surface: {
          page: '#060907',
          DEFAULT: '#0E1310',
          subtle: '#060907',
          elevated: '#121A16',
          dark: '#060907',
        },
      },
      fontFamily: {
        sans: [
          '"ABC Diatype"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        button: '999px',
        field: '14px',
        card: '16px',
        dialog: '24px',
        table: '18px',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(45,232,196,0.18)',
        cyan: '0 0 34px rgba(45,232,196,0.18)',
        soft: '0 16px 46px rgba(0,0,0,0.28)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
