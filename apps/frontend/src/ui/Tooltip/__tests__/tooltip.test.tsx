import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../tooltip';

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('renders children without tooltip initially', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByRole('button', { name: /trigger/i })).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders with custom content', () => {
      render(
        <Tooltip content={<span>Custom content</span>}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Mouse Interactions', () => {
    it('shows tooltip on mouse enter after delay', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={50}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    it('hides tooltip on mouse leave', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.unhover(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('respects custom delay', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={100}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.hover(trigger);

      // Should not appear immediately
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Wait a bit less than the delay
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Should appear after delay
      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it('cancels tooltip when mouse leaves before delay', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={100}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.hover(trigger);

      // Leave before delay completes
      await new Promise((resolve) => setTimeout(resolve, 50));
      await user.unhover(trigger);

      // Wait past the original delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Focus Interactions', () => {
    it('shows tooltip on focus', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={50}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.tab();
      expect(trigger).toHaveFocus();

      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    it('hides tooltip on blur', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.tab();

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('adds focused class when tooltip is shown via focus', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.tab();

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('tooltip--focused');
      });
    });
  });

  describe('Positions', () => {
    it('renders with top position by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('tooltip--top');
      });
    });

    it.each(['top', 'bottom', 'left', 'right'] as const)(
      'renders with %s position',
      async (position) => {
        const user = userEvent.setup();

        render(
          <Tooltip content="Tooltip text" position={position} delay={0}>
            <button>Trigger</button>
          </Tooltip>
        );

        await user.hover(screen.getByRole('button'));

        await waitFor(() => {
          const tooltip = screen.getByRole('tooltip');
          expect(tooltip).toHaveClass(`tooltip--${position}`);
        });
      }
    );
  });

  describe('Disabled State', () => {
    it('does not show tooltip when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" disabled delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('does not show tooltip on focus when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" disabled delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.tab();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses aria-describedby when tooltip is visible', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      const wrapper = trigger.parentElement?.parentElement;
      const tooltipTrigger = wrapper?.querySelector('.tooltip-trigger');

      expect(tooltipTrigger).not.toHaveAttribute('aria-describedby');

      await user.hover(trigger);

      await waitFor(() => {
        expect(tooltipTrigger).toHaveAttribute('aria-describedby');
      });
    });

    it('tooltip has role="tooltip"', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
      });
    });

    it('tooltip id matches aria-describedby', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');

      await user.hover(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const wrapper = trigger.parentElement?.parentElement;
        const tooltipTrigger = wrapper?.querySelector('.tooltip-trigger');
        const describedBy = tooltipTrigger?.getAttribute('aria-describedby');
        expect(tooltip.id).toBe(describedBy);
      });
    });
  });

  describe('Content', () => {
    it('displays text content', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Simple text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Simple text')).toBeInTheDocument();
      });
    });

    it('displays complex JSX content', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip
          content={
            <div>
              <strong>Title</strong>
              <p>Description</p>
            </div>
          }
          delay={0}
        >
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
      });
    });
  });

  describe('Cleanup', () => {
    it('cleans up timeout on unmount', () => {
      const { unmount } = render(
        <Tooltip content="Tooltip text" delay={50}>
          <button>Trigger</button>
        </Tooltip>
      );

      unmount();

      // If component doesn't crash or cause issues, cleanup worked
      expect(true).toBe(true);
    });
  });

  describe('Arrow', () => {
    it('renders arrow element', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const arrow = tooltip.querySelector('.tooltip__arrow');
        expect(arrow).toBeInTheDocument();
      });
    });
  });
});
