# Engineering Specification: Design System Integration

**Author**: Claude Code Senior Planning Team
**Date**: 2026-01-16
**Status**: Draft -> Review -> Approved

---

## 1. Problem Statement

### Background

The Defence Game is a tower defense game built with a dual architecture: **Phaser 3** for the game canvas and **React** for UI overlays. While the game mechanics are functional, the user interface suffers from a critical disconnect:

**Current State Analysis**:

- Components use generic Tailwind classes (`bg-gray-800`, `text-gray-400`, `bg-blue-600`)
- No visual consistency - UI looks like a "game engine" rather than a polished game
- Hardcoded colors scattered across 10+ components
- No animation system for interactive feedback
- Typography uses system fonts (`Segoe UI`) instead of game-appropriate fonts
- Tailwind config has token definitions but they are NOT consistently applied

**Evidence from Codebase**:

```tsx
// Current: Generic gray panels everywhere
<div className="bg-gray-800 p-4 rounded-lg">  // TowerSelectionPanel.tsx
<div className="bg-gray-800 rounded-lg p-4">  // TowerPanel.tsx
<div className="bg-gray-800 rounded-lg p-4">  // WaveProgress.tsx
<div className="bg-gray-800 rounded-lg p-4">  // GameStats.tsx
<header className="bg-gray-800 text-white">   // Header.tsx
<footer className="bg-gray-800 text-white">   // Footer.tsx
```

The `tailwind.config.js` already contains a rich color palette (`ui.interactive`, `tower.*`, `enemy.*`, `feedback.*`) that is **not being utilized**.

### Goals

1. **Primary**: Create and implement a cohesive design system that transforms the UI from "game engine" to "polished game"
2. **Secondary**: Establish TypeScript-first token system with full type safety
3. **Tertiary**: Add Framer Motion animations for interactive feedback
4. **Measurable**: 100% of UI components using semantic design tokens

### Non-Goals

- Game mechanics changes (towers, enemies, economy)
- Backend/server implementation (this is a client-only feature)
- Mobile-first responsive redesign (desktop is primary target)
- Complete visual redesign of game canvas (Phaser graphics)

---

## 2. Solution Design

### High-Level Approach

Transform existing components through a **three-layer architecture**:

```
+-------------------------------------------------------------+
|                    DESIGN TOKEN LAYER                        |
|  src/design-system/tokens.ts (single source of truth)       |
+-------------------------------------------------------------+
|                    INTEGRATION LAYER                         |
|  +-----------+  +-----------+  +----------------+           |
|  |  Tailwind |  |   Phaser  |  |  Framer Motion |           |
|  |  (classes)|  | (hex codes)|  |   (animations) |           |
|  +-----------+  +-----------+  +----------------+           |
+-------------------------------------------------------------+
|                    COMPONENT LAYER                           |
|  React Components: TowerPanel, GameStats, Header, etc.      |
|  Phaser Scenes: GameScene, UI elements                      |
+-------------------------------------------------------------+
```

### Architecture Diagram

```
+-------------------------------------------------------------+
|                         BUILD TIME                           |
+-------------------------------------------------------------+
|                                                              |
|  src/design-system/tokens.ts                                |
|  +-------------------------------------------------------+  |
|  |  export const colors = {                              |  |
|  |    ui: { panel: { bg: '#1E2A3D', ... }, ... },       |  |
|  |    tower: { peashooter: { primary: '#32CD32' }, ... }|  |
|  |  }                                                    |  |
|  |  export const typography = { ... }                    |  |
|  |  export const spacing = { ... }                       |  |
|  |  export const animation = { ... }                     |  |
|  +------------------------+------------------------------+  |
|                           |                                  |
|           +---------------+---------------+                  |
|           v               v               v                  |
|  +----------------+ +------------+ +-----------------+      |
|  | Vite Plugin    | | Direct     | | Type            |      |
|  | (generates     | | Import     | | Definitions     |      |
|  | tailwind.css)  | | (Phaser)   | | (autocomplete)  |      |
|  +----------------+ +------------+ +-----------------+      |
|                                                              |
+-------------------------------------------------------------+
|                         RUNTIME                              |
+-------------------------------------------------------------+
|                                                              |
|  +-------------------------------------------------------+  |
|  |                     GameUI.tsx                        |  |
|  |  +-----------+  +-----------+  +-----------------+   |  |
|  |  |   Header  |  |  Sidebar  |  |   PhaserGame    |   |  |
|  |  | (semantic |  | (TowerPanel|  | (imports hex    |   |  |
|  |  |  classes) |  |  WaveProgress|  from tokens)   |   |  |
|  |  +-----------+  | GameStats) |  +-----------------+   |  |
|  |                 +-----------+                         |  |
|  |                                                       |  |
|  |  +-----------------------------------------------+   |  |
|  |  |                 Overlay Menus                  |   |  |
|  |  |  PauseMenu / GameOverScreen (Framer Motion)   |   |  |
|  |  +-----------------------------------------------+   |  |
|  +-------------------------------------------------------+  |
|                                                              |
+-------------------------------------------------------------+
```

### Key Design Decisions

| Decision             | Choice                      | Rationale                                           | Alternative Considered       | Code Example                                      |
| -------------------- | --------------------------- | --------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| Token Source         | TypeScript module           | Type safety, IDE autocomplete, single source        | JSON files                   | `import { colors } from '@/design-system/tokens'` |
| Tailwind Integration | Vite plugin auto-generation | Build-time validation, no runtime overhead          | PostCSS plugin               | `vite-plugin-design-tokens.ts`                    |
| Animation Library    | Framer Motion               | Declarative API, React integration, gesture support | CSS transitions, GSAP        | `<motion.div animate={{ scale: 1.05 }}>`          |
| Token Granularity    | Semantic tokens only        | Prevents color misuse, enforces consistency         | Primitive + semantic         | `bg-panel-primary` not `bg-blue-900`              |
| Migration Strategy   | Incremental in-place        | Low risk, measurable progress, no feature freeze    | Big bang rewrite             | ESLint rule + gradual replacement                 |
| Phaser Integration   | Mixed semantic config       | Phaser needs hex codes, config provides mapping     | Runtime CSS variable reading | `PhaserConfig.colors.tower.peashooter`            |

---

## 3. API / Interface Design

### Token API Structure

