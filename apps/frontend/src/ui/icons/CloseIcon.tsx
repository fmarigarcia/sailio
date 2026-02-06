import React from 'react';

export interface CloseIconProps {
  size?: number;
  color?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.8333 5.34166L14.6583 4.16666L9.99999 8.825L5.34166 4.16666L4.16666 5.34166L8.82499 10L4.16666 14.6583L5.34166 15.8333L9.99999 11.175L14.6583 15.8333L15.8333 14.6583L11.175 10L15.8333 5.34166Z"
        fill={color}
      />
    </svg>
  );
};

export { CloseIcon };
