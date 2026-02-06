import React, { ReactNode, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import './tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  maxWidth = 250,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.setProperty('--tooltip-max-width', `${maxWidth}px`);
    }
  }, [maxWidth]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    showTooltip();
  };

  const handleBlur = () => {
    setIsFocused(false);
    hideTooltip();
  };

  const shouldShow = isVisible && !disabled;

  return (
    <div className="tooltip-wrapper">
      <div
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={shouldShow ? tooltipId.current : undefined}
      >
        {children}
      </div>
      {shouldShow && (
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          role="tooltip"
          className={clsx('tooltip', `tooltip--${position}`, isFocused && 'tooltip--focused')}
        >
          <div className="tooltip__content">{content}</div>
          <div className="tooltip__arrow" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
