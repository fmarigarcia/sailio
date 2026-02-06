import { forwardRef, KeyboardEvent, ChangeEvent, useId } from 'react';
import './select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Unique identifier for the select
   */
  id?: string;
  /**
   * Name attribute for the select
   */
  name?: string;
  /**
   * Current selected value
   */
  value?: string;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Array of options to display
   */
  options: SelectOption[];
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select has an error
   */
  error?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when select loses focus
   */
  onBlur?: () => void;
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
  /**
   * ARIA described by for accessibility
   */
  'aria-describedby'?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id: providedId,
      name,
      value,
      placeholder,
      options,
      disabled = false,
      error = false,
      errorMessage,
      size = 'md',
      onChange,
      onBlur,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      required = false,
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
      // Native select already handles keyboard navigation
      // This is here for potential future enhancements
      const key = event.key;

      // Allow default select behavior for accessibility
      if (['ArrowDown', 'ArrowUp', 'Enter', 'Space', 'Escape', 'Tab'].includes(key)) {
        // Let native behavior handle it
        return;
      }
    };

    const selectClassName = [
      'select',
      `select--${size}`,
      error ? 'select--error' : '',
      disabled ? 'select--disabled' : '',
      !value ? 'select--placeholder' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="select-wrapper">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={selectClassName}
          aria-label={ariaLabel}
          aria-describedby={error && errorMessage ? errorId : ariaDescribedBy}
          aria-invalid={error}
          required={required}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && errorMessage && (
          <span id={errorId} className="select-error-message" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
