import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Stepper from '../stepper';

describe('Stepper', () => {
  const steps = ['Step One', 'Step Two', 'Step Three'];

  it('renders all step labels', () => {
    render(<Stepper steps={steps} currentStep={1} />);

    expect(screen.getByText('Step One')).toBeInTheDocument();
    expect(screen.getByText('Step Two')).toBeInTheDocument();
    expect(screen.getByText('Step Three')).toBeInTheDocument();
  });

  it('renders a list with listitems', () => {
    render(<Stepper steps={steps} currentStep={2} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks active and completed steps correctly', () => {
    const { container } = render(<Stepper steps={steps} currentStep={2} />);

    const renderedSteps = container.querySelectorAll('.stepper__step');
    expect(renderedSteps[0]).toHaveClass('stepper__step--completed');
    expect(renderedSteps[1]).toHaveClass('stepper__step--active');
    expect(renderedSteps[2]).not.toHaveClass('stepper__step--active');
    expect(renderedSteps[2]).not.toHaveClass('stepper__step--completed');
  });

  it('renders step numbers for upcoming and active steps', () => {
    render(<Stepper steps={steps} currentStep={1} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies custom aria label', () => {
    render(<Stepper steps={steps} currentStep={1} ariaLabel="Register progress" />);

    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Register progress');
  });

  it('clamps current step lower bound', () => {
    const { container } = render(<Stepper steps={steps} currentStep={0} />);
    const renderedSteps = container.querySelectorAll('.stepper__step');

    expect(renderedSteps[0]).toHaveClass('stepper__step--active');
  });

  it('clamps current step upper bound', () => {
    const { container } = render(<Stepper steps={steps} currentStep={10} />);
    const renderedSteps = container.querySelectorAll('.stepper__step');

    expect(renderedSteps[2]).toHaveClass('stepper__step--active');
  });

  it('renders children inside content container', () => {
    const { container } = render(
      <Stepper steps={steps} currentStep={1}>
        <div>Step Content</div>
      </Stepper>
    );

    expect(screen.getByText('Step Content')).toBeInTheDocument();
    expect(container.querySelector('.stepper__content')).toBeInTheDocument();
  });
});
