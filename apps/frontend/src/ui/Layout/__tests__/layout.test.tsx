import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Layout } from '../layout';

const navbarSpy = vi.fn();

vi.mock('@/ui/Navbar', () => ({
  Navbar: ({ isMenuOpen, onCloseMenu }: { isMenuOpen: boolean; onCloseMenu: () => void }) => {
    navbarSpy({ isMenuOpen });

    return (
      <div data-testid="navbar-mock">
        <span data-testid="navbar-open-state">{String(isMenuOpen)}</span>
        <button type="button" onClick={onCloseMenu}>
          close menu
        </button>
      </div>
    );
  },
}));

describe('Layout', () => {
  it('renders topbar, content and navbar', () => {
    render(
      <Layout>
        <p>page content</p>
      </Layout>
    );

    expect(screen.getByRole('heading', { name: 'Sailio' })).toBeInTheDocument();
    expect(screen.getByText('page content')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
  });

  it('toggles menu state when hamburger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Layout>
        <p>content</p>
      </Layout>
    );

    const menuButton = screen.getByRole('button', {
      name: /abrir menú de navegación|open navigation menu/i,
    });

    expect(screen.getByTestId('navbar-open-state')).toHaveTextContent('false');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    expect(screen.getByTestId('navbar-open-state')).toHaveTextContent('true');
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes menu when navbar triggers close callback', async () => {
    const user = userEvent.setup();

    render(
      <Layout>
        <p>content</p>
      </Layout>
    );

    const menuButton = screen.getByRole('button', {
      name: /abrir menú de navegación|open navigation menu/i,
    });
    await user.click(menuButton);

    expect(screen.getByTestId('navbar-open-state')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'close menu' }));

    expect(screen.getByTestId('navbar-open-state')).toHaveTextContent('false');
  });
});
