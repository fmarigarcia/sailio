import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { authRoutes } from '@/modules/auth';
import { athletesRoutes } from '@/modules/athletes';
import { dashboardRoutes } from '@/modules/dashboard';
import { profileRoutes } from '@/modules/profile';
import { sessionsRoutes } from '@/modules/sessions';
import { settingsRoutes } from '@/modules/settings';
import { ProtectedRoute, PublicRoute } from './components';

/**
 * Configuración de rutas de la aplicación.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      ...dashboardRoutes,
      ...athletesRoutes,
      ...sessionsRoutes,
      ...profileRoutes,
      ...settingsRoutes,
    ],
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
