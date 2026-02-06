import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from '../alert';

describe('Alert', () => {
  describe('rendering', () => {
    it('renders with children text', () => {
      render(<Alert>Test message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders with default variant (info)', () => {
      render(<Alert>Info message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--info');
    });

    it('renders icon based on variant', () => {
      const { container } = render(<Alert variant="success">Success message</Alert>);
      const icon = container.querySelector('.alert__icon');
      expect(icon).toBeInTheDocument();
      expect(icon?.querySelector('svg')).toBeInTheDocument();
    });

    it('does not render title when not provided', () => {
      render(<Alert>Message only</Alert>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<Alert title="Alert Title">Message content</Alert>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Message content')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders info variant', () => {
      render(<Alert variant="info">Info</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--info');
    });

    it('renders success variant', () => {
      render(<Alert variant="success">Success</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--success');
    });

    it('renders warning variant', () => {
      render(<Alert variant="warning">Warning</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--warning');
    });

    it('renders error variant', () => {
      render(<Alert variant="error">Error</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--error');
    });
  });

  describe('dismissible functionality', () => {
    it('does not render close button when dismissible is false', () => {
      render(<Alert dismissible={false}>Message</Alert>);
      expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
    });

    it('does not render close button when dismissible is true but no onDismiss provided', () => {
      render(<Alert dismissible>Message</Alert>);
      expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
    });

    it('renders close button when dismissible is true and onDismiss is provided', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );
      expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
    });

    it('calls onDismiss when close button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );

      const closeButton = screen.getByLabelText('Close alert');
      await user.click(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('close button has correct icon', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );

      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('action button', () => {
    it('does not render action button when action prop is not provided', () => {
      render(<Alert>Message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('.alert__action')).not.toBeInTheDocument();
    });

    it('renders action button when action prop is provided', () => {
      const action = {
        label: 'Take Action',
        onClick: vi.fn(),
      };
      render(<Alert action={action}>Message</Alert>);
      expect(screen.getByRole('button', { name: 'Take Action' })).toBeInTheDocument();
    });

    it('calls action onClick when action button is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const action = {
        label: 'Click Me',
        onClick,
      };
      render(<Alert action={action}>Message</Alert>);

      const actionButton = screen.getByRole('button', { name: 'Click Me' });
      await user.click(actionButton);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders both close and action buttons when both are provided', () => {
      const onDismiss = vi.fn();
      const action = {
        label: 'Action',
        onClick: vi.fn(),
      };
      render(
        <Alert dismissible onDismiss={onDismiss} action={action}>
          Message
        </Alert>
      );

      expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('fullWidth prop', () => {
    it('does not have full-width class by default', () => {
      render(<Alert>Message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).not.toHaveClass('alert--full-width');
    });

    it('has full-width class when fullWidth is true', () => {
      render(<Alert fullWidth>Message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--full-width');
    });
  });

  describe('accessibility', () => {
    it('has role="alert"', () => {
      render(<Alert>Message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('close button has aria-label', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );
      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton).toHaveAttribute('aria-label', 'Close alert');
    });

    it('icons have aria-hidden="true"', () => {
      const { container } = render(<Alert>Message</Alert>);
      const icon = container.querySelector('.alert__icon svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('action button has correct type', () => {
      const action = {
        label: 'Action',
        onClick: vi.fn(),
      };
      render(<Alert action={action}>Message</Alert>);
      const actionButton = screen.getByRole('button', { name: 'Action' });
      expect(actionButton).toHaveAttribute('type', 'button');
    });

    it('close button has correct type', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );
      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('complex scenarios', () => {
    it('renders all props together correctly', () => {
      const onDismiss = vi.fn();
      const action = {
        label: 'Retry',
        onClick: vi.fn(),
      };
      render(
        <Alert
          variant="error"
          title="Error Occurred"
          dismissible
          onDismiss={onDismiss}
          action={action}
          fullWidth
        >
          An error occurred. Please try again.
        </Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert--error', 'alert--full-width');
      expect(screen.getByText('Error Occurred')).toBeInTheDocument();
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
      expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('handles long content gracefully', () => {
      const longMessage =
        'This is a very long message that should wrap properly and maintain readability. '
          .repeat(5)
          .trim();
      render(<Alert title="Long Message">{longMessage}</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('renders correctly with only title', () => {
      render(
        <Alert title="Title Only">
          <span>Content here</span>
        </Alert>
      );
      expect(screen.getByText('Title Only')).toBeInTheDocument();
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('forwards additional HTML attributes', () => {
      render(
        <Alert data-testid="custom-alert" id="alert-1">
          Message
        </Alert>
      );
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('id', 'alert-1');
    });

    it('forwards additional className', () => {
      render(<Alert data-testid="custom-alert">Message</Alert>);
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveClass('alert');
    });

    it('does not allow style override', () => {
      // @ts-expect-error - Testing that style is not allowed
      render(<Alert style={{ color: 'red' }}>Message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).not.toHaveStyle({ color: 'red' });
    });
  });

  describe('interaction', () => {
    it('multiple clicks on action button call onClick multiple times', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const action = {
        label: 'Action',
        onClick,
      };
      render(<Alert action={action}>Message</Alert>);

      const actionButton = screen.getByRole('button', { name: 'Action' });
      await user.click(actionButton);
      await user.click(actionButton);
      await user.click(actionButton);

      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('keyboard interaction works with close button', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Message
        </Alert>
      );

      const closeButton = screen.getByLabelText('Close alert');
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('keyboard interaction works with action button', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const action = {
        label: 'Action',
        onClick,
      };
      render(<Alert action={action}>Message</Alert>);

      const actionButton = screen.getByRole('button', { name: 'Action' });
      actionButton.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
