import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Sessions = lazy(() => import('./pages/sessions'));

export const sessionsRoutes: RouteObject[] = [
  {
    path: 'sessions',
    element: <Sessions />,
  },
];
