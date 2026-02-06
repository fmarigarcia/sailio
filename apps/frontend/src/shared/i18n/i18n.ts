import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEs from '@/locales/es/common.json';
import commonEn from '@/locales/en/common.json';
import authEs from '@/locales/es/auth.json';
import authEn from '@/locales/en/auth.json';

const resources = {
  es: {
    common: commonEs,
    auth: authEs,
  },
  en: {
    common: commonEn,
    auth: authEn,
  },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
