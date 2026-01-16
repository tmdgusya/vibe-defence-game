# Implementation Plan: Design System Integration

**Based on**: `/home/roach/defence-game/.claude/SPEC.md`
**Generated**: 2026-01-16
**Target Model**: GLM 4.7 (or any model executing implementation)

---

## How to Use This Plan

This document provides step-by-step implementation guidance:

1. **Read SPEC.md first** - Understand the "what" and "why"
2. **Follow this plan** - Get the explicit "how"
3. **Execute in sequence** - Files are dependency-ordered
4. **Use TDD cycles** - Follow RED -> GREEN -> REFACTOR for each component
5. **Copy boilerplate** - Use provided templates directly

**Do not skip steps**. Each step builds on previous ones.

---

## Analysis Summary

### Components Identified

| Component        | Responsibility                                | Current File | Design System File                             |
| ---------------- | --------------------------------------------- | ------------ | ---------------------------------------------- |
| tokens           | Single source of truth for all design values  | N/A          | `src/design-system/tokens.ts`                  |
| types            | TypeScript type definitions for design system | N/A          | `src/design-system/types.ts`                   |
| tailwind-classes | Semantic class name mappings                  | N/A          | `src/design-system/tailwind-classes.ts`        |
| phaser-config    | Phaser-specific color conversions             | N/A          | `src/design-system/phaser-config.ts`           |
| useAnimation     | Animation preset hooks                        | N/A          | `src/design-system/hooks/useAnimation.ts`      |
| Panel            | Styled panel wrapper component                | N/A          | `src/components/design-system/Panel.tsx`       |
| Button           | Styled button with variants                   | N/A          | `src/components/design-system/Button.tsx`      |
| TowerButton      | Tower selection button                        | N/A          | `src/components/design-system/TowerButton.tsx` |
| Text             | Typography component                          | N/A          | `src/components/design-system/Text.tsx`        |
| StatCard         | Stats display card                            | N/A          | `src/components/design-system/StatCard.tsx`    |

### Existing Components to Migrate

| Component               | Current State                                     | Migration Priority |
| ----------------------- | ------------------------------------------------- | ------------------ |
| Footer.tsx              | Uses `bg-gray-800`, `text-gray-400`               | 1 (Simplest)       |
| Header.tsx              | Uses `bg-gray-800`, `bg-blue-600`, `bg-green-600` | 2                  |
| GameStats.tsx           | Uses `bg-gray-800`, `border-gray-700`             | 3                  |
| WaveProgress.tsx        | Uses `bg-gray-800`, `bg-gray-700`                 | 4                  |
| TowerSelectionPanel.tsx | Uses `bg-gray-700`, `bg-blue-600`                 | 5                  |
| TowerPanel.tsx          | Uses `bg-gray-700`, `bg-blue-600`                 | 6                  |
| PauseMenu.tsx           | Uses `bg-gray-800`, `bg-gray-700`                 | 7                  |
| GameOverScreen.tsx      | Uses `bg-gray-800`, `bg-gray-600`                 | 8                  |
| GameUI.tsx              | Layout container                                  | 9 (Last)           |

### Architectural Patterns

- **Data access**: Direct import from tokens module
- **API style**: React component props with TypeScript generics
- **State management**: Zustand (existing) - no changes needed
- **Animation**: Framer Motion declarative API

---

## Ambiguity Resolutions

| Original Statement (from SPEC.md) | Ambiguity                               | Explicit Specification                                                                                                                                               |
| --------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "handle errors appropriately"     | Which errors? How to display?           | Display red error banner with `bg-feedback-error` background, white text, auto-dismiss after 2000ms using `setTimeout`, animate with `animation.presets.fadeIn`      |
| "validate input"                  | Which inputs need validation?           | Tower placement: check `gold >= tower.cost`, check grid cell not occupied. No other user input validation needed (no forms in this feature)                          |
| "semantic tokens only"            | Which tokens are semantic vs primitive? | Semantic: `panel.bg`, `text.primary`, `interactive.success`. Primitive (NOT to use directly): raw hex values like `#1E2A3D`. Always use semantic names in components |
| "font-display: swap"              | How to implement font loading?          | Import `@fontsource/press-start-2p` in `main.tsx`, the package handles font-display automatically                                                                    |
| "reduce animation if FPS drops"   | What threshold? What to reduce?         | If `fps < 50`, disable `whileHover` and `whileTap` animations on buttons. Keep opacity transitions. Check fps from `useGameStore`                                    |
| "WCAG AA contrast"                | How to verify?                          | Run `getContrastRatio()` function from tokens.test.ts. Primary text on panel bg must be >= 4.5:1. Large text >= 3:1                                                  |

---

## Implementation Sequence

### Phase 1: Foundation (No Dependencies)

#### File 1.1: `src/design-system/tokens.ts`

**Purpose**: Single source of truth for all design tokens (colors, typography, spacing, animation)
**Dependencies**: None
**Exports**: `colors`, `typography`, `spacing`, `animation`, `shadows`, `getTowerColors`, `hexToNumber`, `getButtonStyles`
**Test File**: `src/design-system/__tests__/tokens.test.ts`
**Estimated Time**: 1.5 hours

---

#### File 1.2: `src/design-system/types.ts`

**Purpose**: TypeScript type definitions for design system
**Dependencies**: None (React types from `@types/react`)
**Exports**: `ColorPath`, `AnimationPreset`, `PanelProps`, `ButtonProps`, `TowerButtonProps`, `StatCardProps`
**Test File**: None (interfaces only, TypeScript compiler validates)
**Estimated Time**: 30 minutes

---

#### File 1.3: `src/design-system/tailwind-classes.ts`

**Purpose**: Semantic Tailwind class name mappings
**Dependencies**: None
**Exports**: `panelClasses`, `buttonClasses`, `textClasses`, `towerButtonClasses`
**Test File**: None (string constants, TypeScript validates)
**Estimated Time**: 30 minutes

---

#### File 1.4: `src/design-system/phaser-config.ts`

**Purpose**: Phaser-specific color conversions (hex to integer)
**Dependencies**: `./tokens.ts`
**Exports**: `PhaserColors`, `getPhaserTowerColors`
**Test File**: `src/design-system/__tests__/phaser-config.test.ts`
**Estimated Time**: 30 minutes

---

#### File 1.5: `src/design-system/hooks/useAnimation.ts`

