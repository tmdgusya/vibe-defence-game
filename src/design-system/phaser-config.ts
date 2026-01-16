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
