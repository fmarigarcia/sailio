import { forwardRef, ChangeEvent, useId } from 'react';
import './select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
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

export { Select };
