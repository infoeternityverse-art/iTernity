/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgba(137, 105, 239, 0.10)',
          100: 'rgba(137, 105, 239, 0.16)',
          400: '#8969EF',
          500: '#8969EF',
          600: '#8969EF',
          700: '#17161D',
        },
        accent: {
          500: '#8969EF',
          600: '#8969EF',
        },
        surface: {
          page: '#FBF7F2',
          DEFAULT: '#FFFFFF',
          subtle: '#FBF7F2',
          elevated: '#FFFFFF',
          dark: '#17161D',
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
        glow: '0 18px 60px rgba(137,105,239,0.18)',
        cyan: '0 0 34px rgba(137,105,239,0.18)',
        soft: '0 16px 46px rgba(23,22,29,0.10)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
