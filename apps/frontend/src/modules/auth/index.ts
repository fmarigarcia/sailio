/**
 * Módulo de autenticación.
 * Maneja login, registro, perfil y logout.
 */

export type { User, LoginCredentials, RegisterData, AuthResponse } from './auth.types';
export { authApi } from './auth.api';
export { useProfile, useLogin, useRegister, useLogout, authKeys } from './hooks';
