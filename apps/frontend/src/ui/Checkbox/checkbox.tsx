import { forwardRef, InputHTMLAttributes } from 'react';
import './checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the checkbox */
  label?: string;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text to display below the checkbox */
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error = false, errorMessage, helperText, className = '', disabled, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${crypto.randomUUID()}`;

    return (
      <div className={`checkbox-wrapper ${className}`}>
        <div className="checkbox-container">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`checkbox-input ${error ? 'checkbox-input--error' : ''} ${disabled ? 'checkbox-input--disabled' : ''}`}
            disabled={disabled}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={`checkbox-label ${disabled ? 'checkbox-label--disabled' : ''}`}
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
