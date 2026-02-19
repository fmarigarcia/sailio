import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { MenuIcon } from '@/ui/icons';
import { Navbar } from '@/ui/Navbar';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((previousState) => !previousState);
  };

  const menuButtonLabel = isMenuOpen ? t('layout.closeMenu') : t('layout.openMenu');

  return (
    <div className="layout">
      <header className="layout__topbar">
        <div className="layout__topbar-inner">
          <div className="layout__brand" aria-label={t('app.title')}>
            <span className="layout__brand-logo" aria-hidden="true">
              <MenuIcon size={18} />
            </span>
            <h1 className="layout__title">{t('app.title')}</h1>
          </div>

          <Button
            variant="text"
            size="sm"
            onClick={handleMenuToggle}
            aria-label={menuButtonLabel}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-navigation"
          >
            <span className="layout__hamburger-icon" aria-hidden="true">
              ☰
            </span>
          </Button>
        </div>
      </header>

      <Navbar isMenuOpen={isMenuOpen} onCloseMenu={() => setIsMenuOpen(false)} />

      <main className="layout__content">
        <div className="layout__content-inner">{children}</div>
      </main>
    </div>
  );
};

export { Layout };
export type { LayoutProps };
