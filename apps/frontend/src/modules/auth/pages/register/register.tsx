import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Stepper } from '@/ui';
import { MenuIcon } from '@/ui/icons';
import { LanguageSelector } from '../../components';
import { RegisterStepOne, RegisterStepThree, RegisterStepTwo } from './components';
import { useRegister } from './useRegister';
import './register.css';

const Register: React.FC = () => {
  const { t } = useTranslation('auth');
  const { state, actions } = useRegister();

  const steps = [t('register.step1.title'), t('register.step2.title'), t('register.step3.title')];
  const stepContent = [
    null,
    <RegisterStepOne state={state} actions={actions} />,
    <RegisterStepTwo state={state} actions={actions} />,
    <RegisterStepThree state={state} actions={actions} />,
  ];

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-top-actions">
          <button
            type="button"
            className="register-back-to-login"
            onClick={actions.handleBackToLogin}
            disabled={state.isLoading}
          >
            ← {t('register.buttons.backToLogin')}
          </button>

          <LanguageSelector />
        </div>

        <Card variant="elevated">
          <Card.Body>
            <div className="register-header">
              <div className="register-icon">
                <MenuIcon size={96} color="white" />
              </div>
              <h1 className="register-title">{t('register.title')}</h1>
              <p className="register-subtitle">{t('register.subtitle')}</p>
            </div>

            <Stepper steps={steps} currentStep={state.currentStep} ariaLabel={t('register.title')}>
              {state.errors.general && <Alert variant="error">{state.errors.general}</Alert>}

              <form onSubmit={actions.handleSubmit} className="register-form" noValidate>
                {stepContent[state.currentStep]}
              </form>
            </Stepper>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;
