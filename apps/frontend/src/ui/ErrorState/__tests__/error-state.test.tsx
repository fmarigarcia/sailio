import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from '../error-state';

describe('ErrorState', () => {
  it('renders title and description', () => {
    render(<ErrorState title="Request failed" description="Please retry later." />);

    expect(screen.getByText('Request failed')).toBeInTheDocument();
    expect(screen.getByText('Please retry later.')).toBeInTheDocument();
  });

  it('forwards custom attributes', () => {
    render(
      <ErrorState
        title="Error"
        description="Description"
        data-testid="error-state"
        id="error-state-id"
      />
    );

    const element = screen.getByTestId('error-state');
    expect(element).toHaveAttribute('id', 'error-state-id');
  });
});
