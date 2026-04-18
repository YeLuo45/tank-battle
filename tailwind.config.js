/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#1a1a2e',
        'game-light': '#16213e',
        'game-accent': '#e94560',
        'game-green': '#0f3460',
      }
    },
  },
  plugins: [],
}