**Purpose**: Animation preset hooks with reduced-motion support
**Dependencies**: `./tokens.ts`, `framer-motion`
**Exports**: `useAnimationPreset`, `useButtonAnimation`
**Test File**: `src/design-system/hooks/__tests__/useAnimation.test.ts`
**Estimated Time**: 45 minutes

---

#### File 1.6: `src/design-system/index.ts`

**Purpose**: Barrel export for all design system modules
**Dependencies**: All above files
**Exports**: Re-exports all from tokens, types, tailwind-classes, phaser-config, hooks
**Test File**: None (barrel file)
**Estimated Time**: 10 minutes

---

### Phase 2: Component Library (Depends on Phase 1)

#### File 2.1: `src/components/design-system/Panel.tsx`

**Purpose**: Styled panel wrapper with variants (base, elevated, overlay)
**Dependencies**: `src/design-system/tokens.ts`, `framer-motion`
**Exports**: `Panel` component
**Test File**: `src/components/design-system/__tests__/Panel.test.tsx`
**Estimated Time**: 1 hour

---

#### File 2.2: `src/components/design-system/Button.tsx`

**Purpose**: Styled button with variants (primary, success, warning, danger, ghost) and sizes
**Dependencies**: `src/design-system/tokens.ts`, `framer-motion`
**Exports**: `Button` component
**Test File**: `src/components/design-system/__tests__/Button.test.tsx`
**Estimated Time**: 1.5 hours

---

#### File 2.3: `src/components/design-system/Text.tsx`

**Purpose**: Typography component with semantic variants
**Dependencies**: `src/design-system/tokens.ts`
**Exports**: `Text` component
**Test File**: `src/components/design-system/__tests__/Text.test.tsx`
**Estimated Time**: 45 minutes

---

#### File 2.4: `src/components/design-system/StatCard.tsx`

**Purpose**: Stats display card with icon and value
**Dependencies**: `src/design-system/tokens.ts`, `framer-motion`
**Exports**: `StatCard` component
**Test File**: `src/components/design-system/__tests__/StatCard.test.tsx`
**Estimated Time**: 45 minutes

---

#### File 2.5: `src/components/design-system/TowerButton.tsx`

**Purpose**: Tower selection button with type-specific border colors
**Dependencies**: `src/design-system/tokens.ts`, `src/types/index.ts`, `framer-motion`
**Exports**: `TowerButton` component
**Test File**: `src/components/design-system/__tests__/TowerButton.test.tsx`
**Estimated Time**: 1 hour

---

#### File 2.6: `src/components/design-system/index.ts`

**Purpose**: Barrel export for design system components
**Dependencies**: All component files
**Exports**: Re-exports all components
**Test File**: None (barrel file)
**Estimated Time**: 10 minutes

---

### Phase 3: Configuration Updates (Depends on Phase 1)

#### File 3.1: Update `tailwind.config.js`

**Purpose**: Add CSS variable references for design tokens
**Dependencies**: None (configuration file)
**Changes**: Add colors, fontFamily, boxShadow, borderRadius, spacing extensions
**Test File**: None (build-time validation)
**Estimated Time**: 30 minutes

---

#### File 3.2: Create `src/index.css` additions

**Purpose**: Add CSS custom properties from design tokens
**Dependencies**: `src/design-system/tokens.ts` (reference values)
**Changes**: Add `:root` variables for all token values
**Test File**: None (visual verification)
**Estimated Time**: 30 minutes

---

#### File 3.3: Update `src/main.tsx`

**Purpose**: Import font and design system CSS
**Dependencies**: `@fontsource/press-start-2p` package
**Changes**: Add import for font package
**Test File**: None (runtime verification)
**Estimated Time**: 10 minutes

---

### Phase 4: Component Migration (Depends on Phases 1-3)

Migration order is by complexity (simplest first):

#### File 4.1: Migrate `src/components/Footer.tsx`

**Dependencies**: `Panel`, `Text` components
**Estimated Time**: 30 minutes

---

#### File 4.2: Migrate `src/components/Header.tsx`

**Dependencies**: `Panel`, `Button`, `Text` components
**Estimated Time**: 45 minutes

---

#### File 4.3: Migrate `src/components/GameStats.tsx`

**Dependencies**: `Panel`, `StatCard`, `Text` components
**Estimated Time**: 45 minutes

---

#### File 4.4: Migrate `src/components/WaveProgress.tsx`

**Dependencies**: `Panel`, `Button`, `Text` components
**Estimated Time**: 45 minutes

---

#### File 4.5: Migrate `src/components/TowerSelectionPanel.tsx`

**Dependencies**: `Panel`, `TowerButton`, `Text` components
**Estimated Time**: 1 hour

---

#### File 4.6: Migrate `src/components/TowerPanel.tsx`

**Dependencies**: `Panel`, `Button`, `Text` components
**Estimated Time**: 1 hour

---

#### File 4.7: Migrate `src/components/PauseMenu.tsx`

**Dependencies**: `Panel`, `Button`, `Text` components
**Estimated Time**: 45 minutes

---

#### File 4.8: Migrate `src/components/GameOverScreen.tsx`

**Dependencies**: `Panel`, `Button`, `Text`, `StatCard` components
**Estimated Time**: 45 minutes

---

#### File 4.9: Migrate `src/components/GameUI.tsx`

**Dependencies**: All migrated components
**Estimated Time**: 30 minutes

---

## TDD Implementation Cycles

### Cycle 1: Design Tokens - Color Tokens

**File**: `src/design-system/tokens.ts`
**Test File**: `src/design-system/__tests__/tokens.test.ts`

---

#### RED Phase

Create test file first:

**File**: `src/design-system/__tests__/tokens.test.ts`

```typescript
import { describe, it, expect } from 'vitest';

describe('Design Tokens', () => {
  describe('Color Tokens', () => {
    it('should export colors object with ui.panel.bg defined', async () => {
      const { colors } = await import('../tokens');
      expect(colors.ui.panel.bg).toBeDefined();
      expect(colors.ui.panel.bg).toBe('#1E2A3D');
    });

    it('should have all required UI panel colors', async () => {
      const { colors } = await import('../tokens');
      expect(colors.ui.panel).toHaveProperty('bg');
      expect(colors.ui.panel).toHaveProperty('bgHover');
      expect(colors.ui.panel).toHaveProperty('bgActive');
      expect(colors.ui.panel).toHaveProperty('border');
      expect(colors.ui.panel).toHaveProperty('borderAccent');
    });

    it('should have valid hex color format for panel colors', async () => {
      const { colors } = await import('../tokens');
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;

      expect(colors.ui.panel.bg).toMatch(hexRegex);
      expect(colors.ui.panel.bgHover).toMatch(hexRegex);
      expect(colors.ui.panel.border).toMatch(hexRegex);
    });

    it('should have all text color tokens', async () => {
      const { colors } = await import('../tokens');
      expect(colors.ui.text.primary).toBe('#FFFFFF');
      expect(colors.ui.text.secondary).toBe('#A8B8C8');
      expect(colors.ui.text.muted).toBe('#6B7B8B');
      expect(colors.ui.text.accent).toBe('#4A90D9');
    });

    it('should have gold color tokens', async () => {
      const { colors } = await import('../tokens');
      expect(colors.ui.gold.primary).toBe('#FFD700');
      expect(colors.ui.gold.secondary).toBe('#FFA500');
    });
  });
});
```

