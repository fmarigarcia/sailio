import { renderHook, act } from '@testing-library/react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useRegister } from '../useRegister';
import * as useAuthModule from '../../../hooks/useAuth';
import type { RegisterActions, RegisterFormData } from '../useRegister';

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

vi.spyOn(useAuthModule, 'useRegister').mockReturnValue(
  mockUseRegisterMutation as unknown as ReturnType<typeof useAuthModule.useRegister>
);

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const createChangeEvent = (name: keyof RegisterFormData, value: string): ChangeEvent<unknown> => {
  return { target: { name, value } } as unknown as ChangeEvent<unknown>;
};

const createSubmitEvent = (): FormEvent<unknown> => {
  return { preventDefault: vi.fn() } as unknown as FormEvent<unknown>;
};

const fillStep1 = (actions: RegisterActions) => {
  actions.handleInputChange(createChangeEvent('firstName', 'John'));
  actions.handleInputChange(createChangeEvent('lastName', 'Doe'));
  actions.handleInputChange(createChangeEvent('email', 'john@example.com'));
  actions.handleInputChange(createChangeEvent('password', 'Password123'));
  actions.handleInputChange(createChangeEvent('confirmPassword', 'Password123'));
  actions.handleNext();
};

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
        result.current.actions.handleInputChange(createChangeEvent('firstName', 'John'));
      });

      expect(result.current.state.formData.firstName).toBe('John');
    });

    it('should clear error when input changes', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.firstName).toBeDefined();

      act(() => {
        result.current.actions.handleInputChange(createChangeEvent('firstName', 'John'));
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
        result.current.actions.handleInputChange(createChangeEvent('firstName', 'John'));
        result.current.actions.handleInputChange(createChangeEvent('lastName', 'Doe'));
        result.current.actions.handleInputChange(createChangeEvent('email', 'invalid-email'));
        result.current.actions.handleInputChange(createChangeEvent('password', 'Password123'));
        result.current.actions.handleInputChange(
          createChangeEvent('confirmPassword', 'Password123')
        );
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.email).toBe('errors.emailInvalid');
    });

    it('should validate password strength', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange(createChangeEvent('firstName', 'John'));
        result.current.actions.handleInputChange(createChangeEvent('lastName', 'Doe'));
        result.current.actions.handleInputChange(createChangeEvent('email', 'john@example.com'));
        result.current.actions.handleInputChange(createChangeEvent('password', 'weak'));
        result.current.actions.handleInputChange(createChangeEvent('confirmPassword', 'weak'));
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.password).toBe('errors.passwordTooShort');
    });

    it('should validate password match', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.actions.handleInputChange(createChangeEvent('firstName', 'John'));
        result.current.actions.handleInputChange(createChangeEvent('lastName', 'Doe'));
        result.current.actions.handleInputChange(createChangeEvent('email', 'john@example.com'));
        result.current.actions.handleInputChange(createChangeEvent('password', 'Password123'));
        result.current.actions.handleInputChange(
          createChangeEvent('confirmPassword', 'Different123')
        );
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.confirmPassword).toBe('errors.passwordsNotMatch');
    });

    it('should move to step 2 when validation passes', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        fillStep1(result.current.actions);
      });

      expect(result.current.state.currentStep).toBe(2);
      expect(Object.keys(result.current.state.errors)).toHaveLength(0);
    });
  });

  describe('Step 2 validation', () => {
    it('should validate phone number format when provided', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        fillStep1(result.current.actions);
        result.current.actions.handleInputChange(createChangeEvent('phoneNumber', 'abc'));
        result.current.actions.handleNext();
      });

      expect(result.current.state.errors.phoneNumber).toBe('errors.phoneInvalid');
      expect(result.current.state.currentStep).toBe(2);
    });

    it('should allow empty phone number', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        fillStep1(result.current.actions);
        result.current.actions.handleNext();
      });

      expect(result.current.state.currentStep).toBe(3);
      expect(result.current.state.errors.phoneNumber).toBeUndefined();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to previous step', () => {
      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        fillStep1(result.current.actions);
      });

      expect(result.current.state.currentStep).toBe(2);

      act(() => {
        result.current.actions.handleBack();
      });

      expect(result.current.state.currentStep).toBe(1);
      expect(Object.keys(result.current.state.errors)).toHaveLength(0);
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

      act(() => {
        fillStep1(result.current.actions);
        result.current.actions.handleInputChange(
          createChangeEvent('certificationLevel', 'intermediate')
        );
        result.current.actions.handleInputChange(
          createChangeEvent('clubAffiliation', 'Yacht Club')
        );
        result.current.actions.handleInputChange(createChangeEvent('phoneNumber', '+1234567890'));
        result.current.actions.handleNext();
      });

      await act(async () => {
        await result.current.actions.handleSubmit(createSubmitEvent());
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

      act(() => {
        fillStep1(result.current.actions);
        result.current.actions.handleNext();
      });

      await act(async () => {
        await result.current.actions.handleSubmit(createSubmitEvent());
      });

      expect(result.current.state.errors.general).toBe('errors.registrationFailed');
      expect(result.current.state.currentStep).toBe(1);
    });
  });
});
