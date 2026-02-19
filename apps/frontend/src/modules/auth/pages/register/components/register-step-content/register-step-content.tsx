import React from 'react';
import './register-step-content.css';

interface RegisterStepContentProps {
  children: React.ReactNode;
}

const RegisterStepContent: React.FC<RegisterStepContentProps> = ({ children }) => {
  return <div className="register-step-content">{children}</div>;
};

export default RegisterStepContent;
