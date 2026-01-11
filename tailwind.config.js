/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          primary: '#4a90d9',
          secondary: '#2c3e50',
          accent: '#f39c12',
          success: '#27ae60',
          danger: '#e74c3c',
          dark: '#1a1a2e',
          light: '#eee',
        },
      },
      fontFamily: {
        game: ['Press Start 2P', 'monospace'],
      },
    },
  },
  plugins: [],
};
