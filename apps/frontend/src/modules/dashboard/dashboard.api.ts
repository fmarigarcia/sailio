import { apiClient } from '@/shared';
import type { DashboardOverviewResponse } from './dashboard.types';

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    return apiClient.get<DashboardOverviewResponse>('/dashboard/overview');
  },
};
