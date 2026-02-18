/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hizaki: {
          dark: '#0f172a',
          indigo: '#6366f1',
          slate: '#1e293b',
        }
      },
    },
  },
  plugins: [],
}