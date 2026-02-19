import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '../use-language';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  })),
}));

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns current language and available languages', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.state.currentLanguage).toEqual({
      code: 'en',
      label: 'English',
    });
    expect(result.current.state.availableLanguages).toHaveLength(2);
    expect(result.current.state.availableLanguages).toEqual([
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ]);
  });

  it('provides changeLanguage action', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.actions.changeLanguage).toBeDefined();
    expect(typeof result.current.actions.changeLanguage).toBe('function');
  });

  it('changeLanguage action can be called without errors', () => {
    const { result } = renderHook(() => useLanguage());

    expect(() => {
      act(() => {
        result.current.actions.changeLanguage('es');
      });
    }).not.toThrow();
  });

  it('changeLanguage action accepts language codes', () => {
    const { result } = renderHook(() => useLanguage());

    expect(() => {
      act(() => {
        result.current.actions.changeLanguage('en');
        result.current.actions.changeLanguage('es');
      });
    }).not.toThrow();
  });
});