```typescript
// src/design-system/tokens.ts

// ============================================================
// COLOR TOKENS
// ============================================================

export const colors = {
  // UI Panel Colors
  ui: {
    panel: {
      bg: '#1E2A3D', // Dark blue-gray (was gray-800)
      bgHover: '#253448', // Lighter on hover
      bgActive: '#2D4156', // Active state
      border: '#3A5068', // Subtle border
      borderAccent: '#4A90D9', // Accent border
    },
    overlay: {
      bg: 'rgba(10, 15, 25, 0.85)', // Modal backdrop
      panel: '#1A2332', // Modal panel
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A8B8C8',
      muted: '#6B7B8B',
      accent: '#4A90D9',
    },
    gold: {
      primary: '#FFD700',
      secondary: '#FFA500',
      glow: 'rgba(255, 215, 0, 0.3)',
    },
  },

  // Interactive Elements
  interactive: {
    primary: {
      bg: '#3498DB',
      bgHover: '#2980B9',
      bgActive: '#1F6999',
      text: '#FFFFFF',
    },
    success: {
      bg: '#27AE60',
      bgHover: '#219A52',
      bgActive: '#1A7F43',
      text: '#FFFFFF',
    },
    warning: {
      bg: '#F39C12',
      bgHover: '#D68910',
      bgActive: '#B9770E',
      text: '#FFFFFF',
    },
    danger: {
      bg: '#E74C3C',
      bgHover: '#C0392B',
      bgActive: '#A93226',
      text: '#FFFFFF',
    },
    disabled: {
      bg: '#4A5568',
      text: '#718096',
    },
  },

  // Tower-Specific Colors
  tower: {
    peashooter: {
      primary: '#32CD32',
      secondary: '#228B22',
      accent: '#90EE90',
      border: '#32CD32',
    },
    sunflower: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FFFF00',
      border: '#FFD700',
    },
    wallnut: {
      primary: '#8B4513',
      secondary: '#654321',
      accent: '#D2691E',
      border: '#8B4513',
    },
    mortar: {
      primary: '#FF6347',
      secondary: '#DC143C',
      accent: '#FF7F50',
      border: '#FF6347',
    },
  },

  // Feedback Colors
  feedback: {
    success: '#00FF00',
    error: '#FF4444',
    warning: '#FFA500',
    info: '#00BFFF',
    highlight: '#FFFF00',
  },

  // Level Indicators
  level: {
    basic: '#A8B8C8',
    advanced: '#4A90D9',
    elite: '#9B59B6',
  },
} as const;

// ============================================================
// TYPOGRAPHY TOKENS
// ============================================================

export const typography = {
  fontFamily: {
    heading: '"Comic Sans MS", "Comic Sans", cursive', // Playful cartoon feel
    body: 'Arial, Helvetica, sans-serif', // Clean readability
    mono: '"Press Start 2P", monospace', // Retro game numbers
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
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ============================================================
// SPACING TOKENS
// ============================================================

export const spacing = {
  // Base spacing scale (4px increments)
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

  // Semantic spacing
  panel: {
    padding: '1rem', // 16px
    paddingLarge: '1.5rem', // 24px
    gap: '1rem', // 16px between panels
    borderRadius: '0.75rem', // 12px
  },
  button: {
    paddingX: '1rem',
    paddingY: '0.75rem',
    gap: '0.5rem',
    borderRadius: '0.5rem',
  },
  card: {
    padding: '0.75rem',
    gap: '0.75rem',
    borderRadius: '0.5rem',
  },
} as const;

// ============================================================
// ANIMATION TOKENS
// ============================================================

export const animation = {
  // Durations
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: { type: 'spring', stiffness: 400, damping: 30 },
    bounce: { type: 'spring', stiffness: 600, damping: 15 },
  },

  // Preset animations for Framer Motion
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
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.2 },
    },
    buttonHover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
    buttonTap: {
      scale: 0.95,
    },
    goldPulse: {
      animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
      },
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  },
} as const;

// ============================================================
// SHADOW TOKENS
// ============================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
  md: '0 2px 4px rgba(0, 0, 0, 0.25)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.3)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.35)',
  glow: {
    gold: '0 0 10px rgba(255, 215, 0, 0.5)',
    success: '0 0 10px rgba(39, 174, 96, 0.5)',
    danger: '0 0 10px rgba(231, 76, 60, 0.5)',
    primary: '0 0 10px rgba(74, 144, 217, 0.5)',
  },
  panel: '0 4px 12px rgba(0, 0, 0, 0.4)',
  button: '0 2px 4px rgba(0, 0, 0, 0.3)',
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

/**
 * Get tower colors by type with fallback
 */
export function getTowerColors(type: TowerType) {
  return colors.tower[type] ?? colors.tower.peashooter;
}

/**
 * Convert hex to Phaser-compatible integer
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

/**
 * Get semantic button styles for a variant
 */
export function getButtonStyles(variant: InteractiveVariant) {
  const styles = colors.interactive[variant];
  return {
    bg: styles.bg,
    hover: styles.bgHover,
    active: styles.bgActive,
    text: styles.text,
  };
}
```

### Tailwind Class Mapping

```typescript
// src/design-system/tailwind-classes.ts

/**
 * Semantic class names that map to design tokens
 * Use these instead of arbitrary Tailwind classes
 */

export const panelClasses = {
  base: 'bg-panel-primary border border-panel-border rounded-panel p-panel',
  elevated:
    'bg-panel-primary border border-panel-accent rounded-panel p-panel shadow-panel',
  overlay:
    'bg-overlay-panel border border-panel-border rounded-panel p-panel-lg shadow-xl',
} as const;

export const buttonClasses = {
  primary:
    'bg-interactive-primary hover:bg-interactive-primary-hover active:bg-interactive-primary-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  success:
    'bg-interactive-success hover:bg-interactive-success-hover active:bg-interactive-success-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  warning:
    'bg-interactive-warning hover:bg-interactive-warning-hover active:bg-interactive-warning-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  danger:
    'bg-interactive-danger hover:bg-interactive-danger-hover active:bg-interactive-danger-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  ghost:
    'bg-transparent hover:bg-panel-hover text-text-secondary hover:text-text-primary py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  disabled:
    'bg-interactive-disabled text-interactive-disabled-text cursor-not-allowed py-btn-y px-btn-x rounded-btn',
} as const;

export const textClasses = {
  heading: 'font-heading text-text-primary',
  body: 'font-body text-text-secondary',
  accent: 'font-body text-text-accent',
  muted: 'font-body text-text-muted',
  gold: 'font-mono text-gold-primary',
  number: 'font-mono',
} as const;

export const towerButtonClasses = {
  peashooter:
    'bg-panel-primary border-l-4 border-tower-peashooter hover:bg-panel-hover',
  sunflower:
    'bg-panel-primary border-l-4 border-tower-sunflower hover:bg-panel-hover',
  wallnut:
    'bg-panel-primary border-l-4 border-tower-wallnut hover:bg-panel-hover',
  mortar:
    'bg-panel-primary border-l-4 border-tower-mortar hover:bg-panel-hover',
} as const;

export type PanelVariant = keyof typeof panelClasses;
export type ButtonVariant = keyof typeof buttonClasses;
export type TextVariant = keyof typeof textClasses;
export type TowerButtonVariant = keyof typeof towerButtonClasses;
```

### Phaser Configuration

```typescript
// src/design-system/phaser-config.ts

import { colors, hexToNumber } from './tokens';

/**
 * Phaser-specific color configuration
 * Converts semantic tokens to Phaser-compatible formats
 */
export const PhaserColors = {
  // UI Elements
  ui: {
    panelBg: hexToNumber(colors.ui.panel.bg),
    panelBorder: hexToNumber(colors.ui.panel.border),
    textPrimary: hexToNumber(colors.ui.text.primary),
    textSecondary: hexToNumber(colors.ui.text.secondary),
    gold: hexToNumber(colors.ui.gold.primary),
  },

  // Tower Colors (for rendering)
  tower: {
    peashooter: {
      fill: hexToNumber(colors.tower.peashooter.primary),
      stroke: hexToNumber(colors.tower.peashooter.secondary),
      range: hexToNumber(colors.tower.peashooter.accent),
    },
    sunflower: {
      fill: hexToNumber(colors.tower.sunflower.primary),
      stroke: hexToNumber(colors.tower.sunflower.secondary),
      range: hexToNumber(colors.tower.sunflower.accent),
    },
    wallnut: {
      fill: hexToNumber(colors.tower.wallnut.primary),
      stroke: hexToNumber(colors.tower.wallnut.secondary),
      range: hexToNumber(colors.tower.wallnut.accent),
    },
    mortar: {
      fill: hexToNumber(colors.tower.mortar.primary),
      stroke: hexToNumber(colors.tower.mortar.secondary),
      range: hexToNumber(colors.tower.mortar.accent),
    },
  },

  // Feedback Colors
  feedback: {
    success: hexToNumber(colors.feedback.success),
    error: hexToNumber(colors.feedback.error),
    warning: hexToNumber(colors.feedback.warning),
    info: hexToNumber(colors.feedback.info),
    highlight: hexToNumber(colors.feedback.highlight),
  },

  // Level Colors
  level: {
    basic: hexToNumber(colors.level.basic),
    advanced: hexToNumber(colors.level.advanced),
    elite: hexToNumber(colors.level.elite),
  },
} as const;

/**
 * Get tower colors for Phaser rendering
 */
export function getPhaserTowerColors(towerType: string) {
  const type = towerType.toLowerCase() as keyof typeof PhaserColors.tower;
  return PhaserColors.tower[type] ?? PhaserColors.tower.peashooter;
}
```

