import React, { ReactNode } from 'react';
import './container.css';

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'fluid';
  padding?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = true,
  as: Component = 'div',
  children,
}) => {
  const classNames = ['container', `container--${size}`, padding && 'container--padding']
    .filter(Boolean)
    .join(' ');

  return <Component className={classNames}>{children}</Component>;
};

export default Container;
