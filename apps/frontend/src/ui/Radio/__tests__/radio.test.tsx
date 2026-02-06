import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from '../radio';

describe('Radio', () => {
  it('renders without label', () => {
    render(<Radio name="test" />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Radio label="Option A" name="test" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders as unchecked by default', () => {
    render(<Radio label="Option A" name="test" />);
    const radio = screen.getByRole('radio');
    expect(radio).not.toBeChecked();
  });

  it('renders as checked when checked prop is true', () => {
    render(<Radio label="Option A" name="test" checked readOnly />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio label="Option A" name="test" onChange={handleChange} />);

    const radio = screen.getByRole('radio');
    await user.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when label is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio label="Option A" name="test" onChange={handleChange} />);

    const label = screen.getByText('Option A');
    await user.click(label);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio label="Option A" name="test" onChange={handleChange} disabled />);

    const radio = screen.getByRole('radio');
    await user.click(radio);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders with disabled state', () => {
    render(<Radio label="Option A" name="test" disabled />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  it('renders with error message', () => {
    render(<Radio label="Option A" name="test" error errorMessage="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Radio label="Option A" name="test" helperText="Please select carefully" />);
    expect(screen.getByText('Please select carefully')).toBeInTheDocument();
  });

  it('does not render error message when error is false', () => {
    render(
      <Radio label="Option A" name="test" error={false} errorMessage="This field is required" />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('does not render helper text when error is shown', () => {
    render(
      <Radio
        label="Option A"
        name="test"
        error
        errorMessage="Error message"
        helperText="Helper text"
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Radio label="Option A" name="test" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    render(<Radio label="Option A" name="test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('uses provided id', () => {
    render(<Radio label="Option A" name="test" id="custom-id" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id', 'custom-id');
  });

  it('generates unique id when not provided', () => {
    render(<Radio label="Option A" name="test" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id');
  });

  it('links label to input via htmlFor', () => {
    render(<Radio label="Option A" name="test" id="test-radio" />);
    const radio = screen.getByRole('radio');
    const label = screen.getByText('Option A');
    expect(radio).toHaveAttribute('id', 'test-radio');
    expect(label).toHaveAttribute('for', 'test-radio');
  });

  it('groups radios with same name', () => {
    render(
      <>
        <Radio label="Option A" name="group" id="option-a" />
        <Radio label="Option B" name="group" id="option-b" />
      </>
    );
    const radioA = screen.getByLabelText('Option A');
    const radioB = screen.getByLabelText('Option B');
    expect(radioA).toHaveAttribute('name', 'group');
    expect(radioB).toHaveAttribute('name', 'group');
  });
});