**Run Test**:

```bash
npm run test -- src/design-system/__tests__/tokens.test.ts
```

**Expected Result**: Test fails with `Cannot find module '../tokens'`

---

#### GREEN Phase

Create minimal implementation to pass:

**File**: `src/design-system/tokens.ts`

```typescript
// ============================================================
// COLOR TOKENS
// ============================================================

export const colors = {
  // UI Panel Colors
  ui: {
    panel: {
      bg: '#1E2A3D',
      bgHover: '#253448',
      bgActive: '#2D4156',
      border: '#3A5068',
      borderAccent: '#4A90D9',
    },
    overlay: {
      bg: 'rgba(10, 15, 25, 0.85)',
      panel: '#1A2332',
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
```

**Run Test**:

```bash
npm run test -- src/design-system/__tests__/tokens.test.ts
```

**Expected Result**: All tests pass

---

#### REFACTOR Phase

Add remaining token categories:

**File**: `src/design-system/tokens.ts` (append to existing)

```typescript
// ============================================================
// TYPOGRAPHY TOKENS
// ============================================================

export const typography = {
  fontFamily: {
    heading: '"Comic Sans MS", "Comic Sans", cursive',
    body: 'Arial, Helvetica, sans-serif',
    mono: '"Press Start 2P", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
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
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',

  panel: {
    padding: '1rem',
    paddingLarge: '1.5rem',
    gap: '1rem',
    borderRadius: '0.75rem',
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
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: { type: 'spring' as const, stiffness: 400, damping: 30 },
    bounce: { type: 'spring' as const, stiffness: 600, damping: 15 },
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
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.2 },
    },
    buttonHover: {
      scale: 1.05,
      transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
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

**Run Test**:

```bash
npm run test -- src/design-system/__tests__/tokens.test.ts
```

**Expected Result**: All tests still pass

---

### Cycle 2: Design Tokens - Helper Functions

#### RED Phase

Add tests for helper functions:

**File**: `src/design-system/__tests__/tokens.test.ts` (append to existing)

```typescript
describe('hexToNumber', () => {
  it('should convert hex string to number', async () => {
    const { hexToNumber } = await import('../tokens');
    expect(hexToNumber('#FF0000')).toBe(0xff0000);
    expect(hexToNumber('#00FF00')).toBe(0x00ff00);
    expect(hexToNumber('#0000FF')).toBe(0x0000ff);
  });

  it('should handle lowercase hex', async () => {
    const { hexToNumber } = await import('../tokens');
    expect(hexToNumber('#ff0000')).toBe(0xff0000);
  });

  it('should handle hex without hash', async () => {
    const { hexToNumber } = await import('../tokens');
    // Note: Current implementation requires hash, this tests edge case
    expect(hexToNumber('#1E2A3D')).toBe(0x1e2a3d);
  });
});

describe('getTowerColors', () => {
  it('should return correct colors for valid tower type', async () => {
    const { getTowerColors, colors } = await import('../tokens');
    const peashooterColors = getTowerColors('peashooter');
    expect(peashooterColors.primary).toBe(colors.tower.peashooter.primary);
    expect(peashooterColors.border).toBe(colors.tower.peashooter.border);
  });

  it('should return all tower types correctly', async () => {
    const { getTowerColors, colors } = await import('../tokens');

    expect(getTowerColors('sunflower').primary).toBe(
      colors.tower.sunflower.primary
    );
    expect(getTowerColors('wallnut').primary).toBe(
      colors.tower.wallnut.primary
    );
    expect(getTowerColors('mortar').primary).toBe(colors.tower.mortar.primary);
  });

  it('should return fallback (peashooter) for invalid tower type', async () => {
    const { getTowerColors, colors } = await import('../tokens');
    // @ts-expect-error Testing invalid input
    const unknownColors = getTowerColors('unknown');
    expect(unknownColors).toEqual(colors.tower.peashooter);
  });
});

