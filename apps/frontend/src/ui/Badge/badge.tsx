import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import './badge.css';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', size = 'md', children, ...props }) => {
  return (
    <span className={clsx('badge', `badge--${variant}`, `badge--${size}`)} role="status" {...props}>
      {children}
    </span>
  );
};

export { Badge };
