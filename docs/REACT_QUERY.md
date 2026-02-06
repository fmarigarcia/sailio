# React Query (TanStack Query) en Sailio

## Introducción

El proyecto usa **TanStack Query (antes React Query)** para gestionar el estado del servidor con caching automático, revalidación y gestión de loading/error states.

## Configuración

### QueryClient

El QueryClient está configurado en [app/query-client.ts](../apps/frontend/src/app/query-client.ts):

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Provider

El `QueryClientProvider` está en [app/providers.tsx](../apps/frontend/src/app/providers.tsx) y envuelve toda la aplicación.

### DevTools

Las React Query DevTools están habilitadas en desarrollo automáticamente. Aparecen como un icono flotante en la esquina inferior izquierda.

## Estructura de un Módulo con React Query

Cada módulo debe seguir esta estructura:

```
modules/{dominio}/
  {dominio}.api.ts       # Llamadas al backend
  {dominio}.types.ts     # Tipos del dominio
  hooks/
    use{Hook}.ts         # Hooks con useQuery/useMutation
    index.ts
```

## Patrones de Uso

### 1. Queries (Obtención de Datos)

**Archivo API** (`{dominio}.api.ts`):

```typescript
import { apiClient } from '@/shared';

export const userApi = {
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/users/profile');
  },

  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },
};
```

**Hook con Query** (`hooks/useUsers.ts`):

```typescript
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../{dominio}.api';

// Centralizar query keys
export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// Hook simple
export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userApi.getProfile,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// Hook con parámetros
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id, // Solo ejecutar si hay id
  });
}
```

**Uso en Componente**:

```typescript
import { useProfile } from '@/modules/users/hooks';

function ProfilePage() {
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) return <Spinner />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return <div>{user.name}</div>;
}
```

### 2. Mutations (Modificación de Datos)

**Archivo API**:

```typescript
export const userApi = {
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    return apiClient.put<User>('/users/profile', data);
  },

  deleteAccount: async (): Promise<void> => {
    return apiClient.delete<void>('/users/account');
  },
};
```

**Hook con Mutation**:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../users.api';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Actualizar cache inmediatamente (optimistic update)
      queryClient.setQueryData(userKeys.profile(), updatedUser);

      // O invalidar para refetch
      // queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      // Manejar error si es necesario
      console.error('Error updating profile:', error);
    },
  });
}
```

**Uso en Componente**:

```typescript
import { useUpdateProfile } from '@/modules/users/hooks';

function EditProfileForm() {
  const updateProfile = useUpdateProfile();

  const handleSubmit = (data: UpdateProfileDto) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success('Perfil actualizado');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
```

### 3. Query Keys

**IMPORTANTE**: Centralizar las query keys para mejor gestión del cache.

```typescript
export const sessionsKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionsKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionsKeys.lists(), filters] as const,
  details: () => [...sessionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionsKeys.details(), id] as const,
};
```

### 4. Invalidación de Cache

```typescript
// Invalidar todas las queries de sessions
queryClient.invalidateQueries({ queryKey: sessionsKeys.all });

// Invalidar solo las listas
queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });

// Invalidar una sesión específica
queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(id) });
```

### 5. Optimistic Updates

```typescript
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionsApi.delete,
    onMutate: async (deletedId) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.lists() });

      // Guardar datos previos por si hay error
      const previousSessions = queryClient.getQueryData(sessionsKeys.lists());

      // Actualizar cache optimistamente
      queryClient.setQueryData(sessionsKeys.lists(), (old: Session[]) =>
        old.filter((s) => s.id !== deletedId)
      );

      return { previousSessions };
    },
    onError: (err, deletedId, context) => {
      // Revertir en caso de error
      queryClient.setQueryData(sessionsKeys.lists(), context?.previousSessions);
    },
    onSettled: () => {
      // Refetch después de mutación
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
    },
  });
}
```

## Configuración por Query/Mutation

### Queries

```typescript
useQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
  staleTime: 5000, // Tiempo que los datos se consideran frescos
  gcTime: 10000, // Tiempo antes de garbage collection
  retry: 3, // Número de reintentos
  retryDelay: 1000, // Delay entre reintentos
  refetchOnWindowFocus: true, // Refetch al enfocar ventana
  refetchOnMount: true, // Refetch al montar componente
  enabled: true, // Ejecutar query condicionalmente
});
```

### Mutations

```typescript
useMutation({
  mutationFn: updateFn,
  retry: false, // No reintentar mutations por defecto
  onMutate: async (vars) => {
    /* Optimistic update */
  },
  onSuccess: (data) => {
    /* Invalidar cache */
  },
  onError: (error) => {
    /* Revertir optimistic update */
  },
  onSettled: () => {
    /* Cleanup */
  },
});
```

## Ejemplo Completo: Módulo Auth

Ver implementación en [modules/auth/](../apps/frontend/src/modules/auth/).

```typescript
// Hook de login
const login = useLogin();

login.mutate(
  { email, password },
  {
    onSuccess: (data) => {
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    },
  }
);

// Hook de perfil
const { data: user, isLoading } = useProfile();
```

## Best Practices

1. ✅ **Centralizar query keys** en constantes
2. ✅ **Usar el cliente HTTP de shared/** (`apiClient`)
3. ✅ **Separar lógica de API de hooks** (.api.ts vs hooks/)
4. ✅ **Invalidar cache después de mutations** relevantes
5. ✅ **Usar optimistic updates** para mejor UX
6. ✅ **Configurar staleTime apropiado** según el caso de uso
7. ✅ **Manejar estados de loading y error** en componentes
8. ❌ **NO hacer fetch directo** desde componentes
9. ❌ **NO duplicar lógica de queries** entre módulos
10. ❌ **NO usar strings mágicos** para query keys

## Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
