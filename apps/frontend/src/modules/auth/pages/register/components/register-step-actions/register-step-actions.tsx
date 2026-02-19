import React from 'react';
import './register-step-actions.css';
import clsx from 'clsx';

interface RegisterStepActionsProps {
  children: React.ReactNode;
  flex?: boolean;
}

const RegisterStepActions: React.FC<RegisterStepActionsProps> = ({ children, flex }) => {
  return (
    <div className={clsx('register-button-group', { 'register-button-group--flex': flex })}>
      {children}
    </div>
  );
};

export default RegisterStepActions;
