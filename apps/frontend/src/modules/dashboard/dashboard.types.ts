export type DashboardSessionStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | (string & {});

export interface SessionSummary {
  id: string;
  title: string;
  sessionDate: string;
  status: DashboardSessionStatus;
  athletesCount: number;
}

export interface RecentSessionSummary extends SessionSummary {
  temperatureCelsius: number | null;
  windSpeedKnots: number | null;
}

export interface UpcomingSessionSummary extends SessionSummary {}

export interface DashboardOverviewResponse {
  totalAthletes: number;
  sessionsThisMonth: number;
  upcomingSessionsCount: number;
  averageRating: number | null;
  recentSessions: RecentSessionSummary[];
  upcomingSessions: UpcomingSessionSummary[];
}
