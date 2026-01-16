import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('StatCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render label and value correctly', async () => {
      const { StatCard } = await import('../StatCard');
      render(<StatCard label="Gold" value={100} icon="🪙" />);

      expect(screen.getByText('Gold')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should apply default variant', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Score" value={5000} icon="⭐" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(card.className).toContain('rounded-panel');
      expect(card.className).toContain('p-card');
    });

    it('should apply gold variant', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard variant="gold" label="Gold" value={250} icon="🪙" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(card.className).toContain('rounded-panel');
    });

    it('should apply success variant', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard variant="success" label="Wave" value={7} icon="🌊" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(card.className).toContain('rounded-panel');
    });

    it('should apply danger variant', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard variant="danger" label="Lives" value={3} icon="❤️" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(card.className).toContain('rounded-panel');
    });

    it('should apply info variant', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard variant="info" label="Kills" value={42} icon="💀" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(card.className).toContain('rounded-panel');
    });

    it('should render with all required props', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Test" value={123} icon="🎯" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('bg-panel-primary');
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { StatCard } = await import('../StatCard');
      const { container } = render(
        <StatCard label="Gold" value={100} icon="🪙" variant="gold" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
