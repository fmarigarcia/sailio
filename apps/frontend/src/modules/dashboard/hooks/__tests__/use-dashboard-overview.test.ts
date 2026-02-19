import React, { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardOverview } from '../use-dashboard-overview';
import { dashboardApi } from '../../dashboard.api';

vi.mock('../../dashboard.api', () => ({
  dashboardApi: {
    getOverview: vi.fn(),
  },
}));

describe('useDashboardOverview', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    function Wrapper({ children }: { children: ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    }

    return Wrapper;
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('fetches dashboard overview successfully', async () => {
    vi.mocked(dashboardApi.getOverview).mockResolvedValue({
      totalAthletes: 24,
      sessionsThisMonth: 18,
      upcomingSessionsCount: 5,
      averageRating: 8.4,
      recentSessions: [],
      upcomingSessions: [],
    });

    const { result } = renderHook(() => useDashboardOverview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.totalAthletes).toBe(24);
    expect(dashboardApi.getOverview).toHaveBeenCalledTimes(1);
  });

  it('returns error when api request fails', async () => {
    const apiError = { message: 'Network error', status: 0 };
    vi.mocked(dashboardApi.getOverview).mockRejectedValue(apiError);

    const { result } = renderHook(() => useDashboardOverview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(apiError);
  });
});
