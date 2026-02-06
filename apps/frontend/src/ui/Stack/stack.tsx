import React, { ReactNode } from 'react';
import clsx from 'clsx';
import './stack.css';

export interface StackProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  wrap?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
}

const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify,
  wrap = false,
  as: Component = 'div',
  children,
}) => {
  return (
    <Component
      className={clsx(
        'stack',
        `stack--${direction}`,
        `stack--spacing-${spacing}`,
        `stack--align-${align}`,
        justify && `stack--justify-${justify}`,
        wrap && 'stack--wrap'
      )}
    >
      {children}
    </Component>
  );
};

export default Stack;