---

## 4. Data Models

### Token Type Definitions

```typescript
// src/design-system/types.ts

/**
 * Complete type definitions for design system
 * Enables IDE autocomplete and compile-time validation
 */

// Color path types for type-safe token access
export type ColorPath =
  | `ui.panel.${string}`
  | `ui.overlay.${string}`
  | `ui.text.${string}`
  | `ui.gold.${string}`
  | `interactive.${string}.${string}`
  | `tower.${string}.${string}`
  | `feedback.${string}`
  | `level.${string}`;

// Animation preset types
export type AnimationPreset =
  | 'fadeIn'
  | 'slideUp'
  | 'scaleIn'
  | 'buttonHover'
  | 'buttonTap'
  | 'goldPulse';

// Component variant types
export interface PanelProps {
  variant?: 'base' | 'elevated' | 'overlay';
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface TowerButtonProps {
  towerType: 'peashooter' | 'sunflower' | 'wallnut' | 'mortar';
  cost: number;
  name: string;
  description: string;
  icon: string;
  affordable: boolean;
  selected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: 'default' | 'gold' | 'success' | 'danger' | 'info';
}
```

### File Structure

```
src/
├── design-system/
│   ├── tokens.ts              # Single source of truth for all tokens
│   ├── types.ts               # TypeScript type definitions
│   ├── tailwind-classes.ts    # Semantic class name mappings
│   ├── phaser-config.ts       # Phaser-specific color conversions
│   ├── hooks/
│   │   ├── useAnimation.ts    # Animation preset hooks
│   │   └── useTheme.ts        # Theme access hooks
│   └── index.ts               # Barrel export
├── components/
│   ├── design-system/         # New: Primitive components
│   │   ├── Panel.tsx          # Styled panel wrapper
│   │   ├── Button.tsx         # Styled button with variants
│   │   ├── Text.tsx           # Typography component
│   │   ├── StatCard.tsx       # Stats display card
│   │   ├── TowerButton.tsx    # Tower selection button
│   │   └── index.ts           # Barrel export
│   ├── Header.tsx             # Updated to use design system
│   ├── Footer.tsx             # Updated to use design system
│   ├── TowerSelectionPanel.tsx
│   ├── TowerPanel.tsx
│   ├── WaveProgress.tsx
│   ├── GameStats.tsx
│   ├── PauseMenu.tsx
│   ├── GameOverScreen.tsx
│   └── GameUI.tsx
├── plugins/
│   └── vite-plugin-design-tokens.ts  # Tailwind generation plugin
└── index.css                  # Updated with generated tokens
```

---

## 5. User Experience

### Visual Priority Decision

**Choice**: Game canvas is primary focus; UI panels are subtle and supportive.

**Implementation**:

- Panels use semi-transparent dark backgrounds (`rgba` with 85% opacity)
- Panel borders are subtle (1px, muted color)
- Shadows are soft (2-4px blur, low opacity)
- In-game UI minimizes distraction from gameplay

```tsx
// Panel depth hierarchy
const panelStyles = {
  // Base panels (sidebar)
  base: 'bg-[#1E2A3D]/95 border border-[#3A5068]/50 shadow-md',

  // Elevated panels (modals)
  elevated: 'bg-[#1A2332]/98 border border-[#4A90D9]/30 shadow-xl',

  // Overlay panels (game over, pause)
  overlay: 'bg-[#0A0F19]/90 border border-[#4A90D9]/20 shadow-2xl',
};
```

### Button Feedback

**Choice**: Moderate affordance with 1.05x scale and brightness increase on hover.

```tsx
// Button interaction states
<motion.button
  className={buttonClasses.primary}
  whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
  Start Wave
</motion.button>
```

### Information Density

**Choice**: Spacious/airy layout with 16-24px spacing.

```tsx
// Spacing implementation
<div className="p-4 space-y-4">
  {' '}
  {/* 16px padding, 16px gap */}
  <h3 className="mb-4">...</h3> {/* 16px bottom margin */}
  <div className="grid gap-3">...</div> {/* 12px grid gap */}
</div>
```

### Tower Button Design

**Choice**: Accent-based with colored 4px left border indicating tower type.

```tsx
// Tower button example
<button
  className="
  bg-panel-primary
  border-l-4 border-tower-peashooter
  hover:bg-panel-hover
  p-3 rounded-lg
  transition-all duration-150
"
>
  <span className="text-2xl">🌱</span>
  <span className="text-white">Peashooter</span>
  <span className="text-gold-primary">100g</span>
</button>
```

### Typography Hierarchy

**Choice**: Hybrid approach with distinct fonts for different purposes.

| Element       | Font           | Size     | Weight | Example                |
| ------------- | -------------- | -------- | ------ | ---------------------- |
| Game Title    | Comic Sans MS  | 2rem     | Bold   | "Defence Game"         |
| Panel Headers | Comic Sans MS  | 1.125rem | Bold   | "Tower Info"           |
| Body Text     | Arial          | 0.875rem | Normal | "Click to select..."   |
| Numbers/Stats | Press Start 2P | 1.5rem   | Bold   | "1250"                 |
| Gold Amount   | Press Start 2P | 1rem     | Bold   | "100g"                 |
| Hints/Muted   | Arial          | 0.75rem  | Normal | "Press SPACE to start" |

### User Workflows

#### Tower Selection Flow

```
1. User sees TowerSelectionPanel with tower options
   - Each tower shows: icon, name, cost (colored by affordability)

2. User hovers over tower button
   - Button scales to 1.05x, background lightens
   - Cursor changes to pointer

3. User clicks tower OR drags tower
   - If click: Tower becomes selected (ring highlight)
   - If drag: Tower follows cursor, grid highlights valid cells

4. User clicks on game grid OR drops tower
   - If affordable: Tower placed, gold deducted, satisfying animation
   - If not affordable: Error message appears (red, 2s duration)
   - If invalid position: Error message appears

5. Gold display animates if amount changed
   - Gold text pulses briefly (scale 1.1x, 300ms)
```

#### Wave Start Flow

```
1. User sees WaveProgress panel with "Start Wave N" button
   - Button is green when wave can start
   - Button shows wave number and hint text

2. User hovers over Start button
   - Button brightens, subtle glow appears

3. User clicks button OR presses SPACE
   - Button disabled, changes to "Wave N in Progress..."
   - Progress bar begins animating

4. Wave completes
   - Button re-enables with next wave number
   - Score updates with animation
```

### Error States

| Scenario            | Message                 | Duration | Style                               |
| ------------------- | ----------------------- | -------- | ----------------------------------- |
| Cannot afford tower | "Not enough gold!"      | 2000ms   | Red bg, white text, shake animation |
| Invalid placement   | "Cannot place here"     | 2000ms   | Red bg, white text                  |
| Tower at max level  | "Maximum level reached" | 1500ms   | Amber bg, white text                |
| Wave already active | (button disabled)       | -        | Grayed out button                   |

### Accessibility Requirements

| Requirement                 | Target                         | Implementation                             |
| --------------------------- | ------------------------------ | ------------------------------------------ |
| Color contrast (body text)  | 4.5:1 (WCAG AA)                | `#A8B8C8` on `#1E2A3D` = 5.2:1             |
| Color contrast (large text) | 3:1 (WCAG AA)                  | `#FFFFFF` on `#3498DB` = 4.8:1             |
| Color contrast (critical)   | 7:1 (WCAG AAA)                 | Gold `#FFD700` with shadow on dark = 8.1:1 |
| Focus indicators            | Visible focus ring             | `focus:ring-2 focus:ring-accent`           |
| Touch targets               | 44x44px minimum                | Buttons min-height: 44px                   |
| Motion                      | Respect prefers-reduced-motion | Check media query, disable springs         |
| Screen reader               | ARIA labels                    | `aria-label` on icon-only buttons          |

