import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../language-selector';

const mockChangeLanguage = vi.fn();

vi.mock('@/shared/i18n', () => ({
  useLanguage: () => ({
    state: {
      currentLanguage: { code: 'en', label: 'English' },
      availableLanguages: [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
      ],
    },
    actions: {
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with current language', () => {
    render(<LanguageSelector />);

    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders globe icon', () => {
    const { container } = render(<LanguageSelector />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', () => {
    render(<LanguageSelector />);

    const trigger = screen.getByText('English');
    fireEvent.click(trigger);

    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('calls changeLanguage when selecting a language', () => {
    render(<LanguageSelector />);

    // Open dropdown
    const trigger = screen.getByText('English');
    fireEvent.click(trigger);

    // Click on Spanish option
    const spanishOption = screen.getByText('Español');
    fireEvent.click(spanishOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });
});
