# Design System Implementation Plan - Full Spec Compliance

**Date**: 2026-01-16  
**Approach**: Option A - Replace JSON with pure TypeScript (exact SPEC compliance)  
**Total Estimated Time**: 15-20 hours  
**Total Files**: 25 new/modified files

---

## SUMMARY OF CHANGES

### What We're Building

- **TypeScript Design Tokens**: Single source of truth (`src/design-system/tokens.ts`)
- **Primitive Components**: Panel, Button, Text, StatCard, TowerButton
- **Component Migration**: Migrate 9 existing components to use design system
- **Tailwind Integration**: CSS variables for semantic tokens
- **Animation System**: Framer Motion integration with reduced-motion support
- **Phaser Compatibility**: Color conversion utilities for game rendering

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DESIGN TOKEN LAYER                        │
│  src/design-system/tokens.ts (single source of truth)       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   INTEGRATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐      │
│  │ Tailwind  │  │   Phaser  │  │  Framer Motion │      │
│  │  (CSS var)│  │ (hex->int)│  │   (animations) │      │
│  └──────────┘  └──────────┘  └────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT LAYER                           │
│  Panel, Button, Text, StatCard, TowerButton primitives      │
│  Migrated: Footer, Header, GameStats, WaveProgress, etc.  │
└─────────────────────────────────────────────────────────────┘
```

---

## DEPENDENCIES INSTALLED ✅

```bash
✓ framer-motion@^11.0.0
✓ @fontsource/press-start-2p
```

---

## IMPLEMENTATION PHASES

### PHASE 1: FOUNDATION - Design Tokens (3 hours)

#### File 1.1: `src/design-system/tokens.ts`

**Purpose**: Single source of truth for all design tokens  
**Dependencies**: None  
**Exports**: colors, typography, spacing, animation, shadows, helper functions  
**Test File**: `src/design-system/__tests__/tokens.test.ts`  
**TDD Cycles**: 5 cycles (colors, helpers, typography, spacing, animation, accessibility)

#### File 1.2: `src/design-system/types.ts`

**Purpose**: TypeScript type definitions for design system  
**Dependencies**: React types  
**Exports**: ColorPath, AnimationPreset, PanelProps, ButtonProps, TowerButtonProps, StatCardProps  
**Test File**: None (TypeScript compiler validates)  
**Estimated Time**: 30 minutes

#### File 1.3: `src/design-system/tailwind-classes.ts`

**Purpose**: Semantic Tailwind class name mappings  
**Dependencies**: None  
**Exports**: panelClasses, buttonClasses, textClasses, towerButtonClasses  
**Test File**: None (string constants, validated by TypeScript)  
**Estimated Time**: 30 minutes

#### File 1.4: `src/design-system/phaser-config.ts`

**Purpose**: Phaser-specific color conversions (hex to integer)  
**Dependencies**: `./tokens.ts`  
**Exports**: PhaserColors, getPhaserTowerColors, hexToNumber  
**Test File**: `src/design-system/__tests__/phaser-config.test.ts`  
**Estimated Time**: 30 minutes

#### File 1.5: `src/design-system/hooks/useAnimation.ts`

**Purpose**: Animation preset hooks with reduced-motion support  
**Dependencies**: `./tokens.ts`, `framer-motion`  
**Exports**: useAnimationPreset, useButtonAnimation  
**Test File**: `src/design-system/hooks/__tests__/useAnimation.test.ts`  
**Estimated Time**: 45 minutes

#### File 1.6: `src/design-system/index.ts`

**Purpose**: Barrel export for all design system modules  
**Dependencies**: All above files  
**Exports**: Re-exports all from tokens, types, tailwind-classes, phaser-config, hooks  
**Test File**: None  
**Estimated Time**: 10 minutes

---

### PHASE 2: CONFIGURATION - Tailwind & CSS (1 hour)

#### File 2.1: Update `tailwind.config.js`

**Purpose**: Add CSS variable references for design tokens  
**Changes**: Add colors, fontFamily, boxShadow, borderRadius, spacing, transitionDuration extensions  
**Test Method**: Build-time validation + visual verification  
**Estimated Time**: 30 minutes

#### File 2.2: Update `src/index.css`

**Purpose**: Add CSS custom properties from design tokens  
**Changes**: Add `:root` variables for all token values, import fonts  
**Test Method**: Visual verification + browser dev tools  
**Estimated Time**: 30 minutes

---

### PHASE 3: COMPONENT LIBRARY - Primitives (4.5 hours)

#### File 3.1: `src/components/design-system/Panel.tsx`

**Purpose**: Styled panel wrapper with variants (base, elevated, overlay)  
**Dependencies**: `tokens.ts`, `framer-motion`  
**Exports**: Panel component  
**Test File**: `src/components/design-system/__tests__/Panel.test.tsx`  
**TDD Cycles**: 3 cycles (rendering, variants, accessibility)  
**Estimated Time**: 1 hour

#### File 3.2: `src/components/design-system/Button.tsx`

**Purpose**: Styled button with variants (primary, success, warning, danger, ghost) and sizes  
**Dependencies**: `tokens.ts`, `framer-motion`  
**Exports**: Button component  
**Test File**: `src/components/design-system/__tests__/Button.test.tsx`  
**TDD Cycles**: 4 cycles (rendering, variants, interactions, accessibility)  
**Estimated Time**: 1.5 hours

#### File 3.3: `src/components/design-system/Text.tsx`

**Purpose**: Typography component with semantic variants  
**Dependencies**: `tokens.ts`  
**Exports**: Text component  
**Test File**: `src/components/design-system/__tests__/Text.test.tsx`  
**TDD Cycles**: 3 cycles (rendering, variants, accessibility)  
**Estimated Time**: 45 minutes

#### File 3.4: `src/components/design-system/StatCard.tsx`

**Purpose**: Stats display card with icon and value  
**Dependencies**: `tokens.ts`, `framer-motion`  
**Exports**: StatCard component  
**Test File**: `src/components/design-system/__tests__/StatCard.test.tsx`  
**TDD Cycles**: 3 cycles (rendering, variants, animations)  
**Estimated Time**: 45 minutes

#### File 3.5: `src/components/design-system/TowerButton.tsx`

**Purpose**: Tower selection button with type-specific border colors  
**Dependencies**: `tokens.ts`, `src/types/index.ts`, `framer-motion`  
**Exports**: TowerButton component  
**Test File**: `src/components/design-system/__tests__/TowerButton.test.tsx`  
**TDD Cycles**: 5 cycles (rendering, affordability, selection, drag-and-drop, accessibility)  
**Estimated Time**: 1 hour

#### File 3.6: `src/components/design-system/index.ts`

**Purpose**: Barrel export for design system components  
**Dependencies**: All component files  
**Exports**: Re-exports all components  
**Test File**: None  
**Estimated Time**: 10 minutes

---

### PHASE 4: COMPONENT MIGRATION (6 hours)

**Migration Order**: Simplest to most complex

#### File 4.1: Migrate `src/components/Footer.tsx`

**Dependencies**: Panel, Text components  
**Changes**: Replace `bg-gray-800` with Panel, update text styling  
**Estimated Time**: 30 minutes

#### File 4.2: Migrate `src/components/Header.tsx`

**Dependencies**: Panel, Button, Text components  
**Changes**: Replace gray panels with Panel, use Button for actions  
**Estimated Time**: 45 minutes

#### File 4.3: Migrate `src/components/GameStats.tsx`

**Dependencies**: Panel, StatCard, Text components  
**Changes**: Replace stat cards with StatCard component  
**Estimated Time**: 45 minutes

#### File 4.4: Migrate `src/components/WaveProgress.tsx`

**Dependencies**: Panel, Button, Text components  
**Changes**: Use Panel for container, Button for start action  
**Estimated Time**: 45 minutes

#### File 4.5: Migrate `src/components/TowerSelectionPanel.tsx`

**Dependencies**: Panel, TowerButton, Text components  
**Changes**: Replace tower buttons with TowerButton component  
**Estimated Time**: 1 hour

#### File 4.6: Migrate `src/components/TowerPanel.tsx`

**Dependencies**: Panel, Button, Text components  
**Changes**: Use Panel for info section, Button for actions  
**Estimated Time**: 1 hour

#### File 4.7: Migrate `src/components/PauseMenu.tsx`

**Dependencies**: Panel, Button, Text components  
**Changes**: Use Panel variant="overlay" for menu  
**Estimated Time**: 45 minutes

#### File 4.8: Migrate `src/components/GameOverScreen.tsx`

**Dependencies**: Panel, Button, Text, StatCard components  
**Changes**: Use Panel variant="overlay", StatCard for final stats  
**Estimated Time**: 45 minutes

#### File 4.9: Migrate `src/components/GameUI.tsx`

**Dependencies**: All migrated components  
**Changes**: Update imports, ensure layout works  
**Estimated Time**: 30 minutes

---

### PHASE 5: CLEANUP & VALIDATION (1 hour)

#### Task 5.1: Remove Unused JSON Files

**Files to Remove**:

- `design-system/tokens/colors.json`
- `design-system/tokens/typography.json`
- `design-system/tokens/spacing.json`
- `design-system/tokens/animation.json`

**Rationale**: Replaced by TypeScript tokens.ts

#### Task 5.2: Run Full Test Suite

```bash
npm run test
```

**Expected**: All tests pass

#### Task 5.3: Type Check

```bash
npm run type-check
```

**Expected**: No TypeScript errors

#### Task 5.4: Build Verification

```bash
npm run build
```

**Expected**: Successful build, no errors

#### Task 5.5: Visual Regression

**Action**: Start dev server, verify UI appears correctly

```bash
npm run dev
```

**Expected**: All components render with design system styling

---

## DETAILED TDD CYCLES

### Cycle 1.1: Design Tokens - Color Tokens

#### RED Phase

**Test File**: `src/design-system/__tests__/tokens.test.ts`  
**Tests**:

- Export colors object with ui.panel.bg defined
- Have all required UI panel colors (bg, bgHover, border, etc.)
- Have valid hex color format for panel colors
- Have all text color tokens (primary, secondary, muted, accent)
- Have gold color tokens (primary, secondary)

**Run**: `npm run test -- src/design-system/__tests__/tokens.test.ts`  
**Expected**: Test fails with `Cannot find module '../tokens'`

#### GREEN Phase

**Implementation**: `src/design-system/tokens.ts` (partial)  
**Code**: Color tokens only (colors object)  
**Run**: Same test command  
**Expected**: All color tests pass

#### REFACTOR Phase

**Action**: None (first cycle establishes structure)

---

### Cycle 1.2: Design Tokens - Helper Functions

#### RED Phase

**Append to Test File**: `src/design-system/__tests__/tokens.test.ts`  
**New Tests**:

- `hexToNumber` converts hex string to number
- `getTowerColors` returns correct colors for valid tower type
- `getTowerColors` returns fallback for invalid tower type
- `getButtonStyles` returns button styles for all variants

**Run**: Test command  
**Expected**: Tests fail (functions not implemented)

#### GREEN Phase

**Implementation**: `src/design-system/tokens.ts` (append)  
**Code**: Helper functions (hexToNumber, getTowerColors, getButtonStyles)  
**Run**: Test command  
**Expected**: All helper tests pass

#### REFACTOR Phase

**Action**: Optimize hexToNumber, add error handling

---

### Cycle 1.3: Design Tokens - Typography Tests

#### RED Phase

**Append to Test File**: `src/design-system/__tests__/tokens.test.ts`  
**New Tests**:

- Have all required font families (heading, body, mono)
- Heading font contains Comic Sans
- Mono font contains Press Start 2P
- Have valid rem-based font sizes
- Have all standard font sizes (xs, sm, base, lg, xl)

**Run**: Test command  
**Expected**: Tests fail (typography not implemented)

#### GREEN Phase

**Implementation**: `src/design-system/tokens.ts` (append)  
**Code**: Typography tokens (typography object)  
**Run**: Test command  
**Expected**: All typography tests pass

---

### Cycle 1.4: Design Tokens - Spacing & Animation

#### RED Phase

**Append to Test File**: `src/design-system/__tests__/tokens.test.ts`  
**New Tests**:

- Spacing has numeric keys (0-12)
- Spacing has semantic panel/button/card objects
- Animation duration values are in milliseconds
- Animation has valid preset animations with required properties
- Animation presets include fadeIn, slideUp, scaleIn, buttonHover, buttonTap

**Run**: Test command  
**Expected**: Tests fail (not implemented)

#### GREEN Phase

**Implementation**: `src/design-system/tokens.ts` (append)  
**Code**: Spacing and animation tokens  
**Run**: Test command  
**Expected**: All spacing/animation tests pass

---

### Cycle 1.5: Design Tokens - Accessibility

#### RED Phase

**Append to Test File**: `src/design-system/__tests__/tokens.test.ts`  
**New Tests**:

- WCAG AA compliant contrast for secondary text on panel (≥4.5:1)
- WCAG AA compliant contrast for primary text on panel (≥4.5:1)
- WCAG AA compliant contrast for button text (≥4.5:1)

**Implementation Details**: Include `getContrastRatio()` helper function in test  
**Run**: Test command  
**Expected**: Tests pass (colors chosen to meet WCAG AA)

---

### Cycle 2.1: Panel Component

#### RED Phase

**Test File**: `src/components/design-system/__tests__/Panel.test.tsx`  
**Tests**:

- Render children correctly
- Apply base variant classes by default
- Apply elevated variant classes
- Apply overlay variant classes
- Merge custom className
- Have no accessibility violations

**Run**: `npm run test -- src/components/design-system/__tests__/Panel.test.tsx`  
**Expected**: Test fails with `Cannot find module '../Panel'`

#### GREEN Phase

**Implementation**: `src/components/design-system/Panel.tsx`  
**Code**: Basic Panel component with variants  
**Run**: Test command  
**Expected**: All tests pass

#### REFACTOR Phase

**Action**: Add useReducedMotion support, add noAnimation prop

---

### Cycle 2.2: Button Component

#### RED Phase

**Test File**: `src/components/design-system/__tests__/Button.test.tsx`  
**Tests**:

- Rendering: all variants (primary, success, warning, danger, ghost)
- Sizes: small, medium, large classes
- Interactions: onClick fires, disabled state works
- Accessibility: focusable, type="button" default

**Run**: Test command  
**Expected**: Test fails with `Cannot find module '../Button'`

#### GREEN Phase

**Implementation**: `src/components/design-system/Button.tsx`  
**Code**: Button component with variants, sizes, Framer Motion animations  
**Run**: Test command  
**Expected**: All tests pass

#### REFACTOR Phase

**Action**: Add focus ring, useReducedMotion support

---

### Cycle 2.3: TowerButton Component

#### RED Phase

**Test File**: `src/components/design-system/__tests__/TowerButton.test.tsx`  
**Tests**:

- Rendering: tower name, cost, icon
- Affordability: gold color when affordable, danger when not
- Selection: show selected state, call onSelect
- Drag and Drop: draggable when affordable, onDragStart called
- Accessibility: descriptive aria-label, indicates not affordable

**Run**: Test command  
**Expected**: Test fails with `Cannot find module '../TowerButton'`

#### GREEN Phase

**Implementation**: `src/components/design-system/TowerButton.tsx`  
**Code**: TowerButton with type-specific border colors, affordability handling  
**Run**: Test command  
**Expected**: All tests pass

---

## CRITICAL DESIGN DECISIONS (CONFIRMED)

✅ **MORTAR Tower Colors**:

```typescript
mortar: {
  primary: '#FF6347',   // Tomato red
  secondary: '#DC143C',  // Crimson
  accent: '#FF7F50',     // Coral
  border: '#FF6347',
}
```

✅ **Token Architecture**: Pure TypeScript (Option A) - Replacing JSON files completely

✅ **Dark Theme**: All panel backgrounds dark (`#1E2A3D`), text light (`#FFFFFF`, `#A8B8C8`)

