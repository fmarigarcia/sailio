import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboard } from '../use-dashboard';

vi.mock('@/modules/auth', () => ({
  useProfile: vi.fn(),
}));

vi.mock('../../../hooks', () => ({
  useDashboardOverview: vi.fn(),
}));

import { useProfile } from '@/modules/auth';
import { useDashboardOverview } from '../../../hooks';

describe('useDashboard', () => {
  it('returns computed data for dashboard UI', () => {
    vi.mocked(useProfile).mockReturnValue({
      data: {
        user: {
          firstName: 'Sarah',
          lastName: 'Connor',
        },
      },
    } as ReturnType<typeof useProfile>);

    vi.mocked(useDashboardOverview).mockReturnValue({
      data: {
        totalAthletes: 24,
        sessionsThisMonth: 18,
        upcomingSessionsCount: 5,
        averageRating: 8.4,
        recentSessions: [
          {
            id: 'recent-1',
            title: 'Recent',
            sessionDate: '2026-02-18T10:00:00.000Z',
            status: 'completed',
            athletesCount: 10,
            temperatureCelsius: 20,
            windSpeedKnots: 14,
          },
        ],
        upcomingSessions: [
          {
            id: 'upcoming-1',
            title: 'Upcoming',
            sessionDate: '2026-02-20T10:00:00.000Z',
            status: 'planned',
            athletesCount: 8,
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDashboardOverview>);

    const { result } = renderHook(() => useDashboard());

    expect(result.current.state.coachName).toBe('Sarah Connor');
    expect(result.current.state.totalAthletes).toBe(24);
    expect(result.current.state.recentSessions).toHaveLength(1);
    expect(result.current.state.upcomingSessions).toHaveLength(1);
  });

  it('uses fallback values when data is missing', () => {
    vi.mocked(useProfile).mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useProfile>);

    vi.mocked(useDashboardOverview).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDashboardOverview>);

    const { result } = renderHook(() => useDashboard());

    expect(result.current.state.totalAthletes).toBe(0);
    expect(result.current.state.recentSessions).toEqual([]);
    expect(result.current.state.upcomingSessions).toEqual([]);
  });
});
