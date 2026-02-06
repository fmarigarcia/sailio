import { InputHTMLAttributes, forwardRef, useId } from 'react';
import clsx from 'clsx';
import './input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const buildInputClasses = (
  size: string,
  hasError: boolean,
  disabled: boolean,
  readOnly: boolean,
  fullWidth: boolean,
  className: string
): string => {
  return clsx(
    'input',
    `input--${size}`,
    hasError && 'input--error',
    disabled && 'input--disabled',
    readOnly && 'input--readonly',
    fullWidth && 'input--full-width',
    className
  );
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      disabled = false,
      readOnly = false,
      required = false,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = !!error;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;

    const inputClasses = buildInputClasses(
      size,
      hasError,
      disabled,
      readOnly,
      fullWidth,
      className
    );

    return (
      <div className={clsx('input-wrapper', fullWidth && 'input-wrapper--full-width')}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && (
              <span className="input-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={hasError}
          aria-describedby={helperId}
          {...props}
        />
        {(helperText || error) && (
          <span
            id={helperId}
            className={clsx('input-helper', hasError && 'input-helper--error')}
            role={hasError ? 'alert' : undefined}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
