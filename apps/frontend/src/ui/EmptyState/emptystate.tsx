import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { EmptyStateIcon } from '../icons';
import { Button } from '../Button';
import './emptystate.css';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> {
  title: string;
  description?: string | ReactNode;
  icon?: ReactNode;
  showDefaultIcon?: boolean;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  size?: EmptyStateSize;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  showDefaultIcon = true,
  action,
  secondaryAction,
  size = 'md',
  ...props
}) => {
  const renderIcon = () => {
    if (icon) {
      return <div className="empty-state__icon">{icon}</div>;
    }
    if (showDefaultIcon) {
      return (
        <div className="empty-state__icon">
          <EmptyStateIcon size={size === 'sm' ? 40 : size === 'lg' ? 64 : 48} />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={clsx('empty-state', `empty-state--${size}`)}
      role="status"
      aria-live="polite"
      {...props}
    >
      {renderIcon()}

      <div className="empty-state__content">
        <h3 className="empty-state__title">{title}</h3>
        {description && <p className="empty-state__description">{description}</p>}
      </div>

      {(action || secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              aria-label={action.label}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'secondary'}
              onClick={secondaryAction.onClick}
              aria-label={secondaryAction.label}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { EmptyState };
