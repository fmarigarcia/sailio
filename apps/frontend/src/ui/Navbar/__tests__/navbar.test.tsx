import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../navbar';

const mockNavigate = vi.fn();
const mockToggleTheme = vi.fn();
const mockMutate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/modules/auth', () => ({
  useProfile: () => ({
    data: {
      firstName: 'Coach',
      lastName: 'Sarah',
      email: 'sarah@sailio.app',
    },
  }),
  useLogout: () => ({
    mutate: mockMutate,
  }),
}));

vi.mock('@/shared', async () => {
  const actual = await vi.importActual<typeof import('@/shared')>('@/shared');

  return {
    ...actual,
    useTheme: () => ({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    }),
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main nav and footer actions', () => {
    render(
      <MemoryRouter>
        <Navbar isMenuOpen={false} onCloseMenu={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('navigation', { name: /navegación principal|main navigation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /athletes|atletas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sessions|sesiones/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile|perfil/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings|configuración/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /toggle dark mode|cambiar modo oscuro/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout|cerrar sesión/i })).toBeInTheDocument();
  });

  it('opens and closes styles based on isMenuOpen prop', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Navbar isMenuOpen={false} onCloseMenu={vi.fn()} />
      </MemoryRouter>
    );

    const overlay = globalThis.document.querySelector('.navbar__overlay');
    const sidemenu = globalThis.document.querySelector('.navbar__sidemenu');

    expect(overlay).toBeInTheDocument();
    expect(sidemenu).toBeInTheDocument();
    expect(overlay).not.toHaveClass('navbar__overlay--open');
    expect(sidemenu).not.toHaveClass('navbar__sidemenu--open');

    rerender(
      <MemoryRouter>
        <Navbar isMenuOpen={true} onCloseMenu={vi.fn()} />
      </MemoryRouter>
    );

    expect(globalThis.document.querySelector('.navbar__overlay')).toHaveClass(
      'navbar__overlay--open'
    );
    expect(globalThis.document.querySelector('.navbar__sidemenu')).toHaveClass(
      'navbar__sidemenu--open'
    );
  });

  it('calls onCloseMenu when clicking overlay and nav links', async () => {
    const user = userEvent.setup();
    const onCloseMenu = vi.fn();

    render(
      <MemoryRouter>
        <Navbar isMenuOpen={true} onCloseMenu={onCloseMenu} />
      </MemoryRouter>
    );

    const overlay = globalThis.document.querySelector('.navbar__overlay');
    expect(overlay).toBeInTheDocument();
    if (overlay) {
      await user.click(overlay);
    }

    await user.click(screen.getByRole('link', { name: /dashboard/i }));

    expect(onCloseMenu).toHaveBeenCalledTimes(2);
  });

  it('calls toggleTheme on theme button click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Navbar isMenuOpen={true} onCloseMenu={vi.fn()} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /toggle dark mode|cambiar modo oscuro/i }));

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('logs out and navigates to login on settled', async () => {
    const user = userEvent.setup();

    mockMutate.mockImplementation((_value: undefined, options?: { onSettled?: () => void }) => {
      options?.onSettled?.();
    });

    render(
      <MemoryRouter>
        <Navbar isMenuOpen={true} onCloseMenu={vi.fn()} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /logout|cerrar sesión/i }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
