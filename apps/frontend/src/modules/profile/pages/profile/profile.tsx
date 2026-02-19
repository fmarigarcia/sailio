import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/ui';

const Profile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section>
        <h2>{t('pages.profile.title')}</h2>
        <p>{t('pages.profile.placeholder')}</p>
      </section>
    </Layout>
  );
};

export { Profile };
