import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders without label', () => {
      render(<Input placeholder="No label" />);
      const input = screen.getByPlaceholderText('No label');
      expect(input).toBeInTheDocument();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Input label="Username" helperText="Choose a unique username" />);
      expect(screen.getByText('Choose a unique username')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Input label="Email" error="Email is required" />);
      const errorMessage = screen.getByText('Email is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('input-helper--error');
    });

    it('renders error instead of helper text when both provided', () => {
      render(<Input label="Email" helperText="Enter your email" error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      const { container } = render(<Input label="Email" required />);
      const requiredIndicator = container.querySelector('.input-label__required');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent('*');
    });
  });

  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input--sm');
    });

    it('renders with medium size by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input--md');
    });

    it('renders with large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input--lg');
    });
  });

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input label="Email" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('input--disabled');
    });

    it('renders readonly state', () => {
      render(<Input label="Username" value="johndoe" readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveClass('input--readonly');
    });

    it('renders error state', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input--error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Full Width', () => {
    it('renders full width when specified', () => {
      render(<Input fullWidth />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input--full-width');
    });

    it('wrapper has full width class when fullWidth is true', () => {
      const { container } = render(<Input fullWidth />);
      const wrapper = container.querySelector('.input-wrapper');
      expect(wrapper).toHaveClass('input-wrapper--full-width');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input via htmlFor and id', () => {
      render(<Input label="Email" id="email-input" />);
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('generates unique id when not provided', () => {
      const { container } = render(
        <>
          <Input label="Email 1" />
          <Input label="Email 2" />
        </>
      );
      const inputs = container.querySelectorAll('input');
      expect(inputs[0].id).toBeTruthy();
      expect(inputs[1].id).toBeTruthy();
      expect(inputs[0].id).not.toBe(inputs[1].id);
    });

    it('associates helper text with input via aria-describedby', () => {
      render(<Input label="Email" helperText="Enter your email" id="email" />);
      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('Enter your email');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
      expect(helperText).toHaveAttribute('id', 'email-helper');
    });

    it('associates error message with input via aria-describedby', () => {
      render(<Input label="Email" error="Email is required" id="email" />);
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Email is required');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
      expect(errorMessage).toHaveAttribute('id', 'email-helper');
    });

    it('error message has role="alert"', () => {
      render(<Input label="Email" error="Email is required" />);
      const errorMessage = screen.getByText('Email is required');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('helper text does not have role="alert"', () => {
      render(<Input label="Email" helperText="Enter your email" />);
      const helperText = screen.getByText('Enter your email');
      expect(helperText).not.toHaveAttribute('role');
    });
  });

  describe('User Interactions', () => {
    it('handles text input', async () => {
      const user = userEvent.setup();
      render(<Input label="Username" />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'johndoe');
      expect(input).toHaveValue('johndoe');
    });

    it('calls onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input label="Email" onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus handler', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Input label="Email" onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur handler', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Input label="Email" onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('does not allow input when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input label="Email" disabled onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('Input Types', () => {
    it('renders as password input', () => {
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders as email input', () => {
      render(<Input label="Email" type="email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders as number input', () => {
      render(<Input label="Age" type="number" />);
      const input = screen.getByLabelText('Age');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders as search input', () => {
      render(<Input label="Search" type="search" />);
      const input = screen.getByLabelText('Search');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Value Control', () => {
    it('renders with initial value', () => {
      render(<Input label="Email" value="test@example.com" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test@example.com');
    });

    it('updates controlled value', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Input label="Email" defaultValue="test@example.com" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test@example.com');

      await user.clear(input);
      await user.type(input, 'new@example.com');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('new@example.com');
    });
  });

  describe('Custom Props', () => {
    it('passes through additional HTML input attributes', () => {
      render(
        <Input label="Email" maxLength={50} minLength={5} pattern="[a-z]+" autoComplete="email" />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '50');
      expect(input).toHaveAttribute('minlength', '5');
      expect(input).toHaveAttribute('pattern', '[a-z]+');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('input');
    });
  });
});
