import type { ApiError } from '@/shared';
import { useProfile } from '@/modules/auth';
import { useDashboardOverview } from '../../hooks';
import type {
  DashboardOverviewResponse,
  RecentSessionSummary,
  UpcomingSessionSummary,
} from '../../dashboard.types';

const RECENT_SESSIONS_LIMIT = 3;
const UPCOMING_SESSIONS_LIMIT = 3;

interface DashboardUserLike {
  firstName?: string | null;
  lastName?: string | null;
}

interface DashboardLists {
  recentSessions: RecentSessionSummary[];
  upcomingSessions: UpcomingSessionSummary[];
}

interface DashboardMetrics {
  totalAthletes: number;
  sessionsThisMonth: number;
  upcomingSessionsCount: number;
  averageRating: number | null;
}

export interface DashboardState extends DashboardMetrics, DashboardLists {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  coachName: string;
}

export interface UseDashboardResult {
  state: DashboardState;
}

function getCoachName(user: DashboardUserLike | undefined): string {
  const coachName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  return coachName;
}

function getMetrics(data: DashboardOverviewResponse | undefined): DashboardMetrics {
  return {
    totalAthletes: data?.totalAthletes ?? 0,
    sessionsThisMonth: data?.sessionsThisMonth ?? 0,
    upcomingSessionsCount: data?.upcomingSessionsCount ?? 0,
    averageRating: data?.averageRating ?? null,
  };
}

function getLists(data: DashboardOverviewResponse | undefined): DashboardLists {
  return {
    recentSessions: data?.recentSessions.slice(0, RECENT_SESSIONS_LIMIT) ?? [],
    upcomingSessions: data?.upcomingSessions.slice(0, UPCOMING_SESSIONS_LIMIT) ?? [],
  };
}

function getErrorMessage(error: unknown): string | undefined {
  return (error as ApiError | null)?.message;
}

export function useDashboard(): UseDashboardResult {
  const { data: { user } = {} } = useProfile();
  const { data, isLoading, isError, error } = useDashboardOverview();
  const metrics = getMetrics(data);
  const lists = getLists(data);

  return {
    state: {
      isLoading,
      isError,
      errorMessage: getErrorMessage(error),
      coachName: getCoachName(user),
      ...metrics,
      ...lists,
    },
  };
}
