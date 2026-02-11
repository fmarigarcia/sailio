import React, { ReactNode, ElementType } from 'react';
import clsx from 'clsx';
import './container.css';

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'fluid';
  padding?: boolean;
  as?: ElementType;
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = true,
  as: Component = 'div',
  children,
}) => {
  return (
    <Component className={clsx('container', `container--${size}`, padding && 'container--padding')}>
      {children}
    </Component>
  );
};

export default Container;
