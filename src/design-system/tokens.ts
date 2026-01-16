// ============================================================
// CARTOON GAME DESIGN TOKENS - Plants vs Zombies Inspired
// ============================================================
// Vibrant, playful, and fun! 🌻🌱💥

// ============================================================
// COLOR TOKENS - Bright & Cartoonish
// ============================================================

export const colors = {
  // Background - Sky & Grass Theme
  ui: {
    panel: {
      bg: '#FFF9E6', // Warm cream/paper
      bgHover: '#FFF4D6',
      bgActive: '#FFEFC6',
      border: '#8B6914', // Dark golden brown
      borderAccent: '#FFD700', // Gold accent
    },
    overlay: {
      bg: 'rgba(0, 0, 0, 0.5)',
      panel: '#FFFEF0',
    },
    text: {
      primary: '#2D1B00', // Dark brown, very readable
      secondary: '#5C4A26',
      muted: '#8B7355',
      accent: '#FF6B35', // Bright orange
    },
    gold: {
      primary: '#FFD700',
      secondary: '#FFA500',
      glow: 'rgba(255, 215, 0, 0.6)',
    },
  },

  // Background gradients
  gradients: {
    sky: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
    grass: 'linear-gradient(180deg, #7EC850 0%, #5FA830 100%)',
    sunset: 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 50%, #C44569 100%)',
    panel: 'linear-gradient(135deg, #FFF9E6 0%, #FFFEF8 100%)',
  },

  // Interactive Elements - Bright & Punchy
  interactive: {
    primary: {
      bg: 'linear-gradient(180deg, #5DADE2 0%, #3498DB 100%)',
      bgHover: 'linear-gradient(180deg, #7DC8F0 0%, #5DADE2 100%)',
      bgActive: 'linear-gradient(180deg, #3498DB 0%, #2980B9 100%)',
      border: '#1F618D',
      shadow: '0 6px 0 #1F618D, 0 8px 12px rgba(0,0,0,0.3)',
      text: '#FFFFFF',
    },
    success: {
      bg: 'linear-gradient(180deg, #58D68D 0%, #27AE60 100%)',
      bgHover: 'linear-gradient(180deg, #7DCEA0 0%, #58D68D 100%)',
      bgActive: 'linear-gradient(180deg, #27AE60 0%, #1E8449 100%)',
      border: '#1E8449',
      shadow: '0 6px 0 #1E8449, 0 8px 12px rgba(0,0,0,0.3)',
      text: '#FFFFFF',
    },
    warning: {
      bg: 'linear-gradient(180deg, #F5B041 0%, #F39C12 100%)',
      bgHover: 'linear-gradient(180deg, #F8C471 0%, #F5B041 100%)',
      bgActive: 'linear-gradient(180deg, #F39C12 0%, #D68910 100%)',
      border: '#B9770E',
      shadow: '0 6px 0 #B9770E, 0 8px 12px rgba(0,0,0,0.3)',
      text: '#FFFFFF',
    },
    danger: {
      bg: 'linear-gradient(180deg, #EC7063 0%, #E74C3C 100%)',
      bgHover: 'linear-gradient(180deg, #F1948A 0%, #EC7063 100%)',
      bgActive: 'linear-gradient(180deg, #E74C3C 0%, #C0392B 100%)',
      border: '#A93226',
      shadow: '0 6px 0 #A93226, 0 8px 12px rgba(0,0,0,0.3)',
      text: '#FFFFFF',
    },
    disabled: {
      bg: '#BDC3C7',
      text: '#7F8C8D',
      border: '#95A5A6',
      shadow: '0 4px 0 #95A5A6',
    },
  },

  // Tower-Specific Colors - Super Vibrant!
  tower: {
    peashooter: {
      primary: '#7EC850', // Bright green
      secondary: '#5FA830',
      accent: '#A8E063',
      border: '#4A7C28',
      glow: 'rgba(126, 200, 80, 0.5)',
    },
    sunflower: {
      primary: '#FFD93D', // Bright sunny yellow
      secondary: '#FFC107',
      accent: '#FFEB3B',
      border: '#F57F17',
      glow: 'rgba(255, 217, 61, 0.6)',
    },
    wallnut: {
      primary: '#B8860B', // Rich golden brown
      secondary: '#8B6914',
      accent: '#DAA520',
      border: '#654321',
      glow: 'rgba(184, 134, 11, 0.5)',
    },
    mortar: {
      primary: '#FF6B6B', // Bright red
      secondary: '#EE5A52',
      accent: '#FF8787',
      border: '#C0392B',
      glow: 'rgba(255, 107, 107, 0.5)',
    },
  },

  // Feedback Colors - Eye-catching
  feedback: {
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
    highlight: '#FFEB3B',
  },

  // Level Indicators
  level: {
    basic: '#95A5A6',
    advanced: '#3498DB',
    elite: '#9B59B6',
  },
} as const;