✅ **Framer Motion**: Animations with reduced-motion support via `useReducedMotion()`

✅ **FPS-Based Quality**: NOT implemented in initial phase (deferred to performance optimization)

---

## FILE STRUCTURE AFTER IMPLEMENTATION

```
src/
├── design-system/
│   ├── tokens.ts                    # NEW - Single source of truth
│   ├── types.ts                    # NEW - Type definitions
│   ├── tailwind-classes.ts         # NEW - Semantic class mappings
│   ├── phaser-config.ts           # NEW - Phaser color conversions
│   ├── hooks/
│   │   └── useAnimation.ts        # NEW - Animation hooks
│   ├── __tests__/
│   │   ├── tokens.test.ts         # NEW - Token tests
│   │   └── phaser-config.test.ts # NEW - Phaser config tests
│   └── index.ts                   # NEW - Barrel export
├── components/
│   ├── design-system/
│   │   ├── Panel.tsx              # NEW
│   │   ├── Button.tsx             # NEW
│   │   ├── Text.tsx               # NEW
│   │   ├── StatCard.tsx           # NEW
│   │   ├── TowerButton.tsx        # NEW
│   │   ├── __tests__/
│   │   │   ├── Panel.test.tsx     # NEW
│   │   │   ├── Button.test.tsx    # NEW
│   │   │   ├── Text.test.tsx      # NEW
│   │   │   ├── StatCard.test.tsx  # NEW
│   │   │   └── TowerButton.test.tsx # NEW
│   │   └── index.ts              # NEW - Barrel export
│   ├── Footer.tsx                 # MODIFIED
│   ├── Header.tsx                 # MODIFIED
│   ├── GameStats.tsx              # MODIFIED
│   ├── WaveProgress.tsx            # MODIFIED
│   ├── TowerSelectionPanel.tsx     # MODIFIED
│   ├── TowerPanel.tsx             # MODIFIED
│   ├── PauseMenu.tsx              # MODIFIED
│   ├── GameOverScreen.tsx          # MODIFIED
│   └── GameUI.tsx                # MODIFIED
└── index.css                     # MODIFIED - CSS variables

tailwind.config.js                  # MODIFIED - Token references
main.tsx                           # MODIFIED - Font import

design-system/tokens/                # DELETE - Replaced by TypeScript
├── colors.json
├── typography.json
├── spacing.json
└── animation.json
```