---

## 6. Technical Implementation

### Technology Stack

| Library       | Version | Purpose          | Alternative Considered         | Why Chosen                                        |
| ------------- | ------- | ---------------- | ------------------------------ | ------------------------------------------------- |
| Framer Motion | ^11.0.0 | React animations | GSAP, CSS transitions          | React-native API, gesture support, smaller bundle |
| Tailwind CSS  | ^3.4.17 | Utility styling  | Styled Components, CSS Modules | Already in use, excellent DX                      |
| TypeScript    | ^5.7.3  | Type safety      | JavaScript                     | Project already uses TS                           |
| Vite          | ^6.0.7  | Build tool       | Webpack                        | Already in use, fast HMR                          |
| Zustand       | ^5.0.3  | State management | Redux, Context                 | Already in use                                    |

### Vite Plugin for Token Generation

```typescript
// src/plugins/vite-plugin-design-tokens.ts

import type { Plugin } from 'vite';
import { colors, typography, shadows } from '../design-system/tokens';

/**
 * Vite plugin that generates Tailwind-compatible CSS variables
 * from design system tokens at build time
 */
export function designTokensPlugin(): Plugin {
  return {
    name: 'vite-plugin-design-tokens',

    // Generate CSS before build
    buildStart() {
      this.emitFile({
        type: 'asset',
        fileName: 'design-tokens.css',
        source: generateTokenCSS(),
      });
    },

    // HMR support
    handleHotUpdate({ file, server }) {
      if (file.includes('design-system/tokens')) {
        // Invalidate and regenerate
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

function generateTokenCSS(): string {
  return `
/* Auto-generated from design-system/tokens.ts */
/* DO NOT EDIT DIRECTLY */

:root {
  /* Panel Colors */
  --color-panel-primary: ${colors.ui.panel.bg};
  --color-panel-hover: ${colors.ui.panel.bgHover};
  --color-panel-active: ${colors.ui.panel.bgActive};
  --color-panel-border: ${colors.ui.panel.border};
  --color-panel-accent: ${colors.ui.panel.borderAccent};

  /* Text Colors */
  --color-text-primary: ${colors.ui.text.primary};
  --color-text-secondary: ${colors.ui.text.secondary};
  --color-text-muted: ${colors.ui.text.muted};
  --color-text-accent: ${colors.ui.text.accent};

  /* Gold Colors */
  --color-gold-primary: ${colors.ui.gold.primary};
  --color-gold-secondary: ${colors.ui.gold.secondary};

  /* Interactive Colors */
  --color-interactive-primary: ${colors.interactive.primary.bg};
  --color-interactive-primary-hover: ${colors.interactive.primary.bgHover};
  --color-interactive-success: ${colors.interactive.success.bg};
  --color-interactive-success-hover: ${colors.interactive.success.bgHover};
  --color-interactive-warning: ${colors.interactive.warning.bg};
  --color-interactive-warning-hover: ${colors.interactive.warning.bgHover};
  --color-interactive-danger: ${colors.interactive.danger.bg};
  --color-interactive-danger-hover: ${colors.interactive.danger.bgHover};

  /* Tower Colors */
  --color-tower-peashooter: ${colors.tower.peashooter.border};
  --color-tower-sunflower: ${colors.tower.sunflower.border};
  --color-tower-wallnut: ${colors.tower.wallnut.border};
  --color-tower-mortar: ${colors.tower.mortar.border};

  /* Typography */
  --font-heading: ${typography.fontFamily.heading};
  --font-body: ${typography.fontFamily.body};
  --font-mono: ${typography.fontFamily.mono};

  /* Shadows */
  --shadow-panel: ${shadows.panel};
  --shadow-button: ${shadows.button};
  --shadow-glow-gold: ${shadows.glow.gold};
}
`;
}
```

### Updated Tailwind Configuration

```javascript
// tailwind.config.js (updated)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Panel colors
        panel: {
          primary: 'var(--color-panel-primary)',
          hover: 'var(--color-panel-hover)',
          active: 'var(--color-panel-active)',
          border: 'var(--color-panel-border)',
          accent: 'var(--color-panel-accent)',
        },
        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-text-accent)',
        },
        // Gold colors
        gold: {
          primary: 'var(--color-gold-primary)',
          secondary: 'var(--color-gold-secondary)',
        },
        // Interactive colors
        interactive: {
          primary: {
            DEFAULT: 'var(--color-interactive-primary)',
            hover: 'var(--color-interactive-primary-hover)',
          },
          success: {
            DEFAULT: 'var(--color-interactive-success)',
            hover: 'var(--color-interactive-success-hover)',
          },
          warning: {
            DEFAULT: 'var(--color-interactive-warning)',
            hover: 'var(--color-interactive-warning-hover)',
          },
          danger: {
            DEFAULT: 'var(--color-interactive-danger)',
            hover: 'var(--color-interactive-danger-hover)',
          },
        },
        // Tower accent colors
        tower: {
          peashooter: 'var(--color-tower-peashooter)',
          sunflower: 'var(--color-tower-sunflower)',
          wallnut: 'var(--color-tower-wallnut)',
          mortar: 'var(--color-tower-mortar)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        button: 'var(--shadow-button)',
        'glow-gold': 'var(--shadow-glow-gold)',
      },
      borderRadius: {
        panel: '0.75rem',
        btn: '0.5rem',
        card: '0.5rem',
      },
      spacing: {
        panel: '1rem',
        'panel-lg': '1.5rem',
        'btn-x': '1rem',
        'btn-y': '0.75rem',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
```

### Component Migration Examples

#### Before: TowerSelectionPanel (Current)

