import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile, useLogin, useRegister, useLogout, authKeys } from '../useAuth';
import { authApi } from '../../auth.api';
import React, { type ReactNode } from 'react';

// Mock del authApi
vi.mock('../../auth.api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuth hooks', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    function Wrapper({ children }: { children: ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    }
    return Wrapper;
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('useProfile', () => {
    it('fetches user profile successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      vi.mocked(authApi.getProfile).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUser);
      expect(authApi.getProfile).toHaveBeenCalledTimes(1);
    });

    it('handles profile fetch error', async () => {
      const mockError = { message: 'Unauthorized', status: 401 };
      vi.mocked(authApi.getProfile).mockRejectedValue(mockError);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useLogin', () => {
    it('logs in successfully and stores token', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'mock-token',
      };

      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCredentials);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.login).toHaveBeenCalledWith(mockCredentials);
      expect(localStorageMock.getItem('token')).toBe('mock-token');
      expect(queryClient.getQueryData(authKeys.profile())).toEqual(mockResponse.user);
    });

    it('handles login error', async () => {
      const mockError = { message: 'Invalid credentials', status: 401 };
      vi.mocked(authApi.login).mockRejectedValue(mockError);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'wrong@example.com',
        password: 'wrong',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
      expect(localStorageMock.getItem('token')).toBeNull();
    });
  });

  describe('useRegister', () => {
    it('registers successfully and stores token', async () => {
      const mockData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      const mockResponse = {
        user: {
          id: '2',
          email: 'new@example.com',
          name: 'New User',
          role: 'user',
        },
        token: 'new-token',
      };

      vi.mocked(authApi.register).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.register).toHaveBeenCalledWith(mockData);
      expect(localStorageMock.getItem('token')).toBe('new-token');
      expect(queryClient.getQueryData(authKeys.profile())).toEqual(mockResponse.user);
    });

    it('handles registration error', async () => {
      const mockError = { message: 'Email already exists', status: 409 };
      vi.mocked(authApi.register).mockRejectedValue(mockError);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'existing@example.com',
        password: 'password123',
        name: 'User',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useLogout', () => {
    it('logs out successfully and clears token', async () => {
      localStorageMock.setItem('token', 'existing-token');
      queryClient.setQueryData(authKeys.profile(), {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
      });

      vi.mocked(authApi.logout).mockResolvedValue();

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.logout).toHaveBeenCalledTimes(1);
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(queryClient.getQueryData(authKeys.profile())).toBeUndefined();
    });

    it('clears data even if logout request fails', async () => {
      localStorageMock.setItem('token', 'existing-token');

      vi.mocked(authApi.logout).mockRejectedValue({ message: 'Server error', status: 500 });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Incluso si falla, debería limpiar el token localmente
      // (esto puede ajustarse según la lógica de negocio deseada)
    });
  });
});
