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
        tower: {
          peashooter: {
            primary: '#32CD32',
            secondary: '#228B22',
            accent: '#90EE90',
          },
          sunflower: {
            primary: '#FFD700',
            secondary: '#FFA500',
            accent: '#FFFF00',
          },
          wallnut: {
            primary: '#8B4513',
            secondary: '#654321',
            accent: '#D2691E',
          },
        },
        enemy: {
          basic: {
            primary: '#9ACD32',
            secondary: '#556B2F',
            accent: '#ADFF2F',
          },
          tank: {
            primary: '#696969',
            secondary: '#2F4F4F',
            accent: '#708090',
          },
          flying: {
            primary: '#FF69B4',
            secondary: '#FF1493',
            accent: '#FFB6C1',
          },
          boss: {
            primary: '#8B0000',
            secondary: '#4B0000',
            accent: '#DC143C',
          },
          swarm: {
            primary: '#FF8C00',
            secondary: '#D2691E',
            accent: '#FFA500',
          },
          armored: {
            primary: '#483D8B',
            secondary: '#191970',
            accent: '#6A5ACD',
          },
        },
        ui: {
          bg: {
            primary: '#F0F8FF',
            secondary: '#E6F3FF',
            overlay: 'rgba(0, 0, 0, 0.7)',
          },
          text: {
            primary: '#2C3E50',
            secondary: '#34495E',
            accent: '#FFFFFF',
            muted: '#95A5A6',
          },
          gold: {
            primary: '#FFD700',
            secondary: '#FFA500',
            glow: '#FFFFE0',
          },
          interactive: {
            primary: '#3498DB',
            secondary: '#2980B9',
            success: '#27AE60',
            warning: '#F39C12',
            danger: '#E74C3C',
            disabled: '#BDC3C7',
          },
        },
        feedback: {
          success: '#00FF00',
          error: '#FF0000',
          warning: '#FFA500',
          info: '#00BFFF',
          highlight: '#FFFF00',
        },
      },
      fontFamily: {
        game: ['Press Start 2P', 'monospace'],
      },
      backgroundImage: {
        'game-sky': 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
        'game-grass': 'linear-gradient(to bottom, #90EE90, #228B22)',
        'game-gold': 'linear-gradient(135deg, #FFD700, #FFA500)',
      },
      boxShadow: {
        'game-soft': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'game-medium': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'game-hard': '0 8px 16px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
