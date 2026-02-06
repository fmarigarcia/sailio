import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import './card.css';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  fullWidth?: boolean;
}

interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
}

interface CardBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
}

interface CardFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
}

const CardRoot: React.FC<CardProps> = ({
  children,
  variant = 'default',
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={clsx('card', `card--${variant}`, fullWidth && 'card--full-width')} {...props}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, ...props }) => {
  return (
    <div className="card__header" {...props}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children, ...props }) => {
  return (
    <div className="card__body" {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, ...props }) => {
  return (
    <div className="card__footer" {...props}>
      {children}
    </div>
  );
};

CardRoot.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { Card };
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps };
