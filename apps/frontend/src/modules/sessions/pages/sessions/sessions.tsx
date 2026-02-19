import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/ui';

const Sessions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section>
        <h2>{t('pages.sessions.title')}</h2>
        <p>{t('pages.sessions.placeholder')}</p>
      </section>
    </Layout>
  );
};

export { Sessions };
