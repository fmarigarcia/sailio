/**
 * Tipos para el cliente HTTP
 */

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Formato de respuesta estándar del backend
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

/**
 * Opciones para las peticiones HTTP.
 */
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: 'include' | 'omit' | 'same-origin';
  _retry?: boolean; // Flag interno para evitar loops infinitos
}

/**
 * Respuesta del endpoint /auth/refresh
 */
export interface RefreshResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
