import React from 'react';

export interface WarningIconProps {
  size?: number;
  color?: string;
}

const WarningIcon: React.FC<WarningIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M1 18H19L10 2L1 18ZM11 15H9V13H11V15ZM11 11H9V7H11V11Z" fill={color} />
    </svg>
  );
};

export { WarningIcon };
