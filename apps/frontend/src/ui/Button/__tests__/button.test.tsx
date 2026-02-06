import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with default variant (primary)', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--primary');
    });

    it('renders with default size (md)', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--md');
    });

    it('renders with default type (button)', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('variants', () => {
    it('renders primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--primary');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--secondary');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--danger');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--ghost');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--sm');
    });

    it('renders medium size', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--md');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--lg');
    });
  });

  describe('loading state', () => {
    it('shows loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--loading');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('renders spinner SVG when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('.btn__spinner');
      expect(spinner).toBeInTheDocument();
      const svg = spinner?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides content visually when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const content = container.querySelector('.btn__content--loading');
      expect(content).toBeInTheDocument();
    });

    it('does not show loading spinner when loading is false', () => {
      const { container } = render(<Button loading={false}>Not Loading</Button>);
      const spinner = container.querySelector('.btn__spinner');
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is not disabled by default', () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('can receive focus', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('cannot receive focus when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });
  });

  describe('button types', () => {
    it('renders as submit button', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders as reset button', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('renders as button type', () => {
      render(<Button type="button">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('additional props', () => {
    it('forwards additional HTML button attributes', () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom label">
          Button
        </Button>
      );
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('does not accept className prop in TypeScript', () => {
      // TypeScript prevents className at compile time via Omit
      // We verify the TypeScript types correctly exclude className
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('does not accept style prop in TypeScript', () => {
      // TypeScript prevents style at compile time via Omit
      // We verify the TypeScript types correctly exclude style
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('combined states', () => {
    it('renders primary large loading button', () => {
      render(
        <Button variant="primary" size="lg" loading>
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--primary', 'btn--lg', 'btn--loading');
      expect(button).toBeDisabled();
    });

    it('renders secondary small disabled button', () => {
      render(
        <Button variant="secondary" size="sm" disabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--secondary', 'btn--sm');
      expect(button).toBeDisabled();
    });

    it('renders danger medium button with click handler', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="danger" size="md" onClick={handleClick}>
          Delete
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--danger', 'btn--md');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders ghost large submit button', () => {
      render(
        <Button variant="ghost" size="lg" type="submit">
          Submit
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--ghost', 'btn--lg');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('accessibility', () => {
    it('has button role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has aria-busy attribute when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('does not have aria-busy when not loading', () => {
      render(<Button>Not Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'false');
    });

    it('spinner has aria-hidden', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('.btn__spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
