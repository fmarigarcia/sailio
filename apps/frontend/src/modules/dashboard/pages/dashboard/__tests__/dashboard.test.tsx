import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../dashboard';

vi.mock('@/ui', async () => {
  const actual = await vi.importActual<typeof import('@/ui')>('@/ui');

  return {
    ...actual,
    Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock('../useDashboard', () => ({
  useDashboard: vi.fn(),
}));

import { useDashboard } from '../useDashboard';

const createDashboardHookResult = () => ({
  state: {
    isLoading: false,
    isError: false,
    errorMessage: null,
    coachName: 'Sarah Connor',
    totalAthletes: 24,
    sessionsThisMonth: 18,
    upcomingSessionsCount: 5,
    averageRating: 8.4,
    recentSessions: [
      {
        id: 'recent-1',
        title: 'Advanced Tacking Techniques',
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
        title: 'Racing Strategy Workshop',
        sessionDate: '2026-02-20T10:00:00.000Z',
        status: 'planned',
        athletesCount: 8,
      },
    ],
  },
});

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...createDashboardHookResult(),
      state: {
        ...createDashboardHookResult().state,
        isLoading: true,
      },
    } as unknown as ReturnType<typeof useDashboard>);

    render(<Dashboard />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders overview data and sections', () => {
    vi.mocked(useDashboard).mockReturnValue(
      createDashboardHookResult() as unknown as ReturnType<typeof useDashboard>
    );

    render(<Dashboard />);

    expect(screen.getByText(/atletas totales|total athletes/i)).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText(/advanced tacking techniques/i)).toBeInTheDocument();
    expect(screen.getByText(/racing strategy workshop/i)).toBeInTheDocument();
  });
});
