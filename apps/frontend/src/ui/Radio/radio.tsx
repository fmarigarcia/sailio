import { forwardRef, InputHTMLAttributes } from 'react';
import './radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the radio */
  label?: string;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text to display below the radio */
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error = false, errorMessage, helperText, className = '', disabled, ...props }, ref) => {
    const radioId = props.id || `radio-${crypto.randomUUID()}`;

    return (
      <div className={`radio-wrapper ${className}`}>
        <div className="radio-container">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={`radio-input ${error ? 'radio-input--error' : ''} ${disabled ? 'radio-input--disabled' : ''}`}
            disabled={disabled}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
              className={`radio-label ${disabled ? 'radio-label--disabled' : ''}`}
            >
              {label}
            </label>
          )}
        </div>
        {error && errorMessage && <span className="radio-error-message">{errorMessage}</span>}
        {!error && helperText && <span className="radio-helper-text">{helperText}</span>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
