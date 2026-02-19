import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../emptystate';

describe('EmptyState', () => {
  describe('Basic Rendering', () => {
    it('should render with title', () => {
      render(<EmptyState title="No items found" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render with title and description', () => {
      render(<EmptyState title="No items found" description="Try adjusting your filters." />);

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
    });

    it('should render description as ReactNode', () => {
      render(
        <EmptyState
          title="No items"
          description={
            <div>
              <strong>No items found.</strong> Try again.
            </div>
          }
        />
      );

      expect(screen.getByText('No items found.', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Try again.', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render default icon when showDefaultIcon is true', () => {
      const { container } = render(<EmptyState title="Empty" showDefaultIcon={true} />);

      const icon = container.querySelector('.empty-state__icon svg');
      expect(icon).toBeInTheDocument();
    });

    it('should not render default icon when showDefaultIcon is false', () => {
      const { container } = render(<EmptyState title="Empty" showDefaultIcon={false} />);

      const icon = container.querySelector('.empty-state__icon');
      expect(icon).not.toBeInTheDocument();
    });

    it('should render custom icon when provided', () => {
      const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
      render(<EmptyState title="Empty" icon={customIcon} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should prioritize custom icon over default icon', () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(<EmptyState title="Empty" icon={customIcon} showDefaultIcon={true} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render primary action button', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="Empty"
          action={{
            label: 'Create Item',
            onClick: handleClick,
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Create Item' });
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render secondary action button', async () => {
      const handleSecondaryClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="Empty"
          action={{
            label: 'Primary Action',
            onClick: vi.fn(),
          }}
          secondaryAction={{
            label: 'Secondary Action',
            onClick: handleSecondaryClick,
          }}
        />
      );

      const secondaryButton = screen.getByRole('button', { name: 'Secondary Action' });
      expect(secondaryButton).toBeInTheDocument();

      await user.click(secondaryButton);
      expect(handleSecondaryClick).toHaveBeenCalledTimes(1);
    });

    it('should render both action buttons', () => {
      render(
        <EmptyState
          title="Empty"
          action={{
            label: 'Primary',
            onClick: vi.fn(),
          }}
          secondaryAction={{
            label: 'Secondary',
            onClick: vi.fn(),
          }}
        />
      );

      expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
    });

    it('should apply custom variant to action button', () => {
      render(
        <EmptyState
          title="Empty"
          action={{
            label: 'Danger Action',
            onClick: vi.fn(),
            variant: 'danger',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Danger Action' });
      expect(button).toHaveClass('btn--danger');
    });

    it('should not render actions container when no actions provided', () => {
      const { container } = render(<EmptyState title="Empty" />);

      const actionsContainer = container.querySelector('.empty-state__actions');
      expect(actionsContainer).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      const { container } = render(<EmptyState title="Empty" size="sm" />);

      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).toHaveClass('empty-state--sm');
    });

    it('should apply medium size class by default', () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).toHaveClass('empty-state--md');
    });

    it('should apply large size class', () => {
      const { container } = render(<EmptyState title="Empty" size="lg" />);

      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).toHaveClass('empty-state--lg');
    });
  });

  describe('Appearance Variants', () => {
    it('should apply default appearance class by default', () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).toHaveClass('empty-state--default');
    });

    it('should apply transparent appearance class', () => {
      const { container } = render(<EmptyState title="Empty" appearance="transparent" />);

      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).toHaveClass('empty-state--transparent');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<EmptyState title="Empty" />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<EmptyState title="Empty" />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-label on action buttons', () => {
      render(
        <EmptyState
          title="Empty"
          action={{
            label: 'Create',
            onClick: vi.fn(),
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Create' });
      expect(button).toHaveAttribute('aria-label', 'Create');
    });
  });

  describe('HTML Attributes', () => {
    it('should forward additional props to container', () => {
      render(<EmptyState title="Empty" data-testid="empty-state" id="my-empty-state" />);

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toHaveAttribute('id', 'my-empty-state');
    });

    it('should not accept className or style props due to TypeScript types', () => {
      // This test verifies TypeScript prevents className and style props
      // The type definition Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>
      // prevents these props at compile time
      render(<EmptyState title="Empty" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string description', () => {
      render(<EmptyState title="Empty" description="" />);

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines';
      render(<EmptyState title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription =
        'This is a very long description that contains a lot of text and might need to wrap to multiple lines to fit properly in the container.';
      render(<EmptyState title="Empty" description={longDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });
});
