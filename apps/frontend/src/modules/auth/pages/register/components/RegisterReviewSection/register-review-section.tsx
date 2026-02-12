import React from 'react';
import './register-review-section.css';

interface RegisterReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

interface RegisterReviewItemProps {
  label: string;
  value: string;
}

const RegisterReviewSection: React.FC<RegisterReviewSectionProps> = ({ title, children }) => {
  return (
    <div className="register-review-section">
      <h3 className="register-review-title">{title}</h3>
      {children}
    </div>
  );
};

const RegisterReviewItem: React.FC<RegisterReviewItemProps> = ({ label, value }) => {
  return (
    <div className="register-review-item">
      <span className="register-review-label">{label}:</span>
      <span className="register-review-value">{value}</span>
    </div>
  );
};

export { RegisterReviewSection, RegisterReviewItem };
