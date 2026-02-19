import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/ui';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section>
        <h2>{t('pages.settings.title')}</h2>
        <p>{t('pages.settings.placeholder')}</p>
      </section>
    </Layout>
  );
};

export { Settings };
