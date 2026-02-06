import React from 'react';

export interface SpinnerProps {
  size?: number;
  color?: string;
}

/* eslint-disable react/forbid-dom-props */
const Spinner: React.FC<SpinnerProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        animation: 'spin 1s linear infinite',
      }}
      aria-label="Loading"
    >
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="4" style={{ opacity: 0.25 }} />
      <path
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
/* eslint-enable react/forbid-dom-props */

export { Spinner };
