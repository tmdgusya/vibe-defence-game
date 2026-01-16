/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bright cartoon panel colors
        panel: {
          primary: '#FFF9E6',
          hover: '#FFF4D6',
          active: '#FFEFC6',
          border: '#8B6914',
          accent: '#FFD700',
        },
        overlay: {
          bg: 'rgba(0, 0, 0, 0.5)',
          panel: '#FFFEF0',
        },
        // Dark readable text on light backgrounds
        text: {
          primary: '#2D1B00',
          secondary: '#5C4A26',
          muted: '#8B7355',
          accent: '#FF6B35',
        },
        gold: {
          primary: '#FFD700',
          secondary: '#FFA500',
          glow: 'rgba(255, 215, 0, 0.6)',
        },
        // Interactive with gradients (we'll use inline styles for gradients)
        interactive: {
          primary: {
            DEFAULT: '#3498DB',
            hover: '#5DADE2',
            active: '#2980B9',
            border: '#1F618D',
          },
          success: {
            DEFAULT: '#27AE60',
            hover: '#58D68D',
            active: '#1E8449',
            border: '#1E8449',
          },
          warning: {
            DEFAULT: '#F39C12',
            hover: '#F5B041',
            active: '#D68910',
            border: '#B9770E',
          },
          danger: {
            DEFAULT: '#E74C3C',
            hover: '#EC7063',
            active: '#C0392B',
            border: '#A93226',
          },
          disabled: {
            DEFAULT: '#BDC3C7',
            border: '#95A5A6',
          },
        },
        tower: {
          peashooter: {
            primary: '#7EC850',
            secondary: '#5FA830',
            accent: '#A8E063',
            border: '#4A7C28',
          },
          sunflower: {
            primary: '#FFD93D',
            secondary: '#FFC107',
            accent: '#FFEB3B',
            border: '#F57F17',
          },
          wallnut: {
            primary: '#B8860B',
            secondary: '#8B6914',
            accent: '#DAA520',
            border: '#654321',
          },
          mortar: {
            primary: '#FF6B6B',
            secondary: '#EE5A52',
            accent: '#FF8787',
            border: '#C0392B',
          },
        },
        feedback: {
          success: '#2ECC71',
          error: '#E74C3C',
          warning: '#F39C12',
          info: '#3498DB',
          highlight: '#FFEB3B',
        },
        level: {
          basic: '#95A5A6',
          advanced: '#3498DB',
          elite: '#9B59B6',
        },
      },
      fontFamily: {
        heading: '"Fredoka One", "Comic Sans MS", cursive',
        body: '"Nunito", "Arial Rounded MT Bold", sans-serif',
        mono: '"Press Start 2P", "Courier New", monospace',
      },
      borderRadius: {
        panel: '1.25rem', // Very rounded for cartoon feel
        btn: '999px', // Pill-shaped buttons!
        card: '1rem',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
        panel: '4px',
        btn: '3px',
        card: '3px',
      },
      spacing: {
        panel: '1.5rem',
        'panel-lg': '2rem',
        'btn-x': '1.5rem',
        'btn-y': '1rem',
        card: '1rem',
      },
      transitionDuration: {
        fast: '200ms',
        normal: '350ms',
        slow: '500ms',
      },
      boxShadow: {
        // Cartoon-style shadows with hard edges
        panel: '0 8px 0 rgba(139, 105, 20, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15)',
        button: '0 6px 0 currentColor, 0 8px 12px rgba(0, 0, 0, 0.3)',
        'button-pressed': '0 2px 0 currentColor, 0 3px 6px rgba(0, 0, 0, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 217, 0, 0.8), 0 0 40px rgba(255, 217, 0, 0.4)',
        'glow-success': '0 0 20px rgba(126, 200, 80, 0.6)',
        'glow-danger': '0 0 20px rgba(255, 107, 107, 0.6)',
        'glow-primary': '0 0 20px rgba(52, 152, 219, 0.6)',
        cartoon: '6px 6px 0 rgba(0, 0, 0, 0.2)',
        'cartoon-sm': '4px 4px 0 rgba(0, 0, 0, 0.2)',
        'cartoon-lg': '8px 8px 0 rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-sky': 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
        'gradient-grass': 'linear-gradient(180deg, #7EC850 0%, #5FA830 100%)',
        'gradient-panel': 'linear-gradient(135deg, #FFF9E6 0%, #FFFEF8 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 50%, #C44569 100%)',
      },
    },
  },
  plugins: [],
};
