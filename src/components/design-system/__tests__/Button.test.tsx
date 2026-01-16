import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render children correctly', async () => {
      const { Button } = await import('../Button');
      render(<Button>Click Me</Button>);
      expect(
        screen.getByRole('button', { name: /Click Me/i })
      ).toBeInTheDocument();
    });

    it('should apply primary variant by default', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button>Primary</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('bg-interactive-primary');
    });

    it('should apply success variant', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="success">Success</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('bg-interactive-success');
    });

    it('should apply warning variant', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="warning">Warning</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('bg-interactive-warning');
    });

    it('should apply danger variant', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('bg-interactive-danger');
    });

    it('should apply ghost variant', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('hover:bg-panel-hover');
      expect(button.className).toContain('text-text-secondary');
    });

    it('should apply disabled state', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const { Button } = await import('../Button');
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      fireEvent.click(screen.getByRole('button', { name: /Click Me/i }));

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

      fireEvent.click(screen.getByRole('button', { name: /Disabled/i }));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have type="button" by default', async () => {
      const { Button } = await import('../Button');
      const { container } = render(<Button>Button</Button>);
      const button = container.firstChild as HTMLButtonElement;

      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should have focusable elements', async () => {
      const { Button } = await import('../Button');
      render(<Button>Focus Me</Button>);

      const button = screen.getByRole('button', { name: /Focus Me/i });
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should be focusable via keyboard', async () => {
      const { Button } = await import('../Button');
      render(<Button>Tab Me</Button>);

      expect(screen.getByRole('button', { name: /Tab Me/i })).toHaveAttribute(
        'tabindex',
        '0'
      );
    });

    it('should have visible focus ring when focused', async () => {
      const { Button } = await import('../Button');
      render(<Button>Focus Me</Button>);

      const button = screen.getByRole('button', { name: /Focus Me/i });
      button.focus();

      expect(button).toHaveFocus();
    });
  });
});
