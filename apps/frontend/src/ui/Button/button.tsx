import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Spinner } from '../icons';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ComponentProps<'button'>, 'className' | 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={clsx('btn', `btn--${variant}`, `btn--${size}`, loading && 'btn--loading')}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <Spinner />
        </span>
      )}
      <span className={loading ? 'btn__content btn__content--loading' : 'btn__content'}>
        {children}
      </span>
    </button>
  );
};

export { Button };
