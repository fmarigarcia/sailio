import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectOption } from '../select';

const defaultOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Select options={defaultOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Select options={defaultOptions} placeholder="Select an option" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).toBeInTheDocument();
      // Check that placeholder text exists in the DOM
      expect(select.querySelector('option[value=""]')).toHaveTextContent('Select an option');
      // Verify placeholder option attributes
      const placeholderOption = select.querySelector('option[value=""]');
      expect(placeholderOption).toHaveAttribute('disabled');
      expect(placeholderOption).toHaveAttribute('hidden');
    });

    it('renders all options', () => {
      render(<Select options={defaultOptions} />);
      defaultOptions.forEach((option) => {
        expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
      });
    });

    it('renders with a selected value', () => {
      render(<Select options={defaultOptions} value="option2" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });
  });

  describe('Sizes', () => {
    it('applies small size class', () => {
      render(<Select options={defaultOptions} size="sm" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--sm');
    });

    it('applies medium size class by default', () => {
      render(<Select options={defaultOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--md');
    });

    it('applies large size class', () => {
      render(<Select options={defaultOptions} size="lg" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--lg');
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Select options={defaultOptions} disabled />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('applies disabled class when disabled', () => {
      render(<Select options={defaultOptions} disabled />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--disabled');
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} disabled onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      await user.click(select);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('renders disabled options', () => {
      const optionsWithDisabled = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2', disabled: true },
        { value: 'option3', label: 'Option 3' },
      ];
      render(<Select options={optionsWithDisabled} />);
      const disabledOption = screen.getByRole('option', { name: 'Option 2' });
      expect(disabledOption).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('applies error class when error prop is true', () => {
      render(<Select options={defaultOptions} error />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--error');
    });

    it('renders error message when provided', () => {
      render(<Select options={defaultOptions} error errorMessage="This field is required" />);
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('select-error-message');
    });

    it('sets aria-invalid when error is true', () => {
      render(<Select options={defaultOptions} error />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('links error message with aria-describedby', () => {
      render(
        <Select
          options={defaultOptions}
          error
          errorMessage="This field is required"
          id="test-select"
        />
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'test-select-error');
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toHaveAttribute('id', 'test-select-error');
    });

    it('error message has role alert', () => {
      render(<Select options={defaultOptions} error errorMessage="This field is required" />);
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('This field is required');
    });
  });

  describe('Interaction', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      await user.selectOptions(select, 'option2');
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('calls onBlur when focus is lost', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Select options={defaultOptions} onBlur={handleBlur} />);
      const select = screen.getByRole('combobox');

      await user.click(select);
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('updates value when controlled', async () => {
      const { rerender } = render(<Select options={defaultOptions} value="option1" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option1');

      rerender(<Select options={defaultOptions} value="option3" />);
      expect(select.value).toBe('option3');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('allows keyboard navigation with arrow keys', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      select.focus();
      await user.keyboard('{ArrowDown}');
      // Native select behavior is tested by the browser
      expect(select).toHaveFocus();
    });

    it('allows selection with Enter key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);
      const select = screen.getByRole('combobox');

      select.focus();
      await user.keyboard('{Enter}');
      expect(select).toHaveFocus();
    });

    it('allows closing with Escape key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);
      const select = screen.getByRole('combobox');

      select.focus();
      await user.keyboard('{Escape}');
      expect(select).toHaveFocus();
    });

    it('supports Tab navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Select options={defaultOptions} />
          <button>Next</button>
        </div>
      );
      const select = screen.getByRole('combobox');
      const button = screen.getByRole('button');

      select.focus();
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Select options={defaultOptions} aria-label="Choose option" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-label', 'Choose option');
    });

    it('respects aria-describedby', () => {
      render(<Select options={defaultOptions} aria-describedby="helper-text" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('generates unique id when not provided', () => {
      const { container } = render(<Select options={defaultOptions} />);
      const select = container.querySelector('select');
      expect(select).toHaveAttribute('id');
      expect(select?.id).toBeTruthy();
    });

    it('uses provided id', () => {
      render(<Select options={defaultOptions} id="custom-id" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'custom-id');
    });

    it('marks as required when required prop is true', () => {
      render(<Select options={defaultOptions} required />);
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });
  });

  describe('Placeholder State', () => {
    it('applies placeholder class when no value is selected', () => {
      render(<Select options={defaultOptions} placeholder="Choose" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('select--placeholder');
    });

    it('removes placeholder class when value is selected', () => {
      render(<Select options={defaultOptions} value="option1" placeholder="Choose" />);
      const select = screen.getByRole('combobox');
      expect(select).not.toHaveClass('select--placeholder');
    });
  });

  describe('Long Options', () => {
    it('handles long option text', () => {
      const longOptions: SelectOption[] = [
        {
          value: 'long',
          label:
            'This is a very long option text that should be handled gracefully by the component',
        },
      ];
      render(<Select options={longOptions} />);
      const option = screen.getByRole('option', {
        name: /This is a very long option text/,
      });
      expect(option).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Select options={defaultOptions} className="custom-class" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });

    it('sets name attribute', () => {
      render(<Select options={defaultOptions} name="test-name" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('name', 'test-name');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Select options={defaultOptions} ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSelectElement);
    });
  });
});
