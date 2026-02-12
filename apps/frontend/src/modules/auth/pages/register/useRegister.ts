import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister as useRegisterMutation } from '../../hooks/useAuth';

export interface RegisterFormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2: Sailing Credentials
  certificationLevel: string;
  clubAffiliation: string;
  phoneNumber: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  certificationLevel?: string;
  clubAffiliation?: string;
  phoneNumber?: string;
  general?: string;
}

export type RegisterStep = 1 | 2 | 3;

export interface RegisterState {
  currentStep: RegisterStep;
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  isLoading: boolean;
}

export interface RegisterActions {
  handleFieldChange: (name: keyof RegisterFormData, value: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackToLogin: () => void;
}

export interface UseRegisterResult {
  state: RegisterState;
  actions: RegisterActions;
}

export function useRegister(): UseRegisterResult {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    certificationLevel: '',
    clubAffiliation: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const handleFieldChange = (name: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFieldChange(name as keyof RegisterFormData, value);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field
    // Basic phone validation - allows various formats
    const phoneRegex = /^[+]?[\d\s()-]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep1 = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.passwordTooShort');
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t('errors.passwordWeak');
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('errors.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    // Phone is optional but must be valid if provided
    if (formData.phoneNumber.trim() && !validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = t('errors.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as RegisterStep);
      // Clear general errors when moving forward
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegisterStep);
      // Clear errors when going back
      setErrors({});
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1); // Go back to first error
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber.trim() || undefined,
        certificationLevel: formData.certificationLevel.trim() || undefined,
        clubAffiliation: formData.clubAffiliation.trim() || undefined,
      });

      // Navigate to dashboard after successful registration
      navigate('/');
    } catch (error) {
      setErrors({
        general: t('errors.registrationFailed'),
      });
      // Go back to first step to show error
      setCurrentStep(1);
    }
  };

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return {
    state: {
      currentStep,
      formData,
      errors,
      isLoading: registerMutation.isPending,
    },
    actions: {
      handleFieldChange,
      handleInputChange,
      handleNext,
      handleBack,
      handleSubmit,
      handleBackToLogin,
    },
  };
}