```tsx
// Current implementation with generic classes
<div className="bg-gray-800 p-4 rounded-lg w-48 flex flex-col">
  <h3 className="text-white font-bold">Towers</h3>
  <button className={`
    p-3 rounded-lg transition-all
    ${isSelected ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700'}
    ${!affordable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}
  `}>
```

#### After: TowerSelectionPanel (Migrated)

```tsx
// Migrated implementation with design system
import { motion } from 'framer-motion';
import { Panel } from '@/components/design-system/Panel';
import { TowerButton } from '@/components/design-system/TowerButton';
import { animation } from '@/design-system/tokens';

<Panel variant="base" className="w-48">
  <h3 className="font-heading text-text-primary font-bold">Towers</h3>
  <motion.div className="flex flex-col space-y-2">
    {TOWER_OPTIONS.map((tower) => (
      <TowerButton
        key={tower.type}
        towerType={tower.type}
        name={tower.name}
        cost={tower.cost}
        icon={tower.icon}
        affordable={gold >= tower.cost}
        selected={selectedTowerType === tower.type}
        onSelect={() => handleSelectTower(tower.type)}
      />
    ))}
  </motion.div>
</Panel>;
```

#### Reusable Component: Panel

```tsx
// src/components/design-system/Panel.tsx

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { animation } from '@/design-system/tokens';

interface PanelProps extends HTMLMotionProps<'div'> {
  variant?: 'base' | 'elevated' | 'overlay';
  children: React.ReactNode;
}

const variantClasses = {
  base: 'bg-panel-primary/95 border border-panel-border/50 rounded-panel p-panel shadow-md',
  elevated:
    'bg-panel-primary border border-panel-accent/30 rounded-panel p-panel shadow-panel',
  overlay:
    'bg-panel-primary/98 border border-panel-accent/20 rounded-panel p-panel-lg shadow-xl',
};

export const Panel: React.FC<PanelProps> = ({
  variant = 'base',
  children,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animation.duration.normal / 1000 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
```

#### Reusable Component: Button

```tsx
// src/components/design-system/Button.tsx

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { animation } from '@/design-system/tokens';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary:
    'bg-interactive-primary hover:bg-interactive-primary-hover text-white',
  success:
    'bg-interactive-success hover:bg-interactive-success-hover text-white',
  warning:
    'bg-interactive-warning hover:bg-interactive-warning-hover text-white',
  danger: 'bg-interactive-danger hover:bg-interactive-danger-hover text-white',
  ghost:
    'bg-transparent hover:bg-panel-hover text-text-secondary hover:text-text-primary',
};

const sizeClasses = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-btn-y px-btn-x text-base',
  lg: 'py-4 px-6 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className = '',
  onClick,
  ...motionProps
}) => {
  return (
    <motion.button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium rounded-btn
        transition-colors duration-fast
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : animation.presets.buttonHover}
      whileTap={disabled ? {} : animation.presets.buttonTap}
      disabled={disabled}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};
```

#### Reusable Component: TowerButton

```tsx
// src/components/design-system/TowerButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { TowerType } from '@/types';
import { animation, colors } from '@/design-system/tokens';

interface TowerButtonProps {
  towerType: TowerType;
  name: string;
  cost: number;
  icon: string;
  description?: string;
  affordable: boolean;
  selected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

const towerTypeToKey: Record<TowerType, keyof typeof colors.tower> = {
  [TowerType.PEASHOOTER]: 'peashooter',
  [TowerType.SUNFLOWER]: 'sunflower',
  [TowerType.WALLNUT]: 'wallnut',
  [TowerType.MORTAR]: 'mortar',
};

export const TowerButton: React.FC<TowerButtonProps> = ({
  towerType,
  name,
  cost,
  icon,
  description,
  affordable,
  selected,
  onSelect,
  onDragStart,
  onDragEnd,
}) => {
  const colorKey = towerTypeToKey[towerType];

  return (
    <motion.button
      onClick={onSelect}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={affordable}
      disabled={!affordable}
      className={`
        p-3 rounded-lg transition-all flex items-center gap-3
        bg-panel-primary border-l-4
        ${selected ? 'ring-2 ring-text-accent bg-panel-active' : ''}
        ${!affordable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-panel-hover cursor-pointer'}
      `}
      style={{
        borderLeftColor: colors.tower[colorKey].border,
      }}
      whileHover={affordable ? { scale: 1.02 } : {}}
      whileTap={affordable ? { scale: 0.98 } : {}}
      title={description}
      aria-label={`${name} tower, costs ${cost} gold${!affordable ? ', not affordable' : ''}`}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <div className="flex flex-col items-start">
        <span className="text-text-primary text-sm font-medium">{name}</span>
        <span
          className={`font-mono text-sm ${affordable ? 'text-gold-primary' : 'text-interactive-danger'}`}
        >
          {cost}g
        </span>
      </div>
    </motion.button>
  );
};
```

---

## 7. Security and Compliance

### Risk Assessment

**Overall Risk Level**: Low (UI-only changes, no backend modifications)

### Security Controls

| Control             | Implementation                        | Status     |
| ------------------- | ------------------------------------- | ---------- |
| XSS Prevention      | React auto-escaping by default        | Maintained |
| Safe HTML Rendering | Avoid unsafe HTML injection patterns  | Enforced   |
| CSP Compatibility   | Build-time token generation (no eval) | Compatible |
| Dependency Audit    | npm audit for Framer Motion           | Required   |
| Input Sanitization  | N/A (no user input changes)           | N/A        |

### Security Recommendations

1. **Maintain React's Safe Rendering**:
   - Always use React's JSX syntax for rendering user-provided content
   - React automatically escapes strings, preventing XSS attacks
   - Never bypass React's escaping mechanisms with raw HTML injection

2. **Audit Framer Motion**:

   ```bash
   # Before adding dependency
   npm audit

   # Check for known vulnerabilities
   npx audit-ci --moderate
   ```

3. **No Inline Styles from User Data**:

   ```tsx
   // GOOD: Static styles from tokens
   style={{ borderLeftColor: colors.tower[type].border }}

   // BAD: Dynamic styles from untrusted user input
   // style={{ color: userProvidedColor }}
   ```

### Content Security Policy

No changes required. Build-time generation means:

- No dynamic code evaluation
- No inline scripts
- CSS variables are static at build time

---

## 8. Performance and Scalability

### Performance SLOs

| Metric                 | Target                     | Measurement Method                  |
| ---------------------- | -------------------------- | ----------------------------------- |
| Frame Rate             | 60 FPS (16.67ms per frame) | Phaser FPS counter, Chrome DevTools |
| Initial Load           | < 3 seconds on 3G          | Lighthouse, WebPageTest             |
| Time to Interactive    | < 2 seconds                | Lighthouse TTI metric               |
| Animation Frame Budget | < 8ms for UI animations    | Performance.now() sampling          |
| Bundle Size Increase   | < 52KB gzipped             | Vite bundle analyzer                |

### Bundle Size Budget

| Addition                      | Estimated Size | Justification              |
| ----------------------------- | -------------- | -------------------------- |
| Framer Motion                 | ~15KB gzipped  | Essential for animations   |
| Design tokens                 | ~5KB           | Necessary for theming      |
| Google Fonts (Press Start 2P) | ~12KB          | Retro game aesthetic       |
| New component code            | ~20KB          | Reusable components        |
| **Total**                     | **~52KB**      | Acceptable for improved UX |

### Animation Performance Strategy

1. **Concurrent Animation Limit**: Maximum 3 Framer Motion components animating simultaneously

2. **Gold Counter Debouncing**:

   ```typescript
   // Debounce gold animations to prevent jank
   const debouncedGoldUpdate = useMemo(
     () =>
       debounce((newGold: number) => {
         setDisplayGold(newGold);
       }, 100),
     []
   );
   ```

3. **FPS-Based Quality Reduction**:

   ```typescript
   // Reduce animation quality if FPS drops
   const { fps } = useGameStore();
   const animationQuality = fps < 50 ? 'reduced' : 'full';

   // In components
   <motion.div
     animate={animationQuality === 'full' ? fullAnimation : reducedAnimation}
   />
   ```

4. **Prefers-Reduced-Motion Support**:

   ```typescript
   // src/design-system/hooks/useAnimation.ts
   import { useReducedMotion } from 'framer-motion';

   export function useAnimationPreset(preset: AnimationPreset) {
     const shouldReduceMotion = useReducedMotion();

     if (shouldReduceMotion) {
       return {
         initial: {},
         animate: {},
         exit: {},
         transition: { duration: 0 },
       };
     }

     return animation.presets[preset];
   }
   ```

### Caching Strategy

| Resource      | Cache Location | TTL    | Invalidation             |
| ------------- | -------------- | ------ | ------------------------ |
| Google Fonts  | Browser cache  | 1 year | Versioned URL            |
| CSS bundle    | Browser cache  | 1 year | Content hash in filename |
| JS bundle     | Browser cache  | 1 year | Content hash in filename |
| Design tokens | Compile-time   | N/A    | Rebuild on change        |

### Database/State Optimization

No database changes. For Zustand state:

```typescript
// Optimize re-renders with selectors
const gold = useGameStore((state) => state.gold);

// Use shallow comparison for multiple values
const { gold, score } = useGameStore(
  useShallow((state) => ({
    gold: state.gold,
    score: state.score,
  }))
);
```

---

## 9. Test Specification

### TDD Workflow

```
RED Phase:    Write failing test that defines expected behavior
GREEN Phase:  Write minimal code to make test pass
REFACTOR:     Clean up code while keeping tests green
```

### Test Categories and Coverage Targets

| Category            | Coverage Target | Tools                    |
| ------------------- | --------------- | ------------------------ |
| Design Tokens       | 95%             | Vitest                   |
| Component Rendering | 85%             | Vitest + Testing Library |
| Animation Behavior  | 70%             | Vitest + mock timers     |
| Accessibility       | 100% automated  | jest-axe                 |
| Visual Regression   | Manual review   | Storybook (future)       |

### Test Specifications

#### Test Suite 1: Design Tokens

```typescript
// src/design-system/__tests__/tokens.test.ts

import { describe, it, expect } from 'vitest';
import {
  colors,
  typography,
  spacing,
  animation,
  hexToNumber,
  getTowerColors,
} from '../tokens';

describe('Design Tokens', () => {
  describe('Color Tokens', () => {
    it('should have all required UI panel colors', () => {
      expect(colors.ui.panel).toHaveProperty('bg');
      expect(colors.ui.panel).toHaveProperty('bgHover');
      expect(colors.ui.panel).toHaveProperty('border');
    });

    it('should have valid hex color format for all colors', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;

      expect(colors.ui.panel.bg).toMatch(hexRegex);
      expect(colors.ui.text.primary).toMatch(hexRegex);
      expect(colors.tower.peashooter.primary).toMatch(hexRegex);
    });

    it('should have colors for all tower types', () => {
      const towerTypes = ['peashooter', 'sunflower', 'wallnut', 'mortar'];

      towerTypes.forEach((type) => {
        expect(colors.tower[type as keyof typeof colors.tower]).toBeDefined();
        expect(
          colors.tower[type as keyof typeof colors.tower].primary
        ).toBeDefined();
        expect(
          colors.tower[type as keyof typeof colors.tower].border
        ).toBeDefined();
      });
    });

    it('should have accessible contrast ratios', () => {
      function getContrastRatio(hex1: string, hex2: string): number {
        const getLuminance = (hex: string) => {
          const rgb = parseInt(hex.slice(1), 16);
          const r = (rgb >> 16) & 0xff;
          const g = (rgb >> 8) & 0xff;
          const b = rgb & 0xff;
          const [rs, gs, bs] = [r, g, b].map((c) => {
            c /= 255;
            return c <= 0.03928
              ? c / 12.92
              : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const l1 = getLuminance(hex1);
        const l2 = getLuminance(hex2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      // Body text on panel background should be >= 4.5:1
      const textOnPanel = getContrastRatio(
        colors.ui.text.secondary,
        colors.ui.panel.bg
      );
      expect(textOnPanel).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('hexToNumber', () => {
    it('should convert hex string to number', () => {
      expect(hexToNumber('#FF0000')).toBe(0xff0000);
      expect(hexToNumber('#00FF00')).toBe(0x00ff00);
      expect(hexToNumber('#0000FF')).toBe(0x0000ff);
    });

    it('should handle lowercase hex', () => {
      expect(hexToNumber('#ff0000')).toBe(0xff0000);
    });
  });

  describe('getTowerColors', () => {
    it('should return correct colors for valid tower type', () => {
      const peashooterColors = getTowerColors('peashooter');
      expect(peashooterColors.primary).toBe(colors.tower.peashooter.primary);
    });

    it('should return fallback for invalid tower type', () => {
      // @ts-expect-error Testing invalid input
      const unknownColors = getTowerColors('unknown');
      expect(unknownColors).toEqual(colors.tower.peashooter);
    });
  });
});

describe('Typography Tokens', () => {
  it('should have all required font families', () => {
    expect(typography.fontFamily.heading).toBeDefined();
    expect(typography.fontFamily.body).toBeDefined();
    expect(typography.fontFamily.mono).toBeDefined();
  });

  it('should have valid rem-based font sizes', () => {
    const remRegex = /^\d+(\.\d+)?rem$/;

    Object.values(typography.fontSize).forEach((size) => {
      expect(size).toMatch(remRegex);
    });
  });
});

describe('Animation Tokens', () => {
  it('should have duration values in milliseconds', () => {
    expect(animation.duration.fast).toBe(150);
    expect(animation.duration.normal).toBe(300);
  });

  it('should have valid preset animations', () => {
    expect(animation.presets.fadeIn).toHaveProperty('initial');
    expect(animation.presets.fadeIn).toHaveProperty('animate');
    expect(animation.presets.buttonHover).toHaveProperty('scale');
  });
});
```

#### Test Suite 2: Panel Component

```typescript
// src/components/design-system/__tests__/Panel.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Panel } from '../Panel';

expect.extend(toHaveNoViolations);

describe('Panel Component', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(<Panel>Test Content</Panel>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply base variant classes by default', () => {
      const { container } = render(<Panel>Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('bg-panel-primary');
      expect(panel.className).toContain('border');
      expect(panel.className).toContain('rounded-panel');
    });

    it('should apply elevated variant classes', () => {
      const { container } = render(<Panel variant="elevated">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('shadow-panel');
    });

    it('should apply overlay variant classes', () => {
      const { container } = render(<Panel variant="overlay">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('shadow-xl');
      expect(panel.className).toContain('p-panel-lg');
    });

    it('should merge custom className', () => {
      const { container } = render(<Panel className="custom-class">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('custom-class');
      expect(panel.className).toContain('bg-panel-primary');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Panel>
          <h2>Panel Title</h2>
          <p>Panel content</p>
        </Panel>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

#### Test Suite 3: Button Component

```typescript
// src/components/design-system/__tests__/Button.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should apply primary variant by default', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-primary');
    });

    it('should apply success variant classes', () => {
      const { container } = render(<Button variant="success">Success</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-success');
    });

    it('should apply danger variant classes', () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-danger');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });

    it('should apply large size classes', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('py-4');
      expect(button.className).toContain('text-lg');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled styles', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be focusable', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
    });
  });
});
```

#### Test Suite 4: TowerButton Component

```typescript
// src/components/design-system/__tests__/TowerButton.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TowerButton } from '../TowerButton';
import { TowerType } from '@/types';

