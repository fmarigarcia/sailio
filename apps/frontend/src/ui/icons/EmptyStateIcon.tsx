import React from 'react';

export interface EmptyStateIconProps {
  size?: number;
  color?: string;
}

const EmptyStateIcon: React.FC<EmptyStateIconProps> = ({ size = 48, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 12H28L24 8H8C5.79 8 4.02 9.79 4.02 12L4 36C4 38.21 5.79 40 8 40H40C42.21 40 44 38.21 44 36V16C44 13.79 42.21 12 40 12ZM40 36H8V16H40V36Z"
        fill={color}
        fillOpacity="0.3"
      />
      <path
        d="M24 26C26.21 26 28 24.21 28 22C28 19.79 26.21 18 24 18C21.79 18 20 19.79 20 22C20 24.21 21.79 26 24 26Z"
        fill={color}
        fillOpacity="0.5"
      />
    </svg>
  );
};

export { EmptyStateIcon };
