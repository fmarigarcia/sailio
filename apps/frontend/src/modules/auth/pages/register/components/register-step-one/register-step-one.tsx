import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, EmailInput, PasswordInput, TextInput } from '@/ui';
import type { RegisterActions, RegisterState } from '../../use-register';
import { RegisterStepContent } from '../register-step-content';
import './register-step-one.css';
import { RegisterStepActions } from '../register-step-actions';

interface RegisterStepOneProps {
  state: RegisterState;
  actions: Pick<RegisterActions, 'handleInputChange' | 'handleNext'>;
}

const RegisterStepOne: React.FC<RegisterStepOneProps> = ({ state, actions }) => {
  const { t } = useTranslation('auth');

  return (
    <RegisterStepContent>
      <div className="register-form-row">
        <TextInput
          name="firstName"
          label={t('register.step1.firstName')}
          placeholder={t('register.step1.firstNamePlaceholder')}
          value={state.formData.firstName}
          onChange={actions.handleInputChange}
          error={state.errors.firstName}
          fullWidth
          required
          disabled={state.isLoading}
        />
        <TextInput
          name="lastName"
          label={t('register.step1.lastName')}
          placeholder={t('register.step1.lastNamePlaceholder')}
          value={state.formData.lastName}
          onChange={actions.handleInputChange}
          error={state.errors.lastName}
          fullWidth
          required
          disabled={state.isLoading}
        />
      </div>

      <EmailInput
        name="email"
        label={t('register.step1.email')}
        placeholder={t('register.step1.emailPlaceholder')}
        value={state.formData.email}
        onChange={actions.handleInputChange}
        error={state.errors.email}
        fullWidth
        required
        autoComplete="email"
        disabled={state.isLoading}
      />

      <PasswordInput
        name="password"
        label={t('register.step1.password')}
        placeholder={t('register.step1.passwordPlaceholder')}
        value={state.formData.password}
        onChange={actions.handleInputChange}
        error={state.errors.password}
        fullWidth
        required
        autoComplete="new-password"
        disabled={state.isLoading}
      />

      <PasswordInput
        name="confirmPassword"
        label={t('register.step1.confirmPassword')}
        placeholder={t('register.step1.confirmPasswordPlaceholder')}
        value={state.formData.confirmPassword}
        onChange={actions.handleInputChange}
        error={state.errors.confirmPassword}
        fullWidth
        required
        autoComplete="new-password"
        disabled={state.isLoading}
      />
      <RegisterStepActions flex>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={actions.handleNext}
          disabled={state.isLoading}
        >
          {t('register.buttons.next')}
        </Button>
      </RegisterStepActions>
    </RegisterStepContent>
  );
};

export default RegisterStepOne;
