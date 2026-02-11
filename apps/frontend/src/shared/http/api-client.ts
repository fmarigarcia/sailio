/**
 * Cliente HTTP para comunicación con el backend.
 * Configurado con interceptores para manejo de errores y autenticación.
 */

import type { ApiError, ApiResponse, RequestOptions, RefreshResponse } from './api-client.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

// Variables para controlar el estado del refresh
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let sessionExpired = false; // Flag para detener TODAS las peticiones

/**
 * Obtiene el token de autenticación del localStorage.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Obtiene el refresh token del localStorage.
 */
function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

/**
 * Renueva el access token usando el refresh token.
 * Evita múltiples llamadas simultáneas devolviendo la misma Promise.
 * Si falla, marca sessionExpired y detiene TODAS las peticiones.
 */
async function refreshAccessToken(): Promise<string> {
  // Si ya hay un refresh en progreso, devolver la misma Promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error('NO_REFRESH_TOKEN');
      }

      // Llamar al endpoint de refresh SIN el interceptor (usar fetch directo para evitar loop)
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('REFRESH_FAILED');
      }

      const result: ApiResponse<RefreshResponse> = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = result.data.tokens;

      // Guardar los nuevos tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      return accessToken;
    } catch {
      // MARCAR que la sesión ha expirado para detener TODAS las peticiones futuras
      sessionExpired = true;

      // Limpiar tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // Redirigir a login SOLO si NO estamos ya en login
      if (!globalThis.window?.location.pathname.includes('/login')) {
        globalThis.window.location.href = '/login';
      }

      throw new Error('REFRESH_TOKEN_EXPIRED');
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Maneja errores 401 intentando renovar el token.
 */
async function handle401Error<T>(
  endpoint: string,
  options: RequestOptions | undefined
): Promise<T> {
  // NO intentar refresh si ya estamos en login o si la sesión ya expiró
  if (
    options?._retry ||
    endpoint === '/auth/refresh' ||
    globalThis.window?.location.pathname.includes('/login') ||
    sessionExpired
  ) {
    throw {
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      status: 401,
      code: 'SESSION_EXPIRED',
    } as ApiError;
  }

  try {
    // Intentar renovar el token
    await refreshAccessToken();

    // Reintentar la petición original con el nuevo token
    return request<T>(endpoint, { ...options, _retry: true });
  } catch {
    // Si falla el refresh, lanzar error terminal para evitar bucle
    // refreshAccessToken() ya limpia tokens y redirige a login (si no estamos allí)
    throw {
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      status: 401,
      code: 'SESSION_EXPIRED',
    } as ApiError;
  }
}

/**
 * Realiza una petición fetch configurada.
 */
async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  // Si la sesión ya expiró, no hacer ninguna petición
  if (sessionExpired) {
    throw {
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      status: 401,
      code: 'SESSION_EXPIRED',
    } as ApiError;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Obtener token y añadirlo al header si existe
  const token = getAuthToken();

  const config: RequestOptions = {
    ...options,
    credentials: 'include', // Para enviar cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Añadir token Bearer si existe
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText || 'Error en la petición',
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.code = errorData.code;
      } catch {
        // Si no se puede parsear el error, usar el mensaje por defecto
      }

      // Si es 401, intentar renovar el token
      if (error.status === 401) {
        return handle401Error<T>(endpoint, options);
      }

      throw error;
    }

    // Si es 204 No Content, no intentar parsear JSON
    if (response.status === 204) {
      return undefined as T;
    }

    const result: ApiResponse<T> = await response.json();

    // Unwrap la respuesta: devolver solo el campo "data"
    return result.data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }

    throw {
      message: 'Error de conexión con el servidor',
      status: 0,
    } as ApiError;
  }
}

/**
 * Cliente HTTP exportado con métodos para cada verbo HTTP.
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
