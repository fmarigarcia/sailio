import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/query-client';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/useAuth', () => ({
  useLogin: () => ({
    mutateAsync: vi
      .fn()
      .mockResolvedValue({ user: { id: '1', email: 'test@example.com' }, token: 'token' }),
    isPending: false,
  }),
}));

const renderLogin = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form with all elements', () => {
    renderLogin();

    expect(screen.getByText(/Welcome to Sailio/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Sign in to manage your sailing training sessions/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  it('updates email input value when typing', () => {
    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input value when typing', () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('updates remember me checkbox when clicked', () => {
    renderLogin();

    const rememberCheckbox = screen.getByLabelText(/Remember me/i) as HTMLInputElement;
    expect(rememberCheckbox.checked).toBe(false);

    fireEvent.click(rememberCheckbox);
    expect(rememberCheckbox.checked).toBe(true);

    fireEvent.click(rememberCheckbox);
    expect(rememberCheckbox.checked).toBe(false);
  });

  it('shows email required error when submitting without email', async () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
  });

  it('shows password required error when submitting without password', async () => {
    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('calls navigate to register when clicking register link', () => {
    renderLogin();

    const registerLink = screen.getByText(/Register/i);
    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('calls navigate to forgot password when clicking forgot password link', () => {
    renderLogin();

    const forgotPasswordLink = screen.getByText(/Forgot password?/i);
    fireEvent.click(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  it('displays copyright text', () => {
    renderLogin();

    expect(screen.getByText(/© 2025 Sailio. All rights reserved./i)).toBeInTheDocument();
  });
});
