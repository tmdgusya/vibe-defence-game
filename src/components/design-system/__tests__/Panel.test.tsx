import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

describe('Panel Component', () => {
  afterEach(() => {
    cleanup();
  });

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
      expect(panel.className).toContain('p-panel');
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
      const { container } = render(
        <Panel className="custom-class">Content</Panel>
      );
      const panel = container.firstChild as HTMLElement;

      expect(panel.className).toContain('bg-panel-primary');
      expect(panel.className).toContain('custom-class');
    });
  });
});
