import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));

/**
 * Rutas del módulo de autenticación.
 */
export const authRoutes: RouteObject[] = [
  {
    index: true,
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  // Future routes:
  // {
  //   path: 'forgot-password',
  //   element: <ForgotPassword />,
  // },
];
