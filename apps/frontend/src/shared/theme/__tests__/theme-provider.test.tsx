import React from 'react';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../theme-provider';

const originalMatchMedia = globalThis.matchMedia;

const ThemeConsumer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        toggle
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('throws if useTheme is used outside provider', () => {
    expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within ThemeProvider');
  });

  it('uses stored theme on initial render', () => {
    localStorage.setItem('sailio-theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(globalThis.document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('uses dark theme when system preference is dark and no stored theme', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(localStorage.getItem('sailio-theme')).toBe('dark');
  });

  it('toggles theme and persists in localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(globalThis.document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('sailio-theme')).toBe('dark');
  });
});

afterAll(() => {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: originalMatchMedia,
  });
});
