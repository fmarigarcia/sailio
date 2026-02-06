import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración del QueryClient para TanStack Query.
 * Maneja el caching, revalidación y gestión de estado del servidor.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});
