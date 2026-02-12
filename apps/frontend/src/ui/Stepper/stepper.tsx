import React from 'react';
import clsx from 'clsx';
import { SuccessIcon } from '../icons';
import './stepper.css';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  children?: React.ReactNode;
  className?: string;
  showCompletedIcon?: boolean;
  ariaLabel?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  children,
  className,
  showCompletedIcon = true,
  ariaLabel,
}) => {
  const normalizedCurrentStep = Math.min(Math.max(currentStep, 1), steps.length);

  return (
    <div className={clsx('stepper-wrapper', className)}>
      <div className="stepper" role="list" aria-label={ariaLabel}>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < normalizedCurrentStep;
          const isActive = stepNumber === normalizedCurrentStep;

          return (
            <React.Fragment key={label}>
              <div
                className={clsx('stepper__step', {
                  'stepper__step--active': isActive,
                  'stepper__step--completed': isCompleted,
                })}
                role="listitem"
              >
                <div className="stepper__number" aria-hidden="true">
                  {isCompleted && showCompletedIcon ? <SuccessIcon size={16} /> : stepNumber}
                </div>
                <div className="stepper__label">{label}</div>
              </div>

              {stepNumber < steps.length && <div className="stepper__line" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </div>

      {children && <div className="stepper__content">{children}</div>}
    </div>
  );
};

export default Stepper;