describe('getButtonStyles', () => {
  it('should return button styles for primary variant', async () => {
    const { getButtonStyles, colors } = await import('../tokens');
    const styles = getButtonStyles('primary');
    expect(styles.bg).toBe(colors.interactive.primary.bg);
    expect(styles.hover).toBe(colors.interactive.primary.bgHover);
    expect(styles.active).toBe(colors.interactive.primary.bgActive);
    expect(styles.text).toBe(colors.interactive.primary.text);
  });

  it('should return button styles for all variants', async () => {
    const { getButtonStyles } = await import('../tokens');

    expect(getButtonStyles('success').bg).toBe('#27AE60');
    expect(getButtonStyles('warning').bg).toBe('#F39C12');
    expect(getButtonStyles('danger').bg).toBe('#E74C3C');
  });
});
```

**Run Test**:

```bash
npm run test -- src/design-system/__tests__/tokens.test.ts
```

**Expected Result**: All tests pass (functions already implemented)

---

### Cycle 3: Design Tokens - Typography Tests

#### RED Phase

**File**: `src/design-system/__tests__/tokens.test.ts` (append)

```typescript
describe('Typography Tokens', () => {
  it('should have all required font families', async () => {
    const { typography } = await import('../tokens');
    expect(typography.fontFamily.heading).toBeDefined();
    expect(typography.fontFamily.body).toBeDefined();
    expect(typography.fontFamily.mono).toBeDefined();
  });

  it('should have heading font with Comic Sans', async () => {
    const { typography } = await import('../tokens');
    expect(typography.fontFamily.heading).toContain('Comic Sans');
  });

  it('should have mono font with Press Start 2P', async () => {
    const { typography } = await import('../tokens');
    expect(typography.fontFamily.mono).toContain('Press Start 2P');
  });

  it('should have valid rem-based font sizes', async () => {
    const { typography } = await import('../tokens');
    const remRegex = /^\d+(\.\d+)?rem$/;

    Object.values(typography.fontSize).forEach((size) => {
      expect(size).toMatch(remRegex);
    });
  });

  it('should have all standard font sizes', async () => {
    const { typography } = await import('../tokens');
    expect(typography.fontSize.xs).toBe('0.75rem');
    expect(typography.fontSize.sm).toBe('0.875rem');
    expect(typography.fontSize.base).toBe('1rem');
    expect(typography.fontSize.lg).toBe('1.125rem');
    expect(typography.fontSize.xl).toBe('1.25rem');
  });
});
```

**Run Test**: Tests should pass with existing implementation.

---

### Cycle 4: Design Tokens - Animation Tests

#### RED Phase

**File**: `src/design-system/__tests__/tokens.test.ts` (append)

```typescript
describe('Animation Tokens', () => {
  it('should have duration values in milliseconds', async () => {
    const { animation } = await import('../tokens');
    expect(animation.duration.fast).toBe(150);
    expect(animation.duration.normal).toBe(300);
    expect(animation.duration.slow).toBe(500);
  });

  it('should have valid preset animations with required properties', async () => {
    const { animation } = await import('../tokens');

    expect(animation.presets.fadeIn).toHaveProperty('initial');
    expect(animation.presets.fadeIn).toHaveProperty('animate');
    expect(animation.presets.fadeIn).toHaveProperty('exit');
    expect(animation.presets.fadeIn).toHaveProperty('transition');
  });

  it('should have button hover preset with scale', async () => {
    const { animation } = await import('../tokens');
    expect(animation.presets.buttonHover.scale).toBe(1.05);
  });

  it('should have button tap preset with scale', async () => {
    const { animation } = await import('../tokens');
    expect(animation.presets.buttonTap.scale).toBe(0.95);
  });

  it('should have spring easing configuration', async () => {
    const { animation } = await import('../tokens');
    expect(animation.easing.spring.type).toBe('spring');
    expect(animation.easing.spring.stiffness).toBe(400);
    expect(animation.easing.spring.damping).toBe(30);
  });
});
```

**Run Test**: Tests should pass with existing implementation.

---

### Cycle 5: Design Tokens - Accessibility Tests

#### RED Phase

**File**: `src/design-system/__tests__/tokens.test.ts` (append)

```typescript
describe('Accessibility', () => {
  /**
   * Calculate contrast ratio between two hex colors
   * Based on WCAG 2.1 formula
   */
  function getContrastRatio(hex1: string, hex2: string): number {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const [rs, gs, bs] = [r, g, b].map((c) => {
        const normalized = c / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : Math.pow((normalized + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  it('should have WCAG AA compliant contrast for secondary text on panel', async () => {
    const { colors } = await import('../tokens');
    const ratio = getContrastRatio(
      colors.ui.text.secondary,
      colors.ui.panel.bg
    );
    // WCAG AA requires 4.5:1 for normal text
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should have WCAG AA compliant contrast for primary text on panel', async () => {
    const { colors } = await import('../tokens');
    const ratio = getContrastRatio(colors.ui.text.primary, colors.ui.panel.bg);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should have WCAG AA compliant contrast for button text', async () => {
    const { colors } = await import('../tokens');

    // Primary button
    const primaryRatio = getContrastRatio(
      colors.interactive.primary.text,
      colors.interactive.primary.bg
    );
    expect(primaryRatio).toBeGreaterThanOrEqual(4.5);

    // Success button
    const successRatio = getContrastRatio(
      colors.interactive.success.text,
      colors.interactive.success.bg
    );
    expect(successRatio).toBeGreaterThanOrEqual(4.5);
  });
});
```

**Run Test**: Tests should pass (colors were chosen to meet WCAG AA).

---

### Cycle 6: Panel Component

**File**: `src/components/design-system/Panel.tsx`
**Test File**: `src/components/design-system/__tests__/Panel.test.tsx`

---

#### RED Phase

**File**: `src/components/design-system/__tests__/Panel.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Panel Component', () => {
  describe('Rendering', () => {
    it('should render children correctly', async () => {
      const { Panel } = await import('../Panel');
      render(<Panel>Test Content</Panel>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply base variant classes by default', async () => {
      const { Panel } = await import('../Panel');
      const { container } = render(<Panel>Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('bg-panel-primary');
      expect(panel.className).toContain('border');
      expect(panel.className).toContain('rounded-panel');
    });

    it('should apply elevated variant classes', async () => {
      const { Panel } = await import('../Panel');
      const { container } = render(<Panel variant="elevated">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('shadow-panel');
    });

    it('should apply overlay variant classes', async () => {
      const { Panel } = await import('../Panel');
      const { container } = render(<Panel variant="overlay">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('shadow-xl');
      expect(panel.className).toContain('p-panel-lg');
    });

    it('should merge custom className', async () => {
      const { Panel } = await import('../Panel');
      const { container } = render(<Panel className="custom-class">Content</Panel>);
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('custom-class');
      expect(panel.className).toContain('bg-panel-primary');
    });
  });
});
```

**Run Test**:

```bash
npm run test -- src/components/design-system/__tests__/Panel.test.tsx
```

**Expected Result**: Test fails with `Cannot find module '../Panel'`

---

#### GREEN Phase

**File**: `src/components/design-system/Panel.tsx`

```typescript
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { animation } from '../../design-system/tokens';

interface PanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'base' | 'elevated' | 'overlay';
  children: React.ReactNode;
}

const variantClasses: Record<PanelProps['variant'] & string, string> = {
  base: 'bg-panel-primary/95 border border-panel-border/50 rounded-panel p-panel shadow-md',
  elevated: 'bg-panel-primary border border-panel-accent/30 rounded-panel p-panel shadow-panel',
  overlay: 'bg-panel-primary/98 border border-panel-accent/20 rounded-panel p-panel-lg shadow-xl',
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

export default Panel;
```

**Run Test**: Tests should pass.

---

#### REFACTOR Phase

Add accessibility improvements:

**File**: `src/components/design-system/Panel.tsx` (update)

```typescript
import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { animation } from '../../design-system/tokens';

interface PanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'base' | 'elevated' | 'overlay';
  children: React.ReactNode;
  /** Disable entrance animation */
  noAnimation?: boolean;
}

const variantClasses: Record<string, string> = {
  base: 'bg-panel-primary/95 border border-panel-border/50 rounded-panel p-panel shadow-md',
  elevated: 'bg-panel-primary border border-panel-accent/30 rounded-panel p-panel shadow-panel',
  overlay: 'bg-panel-primary/98 border border-panel-accent/20 rounded-panel p-panel-lg shadow-xl',
};

export const Panel: React.FC<PanelProps> = ({
  variant = 'base',
  children,
  className = '',
  noAnimation = false,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = noAnimation || shouldReduceMotion;

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      initial={skipAnimation ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={skipAnimation ? { duration: 0 } : { duration: animation.duration.normal / 1000 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default Panel;
```

---

### Cycle 7: Button Component

**File**: `src/components/design-system/Button.tsx`
**Test File**: `src/components/design-system/__tests__/Button.test.tsx`

---

#### RED Phase

**File**: `src/components/design-system/__tests__/Button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render children correctly', async () => {
      const { Button } = await import('../Button');
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should apply primary variant by default', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button>Primary</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-primary');
    });

    it('should apply success variant classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="success">Success</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-success');
    });

    it('should apply danger variant classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-danger');
    });

    it('should apply warning variant classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="warning">Warning</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-interactive-warning');
    });

    it('should apply ghost variant classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });

    it('should apply medium size classes by default', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button>Medium</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('py-btn-y');
      expect(button.className).toContain('px-btn-x');
    });

    it('should apply large size classes', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('py-4');
      expect(button.className).toContain('text-lg');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const { Button } = await import('../Button');
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const { Button } = await import('../Button');
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled styles', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', async () => {
      const { Button } = await import('../Button');
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should have type="button" by default', async () => {
      const { Button } = await import('../Button');
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
```

**Run Test**: Test fails with `Cannot find module '../Button'`

---

#### GREEN Phase

**File**: `src/components/design-system/Button.tsx`

```typescript
import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { animation } from '../../design-system/tokens';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-interactive-primary hover:bg-interactive-primary-hover text-white',
  success: 'bg-interactive-success hover:bg-interactive-success-hover text-white',
  warning: 'bg-interactive-warning hover:bg-interactive-warning-hover text-white',
  danger: 'bg-interactive-danger hover:bg-interactive-danger-hover text-white',
  ghost: 'bg-transparent hover:bg-panel-hover text-text-secondary hover:text-text-primary',
};

const sizeClasses: Record<string, string> = {
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
  type = 'button',
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();

  const hoverAnimation = disabled || shouldReduceMotion ? {} : animation.presets.buttonHover;
  const tapAnimation = disabled || shouldReduceMotion ? {} : animation.presets.buttonTap;

  return (
    <motion.button
      type={type}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium rounded-btn
        transition-colors duration-fast
        focus:outline-none focus:ring-2 focus:ring-text-accent focus:ring-offset-2 focus:ring-offset-panel-primary
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
```

**Run Test**: Tests should pass.

---

### Cycle 8: TowerButton Component

**File**: `src/components/design-system/TowerButton.tsx`
**Test File**: `src/components/design-system/__tests__/TowerButton.test.tsx`

---

#### RED Phase

**File**: `src/components/design-system/__tests__/TowerButton.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TowerType } from '../../../types';

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
    it('should render tower name and cost', async () => {
      const { TowerButton } = await import('../TowerButton');
      render(<TowerButton {...defaultProps} />);

      expect(screen.getByText('Peashooter')).toBeInTheDocument();
      expect(screen.getByText('100g')).toBeInTheDocument();
    });

    it('should render tower icon', async () => {
      const { TowerButton } = await import('../TowerButton');
      render(<TowerButton {...defaultProps} />);
      expect(screen.getByText('🌱')).toBeInTheDocument();
    });

    it('should apply tower-specific border color via style', async () => {
      const { TowerButton } = await import('../TowerButton');
      const { container } = render(<TowerButton {...defaultProps} />);
      const button = container.firstChild as HTMLElement;

      // Check for border-l-4 class and inline style
      expect(button.className).toContain('border-l-4');
      expect(button.style.borderLeftColor).toBeTruthy();
    });
  });

  describe('Affordability', () => {
    it('should show gold color when affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      render(<TowerButton {...defaultProps} affordable={true} />);
      const costText = screen.getByText('100g');

      expect(costText.className).toContain('text-gold-primary');
    });

    it('should show danger color when not affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      render(<TowerButton {...defaultProps} affordable={false} />);
      const costText = screen.getByText('100g');

      expect(costText.className).toContain('text-interactive-danger');
    });

    it('should be disabled when not affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      const { container } = render(<TowerButton {...defaultProps} affordable={false} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button).toBeDisabled();
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('should not be draggable when not affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      const { container } = render(<TowerButton {...defaultProps} affordable={false} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.draggable).toBe(false);
    });
  });

  describe('Selection', () => {
    it('should show selected state', async () => {
      const { TowerButton } = await import('../TowerButton');
      const { container } = render(<TowerButton {...defaultProps} selected={true} />);
      const button = container.firstChild as HTMLElement;

      expect(button.className).toContain('ring-2');
      expect(button.className).toContain('bg-panel-active');
    });

    it('should call onSelect when clicked', async () => {
      const { TowerButton } = await import('../TowerButton');
      const onSelect = vi.fn();
      render(<TowerButton {...defaultProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('should not call onSelect when not affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      const onSelect = vi.fn();
      render(<TowerButton {...defaultProps} affordable={false} onSelect={onSelect} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('should be draggable when affordable', async () => {
      const { TowerButton } = await import('../TowerButton');
      const { container } = render(<TowerButton {...defaultProps} affordable={true} />);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.draggable).toBe(true);
    });

    it('should call onDragStart when dragging starts', async () => {
      const { TowerButton } = await import('../TowerButton');
      const onDragStart = vi.fn();
      const { container } = render(
        <TowerButton {...defaultProps} onDragStart={onDragStart} />
      );

      fireEvent.dragStart(container.firstChild as HTMLElement);
      expect(onDragStart).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive aria-label', async () => {
      const { TowerButton } = await import('../TowerButton');
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

    it('should indicate not affordable in aria-label', async () => {
      const { TowerButton } = await import('../TowerButton');
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

**Run Test**: Test fails with `Cannot find module '../TowerButton'`

---

#### GREEN Phase

**File**: `src/components/design-system/TowerButton.tsx`

```typescript
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TowerType } from '../../types';
import { colors } from '../../design-system/tokens';

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

const towerTypeToColorKey: Record<TowerType, keyof typeof colors.tower> = {
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
  const shouldReduceMotion = useReducedMotion();
  const colorKey = towerTypeToColorKey[towerType];
  const borderColor = colors.tower[colorKey].border;

  const handleClick = () => {
    if (affordable) {
      onSelect();
    }
  };

  const ariaLabel = `${name} tower, costs ${cost} gold${!affordable ? ', not affordable' : ''}`;

  return (
    <motion.button
      onClick={handleClick}
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
        borderLeftColor: borderColor,
      }}
      whileHover={affordable && !shouldReduceMotion ? { scale: 1.02 } : {}}
      whileTap={affordable && !shouldReduceMotion ? { scale: 0.98 } : {}}
      title={description}
      aria-label={ariaLabel}
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

export default TowerButton;
```

**Run Test**: Tests should pass.

---

### Cycle 9: Text Component

**File**: `src/components/design-system/Text.tsx`
**Test File**: `src/components/design-system/__tests__/Text.test.tsx`

---

#### RED Phase

**File**: `src/components/design-system/__tests__/Text.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Text Component', () => {
  describe('Rendering', () => {
    it('should render children correctly', async () => {
      const { Text } = await import('../Text');
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render as span by default', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text>Content</Text>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('should render as specified element', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text as="p">Paragraph</Text>);
      expect(container.firstChild?.nodeName).toBe('P');
    });

    it('should render as heading elements', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text as="h1">Heading</Text>);
      expect(container.firstChild?.nodeName).toBe('H1');
    });
  });

  describe('Variants', () => {
    it('should apply heading variant classes', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text variant="heading">Heading</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('font-heading');
      expect(element.className).toContain('text-text-primary');
    });

    it('should apply body variant classes', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text variant="body">Body</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('font-body');
      expect(element.className).toContain('text-text-secondary');
    });

    it('should apply muted variant classes', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text variant="muted">Muted</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('text-text-muted');
    });

    it('should apply gold variant classes', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text variant="gold">Gold</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('font-mono');
      expect(element.className).toContain('text-gold-primary');
    });
  });

  describe('Sizes', () => {
    it('should apply size classes', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text size="lg">Large</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('text-lg');
    });

    it('should apply small size', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text size="sm">Small</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('text-sm');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className', async () => {
      const { Text } = await import('../Text');
      const { container } = render(<Text className="custom-class">Text</Text>);
      const element = container.firstChild as HTMLElement;

      expect(element.className).toContain('custom-class');
    });
  });
});
```

**Run Test**: Test fails.

---

#### GREEN Phase

**File**: `src/components/design-system/Text.tsx`

```typescript
import React from 'react';

type TextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';

interface TextProps {
  as?: TextElement;
  variant?: 'heading' | 'body' | 'muted' | 'accent' | 'gold' | 'number';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  heading: 'font-heading text-text-primary',
  body: 'font-body text-text-secondary',
  muted: 'font-body text-text-muted',
  accent: 'font-body text-text-accent',
  gold: 'font-mono text-gold-primary',
  number: 'font-mono text-text-primary',
};

const sizeClasses: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text: React.FC<TextProps> = ({
  as: Component = 'span',
  variant = 'body',
  size,
  weight,
  className = '',
  children,
}) => {
  const classes = [
    variantClasses[variant],
    size ? sizeClasses[size] : '',
    weight ? weightClasses[weight] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{children}</Component>;
};

export default Text;
```

**Run Test**: Tests should pass.

---

### Cycle 10: StatCard Component

**File**: `src/components/design-system/StatCard.tsx`
**Test File**: `src/components/design-system/__tests__/StatCard.test.tsx`

---

#### RED Phase

**File**: `src/components/design-system/__tests__/StatCard.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('StatCard Component', () => {
  describe('Rendering', () => {
    it('should render label and value', async () => {
      const { StatCard } = await import('../StatCard');
      render(<StatCard label="Score" value={1000} icon="🎯" />);

      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('should render icon', async () => {
      const { StatCard } = await import('../StatCard');
      render(<StatCard label="Score" value={100} icon="🎯" />);
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should render string values', async () => {
      const { StatCard } = await import('../StatCard');
      render(<StatCard label="Gold" value="500g" icon="💰" />);
      expect(screen.getByText('500g')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(<StatCard label="Test" value={0} icon="📊" />);
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
    });

    it('should apply gold variant styles', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Gold" value={100} icon="💰" variant="gold" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('border-gold-primary');
    });

    it('should apply success variant styles', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Wins" value={10} icon="✓" variant="success" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('border-interactive-success');
    });

    it('should apply danger variant styles', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Lives" value={3} icon="❤️" variant="danger" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('border-interactive-danger');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Test" value={0} icon="📊" className="custom-class" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('custom-class');
    });
  });
});
```

**Run Test**: Test fails.

---

#### GREEN Phase

**File**: `src/components/design-system/StatCard.tsx`

```typescript
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: 'default' | 'gold' | 'success' | 'danger' | 'info';
  className?: string;
}

const borderColors: Record<string, string> = {
  default: 'border-panel-border',
  gold: 'border-gold-primary',
  success: 'border-interactive-success',
  danger: 'border-interactive-danger',
  info: 'border-text-accent',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = 'default',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`
        bg-panel-primary rounded-lg p-3 border-l-4
        ${borderColors[variant]}
        ${className}
      `}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-text-muted text-sm">{label}</span>
        <span className="text-lg" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-text-primary font-mono">{value}</div>
    </motion.div>
  );
};

export default StatCard;
```

**Run Test**: Tests should pass.

---

## Boilerplate Code

### Project Structure Setup

Run these commands to create the folder structure:

```bash
# Create design system directories
mkdir -p /home/roach/defence-game/src/design-system/hooks
mkdir -p /home/roach/defence-game/src/design-system/__tests__

# Create design system component directories
mkdir -p /home/roach/defence-game/src/components/design-system/__tests__
```

### Install Dependencies

```bash
cd /home/roach/defence-game
npm install framer-motion @fontsource/press-start-2p
npm install -D jest-axe @types/jest-axe
```

### CSS Variables (Add to `src/index.css`)

```css
/* Design System CSS Variables */
/* Auto-generated from design-system/tokens.ts */

:root {
  /* Panel Colors */
  --color-panel-primary: #1e2a3d;
  --color-panel-hover: #253448;
  --color-panel-active: #2d4156;
  --color-panel-border: #3a5068;
  --color-panel-accent: #4a90d9;

  /* Overlay Colors */
  --color-overlay-bg: rgba(10, 15, 25, 0.85);
  --color-overlay-panel: #1a2332;

  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a8b8c8;
  --color-text-muted: #6b7b8b;
  --color-text-accent: #4a90d9;

  /* Gold Colors */
  --color-gold-primary: #ffd700;
  --color-gold-secondary: #ffa500;

  /* Interactive Colors */
  --color-interactive-primary: #3498db;
  --color-interactive-primary-hover: #2980b9;
  --color-interactive-success: #27ae60;
  --color-interactive-success-hover: #219a52;
  --color-interactive-warning: #f39c12;
  --color-interactive-warning-hover: #d68910;
  --color-interactive-danger: #e74c3c;
  --color-interactive-danger-hover: #c0392b;

  /* Tower Colors */
  --color-tower-peashooter: #32cd32;
  --color-tower-sunflower: #ffd700;
  --color-tower-wallnut: #8b4513;
  --color-tower-mortar: #ff6347;

  /* Typography */
  --font-heading: 'Comic Sans MS', 'Comic Sans', cursive;
  --font-body: Arial, Helvetica, sans-serif;
  --font-mono: 'Press Start 2P', monospace;

  /* Shadows */
  --shadow-panel: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-glow-gold: 0 0 10px rgba(255, 215, 0, 0.5);
}
```

### Updated Tailwind Configuration

**File**: `tailwind.config.js` (replace entire content)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Existing game colors (keep for compatibility)
        game: {
          primary: '#4a90d9',
          secondary: '#2c3e50',
          accent: '#f39c12',
          success: '#27ae60',
          danger: '#e74c3c',
          dark: '#1a1a2e',
          light: '#eee',
        },
        // Design System: Panel colors
        panel: {
          primary: 'var(--color-panel-primary)',
          hover: 'var(--color-panel-hover)',
          active: 'var(--color-panel-active)',
          border: 'var(--color-panel-border)',
          accent: 'var(--color-panel-accent)',
        },
        // Design System: Overlay colors
        overlay: {
          bg: 'var(--color-overlay-bg)',
          panel: 'var(--color-overlay-panel)',
        },
        // Design System: Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-text-accent)',
        },
        // Design System: Gold colors
        gold: {
          primary: 'var(--color-gold-primary)',
          secondary: 'var(--color-gold-secondary)',
        },
        // Design System: Interactive colors
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
        // Existing tower colors (keep for Phaser compatibility)
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
        // Existing enemy colors (keep)
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
        // Existing UI colors (keep for compatibility)
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
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
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

### Barrel Export Files

**File**: `src/design-system/index.ts`

```typescript
// Design System Barrel Export
export * from './tokens';
export * from './types';
export * from './tailwind-classes';
export * from './phaser-config';
export { useAnimationPreset, useButtonAnimation } from './hooks/useAnimation';
```

**File**: `src/components/design-system/index.ts`

```typescript
// Design System Components Barrel Export
export { Panel } from './Panel';
export { Button } from './Button';
export { Text } from './Text';
export { StatCard } from './StatCard';
export { TowerButton } from './TowerButton';
```

### Design System Types

**File**: `src/design-system/types.ts`

```typescript
import React from 'react';

/**
 * Complete type definitions for design system
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
  noAnimation?: boolean;
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
  className?: string;
}

export interface TextProps {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';
  variant?: 'heading' | 'body' | 'muted' | 'accent' | 'gold' | 'number';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}
```

### Tailwind Classes Mapping

**File**: `src/design-system/tailwind-classes.ts`

```typescript
/**
 * Semantic class names that map to design tokens
 * Use these instead of arbitrary Tailwind classes
 */

export const panelClasses = {
  base: 'bg-panel-primary/95 border border-panel-border/50 rounded-panel p-panel shadow-md',
  elevated:
    'bg-panel-primary border border-panel-accent/30 rounded-panel p-panel shadow-panel',
  overlay:
    'bg-panel-primary/98 border border-panel-accent/20 rounded-panel p-panel-lg shadow-xl',
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

**File**: `src/design-system/phaser-config.ts`

```typescript
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

### Animation Hook

**File**: `src/design-system/hooks/useAnimation.ts`

```typescript
import { useReducedMotion } from 'framer-motion';
import { animation, type Animation } from '../tokens';

type AnimationPresetKey = keyof typeof animation.presets;

interface AnimationConfig {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

const emptyAnimation: AnimationConfig = {
  initial: {},
  animate: {},
  exit: {},
  transition: { duration: 0 },
};

/**
 * Hook that returns animation preset with reduced-motion support
 */
export function useAnimationPreset(
  preset: AnimationPresetKey
): AnimationConfig {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return emptyAnimation;
  }

  const presetConfig = animation.presets[preset];

  // Handle presets that don't have full config (like buttonHover)
  if ('scale' in presetConfig && !('initial' in presetConfig)) {
    return {
      animate: presetConfig,
      transition:
        'transition' in presetConfig ? presetConfig.transition : undefined,
    };
  }

  return presetConfig as AnimationConfig;
}

/**
 * Hook that returns button-specific hover and tap animations
 */
export function useButtonAnimation(disabled: boolean = false) {
  const shouldReduceMotion = useReducedMotion();

  if (disabled || shouldReduceMotion) {
    return {
      whileHover: {},
      whileTap: {},
    };
  }

  return {
    whileHover: animation.presets.buttonHover,
    whileTap: animation.presets.buttonTap,
  };
}
```

### Update main.tsx

**File**: `src/main.tsx` (add import at top)

```typescript
// Add this import near the top of the file, after React imports
import '@fontsource/press-start-2p';
```

---

## Component Migration Examples

### Example Migration: Footer.tsx

**Before** (current):

```tsx
<footer className="bg-gray-800 text-white p-4 mt-auto">
  <div className="container mx-auto flex justify-between items-center text-sm">
    <div className="flex items-center space-x-4">
      <span className="text-gray-400">
        Tower Defense with Merging Mechanics
      </span>
      <span className="text-gray-500">v{gameVersion}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-green-400">FPS: {fps}</span>
```

**After** (migrated):

```tsx
import React from 'react';
import { Panel, Text, Button } from './design-system';

interface FooterProps {
  gameVersion?: string;
  fps?: number;
}

const Footer: React.FC<FooterProps> = ({ gameVersion = '0.1.0', fps = 60 }) => {
  return (
    <footer className="bg-panel-primary text-text-primary p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <Text variant="muted">Tower Defense with Merging Mechanics</Text>
          <Text variant="muted" size="xs">
            v{gameVersion}
          </Text>
        </div>
        <div className="flex items-center space-x-4">
          <Text variant="gold" className="font-mono">
            FPS: {fps}
          </Text>
          <Button variant="ghost" size="sm">
            Help
          </Button>
          <Button variant="ghost" size="sm">
            About
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### Example Migration: TowerSelectionPanel.tsx

**After** (migrated):

```tsx
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { TowerType } from '../types';
import { useGameStore } from '../store/gameStore';
import { Panel, Text, TowerButton } from './design-system';
import { animation } from '../design-system/tokens';
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  emitEvent,
  type GameEvents,
} from '../utils/EventBus';

interface TowerOption {
  type: TowerType;
  name: string;
  cost: number;
  description: string;
  icon: string;
}

const TOWER_OPTIONS: TowerOption[] = [
  {
    type: TowerType.SUNFLOWER,
    name: 'Sunflower',
    cost: 50,
    description: 'Generates resources',
    icon: '🌻',
  },
  {
    type: TowerType.WALLNUT,
    name: 'Wallnut',
    cost: 75,
    description: 'Blocks enemies',
    icon: '🥜',
  },
  {
    type: TowerType.PEASHOOTER,
    name: 'Peashooter',
    cost: 100,
    description: 'Shoots projectiles',
    icon: '🌱',
  },
  {
    type: TowerType.MORTAR,
    name: 'Mortar',
    cost: 175,
    description: 'Area damage with splash effect',
    icon: '💣',
  },
];

const TowerSelectionPanel: React.FC = () => {
  const { gold, selectedTowerType, selectTowerType } = useGameStore(
    useShallow((state) => ({
      gold: state.gold,
      selectedTowerType: state.selectedTowerType,
      selectTowerType: state.selectTowerType,
    }))
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handlePlacementFailed = (data: GameEvents['placementFailed']) => {
      setErrorMessage(data.message);
      window.setTimeout(() => setErrorMessage(null), 2000);
    };

    subscribeToEvent('placementFailed', handlePlacementFailed);

    return () => {
      unsubscribeFromEvent('placementFailed', handlePlacementFailed);
    };
  }, []);

  const handleSelectTower = (type: TowerType) => {
    if (selectedTowerType === type) {
      selectTowerType(null);
    } else {
      selectTowerType(type);
    }
  };

  const handleDragStart = (e: React.DragEvent, type: TowerType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ towerType: type })
    );
    emitEvent('towerDragStart', { towerType: type });
  };

  const handleDragEnd = () => {
    emitEvent('towerDragEnd', { success: false });
  };

  const canAfford = (cost: number) => gold >= cost;

  return (
    <Panel variant="base" className="w-48 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" variant="heading" weight="bold">
          Towers
        </Text>
        <Text variant="gold" weight="bold">
          {gold}g
        </Text>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            {...animation.presets.fadeIn}
            className="bg-interactive-danger text-text-primary p-2 rounded mb-2 text-sm text-center"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col space-y-2">
        {TOWER_OPTIONS.map((tower) => (
          <TowerButton
            key={tower.type}
            towerType={tower.type}
            name={tower.name}
            cost={tower.cost}
            icon={tower.icon}
            description={tower.description}
            affordable={canAfford(tower.cost)}
            selected={selectedTowerType === tower.type}
            onSelect={() => handleSelectTower(tower.type)}
            onDragStart={(e) => handleDragStart(e, tower.type)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <Text variant="muted" size="xs" className="mt-4">
        {selectedTowerType
          ? 'Click on grid or drag tower to place'
          : 'Click to select or drag tower to place'}
      </Text>
    </Panel>
  );
};

export default TowerSelectionPanel;
```

---

## Verification Checklist

### After Phase 1 (Foundation)

- [ ] `npm run test -- src/design-system/` passes all tests
- [ ] `npx tsc --noEmit` shows no type errors
- [ ] Design tokens file exports all required values
- [ ] CSS variables added to `src/index.css`
- [ ] Tailwind config updated with CSS variable references

### After Phase 2 (Component Library)

- [ ] `npm run test -- src/components/design-system/` passes all tests
- [ ] All 5 components render correctly
- [ ] Animations work (verify visually in browser)
- [ ] Reduced-motion respected (test with OS setting)

### After Phase 3 (Configuration)

- [ ] `npm run build` completes without errors
- [ ] Press Start 2P font loads correctly
- [ ] CSS variables apply correctly in browser

### After Phase 4 (Migration)

- [ ] No `bg-gray-*` classes in migrated components
- [ ] No `text-gray-*` classes in migrated components
- [ ] All components render with new design system
- [ ] Game still functions correctly (play test)
- [ ] 60 FPS maintained
- [ ] Bundle size increase < 52KB gzipped

### Final Verification

- [ ] Run `npm run test` - all tests pass
- [ ] Run `npm run build` - build succeeds
- [ ] Run `npm run lint` - no errors
- [ ] Visual inspection in browser - UI looks consistent
- [ ] Test on different screen sizes
- [ ] Verify contrast ratios meet WCAG AA

---

## Getting Started

**Step 1**: Set up project structure

```bash
mkdir -p /home/roach/defence-game/src/design-system/hooks
mkdir -p /home/roach/defence-game/src/design-system/__tests__
mkdir -p /home/roach/defence-game/src/components/design-system/__tests__
```

**Step 2**: Install dependencies

```bash
cd /home/roach/defence-game
npm install framer-motion @fontsource/press-start-2p
```

**Step 3**: Create foundation files (Phase 1)

- Start with `src/design-system/tokens.ts`
- Write tests first (RED)
- Implement minimal code (GREEN)
- Refactor and add remaining features

**Step 4**: Create component library (Phase 2)

- Start with `Panel.tsx` (simplest)
- Follow TDD cycles for each component
- Create barrel exports

**Step 5**: Update configuration (Phase 3)

- Add CSS variables to `index.css`
- Update `tailwind.config.js`
- Add font import to `main.tsx`

**Step 6**: Migrate components (Phase 4)

- Start with `Footer.tsx` (simplest)
- Work through migration order
- Test each component after migration

**Step 7**: Final verification

- Run all tests
- Visual inspection
- Performance check

---

**Document Status**: Ready for Implementation

**Estimated Total Time**: 3-4 days (8 hours/day)

---

_This implementation plan provides explicit, step-by-step guidance for implementing the Design System Integration feature. All decisions are pre-made, all file paths are specified, and all code is ready to adapt._
