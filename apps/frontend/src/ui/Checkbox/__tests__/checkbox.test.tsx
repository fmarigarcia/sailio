import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('renders without label', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders as unchecked by default', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders as checked when checked prop is true', () => {
    render(<Checkbox label="Accept terms" checked readOnly />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when label is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={handleChange} />);

    const label = screen.getByText('Accept terms');
    await user.click(label);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={handleChange} disabled />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders with disabled state', () => {
    render(<Checkbox label="Accept terms" disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('renders with error message', () => {
    render(<Checkbox label="Accept terms" error errorMessage="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Checkbox label="Accept terms" helperText="Please read carefully" />);
    expect(screen.getByText('Please read carefully')).toBeInTheDocument();
  });

  it('does not render error message when error is false', () => {
    render(<Checkbox label="Accept terms" error={false} errorMessage="This field is required" />);
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('does not render helper text when error is shown', () => {
    render(
      <Checkbox label="Accept terms" error errorMessage="Error message" helperText="Helper text" />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Checkbox label="Accept terms" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    render(<Checkbox label="Accept terms" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('uses provided id', () => {
    render(<Checkbox label="Accept terms" id="custom-id" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-id');
  });

  it('generates unique id when not provided', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id');
  });

  it('links label to input via htmlFor', () => {
    render(<Checkbox label="Accept terms" id="test-checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(label).toHaveAttribute('for', 'test-checkbox');
  });
});
