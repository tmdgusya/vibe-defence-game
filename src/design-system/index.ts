export { colors, typography, spacing, animation, shadows } from './tokens';
export { hexToNumber, getTowerColors, getButtonStyles } from './tokens';

export { PhaserColors, getPhaserTowerColors } from './phaser-config';
export { useAnimationPreset, useButtonAnimation } from './hooks/useAnimation';

import { colors, typography, spacing, animation, shadows } from './tokens';

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Animation = typeof animation;
export type Shadows = typeof shadows;
export type TowerType = keyof typeof colors.tower;
export type InteractiveVariant = keyof typeof colors.interactive;

export type ColorPath =
  | `ui.panel.${string}`
  | `ui.overlay.${string}`
  | `ui.text.${string}`
  | `ui.gold.${string}`
  | `interactive.${string}.${string}`
  | `tower.${string}.${string}`
  | `feedback.${string}`
  | `level.${string}`;

export type AnimationPreset =
  | 'fadeIn'
  | 'slideUp'
  | 'scaleIn'
  | 'buttonHover'
  | 'buttonTap'
  | 'goldPulse';
