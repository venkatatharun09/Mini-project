/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#85a4ff',
          500: '#4f73ff',
          600: '#3b5bdb',
          700: '#2b47b3',
          800: '#1e338a',
          900: '#11205c',
        }
      }
    },
  },
  plugins: [],
}
