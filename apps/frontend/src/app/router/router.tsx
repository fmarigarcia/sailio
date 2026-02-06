import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { authRoutes } from '@/modules/auth';
import { dashboardRoutes } from '@/modules/dashboard';
import { ProtectedRoute, PublicRoute } from './components';

/**
 * Configuración de rutas de la aplicación.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: dashboardRoutes,
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: authRoutes,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
