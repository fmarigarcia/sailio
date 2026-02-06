import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmailInput, PasswordInput, Button, Checkbox, Alert, Card } from '@/ui';
import { MenuIcon } from '@/ui/icons';
import { LanguageSelector } from '../../components';
import { useLogin } from './useLogin';
import './login.css';

const Login: React.FC = () => {
  const { t } = useTranslation('auth');
  const { state, actions } = useLogin();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-language-selector">
          <LanguageSelector />
        </div>

        <Card variant="elevated">
          <Card.Body>
            <div className="login-header">
              <div className="login-icon">
                <MenuIcon size={128} color="white" />
              </div>
              <h1 className="login-title">{t('login.title')}</h1>
              <p className="login-subtitle">{t('login.subtitle')}</p>
            </div>

            {state.errors.general && <Alert variant="error">{state.errors.general}</Alert>}

            <form onSubmit={actions.handleSubmit} className="login-form" noValidate>
              <EmailInput
                name="email"
                label={t('login.email')}
                placeholder={t('login.emailPlaceholder')}
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
                label={t('login.password')}
                placeholder={t('login.passwordPlaceholder')}
                value={state.formData.password}
                onChange={actions.handleInputChange}
                error={state.errors.password}
                fullWidth
                required
                autoComplete="current-password"
                disabled={state.isLoading}
              />

              <div className="login-options">
                <Checkbox
                  name="rememberMe"
                  label={t('login.rememberMe')}
                  checked={state.formData.rememberMe}
                  onChange={actions.handleInputChange}
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className="login-forgot-password"
                  onClick={actions.handleForgotPasswordClick}
                  disabled={state.isLoading}
                >
                  {t('login.forgotPassword')}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={state.isLoading}
                disabled={state.isLoading}
              >
                {state.isLoading ? t('login.loggingIn') : t('login.loginButton')}
              </Button>
            </form>
          </Card.Body>

          <Card.Footer>
            <div className="login-footer">
              <p className="login-register-prompt">
                {t('login.noAccount')}{' '}
                <button
                  type="button"
                  className="login-register-link"
                  onClick={actions.handleRegisterClick}
                  disabled={state.isLoading}
                >
                  {t('login.register')}
                </button>
              </p>
            </div>
          </Card.Footer>
        </Card>

        <footer className="login-copyright">
          <p>{t('login.copyright')}</p>
        </footer>
      </div>
    </div>
  );
};

export { Login };
