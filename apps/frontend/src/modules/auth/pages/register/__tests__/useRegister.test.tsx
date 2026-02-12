import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useRegister } from '../useRegister';
import * as useAuthModule from '../../../hooks/useAuth';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockMutateAsync = vi.fn();
const mockUseRegisterMutation = {
  mutateAsync: mockMutateAsync,
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
  mutate: vi.fn(),
  reset: vi.fn(),
};

vi.spyOn(useAuthModule, 'useRegister').mockReturnValue(mockUseRegisterMutation as any);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      expect(result.current.state.currentStep).toBe(1);
      expect(result.current.state.formData).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        certificationLevel: '',
        clubAffiliation: '',
        phoneNumber: '',
      });
      expect(result.current.state.errors).toEqual({});
      expect(result.current.state.isLoading).toBe(false);
    });
  });

  describe('Input handling', () => {
    it('should update form data on input change', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
      });

      expect(result.current.state.formData.firstName).toBe('John');
    });

    it('should clear error when input changes', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      // Trigger validation error
      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.firstName).toBeDefined();

      // Clear error by typing
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
      });

      expect(result.current.state.errors.firstName).toBeUndefined();
    });
  });

  describe('Step 1 validation', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.firstName).toBe('errors.firstNameRequired');
      expect(result.current.state.errors.lastName).toBe('errors.lastNameRequired');
      expect(result.current.state.errors.email).toBe('errors.emailRequired');
      expect(result.current.state.errors.password).toBe('errors.passwordRequired');
      expect(result.current.state.errors.confirmPassword).toBe('errors.passwordRequired');
      expect(result.current.state.currentStep).toBe(1);
    });

    it('should validate email format', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'invalid-email' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.email).toBe('errors.emailInvalid');
    });

    it('should validate password strength', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'weak' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'weak' },
        } as any);
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.password).toBe('errors.passwordTooShort');
    });

    it('should validate password match', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Different123' },
        } as any);
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.confirmPassword).toBe('errors.passwordsNotMatch');
    });

    it('should move to step 2 when validation passes', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.currentStep).toBe(2);
      expect(Object.keys(result.current.state.errors).length).toBe(0);
    });
  });

  describe('Step 2 validation', () => {
    it('should validate phone number format when provided', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      // Fill step 1
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
        result.current.actions.handleNext();
      });

      // Invalid phone
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'phoneNumber', value: 'abc' },
        } as any);
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.phoneNumber).toBe('errors.phoneInvalid');
      expect(result.current.state.currentStep).toBe(2);
    });

    it('should allow empty phone number', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      // Fill step 1
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
        result.current.actions.handleNext();
      });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.currentStep).toBe(3);
      expect(result.current.state.errors.phoneNumber).toBeUndefined();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to previous step', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      // Move to step 2
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
        result.current.actions.handleNext();
      });

      expect(result.current.state.currentStep).toBe(2);

      act(() => {
        result.current.actions.handleBack();
      });

      expect(result.current.state.currentStep).toBe(1);
      expect(Object.keys(result.current.state.errors).length).toBe(0);
    });

    it('should not go back from step 1', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleBack();
      });

      expect(result.current.state.currentStep).toBe(1);
    });
  });

  describe('Form submission', () => {
    it('should submit form with valid data', async () => {
      mockMutateAsync.mockResolvedValueOnce({
        user: { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
        tokens: { accessToken: 'token', refreshToken: 'refresh' },
      });

      const { result } = renderHook(() => useRegister(), { wrapper });

      // Fill all steps
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
        result.current.actions.handleNext();
      });

      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'certificationLevel', value: 'intermediate' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'clubAffiliation', value: 'Yacht Club' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'phoneNumber', value: '+1234567890' },
        } as any);
        result.current.actions.handleNext();
      });

      await act(async () => {
        await result.current.actions.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        certificationLevel: 'intermediate',
        clubAffiliation: 'Yacht Club',
      });
    });

    it('should handle registration error', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('Registration failed'));

      const { result } = renderHook(() => useRegister(), { wrapper });

      // Fill all steps
      act(() => {
        result.current.actions.handleInputChange({
          target: { name: 'firstName', value: 'John' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'lastName', value: 'Doe' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'password', value: 'Password123' },
        } as any);
        result.current.actions.handleInputChange({
          target: { name: 'confirmPassword', value: 'Password123' },
        } as any);
        result.current.actions.handleNext();
        result.current.actions.handleNext();
      });

      await act(async () => {
        await result.current.actions.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.state.errors.general).toBe('errors.registrationFailed');
      expect(result.current.state.currentStep).toBe(1);
    });
  });
});
