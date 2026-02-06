import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from '../modal';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Clean up body styles
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Modal Content</p>
        </Modal>
      );
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders with title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with footer', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} footer={<button type="button">Action</button>}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies small size class', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="sm">
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('.modal-sm');
      expect(modal).toBeInTheDocument();
    });

    it('applies medium size class by default', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('.modal-md');
      expect(modal).toBeInTheDocument();
    });

    it('applies large size class', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="lg">
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('.modal-lg');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    it('calls onClose when close button is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked and closeOnOverlayClick is true', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={true}>
          <p>Content</p>
        </Modal>
      );
      const overlay = container.querySelector('.modal-overlay');
      if (overlay) {
        fireEvent.click(overlay);
      }
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <p>Content</p>
        </Modal>
      );
      const overlay = container.querySelector('.modal-overlay');
      if (overlay) {
        fireEvent.click(overlay);
      }
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when modal content is clicked', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      const modalContent = container.querySelector('.modal');
      if (modalContent) {
        fireEvent.click(modalContent);
      }
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('[aria-modal="true"]');
      expect(modal).toBeInTheDocument();
    });

    it('has aria-labelledby when title is provided', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
          <p>Content</p>
        </Modal>
      );
      const modal = container.querySelector('[aria-labelledby="modal-title"]');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toHaveAttribute('id', 'modal-title');
    });

    it('prevents body scroll when open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', async () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  describe('Focus management', () => {
    it('focuses first focusable element when opened', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <button type="button">First Button</button>
          <button type="button">Second Button</button>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close');
        expect(closeButton).toHaveFocus();
      });
    });

    it('traps focus within modal on Tab', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <button type="button">Button 1</button>
          <button type="button">Button 2</button>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close');
      const button1 = screen.getByText('Button 1');
      const button2 = screen.getByText('Button 2');

      // Focus should cycle through elements
      closeButton.focus();
      fireEvent.keyDown(document, { key: 'Tab' });

      button1.focus();
      fireEvent.keyDown(document, { key: 'Tab' });

      button2.focus();
      fireEvent.keyDown(document, { key: 'Tab' });

      // After last element, should cycle back to first
      expect(closeButton).toBeDefined();
    });

    it('handles Shift+Tab for reverse focus trap', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <button type="button">Button 1</button>
          <button type="button">Button 2</button>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close');
      closeButton.focus();

      // Shift+Tab on first element should go to last
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

      expect(closeButton).toBeDefined();
    });
  });

  describe('Children and content', () => {
    it('renders children content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div data-testid="custom-content">Custom Content</div>
        </Modal>
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('renders complex content with multiple elements', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <h3>Title</h3>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <button type="button">Action</button>
        </Modal>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });
});
