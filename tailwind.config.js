/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure this matches your folder structure!
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // These ensure your animations and custom colors work
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}