---

## SUCCESS CRITERIA

### Functional

✅ All tests pass (`npm run test`)  
✅ Type checking passes (`npm run type-check`)  
✅ Build succeeds (`npm run build`)  
✅ Dev server runs without errors (`npm run dev`)

### Visual

✅ All components use semantic design tokens (no generic gray classes)  
✅ Consistent color scheme across entire UI  
✅ Dark theme applied throughout  
✅ Animations work on buttons and panels  
✅ Typography uses correct fonts (Comic Sans, Press Start 2P, Arial)

### Technical

✅ Framer Motion installed and integrated  
✅ CSS variables in Tailwind config  
✅ Phaser color conversion utilities  
✅ Type-safe token access (IDE autocomplete)  
✅ WCAG AA compliant contrast ratios (verified by tests)

### Performance

✅ Bundle size increase < 52KB (measured by rollup-plugin-visualizer)  
✅ Animations respect `prefers-reduced-motion`  
✅ No console errors or warnings

---

## ROLLBACK PLAN

If critical issues arise, rollback steps:

1. Restore original components from git:

```bash
git checkout HEAD -- src/components/
```

2. Restore original config:

```bash
git checkout HEAD -- tailwind.config.js src/index.css
```

3. Remove design-system directory:

```bash
rm -rf src/design-system/ src/components/design-system/
```

4. Restore JSON tokens:

```bash
git checkout HEAD -- design-system/tokens/
```

5. Uninstall dependencies:

```bash
npm uninstall framer-motion @fontsource/press-start-2p
```

---

## NEXT STEPS FOR EXECUTION

When ready to implement:

1. **Start with Phase 1**: Create `src/design-system/tokens.ts` following SPEC.md exactly
2. **Follow TDD cycles**: Write test first, implement to pass, refactor
3. **Run tests frequently**: After each cycle to catch regressions early
4. **Verify visually**: After Phase 3, start dev server and check UI
5. **Migrate incrementally**: One component at a time in Phase 4
6. **Full regression test**: After Phase 4, run entire test suite
7. **Final validation**: Phase 5 cleanup and build verification

---

**Ready to execute?** This plan provides explicit file contents, TDD cycles, and step-by-step guidance for full SPEC compliance.
