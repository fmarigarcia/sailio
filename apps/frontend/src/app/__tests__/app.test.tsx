import { render, screen } from '@testing-library/react';
import { App } from '../app';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Sailio')).toBeInTheDocument();
  });

  it('renders the app description', () => {
    render(<App />);
    const description = screen.getByText(/SaaS/i);
    expect(description).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<App />);
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });
});
