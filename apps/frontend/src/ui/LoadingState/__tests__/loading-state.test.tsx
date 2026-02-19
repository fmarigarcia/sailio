import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../loading-state';

describe('LoadingState', () => {
  it('renders loading message and spinner', () => {
    render(<LoadingState message="Loading content..." />);

    expect(screen.getByRole('status', { name: 'Loading content...' })).toBeInTheDocument();
  });

  it('applies page variant class', () => {
    const { container } = render(<LoadingState message="Loading page..." variant="page" />);

    expect(container.querySelector('.loading-state--page')).toBeInTheDocument();
  });
});
