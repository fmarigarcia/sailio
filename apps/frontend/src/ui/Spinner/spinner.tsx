import React from 'react';
import './spinner.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'inline' | 'centered' | 'overlay';
  label?: string;
  className?: string;
  ariaLabel?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'inline',
  label,
  className = '',
  ariaLabel = 'Loading...',
}) => {
  const spinnerClasses = ['spinner', `spinner--${size}`, `spinner--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  const spinnerElement = (
    <div className={spinnerClasses}>
      <div className="spinner__container">
        <div className="spinner__circle" role="status" aria-label={ariaLabel}>
          <span className="spinner__visually-hidden">{ariaLabel}</span>
        </div>
        {label && <span className="spinner__label">{label}</span>}
      </div>
    </div>
  );

  // Para overlay, añadimos el backdrop
  if (variant === 'overlay') {
    return (
      <>
        <div className="spinner__backdrop" aria-hidden="true" />
        {spinnerElement}
      </>
    );
  }

  return spinnerElement;
};

Spinner.displayName = 'Spinner';
