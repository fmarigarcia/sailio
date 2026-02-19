/**
 * Módulo de Dashboard.
 * Página principal de la aplicación una vez autenticado.
 */

export type {
  DashboardOverviewResponse,
  DashboardSessionStatus,
  SessionSummary,
  RecentSessionSummary,
  UpcomingSessionSummary,
} from './dashboard.types';
export { dashboardApi } from './dashboard.api';
export { useDashboardOverview, dashboardKeys } from './hooks';
export { dashboardRoutes } from './dashboard.routes';
export { Dashboard } from './pages/dashboard';
export { useDashboard } from './pages/dashboard';
