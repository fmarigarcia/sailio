import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('./pages/login'));

/**
 * Rutas del módulo de autenticación.
 * Solo incluye login por ahora.
 */
export const authRoutes: RouteObject[] = [
  {
    index: true,
    path: 'login',
    element: <Login />,
  },
  // Future routes:
  // {
  //   path: 'register',
  //   element: <Register />,
  // },
  // {
  //   path: 'forgot-password',
  //   element: <ForgotPassword />,
  // },
];
