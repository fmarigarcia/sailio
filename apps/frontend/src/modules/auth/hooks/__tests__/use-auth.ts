import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile, useLogin, useRegister, useLogout, authKeys } from '../use-auth';
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

Object.defineProperty(globalThis.window, 'localStorage', {
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
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
      };

      vi.mocked(authApi.getProfile).mockResolvedValue({ user: mockUser });

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
          firstName: 'Test',
          lastName: 'User',
          phone: null,
          certificationLevel: null,
          clubAffiliation: null,
          bio: null,
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCredentials);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.login).toHaveBeenCalledWith(mockCredentials);
      expect(localStorageMock.getItem('token')).toBe('mock-access-token');
      expect(localStorageMock.getItem('refreshToken')).toBe('mock-refresh-token');
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
        firstName: 'New',
        lastName: 'User',
      };

      const mockResponse = {
        user: {
          id: '2',
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          phone: null,
          certificationLevel: null,
          clubAffiliation: null,
          bio: null,
        },
        tokens: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };

      vi.mocked(authApi.register).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.register).toHaveBeenCalledWith(mockData);
      expect(localStorageMock.getItem('token')).toBe('new-access-token');
      expect(localStorageMock.getItem('refreshToken')).toBe('new-refresh-token');
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
        firstName: 'Existing',
        lastName: 'User',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useLogout', () => {
    it('logs out successfully and clears token', async () => {
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('refreshToken', 'existing-refresh-token');
      queryClient.setQueryData(authKeys.profile(), {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
      });

      vi.mocked(authApi.logout).mockResolvedValue();

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.logout).toHaveBeenCalledTimes(1);
      expect(authApi.logout).toHaveBeenCalledWith({
        refreshToken: 'existing-refresh-token',
      });
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('refreshToken')).toBeNull();
      expect(queryClient.getQueryData(authKeys.profile())).toBeUndefined();
    });

    it('clears data even if logout request fails', async () => {
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('refreshToken', 'existing-refresh-token');

      vi.mocked(authApi.logout).mockRejectedValue({ message: 'Server error', status: 500 });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('refreshToken')).toBeNull();
      expect(queryClient.getQueryData(authKeys.profile())).toBeUndefined();
    });

    it('does not call logout API if no refresh token is available', async () => {
      localStorageMock.setItem('token', 'existing-token');

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.logout).not.toHaveBeenCalled();
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('refreshToken')).toBeNull();
    });
  });
});
