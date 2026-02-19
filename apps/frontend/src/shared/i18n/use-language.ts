import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  label: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

interface UseLanguageReturn {
  state: {
    currentLanguage: Language;
    availableLanguages: Language[];
  };
  actions: {
    changeLanguage: (languageCode: string) => void;
  };
}

const useLanguage = (): UseLanguageReturn => {
  const { i18n } = useTranslation();

  const currentLanguage =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  const changeLanguage = useCallback(
    (languageCode: string) => {
      i18n.changeLanguage(languageCode);
    },
    [i18n]
  );

  return {
    state: {
      currentLanguage,
      availableLanguages: AVAILABLE_LANGUAGES,
    },
    actions: {
      changeLanguage,
    },
  };
};

export { useLanguage };
export type { Language, UseLanguageReturn };
