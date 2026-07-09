/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fef3c7', // Amber 100
          DEFAULT: '#f59e0b', // Amber 500
          dark: '#b45309', // Amber 700
          accent: '#fbbf24', // Amber 400
        },
        panel: {
          light: '#ffffff',
          dark: '#1e293b', // Slate 800
          bg: '#f8fafc' // Slate 50
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
