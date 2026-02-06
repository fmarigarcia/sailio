import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import './dropdown.css';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export type DropdownPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type DropdownSize = 'small' | 'medium' | 'large';

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: DropdownPosition;
  size?: DropdownSize;
  closeOnSelect?: boolean;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'auto',
  size = 'medium',
  closeOnSelect = true,
  disabled = false,
  className = '',
  menuClassName = '',
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState<DropdownPosition>(position);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (disabled) return;

    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        onOpen?.();
      } else {
        onClose?.();
      }
      return newState;
    });
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  const handleItemClick = useCallback(
    (item: DropdownItem) => {
      if (item.disabled) return;

      item.onClick?.();

      if (closeOnSelect) {
        handleClose();
      }
    },
    [closeOnSelect, handleClose]
  );

  // Calculate position when menu opens
  useEffect(() => {
    if (isOpen && position === 'auto' && dropdownRef.current && menuRef.current) {
      const triggerRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const spaceRight = viewportWidth - triggerRect.right;
      const spaceLeft = triggerRect.left;

      let bestPosition: DropdownPosition = 'bottom';

      if (spaceBelow >= menuRect.height) {
        bestPosition = 'bottom';
      } else if (spaceAbove >= menuRect.height) {
        bestPosition = 'top';
      } else if (spaceRight >= menuRect.width) {
        bestPosition = 'right';
      } else if (spaceLeft >= menuRect.width) {
        bestPosition = 'left';
      } else {
        // Default to bottom if no good option
        bestPosition = 'bottom';
      }

      setCalculatedPosition(bestPosition);
    } else if (position !== 'auto') {
      setCalculatedPosition(position);
    }
  }, [isOpen, position]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const enabledItems = items.filter((item) => !item.disabled && !item.separator);

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex >= enabledItems.length ? 0 : nextIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const prevIndex = prev - 1;
            return prevIndex < 0 ? enabledItems.length - 1 : prevIndex;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
            handleItemClick(enabledItems[focusedIndex]);
          }
          break;
        case 'Tab':
          event.preventDefault();
          handleClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, focusedIndex, handleClose, handleItemClick]);

  // Focus first item when menu opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen]);

  const enabledItems = items.filter((item) => !item.disabled && !item.separator);

  return (
    <div
      ref={dropdownRef}
      className={clsx('dropdown', `dropdown--${size}`, className)}
      data-testid="dropdown"
    >
      <button
        ref={triggerRef}
        type="button"
        className="dropdown__trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        data-testid="dropdown-trigger"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={clsx('dropdown__menu', `dropdown__menu--${calculatedPosition}`, menuClassName)}
          role="menu"
          data-testid="dropdown-menu"
        >
          {items.map((item) => {
            if (item.separator) {
              return (
                <div
                  key={item.id}
                  className="dropdown__separator"
                  role="separator"
                  data-testid={`dropdown-separator-${item.id}`}
                />
              );
            }

            const enabledIndex = enabledItems.findIndex((e) => e.id === item.id);
            const isFocused = enabledIndex === focusedIndex;

            return (
              <button
                key={item.id}
                type="button"
                className={clsx(
                  'dropdown__item',
                  item.danger && 'dropdown__item--danger',
                  isFocused && 'dropdown__item--focused'
                )}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                role="menuitem"
                aria-disabled={item.disabled}
                data-testid={`dropdown-item-${item.id}`}
              >
                {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
                <span className="dropdown__item-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
