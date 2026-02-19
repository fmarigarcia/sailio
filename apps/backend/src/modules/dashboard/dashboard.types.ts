export interface DashboardOverviewQuery {
  [key: string]: unknown;
}

export interface RecentSessionSummary {
  id: string;
  title: string;
  sessionDate: Date;
  status: string;
  athletesCount: number;
  temperatureCelsius: number | null;
  windSpeedKnots: number | null;
}

export interface UpcomingSessionSummary {
  id: string;
  title: string;
  sessionDate: Date;
  status: string;
  athletesCount: number;
}

export interface DashboardOverview {
  totalAthletes: number;
  sessionsThisMonth: number;
  upcomingSessionsCount: number;
  averageRating: number | null;
  recentSessions: RecentSessionSummary[];
  upcomingSessions: UpcomingSessionSummary[];
}
