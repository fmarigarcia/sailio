import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '@/app';
import '@/shared/i18n';
import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
