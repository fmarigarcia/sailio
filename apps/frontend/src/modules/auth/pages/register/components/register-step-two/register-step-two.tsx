import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, TextInput } from '@/ui';
import type { RegisterActions, RegisterState } from '../../use-register';
import { RegisterStepActions } from '../register-step-actions';
import { RegisterStepContent } from '../register-step-content';

interface RegisterStepTwoProps {
  state: RegisterState;
  actions: Pick<
    RegisterActions,
    'handleInputChange' | 'handleFieldChange' | 'handleBack' | 'handleNext'
  >;
}

const RegisterStepTwo: React.FC<RegisterStepTwoProps> = ({ state, actions }) => {
  const { t } = useTranslation('auth');

  const certificationOptions = [
    { value: 'beginner', label: t('register.certificationLevels.beginner') },
    { value: 'intermediate', label: t('register.certificationLevels.intermediate') },
    { value: 'advanced', label: t('register.certificationLevels.advanced') },
    { value: 'expert', label: t('register.certificationLevels.expert') },
    { value: 'instructor', label: t('register.certificationLevels.instructor') },
  ];

  return (
    <RegisterStepContent>
      <Select
        name="certificationLevel"
        aria-label={t('register.step2.certificationLevel')}
        placeholder={t('register.step2.certificationPlaceholder')}
        value={state.formData.certificationLevel}
        onChange={(value) => actions.handleFieldChange('certificationLevel', value)}
        error={Boolean(state.errors.certificationLevel)}
        errorMessage={state.errors.certificationLevel}
        options={certificationOptions}
        disabled={state.isLoading}
      />

      <TextInput
        name="clubAffiliation"
        label={t('register.step2.clubAffiliation')}
        placeholder={t('register.step2.clubPlaceholder')}
        value={state.formData.clubAffiliation}
        onChange={actions.handleInputChange}
        error={state.errors.clubAffiliation}
        fullWidth
        disabled={state.isLoading}
      />

      <TextInput
        name="phoneNumber"
        label={t('register.step2.phoneNumber')}
        placeholder={t('register.step2.phonePlaceholder')}
        value={state.formData.phoneNumber}
        onChange={actions.handleInputChange}
        error={state.errors.phoneNumber}
        fullWidth
        disabled={state.isLoading}
      />

      <RegisterStepActions>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={actions.handleBack}
          disabled={state.isLoading}
        >
          {t('register.buttons.back')}
        </Button>
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

export default RegisterStepTwo;
