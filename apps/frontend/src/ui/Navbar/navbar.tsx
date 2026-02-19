import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogout, useProfile } from '@/modules/auth';
import { useTheme } from '@/shared';
import { Button } from '@/ui/Button';
import './navbar.css';

type NavItem = {
  to: string;
  labelKey: string;
  end?: boolean;
};

const mainNavigationItems: NavItem[] = [
  { to: '/', labelKey: 'layout.dashboard', end: true },
  { to: '/athletes', labelKey: 'layout.athletes' },
  { to: '/sessions', labelKey: 'layout.sessions' },
  { to: '/profile', labelKey: 'layout.profile' },
];

const footerNavigationItems: NavItem[] = [{ to: '/settings', labelKey: 'layout.settings' }];

interface NavbarProps {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, onCloseMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: { user: userProfile } = {} } = useProfile();
  const { mutate: logout } = useLogout();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  const currentThemeLabel = theme === 'dark' ? t('layout.themeLight') : t('layout.themeDark');
  const userName = `${userProfile?.firstName ?? ''} ${userProfile?.lastName ?? ''}`.trim();
  const displayName = userName || t('layout.profile');
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={`navbar__overlay ${isMenuOpen ? 'navbar__overlay--open' : ''}`}
        onClick={onCloseMenu}
        aria-hidden={!isMenuOpen}
      />

      <aside
        id="navbar-navigation"
        className={`navbar__sidemenu ${isMenuOpen ? 'navbar__sidemenu--open' : ''}`}
      >
        <div className="navbar__user-section">
          <span className="navbar__user-avatar" aria-hidden="true">
            {userInitial}
          </span>

          <div className="navbar__user-details">
            <p className="navbar__user-name">{displayName}</p>
            {userProfile?.email ? <p className="navbar__user-email">{userProfile.email}</p> : null}
          </div>
        </div>

        <nav className="navbar__nav" aria-label={t('layout.navigation')}>
          {mainNavigationItems.map(({ to, labelKey, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMenu}
              className={({ isActive }) =>
                isActive ? 'navbar__nav-link navbar__nav-link--active' : 'navbar__nav-link'
              }
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__footer">
          {footerNavigationItems.map(({ to, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMenu}
              className={({ isActive }) =>
                isActive
                  ? 'navbar__nav-link navbar__nav-link--active navbar__footer-link'
                  : 'navbar__nav-link navbar__footer-link'
              }
            >
              {t(labelKey)}
            </NavLink>
          ))}

          <div className="navbar__action-button-wrapper">
            <Button
              type="button"
              variant="text"
              size="md"
              onClick={toggleTheme}
              aria-label={t('layout.themeToggle')}
            >
              {currentThemeLabel}
            </Button>
          </div>

          <div className="navbar__action-button-wrapper navbar__action-button-wrapper--danger">
            <Button
              type="button"
              variant="text"
              size="md"
              onClick={handleLogout}
              aria-label={t('layout.logout')}
            >
              {t('layout.logout')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export { Navbar };
export type { NavbarProps };
