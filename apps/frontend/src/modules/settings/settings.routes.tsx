import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Settings = lazy(() => import('./pages/settings'));

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <Settings />,
  },
];
