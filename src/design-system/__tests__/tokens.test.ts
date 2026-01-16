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

    it('should have colors for all tower types', async () => {
      const { colors } = await import('../tokens');
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

    it('should have interactive element colors', async () => {
      const { colors } = await import('../tokens');
      expect(colors.interactive.primary.bg).toBe('#2980B9');
      expect(colors.interactive.success.bg).toBe('#1E8449');
      expect(colors.interactive.warning.bg).toBe('#B9770E');
      expect(colors.interactive.danger.bg).toBe('#C0392B');
    });

    it('should have feedback colors', async () => {
      const { colors } = await import('../tokens');
      expect(colors.feedback.success).toBe('#00FF00');
      expect(colors.feedback.error).toBe('#FF4444');
      expect(colors.feedback.warning).toBe('#FFA500');
      expect(colors.feedback.info).toBe('#00BFFF');
    });

    it('should have level indicator colors', async () => {
      const { colors } = await import('../tokens');
      expect(colors.level.basic).toBe('#A8B8C8');
      expect(colors.level.advanced).toBe('#4A90D9');
      expect(colors.level.elite).toBe('#9B59B6');
    });

    it('should include mortar tower colors', async () => {
      const { colors } = await import('../tokens');
      expect(colors.tower.mortar).toBeDefined();
      expect(colors.tower.mortar.primary).toBe('#FF6347');
      expect(colors.tower.mortar.border).toBe('#FF6347');
    });
  });

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
      expect(getTowerColors('mortar').primary).toBe(
        colors.tower.mortar.primary
      );
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

      expect(getButtonStyles('success').bg).toBe('#1E8449');
      expect(getButtonStyles('warning').bg).toBe('#B9770E');
      expect(getButtonStyles('danger').bg).toBe('#C0392B');
    });
  });

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

  describe('Spacing Tokens', () => {
    it('should have numeric spacing keys', async () => {
      const { spacing } = await import('../tokens');
      expect(spacing[0]).toBeDefined();
      expect(spacing[1]).toBeDefined();
      expect(spacing[4]).toBeDefined();
      expect(spacing[12]).toBeDefined();
    });

    it('should have semantic spacing objects', async () => {
      const { spacing } = await import('../tokens');
      expect(spacing.panel).toBeDefined();
      expect(spacing.button).toBeDefined();
      expect(spacing.card).toBeDefined();
    });

    it('should have panel spacing values', async () => {
      const { spacing } = await import('../tokens');
      expect(spacing.panel.padding).toBe('1rem');
      expect(spacing.panel.paddingLarge).toBe('1.5rem');
      expect(spacing.panel.borderRadius).toBe('0.75rem');
    });
  });

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

  describe('Shadow Tokens', () => {
    it('should have shadow utilities', async () => {
      const { shadows } = await import('../tokens');
      expect(shadows.sm).toBeDefined();
      expect(shadows.md).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.panel).toBeDefined();
      expect(shadows.button).toBeDefined();
    });

    it('should have glow shadows', async () => {
      const { shadows } = await import('../tokens');
      expect(shadows.glow.gold).toBeDefined();
      expect(shadows.glow.success).toBeDefined();
      expect(shadows.glow.danger).toBeDefined();
    });
  });

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
      const ratio = getContrastRatio(
        colors.ui.text.primary,
        colors.ui.panel.bg
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have WCAG AA compliant contrast for primary button text', async () => {
      const { colors } = await import('../tokens');
      const ratio = getContrastRatio(
        colors.interactive.primary.text,
        colors.interactive.primary.bg
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have WCAG AA compliant contrast for success button text', async () => {
      const { colors } = await import('../tokens');
      const ratio = getContrastRatio(
        colors.interactive.success.text,
        colors.interactive.success.bg
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have WCAG AA compliant contrast for warning button text', async () => {
      const { colors } = await import('../tokens');
      const ratio = getContrastRatio(
        colors.interactive.warning.text,
        colors.interactive.warning.bg
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have WCAG AA compliant contrast for danger button text', async () => {
      const { colors } = await import('../tokens');
      const ratio = getContrastRatio(
        colors.interactive.danger.text,
        colors.interactive.danger.bg
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