// ============================================================
// TYPOGRAPHY TOKENS - Playful & Bold
// ============================================================

export const typography = {
  fontFamily: {
    heading: '"Fredoka One", "Comic Sans MS", cursive', // Bold cartoon heading
    body: '"Nunito", "Arial Rounded MT Bold", sans-serif', // Friendly rounded
    mono: '"Press Start 2P", "Courier New", monospace', // Retro game
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    '4xl': '2.5rem', // 40px
  },
  fontWeight: {
    normal: '400',
    medium: '600',
    semibold: '700',
    bold: '900', // Extra bold for cartoon effect
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ============================================================
// SPACING TOKENS - Generous & Playful
// ============================================================

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px

  // Semantic spacing - more generous for cartoon feel
  panel: {
    padding: '1.5rem', // Bigger padding
    paddingLarge: '2rem',
    gap: '1.5rem',
    borderRadius: '1.25rem', // Very rounded
    borderWidth: '4px', // Thick cartoon borders
  },
  button: {
    paddingX: '1.5rem',
    paddingY: '1rem',
    gap: '0.75rem',
    borderRadius: '999px', // Pill-shaped buttons!
    borderWidth: '3px',
  },
  card: {
    padding: '1rem',
    gap: '0.75rem',
    borderRadius: '1rem',
    borderWidth: '3px',
  },
} as const;

// ============================================================
// ANIMATION TOKENS - Bouncy & Fun
// ============================================================

export const animation = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 350,
    slow: 500,
    verySlow: 800,
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: { type: 'spring', stiffness: 500, damping: 20 }, // More bounce!
    elastic: { type: 'spring', stiffness: 300, damping: 10 },
  },

  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { type: 'spring', stiffness: 500, damping: 20 },
    },
    buttonHover: {
      scale: 1.05,
      y: -2,
      transition: { type: 'spring', stiffness: 500, damping: 20 },
    },
    buttonTap: {
      scale: 0.95,
      y: 2,
    },
    goldPulse: {
      scale: [1, 1.15, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
    popIn: {
      initial: { scale: 0, rotate: -180 },
      animate: { scale: 1, rotate: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    wiggle: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  },
} as const;

// ============================================================
// SHADOW TOKENS - Deep & Playful
// ============================================================

export const shadows = {
  none: 'none',
  sm: '0 2px 0 rgba(0, 0, 0, 0.2)',
  md: '0 4px 0 rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
  lg: '0 6px 0 rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.2)',
  xl: '0 8px 0 rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.25)',

  // Cartoon-style shadows with hard edges
  cartoon: {
    sm: '4px 4px 0 rgba(0, 0, 0, 0.2)',
    md: '6px 6px 0 rgba(0, 0, 0, 0.2)',
    lg: '8px 8px 0 rgba(0, 0, 0, 0.2)',
  },

  glow: {
    gold: '0 0 20px rgba(255, 217, 0, 0.8), 0 0 40px rgba(255, 217, 0, 0.4)',
    success: '0 0 20px rgba(126, 200, 80, 0.6)',
    danger: '0 0 20px rgba(255, 107, 107, 0.6)',
    primary: '0 0 20px rgba(52, 152, 219, 0.6)',
  },

  panel: '0 8px 0 rgba(139, 105, 20, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15)',
  button: '0 6px 0 currentColor, 0 8px 12px rgba(0, 0, 0, 0.3)',
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

// ============================================================
// TYPE EXPORTS
// ============================================================

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Animation = typeof animation;
export type Shadows = typeof shadows;

export type TowerType = keyof typeof colors.tower;
export type InteractiveVariant = keyof typeof colors.interactive;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTowerColors(type: TowerType) {
  return colors.tower[type] ?? colors.tower.peashooter;
}

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

export function getButtonStyles(variant: InteractiveVariant) {
  const styles = colors.interactive[variant];
  return {
    bg: styles.bg,
    hover: 'bgHover' in styles ? styles.bgHover : styles.bg,
    active: 'bgActive' in styles ? styles.bgActive : styles.bg,
    text: styles.text,
    border: 'border' in styles ? styles.border : undefined,
    shadow: 'shadow' in styles ? styles.shadow : undefined,
  };
}
