import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import './checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error = false, errorMessage, helperText, className = '', disabled, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${crypto.randomUUID()}`;

    return (
      <div className={clsx('checkbox-wrapper', className)}>
        <div className="checkbox-container">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              'checkbox-input',
              error && 'checkbox-input--error',
              disabled && 'checkbox-input--disabled'
            )}
            disabled={disabled}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={clsx('checkbox-label', disabled && 'checkbox-label--disabled')}
            >
              {label}
            </label>
          )}
        </div>
        {error && errorMessage && <span className="checkbox-error-message">{errorMessage}</span>}
        {!error && helperText && <span className="checkbox-helper-text">{helperText}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
