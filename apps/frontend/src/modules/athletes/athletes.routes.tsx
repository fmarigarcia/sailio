import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Athletes = lazy(() => import('./pages/athletes'));

export const athletesRoutes: RouteObject[] = [
  {
    path: 'athletes',
    element: <Athletes />,
  },
];
