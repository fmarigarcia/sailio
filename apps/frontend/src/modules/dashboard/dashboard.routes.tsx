import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/dashboard'));

/**
 * Rutas del módulo de dashboard.
 */
export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
];
