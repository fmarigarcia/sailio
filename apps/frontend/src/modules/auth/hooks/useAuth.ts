import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../auth.api';
import type { LoginCredentials, RegisterData } from '../auth.types';

/**
 * Keys para las queries de auth.
 * Centralizadas para mejor gestión del cache.
 */
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Hook para obtener el perfil del usuario autenticado.
 * Usa react-query para caching automático.
 */
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para login con react-query mutation.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Guardar token (ajustar según tu estrategia de auth)
      localStorage.setItem('token', data.token);

      // Invalidar y actualizar cache del perfil
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

/**
 * Hook para registro con react-query mutation.
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      // Guardar token
      localStorage.setItem('token', data.token);

      // Actualizar cache del perfil
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

/**
 * Hook para logout con react-query mutation.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Limpiar token
      localStorage.removeItem('token');

      // Limpiar todo el cache de auth
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
