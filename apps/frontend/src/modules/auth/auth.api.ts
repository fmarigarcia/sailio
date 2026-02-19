import { apiClient } from '@/shared';
import type { User, LoginCredentials, RegisterData, AuthResponse, LogoutData } from './auth.types';

/**
 * API del módulo de autenticación.
 * ÚNICAMENTE llamadas al backend y mapeo de datos.
 */

export const authApi = {
  /**
   * Inicia sesión con credenciales.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Registra un nuevo usuario.
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   */
  getProfile: async (): Promise<{ user: User }> => {
    return apiClient.get<{ user: User }>('/auth/profile');
  },

  /**
   * Cierra sesión.
   */
  logout: async (data: LogoutData): Promise<void> => {
    return apiClient.post<void>('/auth/logout', data);
  },
};
