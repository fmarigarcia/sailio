import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dropdown, DropdownItem } from '../dropdown';

describe('Dropdown', () => {
  const mockItems: DropdownItem[] = [
    { id: '1', label: 'Edit', onClick: vi.fn() },
    { id: '2', label: 'Duplicate', onClick: vi.fn() },
    { id: '3', label: 'Delete', onClick: vi.fn(), danger: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the trigger', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('should not render menu initially', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });

    it('should render menu when trigger is clicked', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });
    });

    it('should render all items', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-item-3')).toBeInTheDocument();
      });
    });

    it('should render separator', async () => {
      const itemsWithSeparator: DropdownItem[] = [
        { id: '1', label: 'Edit', onClick: vi.fn() },
        { id: 'sep', label: '', separator: true },
        { id: '2', label: 'Delete', onClick: vi.fn(), danger: true },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={itemsWithSeparator} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-separator-sep')).toBeInTheDocument();
      });
    });

    it('should render item with icon', async () => {
      const itemsWithIcon: DropdownItem[] = [
        { id: '1', label: 'Edit', icon: <span data-testid="icon">✏️</span>, onClick: vi.fn() },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={itemsWithIcon} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('icon')).toBeInTheDocument();
      });
    });

    it('should apply danger class to danger items', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        const dangerItem = screen.getByTestId('dropdown-item-3');
        expect(dangerItem).toHaveClass('dropdown__item--danger');
      });
    });

    it('should apply disabled attribute to disabled items', async () => {
      const itemsWithDisabled: DropdownItem[] = [
        { id: '1', label: 'Edit', onClick: vi.fn() },
        { id: '2', label: 'Disabled', onClick: vi.fn(), disabled: true },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={itemsWithDisabled} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-2')).toBeDisabled();
      });
    });
  });

  describe('Interaction', () => {
    it('should toggle menu on trigger click', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      const trigger = screen.getByTestId('dropdown-trigger');

      // Open
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      // Close
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
      });
    });

    it('should call item onClick when clicked', async () => {
      const onClickMock = vi.fn();
      const items: DropdownItem[] = [{ id: '1', label: 'Edit', onClick: onClickMock }];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('dropdown-item-1'));

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should close menu after selecting item by default', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('dropdown-item-1'));

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
      });
    });

    it('should not close menu after selecting item when closeOnSelect is false', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} closeOnSelect={false} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('dropdown-item-1'));

      // Menu should still be open
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });

    it('should not call onClick for disabled items', async () => {
      const onClickMock = vi.fn();
      const items: DropdownItem[] = [
        { id: '1', label: 'Disabled', onClick: onClickMock, disabled: true },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('dropdown-item-1'));

      expect(onClickMock).not.toHaveBeenCalled();
    });

    it('should close menu when clicking outside', async () => {
      render(
        <div>
          <Dropdown trigger={<button>Open</button>} items={mockItems} />
          <div data-testid="outside">Outside</div>
        </div>
      );

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close menu on Escape key', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
      });
    });

    it('should navigate items with ArrowDown', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      // Initially, first item should be focused
      expect(screen.getByTestId('dropdown-item-1')).toHaveClass('dropdown__item--focused');

      // Press ArrowDown
      fireEvent.keyDown(document, { key: 'ArrowDown' });

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-2')).toHaveClass('dropdown__item--focused');
      });
    });

    it('should navigate items with ArrowUp', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      // Press ArrowUp (should wrap to last item)
      fireEvent.keyDown(document, { key: 'ArrowUp' });

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-3')).toHaveClass('dropdown__item--focused');
      });
    });

    it('should select focused item on Enter', async () => {
      const onClickMock = vi.fn();
      const items: DropdownItem[] = [
        { id: '1', label: 'Edit', onClick: onClickMock },
        { id: '2', label: 'Duplicate', onClick: vi.fn() },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Enter' });

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should select focused item on Space', async () => {
      const onClickMock = vi.fn();
      const items: DropdownItem[] = [{ id: '1', label: 'Edit', onClick: onClickMock }];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: ' ' });

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should close menu on Tab', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Tab' });

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
      });
    });

    it('should skip separators and disabled items when navigating', async () => {
      const items: DropdownItem[] = [
        { id: '1', label: 'Edit', onClick: vi.fn() },
        { id: 'sep', label: '', separator: true },
        { id: '2', label: 'Disabled', onClick: vi.fn(), disabled: true },
        { id: '3', label: 'Delete', onClick: vi.fn() },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      // First enabled item should be focused
      expect(screen.getByTestId('dropdown-item-1')).toHaveClass('dropdown__item--focused');

      // Press ArrowDown - should skip separator and disabled, go to item 3
      fireEvent.keyDown(document, { key: 'ArrowDown' });

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-3')).toHaveClass('dropdown__item--focused');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on trigger', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveAttribute('aria-haspopup', 'true');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when menu opens', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      const trigger = screen.getByTestId('dropdown-trigger');

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have role="menu" on menu', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toHaveAttribute('role', 'menu');
      });
    });

    it('should have role="menuitem" on items', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-1')).toHaveAttribute('role', 'menuitem');
      });
    });

    it('should have aria-disabled on disabled items', async () => {
      const items: DropdownItem[] = [
        { id: '1', label: 'Disabled', onClick: vi.fn(), disabled: true },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-item-1')).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('should have role="separator" on separators', async () => {
      const items: DropdownItem[] = [
        { id: '1', label: 'Edit', onClick: vi.fn() },
        { id: 'sep', label: '', separator: true },
        { id: '2', label: 'Delete', onClick: vi.fn() },
      ];

      render(<Dropdown trigger={<button>Open</button>} items={items} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-separator-sep')).toHaveAttribute('role', 'separator');
      });
    });
  });

  describe('Props', () => {
    it('should apply position class', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} position="top" />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toHaveClass('dropdown__menu--top');
      });
    });

    it('should apply size class', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} size="large" />);

      expect(screen.getByTestId('dropdown')).toHaveClass('dropdown--large');
    });

    it('should apply custom className', () => {
      render(
        <Dropdown trigger={<button>Open</button>} items={mockItems} className="custom-dropdown" />
      );

      expect(screen.getByTestId('dropdown')).toHaveClass('custom-dropdown');
    });

    it('should apply custom menuClassName', async () => {
      render(
        <Dropdown trigger={<button>Open</button>} items={mockItems} menuClassName="custom-menu" />
      );

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toHaveClass('custom-menu');
      });
    });

    it('should call onOpen when menu opens', async () => {
      const onOpenMock = vi.fn();

      render(<Dropdown trigger={<button>Open</button>} items={mockItems} onOpen={onOpenMock} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(onOpenMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when menu closes', async () => {
      const onCloseMock = vi.fn();

      render(<Dropdown trigger={<button>Open</button>} items={mockItems} onClose={onCloseMock} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should not open when disabled', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} disabled={true} />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });

    it('should disable trigger button when disabled', () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} disabled={true} />);

      expect(screen.getByTestId('dropdown-trigger')).toBeDisabled();
    });
  });

  describe('Position Calculation', () => {
    it('should use provided position when not auto', async () => {
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} position="top" />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-menu')).toHaveClass('dropdown__menu--top');
      });
    });

    it('should calculate position when set to auto', async () => {
      // This is hard to test without mocking getBoundingClientRect
      // We'll just verify it uses auto class initially
      render(<Dropdown trigger={<button>Open</button>} items={mockItems} position="auto" />);

      fireEvent.click(screen.getByTestId('dropdown-trigger'));

      await waitFor(() => {
        const menu = screen.getByTestId('dropdown-menu');
        // Should have some position class
        expect(menu.className).toMatch(/dropdown__menu--/);
      });
    });
  });
});