expect.extend(toHaveNoViolations);

describe('TowerButton Component', () => {
  const defaultProps = {
    towerType: TowerType.PEASHOOTER,
    name: 'Peashooter',
    cost: 100,
    icon: '🌱',
    description: 'Shoots peas',
    affordable: true,
    selected: false,
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render tower name and cost', () => {
      render(<TowerButton {...defaultProps} />);

      expect(screen.getByText('Peashooter')).toBeInTheDocument();
      expect(screen.getByText('100g')).toBeInTheDocument();
    });

    it('should render tower icon', () => {
      render(<TowerButton {...defaultProps} />);
      expect(screen.getByText('🌱')).toBeInTheDocument();
    });

    it('should apply tower-specific border color', () => {
      const { container } = render(<TowerButton {...defaultProps} />);
      const button = container.firstChild as HTMLElement;

      expect(button.style.borderLeftColor).toBe('rgb(50, 205, 50)'); // #32CD32
    });
  });

  describe('Affordability', () => {
    it('should show gold color when affordable', () => {
      render(<TowerButton {...defaultProps} affordable={true} />);
      const costText = screen.getByText('100g');

      expect(costText.className).toContain('text-gold-primary');
    });

    it('should show danger color when not affordable', () => {
      render(<TowerButton {...defaultProps} affordable={false} />);
      const costText = screen.getByText('100g');

      expect(costText.className).toContain('text-interactive-danger');
    });

    it('should be disabled when not affordable', () => {
      const { container } = render(<TowerButton {...defaultProps} affordable={false} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button).toBeDisabled();
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('should not be draggable when not affordable', () => {
      const { container } = render(<TowerButton {...defaultProps} affordable={false} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.draggable).toBe(false);
    });
  });

  describe('Selection', () => {
    it('should show selected state', () => {
      const { container } = render(<TowerButton {...defaultProps} selected={true} />);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('ring-2');
      expect(button.className).toContain('bg-panel-active');
    });

    it('should call onSelect when clicked', () => {
      const onSelect = vi.fn();
      render(<TowerButton {...defaultProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Drag and Drop', () => {
    it('should be draggable when affordable', () => {
      const { container } = render(<TowerButton {...defaultProps} affordable={true} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.draggable).toBe(true);
    });

    it('should call onDragStart when dragging starts', () => {
      const onDragStart = vi.fn();
      const { container } = render(
        <TowerButton {...defaultProps} onDragStart={onDragStart} />
      );

      fireEvent.dragStart(container.firstChild as HTMLElement);
      expect(onDragStart).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<TowerButton {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have descriptive aria-label', () => {
      render(<TowerButton {...defaultProps} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Peashooter tower')
      );
      expect(button).toHaveAttribute(
        'aria-label',
        expect.stringContaining('100 gold')
      );
    });

    it('should indicate not affordable in aria-label', () => {
      render(<TowerButton {...defaultProps} affordable={false} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute(
        'aria-label',
        expect.stringContaining('not affordable')
      );
    });
  });
});
```

#### Test Suite 5: Animation Hooks

```typescript
// src/design-system/hooks/__tests__/useAnimation.test.ts

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnimationPreset } from '../useAnimation';

// Mock framer-motion's useReducedMotion
vi.mock('framer-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe('useAnimationPreset', () => {
  it('should return full animation when motion is not reduced', () => {
    const { result } = renderHook(() => useAnimationPreset('fadeIn'));

    expect(result.current.initial).toEqual({ opacity: 0 });
    expect(result.current.animate).toEqual({ opacity: 1 });
  });

  it('should return empty animation when motion is reduced', async () => {
    const { useReducedMotion } = await import('framer-motion');
    (useReducedMotion as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true
    );

    const { result } = renderHook(() => useAnimationPreset('fadeIn'));

    expect(result.current.initial).toEqual({});
    expect(result.current.animate).toEqual({});
    expect(result.current.transition.duration).toBe(0);
  });
});
```

### Test Execution

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- tokens.test.ts

# Run in watch mode
npm run test -- --watch
```

---

## 10. Integration and Deployment

### Dependencies

| Dependency                 | Version | Purpose    | Failure Strategy            |
| -------------------------- | ------- | ---------- | --------------------------- |
| framer-motion              | ^11.0.0 | Animations | Graceful degradation to CSS |
| @fontsource/press-start-2p | ^5.0.0  | Retro font | System fallback (monospace) |

### Installation Steps

```bash
# 1. Install new dependencies
npm install framer-motion @fontsource/press-start-2p

# 2. Verify no vulnerabilities
npm audit

# 3. Add font import to main.tsx
# import '@fontsource/press-start-2p';
```

### Deployment Steps

```bash
# 1. Create design system directory structure
mkdir -p src/design-system/hooks
mkdir -p src/components/design-system
mkdir -p src/plugins

# 2. Create token files
touch src/design-system/tokens.ts
touch src/design-system/types.ts
touch src/design-system/tailwind-classes.ts
touch src/design-system/phaser-config.ts
touch src/design-system/index.ts

# 3. Create component files
touch src/components/design-system/Panel.tsx
touch src/components/design-system/Button.tsx
touch src/components/design-system/TowerButton.tsx
touch src/components/design-system/Text.tsx
touch src/components/design-system/StatCard.tsx
touch src/components/design-system/index.ts

# 4. Create hooks
touch src/design-system/hooks/useAnimation.ts

# 5. Create Vite plugin
touch src/plugins/vite-plugin-design-tokens.ts

# 6. Run tests
npm run test

# 7. Build and verify
npm run build

# 8. Check bundle size
npm run build:analyze
```

### Environment Configuration

| Setting           | Development | Staging | Production |
| ----------------- | ----------- | ------- | ---------- |
| Animation Quality | Full        | Full    | Adaptive   |
| Source Maps       | Yes         | Yes     | No         |
| Bundle Analysis   | Manual      | CI      | No         |
| Debug Overlays    | Yes         | No      | No         |

### Migration Lint Rule

```javascript
// .eslintrc.cjs addition

module.exports = {
  rules: {
    // Warn on generic Tailwind color classes
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          'JSXAttribute[name.name="className"][value.value=/bg-gray-|text-gray-|bg-blue-|bg-green-/]',
        message:
          'Use design system tokens instead of generic Tailwind colors. See src/design-system/tailwind-classes.ts',
      },
    ],
  },
};
```

---

## 11. Trade-offs and Alternatives

### Major Trade-off Decisions

| Decision          | Chosen Option | Alternative          | Why Chosen                                    |
| ----------------- | ------------- | -------------------- | --------------------------------------------- |
| Token Source      | TypeScript    | JSON files           | Type safety, IDE autocomplete, single build   |
| Animation Library | Framer Motion | CSS-only             | Better DX, gesture support, React integration |
| Token Granularity | Semantic only | Primitive + Semantic | Prevents misuse, enforces consistency         |
| Migration         | Incremental   | Big bang             | Lower risk, continuous delivery               |
| Font Loading      | Self-hosted   | Google Fonts CDN     | Better performance, no external dependency    |

### Framer Motion vs Alternatives

**Framer Motion (Chosen)**:

- Pros: React-native, declarative, gestures, AnimatePresence
- Cons: Bundle size (~15KB), learning curve

**CSS Transitions (Rejected)**:

- Pros: Zero bundle size, browser native
- Cons: No spring physics, no gesture support, imperative

**GSAP (Rejected)**:

- Pros: Powerful, timeline control
- Cons: Larger bundle, not React-native, license concerns

### Token Format: TypeScript vs JSON

**TypeScript (Chosen)**:

```typescript
// Type safety, autocomplete
import { colors } from '@/design-system/tokens';
colors.ui.panel.bg; // IDE shows all options
```

**JSON (Rejected)**:

```json
// No type safety, requires parsing
{ "ui": { "panel": { "bg": "#1E2A3D" } } }
```

---

## 12. Implementation Phases

### Phase 1: Foundation (Days 1-2)

**Goal**: Create design system infrastructure

1. Create `src/design-system/tokens.ts` with all tokens
2. Create `src/design-system/types.ts` with type definitions
3. Create `src/plugins/vite-plugin-design-tokens.ts`
4. Update `tailwind.config.js` with CSS variable references
5. Write tests for tokens (TDD)

**Deliverables**:

- Token files with 95% test coverage
- Updated Tailwind config
- Working Vite plugin

### Phase 2: Component Library (Days 3-4)

**Goal**: Create reusable design system components

1. Create `Panel` component with tests
2. Create `Button` component with tests
3. Create `TowerButton` component with tests
4. Create `Text` component with tests
5. Create `StatCard` component with tests
6. Add Framer Motion animations

**Deliverables**:

- 5 reusable components
- 85% test coverage
- Animation presets working

### Phase 3: Component Migration (Days 5-7)

**Goal**: Migrate existing components to design system

Migration order (by complexity, lowest first):

1. `Footer.tsx` - Simple, few elements
2. `Header.tsx` - Moderate, status displays
3. `GameStats.tsx` - Uses StatCard
4. `WaveProgress.tsx` - Progress bar, button
5. `TowerSelectionPanel.tsx` - Tower buttons
6. `TowerPanel.tsx` - Tower info, actions
7. `PauseMenu.tsx` - Overlay modal
8. `GameOverScreen.tsx` - Overlay modal
9. `GameUI.tsx` - Main layout

**Deliverables**:

- All 9 components migrated
- Zero `bg-gray-*` classes remaining
- Visual consistency verified

### Phase 4: Polish and Documentation (Day 8)

**Goal**: Final polish and documentation

1. Add ESLint migration rule
2. Performance audit (bundle size, FPS)
3. Accessibility audit (contrast, focus)
4. Update component JSDoc comments
5. Final test pass

**Deliverables**:

- Bundle size < 52KB added
- 60 FPS maintained
- WCAG AA compliance verified

### Dependency Graph

```
Phase 1: Foundation
    |
    +-- tokens.ts
    |
    +-- types.ts
    |
    +-- vite-plugin-design-tokens.ts
    |
    +-- tailwind.config.js
            |
            v
Phase 2: Component Library
    |
    +-- Panel.tsx
    |
    +-- Button.tsx
    |
    +-- TowerButton.tsx
    |
    +-- Text.tsx
    |
    +-- StatCard.tsx
            |
            v
Phase 3: Migration
    |
    +-- Footer.tsx (simple)
    |
    +-- Header.tsx
    |
    +-- GameStats.tsx <-- StatCard
    |
    +-- WaveProgress.tsx <-- Button
    |
    +-- TowerSelectionPanel.tsx <-- TowerButton
    |
    +-- TowerPanel.tsx <-- Panel, Button
    |
    +-- PauseMenu.tsx <-- Panel, Button
    |
    +-- GameOverScreen.tsx <-- Panel, Button
    |
    +-- GameUI.tsx <-- All
            |
            v
Phase 4: Polish
```

---

## 13. Risks and Mitigations

| Risk                                    | Likelihood | Impact | Mitigation                                                    |
| --------------------------------------- | ---------- | ------ | ------------------------------------------------------------- |
| Framer Motion performance issues        | Medium     | High   | Animation budget limits, FPS monitoring, graceful degradation |
| Bundle size exceeds budget              | Low        | Medium | Tree-shaking, lazy loading, regular audits                    |
| Migration breaks existing functionality | Medium     | High   | Incremental migration, comprehensive tests, rollback plan     |
| Tailwind class conflicts                | Low        | Medium | Semantic-only approach, lint rules                            |
| Font loading delays                     | Low        | Low    | Font-display: swap, system fallbacks                          |
| Phaser/React color mismatch             | Medium     | Medium | Single source of truth, automated tests                       |
| Accessibility regressions               | Medium     | High   | jest-axe tests, manual audit, contrast checks                 |

### Rollback Plan

If critical issues discovered:

1. **Immediate**: Revert to previous commit
2. **Partial**: Disable Framer Motion, use CSS-only animations
3. **Staged**: Keep token system, migrate components back one-by-one

### Monitoring

- FPS counter always visible (Footer)
- Bundle size in CI pipeline
- Lighthouse scores tracked per release

---

## 14. References

### Project Files

- Design tokens: `/home/roach/defence-game/src/design-system/tokens.ts` (to be created)
- Tailwind config: `/home/roach/defence-game/tailwind.config.js` (to be updated)
- Vite config: `/home/roach/defence-game/vite.config.ts`
- Components: `/home/roach/defence-game/src/components/`

### Existing Color Definitions

Current Tailwind config already has token structure:

```javascript
// tailwind.config.js (current)
colors: {
  tower: { peashooter, sunflower, wallnut },
  enemy: { basic, tank, flying, boss, swarm, armored },
  ui: { bg, text, gold, interactive },
  feedback: { success, error, warning, info, highlight },
}
```

### External Documentation

- Framer Motion Documentation: https://www.framer.com/motion/
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Phaser 3 Documentation: https://photonstorm.github.io/phaser3-docs/

### Design Inspiration

- Plants vs Zombies UI (cartoon aesthetic, vibrant colors)
- Bloons TD 6 (clean panel layouts, readable stats)
- Kingdom Rush (medieval fantasy with modern UI)

---

## Appendix A: Complete Color Token Reference

```typescript
// Full color token export for easy reference
export const allColors = {
  // UI Panel Colors
  'panel.bg': '#1E2A3D',
  'panel.hover': '#253448',
  'panel.active': '#2D4156',
  'panel.border': '#3A5068',
  'panel.accent': '#4A90D9',

  // Overlay Colors
  'overlay.bg': 'rgba(10, 15, 25, 0.85)',
  'overlay.panel': '#1A2332',

  // Text Colors
  'text.primary': '#FFFFFF',
  'text.secondary': '#A8B8C8',
  'text.muted': '#6B7B8B',
  'text.accent': '#4A90D9',

  // Gold Colors
  'gold.primary': '#FFD700',
  'gold.secondary': '#FFA500',
  'gold.glow': 'rgba(255, 215, 0, 0.3)',

  // Interactive - Primary
  'interactive.primary': '#3498DB',
  'interactive.primary.hover': '#2980B9',
  'interactive.primary.active': '#1F6999',

  // Interactive - Success
  'interactive.success': '#27AE60',
  'interactive.success.hover': '#219A52',
  'interactive.success.active': '#1A7F43',

  // Interactive - Warning
  'interactive.warning': '#F39C12',
  'interactive.warning.hover': '#D68910',
  'interactive.warning.active': '#B9770E',

  // Interactive - Danger
  'interactive.danger': '#E74C3C',
  'interactive.danger.hover': '#C0392B',
  'interactive.danger.active': '#A93226',

  // Interactive - Disabled
  'interactive.disabled.bg': '#4A5568',
  'interactive.disabled.text': '#718096',

  // Tower Colors
  'tower.peashooter.primary': '#32CD32',
  'tower.peashooter.secondary': '#228B22',
  'tower.peashooter.accent': '#90EE90',
  'tower.peashooter.border': '#32CD32',

  'tower.sunflower.primary': '#FFD700',
  'tower.sunflower.secondary': '#FFA500',
  'tower.sunflower.accent': '#FFFF00',
  'tower.sunflower.border': '#FFD700',

  'tower.wallnut.primary': '#8B4513',
  'tower.wallnut.secondary': '#654321',
  'tower.wallnut.accent': '#D2691E',
  'tower.wallnut.border': '#8B4513',

  'tower.mortar.primary': '#FF6347',
  'tower.mortar.secondary': '#DC143C',
  'tower.mortar.accent': '#FF7F50',
  'tower.mortar.border': '#FF6347',

  // Feedback Colors
  'feedback.success': '#00FF00',
  'feedback.error': '#FF4444',
  'feedback.warning': '#FFA500',
  'feedback.info': '#00BFFF',
  'feedback.highlight': '#FFFF00',

  // Level Indicator Colors
  'level.basic': '#A8B8C8',
  'level.advanced': '#4A90D9',
  'level.elite': '#9B59B6',
};
```

---

## Appendix B: Migration Checklist

### Pre-Migration

- [ ] Design tokens file created and tested
- [ ] Tailwind config updated with CSS variables
- [ ] Vite plugin working
- [ ] Framer Motion installed
- [ ] Font files installed
- [ ] All design system components created with tests

### Component Migration

- [ ] Footer.tsx
- [ ] Header.tsx
- [ ] GameStats.tsx
- [ ] WaveProgress.tsx
- [ ] TowerSelectionPanel.tsx
- [ ] TowerPanel.tsx
- [ ] PauseMenu.tsx
- [ ] GameOverScreen.tsx
- [ ] GameUI.tsx

### Post-Migration

- [ ] No `bg-gray-*` classes in codebase
- [ ] No `text-gray-*` classes in codebase
- [ ] Bundle size verified < 52KB added
- [ ] 60 FPS maintained
- [ ] WCAG AA contrast verified
- [ ] All tests passing
- [ ] ESLint rule active

---

**Document Status**: Ready for Implementation

**Next Steps**:

1. Review with stakeholders
2. Begin Phase 1: Foundation
3. Track progress against Implementation Phases

---

_This specification is the single source of truth for the Design System Integration feature. All implementation decisions should reference this document._
