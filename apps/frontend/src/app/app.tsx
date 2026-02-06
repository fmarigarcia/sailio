import { useTranslation } from 'react-i18next';
import './app.css';

export function App() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <p>{t('app.description')}</p>
      </header>
      <main className="app-main">
        <p>{t('common.loading')}</p>
      </main>
    </div>
  );
}
