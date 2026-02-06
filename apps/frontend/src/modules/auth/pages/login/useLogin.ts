import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin as useLoginMutation } from '../../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function useLogin() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Navigate to dashboard after successful login
      navigate('/');
    } catch (error) {
      setErrors({
        general: t('errors.invalidCredentials'),
      });
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  return {
    state: {
      formData,
      errors,
      isLoading: loginMutation.isPending,
    },
    actions: {
      handleInputChange,
      handleSubmit,
      handleRegisterClick,
      handleForgotPasswordClick,
    },
  };
}
