import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/ui';

const Athletes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section>
        <h2>{t('pages.athletes.title')}</h2>
        <p>{t('pages.athletes.placeholder')}</p>
      </section>
    </Layout>
  );
};

export { Athletes };
