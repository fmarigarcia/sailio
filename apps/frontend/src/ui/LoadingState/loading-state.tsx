import React, { type ComponentPropsWithoutRef } from 'react';
import { Spinner } from '../Spinner';
import './loading-state.css';

export type LoadingStateVariant = 'section' | 'page';

export interface LoadingStateProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'className' | 'style'
> {
  message: string;
  variant?: LoadingStateVariant;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message, variant = 'section', ...props }) => {
  return (
    <div className={`loading-state loading-state--${variant}`} {...props}>
      <Spinner variant="centered" label={message} ariaLabel={message} />
    </div>
  );
};

export { LoadingState };
