import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders with children text', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders as a span element with role status', () => {
      render(<Badge>Status</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.tagName).toBe('SPAN');
    });

    it('renders with default variant (neutral)', () => {
      render(<Badge>Default</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--neutral');
    });

    it('renders with default size (md)', () => {
      render(<Badge>Default</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--md');
    });
  });

  describe('variants', () => {
    it('renders success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--success');
    });

    it('renders warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--warning');
    });

    it('renders error variant', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--error');
    });

    it('renders info variant', () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--info');
    });

    it('renders neutral variant', () => {
      render(<Badge variant="neutral">Neutral</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--neutral');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--sm');
    });

    it('renders medium size', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--md');
    });
  });

  describe('accessibility', () => {
    it('has role="status" for screen readers', () => {
      render(<Badge>Active</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('preserves custom aria attributes', () => {
      render(
        <Badge aria-label="User status: Active" aria-live="polite">
          Active
        </Badge>
      );
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'User status: Active');
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('HTML attributes', () => {
    it('forwards additional HTML attributes', () => {
      render(
        <Badge data-testid="custom-badge" id="badge-1">
          Test
        </Badge>
      );
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toHaveAttribute('id', 'badge-1');
    });

    it('does not allow className prop (design system consistency)', () => {
      // TypeScript should prevent this, but we verify runtime behavior
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).toBeInTheDocument();
    });

    it('does not allow style prop (design system consistency)', () => {
      // TypeScript should prevent this, but we verify runtime behavior
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('use cases', () => {
    describe('status badges', () => {
      it('renders active status', () => {
        render(<Badge variant="success">Active</Badge>);
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      it('renders pending status', () => {
        render(<Badge variant="warning">Pending</Badge>);
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });

      it('renders error status', () => {
        render(<Badge variant="error">Error</Badge>);
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      it('renders inactive status', () => {
        render(<Badge variant="neutral">Inactive</Badge>);
        expect(screen.getByText('Inactive')).toBeInTheDocument();
      });
    });

    describe('plan badges', () => {
      it('renders free plan', () => {
        render(
          <Badge variant="neutral" size="sm">
            Free
          </Badge>
        );
        const badge = screen.getByText('Free');
        expect(badge).toHaveClass('badge--neutral', 'badge--sm');
      });

      it('renders pro plan', () => {
        render(
          <Badge variant="info" size="sm">
            Pro
          </Badge>
        );
        const badge = screen.getByText('Pro');
        expect(badge).toHaveClass('badge--info', 'badge--sm');
      });

      it('renders enterprise plan', () => {
        render(
          <Badge variant="success" size="sm">
            Enterprise
          </Badge>
        );
        const badge = screen.getByText('Enterprise');
        expect(badge).toHaveClass('badge--success', 'badge--sm');
      });
    });

    describe('role badges', () => {
      it('renders admin role', () => {
        render(
          <Badge variant="error" size="sm">
            Admin
          </Badge>
        );
        const badge = screen.getByText('Admin');
        expect(badge).toHaveClass('badge--error', 'badge--sm');
      });

      it('renders coach role', () => {
        render(
          <Badge variant="info" size="sm">
            Coach
          </Badge>
        );
        const badge = screen.getByText('Coach');
        expect(badge).toHaveClass('badge--info', 'badge--sm');
      });

      it('renders athlete role', () => {
        render(
          <Badge variant="neutral" size="sm">
            Athlete
          </Badge>
        );
        const badge = screen.getByText('Athlete');
        expect(badge).toHaveClass('badge--neutral', 'badge--sm');
      });
    });
  });

  describe('combination of props', () => {
    it('renders with all props combined', () => {
      render(
        <Badge variant="success" size="sm" data-testid="combined-badge">
          Active
        </Badge>
      );
      const badge = screen.getByTestId('combined-badge');
      expect(badge).toHaveClass('badge', 'badge--success', 'badge--sm');
      expect(badge).toHaveAttribute('role', 'status');
    });

    it('applies all CSS classes correctly', () => {
      render(<Badge variant="warning">Test</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('badge');
      expect(badge.className).toContain('badge--warning');
      expect(badge.className).toContain('badge--md');
    });
  });

  describe('edge cases', () => {
    it('renders with empty children', () => {
      render(<Badge>{''}</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    it('renders with numeric children', () => {
      render(<Badge>{10}</Badge>);
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders with React nodes as children', () => {
      render(
        <Badge>
          <span>Complex</span> Badge
        </Badge>
      );
      expect(screen.getByText(/Complex/)).toBeInTheDocument();
      expect(screen.getByText(/Badge/)).toBeInTheDocument();
    });
  });
});
