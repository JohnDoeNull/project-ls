/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#69c0e6',
        'btn-yellow': '#ffb83c',
        'grass-green': '#5fb34a',
        'earth-brown': '#9b6b4a',
        'brown-800': '#5d4037',
      }
    },
  },
  plugins: [],
}