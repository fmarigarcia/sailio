import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/ui';

/**
 * Dashboard principal de la aplicación.
 * Placeholder temporal - se implementará la funcionalidad completa más adelante.
 */
const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section>
        <h2>{t('pages.dashboard.title')}</h2>
        <p>{t('pages.dashboard.placeholder')}</p>
      </section>
    </Layout>
  );
};

export { Dashboard };
