import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import './radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error = false, errorMessage, helperText, className = '', disabled, ...props }, ref) => {
    const radioId = props.id || `radio-${crypto.randomUUID()}`;

    return (
      <div className={clsx('radio-wrapper', className)}>
        <div className="radio-container">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={clsx(
              'radio-input',
              error && 'radio-input--error',
              disabled && 'radio-input--disabled'
            )}
            disabled={disabled}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
              className={clsx('radio-label', disabled && 'radio-label--disabled')}
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

export { Radio };
