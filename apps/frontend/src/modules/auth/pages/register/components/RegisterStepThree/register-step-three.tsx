import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui';
import type { RegisterActions, RegisterState } from '../../useRegister';
import { RegisterReviewItem, RegisterReviewSection } from '../RegisterReviewSection';
import { RegisterStepActions } from '../RegisterStepActions';
import { RegisterStepContent } from '../RegisterStepContent';
import './register-step-three.css';

interface RegisterStepThreeProps {
  state: RegisterState;
  actions: Pick<RegisterActions, 'handleBack'>;
}

const RegisterStepThree: React.FC<RegisterStepThreeProps> = ({ state, actions }) => {
  const { t } = useTranslation('auth');

  const certificationValue = state.formData.certificationLevel
    ? t(`register.certificationLevels.${state.formData.certificationLevel}`)
    : t('register.step3.notProvided');

  return (
    <RegisterStepContent>
      <div className="register-review">
        <RegisterReviewSection title={t('register.step3.personalInfo')}>
          <RegisterReviewItem
            label={t('register.step3.name')}
            value={`${state.formData.firstName} ${state.formData.lastName}`}
          />
          <RegisterReviewItem label={t('register.step3.email')} value={state.formData.email} />
        </RegisterReviewSection>

        <RegisterReviewSection title={t('register.step3.sailingCredentials')}>
          <RegisterReviewItem
            label={t('register.step3.certification')}
            value={certificationValue}
          />
          <RegisterReviewItem
            label={t('register.step3.club')}
            value={state.formData.clubAffiliation || t('register.step3.notProvided')}
          />
          <RegisterReviewItem
            label={t('register.step3.phone')}
            value={state.formData.phoneNumber || t('register.step3.notProvided')}
          />
        </RegisterReviewSection>

        <p className="register-terms">{t('register.step3.termsMessage')}</p>
      </div>

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
          type="submit"
          variant="primary"
          size="lg"
          loading={state.isLoading}
          disabled={state.isLoading}
        >
          {state.isLoading ? t('register.buttons.creating') : t('register.buttons.createAccount')}
        </Button>
      </RegisterStepActions>
    </RegisterStepContent>
  );
};

export default RegisterStepThree;
