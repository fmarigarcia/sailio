/**
 * Cliente HTTP para comunicación con el backend.
 * Configurado con interceptores para manejo de errores y autenticación.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Formato de respuesta estándar del backend
 */
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

/**
 * Opciones para las peticiones HTTP.
 */
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: 'include' | 'omit' | 'same-origin';
}

/**
 * Obtiene el token de autenticación del localStorage.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Realiza una petición fetch configurada.
 */
async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
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
