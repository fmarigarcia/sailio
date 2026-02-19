import React, { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Alert } from '../Alert';
import './error-state.css';

export interface ErrorStateProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'className' | 'style'
> {
  title: string;
  description: ReactNode;
  fullWidth?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  fullWidth = true,
  ...props
}) => {
  return (
    <div className="error-state" {...props}>
      <Alert variant="error" title={title} fullWidth={fullWidth}>
        {description}
      </Alert>
    </div>
  );
};

export { ErrorState };
