import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { InfoIcon, SuccessIcon, WarningIcon, ErrorIcon, CloseIcon } from '../icons';
import './alert.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: AlertAction;
  fullWidth?: boolean;
}

const variantIcons: Record<AlertVariant, React.FC<{ size?: number; color?: string }>> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  fullWidth = false,
  ...props
}) => {
  const Icon = variantIcons[variant];

  return (
    <div
      className={clsx('alert', `alert--${variant}`, fullWidth && 'alert--full-width')}
      role="alert"
      {...props}
    >
      <div className="alert__icon">
        <Icon size={20} />
      </div>

      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>

        {action && (
          <button type="button" className="alert__action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>

      {dismissible && onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Close alert">
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
};

export { Alert };
