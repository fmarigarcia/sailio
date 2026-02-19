import { prisma } from '../../shared/db';
import { UserInactiveError, UserNotFoundError } from '../../shared/errors';
import type {
  DashboardOverview,
  DashboardOverviewQuery,
  RecentSessionSummary,
  UpcomingSessionSummary,
} from './dashboard.types';

const UPCOMING_STATUSES = ['planned', 'in_progress'] as const;
const RECENT_SESSIONS_LIMIT = 3;
const UPCOMING_SESSIONS_LIMIT = 3;

export class DashboardService {
  async getOverview(coachId: string, _query: DashboardOverviewQuery): Promise<DashboardOverview> {
    const coach = await prisma.user.findUnique({
      where: { id: coachId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!coach) {
      throw new UserNotFoundError();
    }

    if (!coach.isActive) {
      throw new UserInactiveError();
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [
      totalAthletes,
      sessionsThisMonth,
      upcomingSessionsCount,
      ratingsAggregate,
      recentSessionsResult,
      upcomingSessionsResult,
    ] = await Promise.all([
      prisma.athlete.count({
        where: {
          coachId,
          isActive: true,
        },
      }),
      prisma.session.count({
        where: {
          coachId,
          sessionDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      }),
      prisma.session.count({
        where: {
          coachId,
          status: {
            in: [...UPCOMING_STATUSES],
          },
          sessionDate: {
            gt: now,
          },
        },
      }),
      prisma.trainingSessionData.aggregate({
        where: {
          performanceRating: {
            not: null,
          },
          session: {
            coachId,
          },
        },
        _avg: {
          performanceRating: true,
        },
      }),
      prisma.session.findMany({
        where: {
          coachId,
        },
        orderBy: {
          sessionDate: 'desc',
        },
        take: RECENT_SESSIONS_LIMIT,
        select: {
          id: true,
          title: true,
          sessionDate: true,
          status: true,
          weatherCondition: {
            select: {
              temperatureCelsius: true,
              windSpeedKnots: true,
            },
          },
          _count: {
            select: {
              trainingSessionData: true,
            },
          },
        },
      }),
      prisma.session.findMany({
        where: {
          coachId,
          status: {
            in: [...UPCOMING_STATUSES],
          },
          sessionDate: {
            gt: now,
          },
        },
        orderBy: {
          sessionDate: 'asc',
        },
        take: UPCOMING_SESSIONS_LIMIT,
        select: {
          id: true,
          title: true,
          sessionDate: true,
          status: true,
          _count: {
            select: {
              trainingSessionData: true,
            },
          },
        },
      }),
    ]);

    const recentSessions: RecentSessionSummary[] = recentSessionsResult.map((session) => ({
      id: session.id,
      title: session.title,
      sessionDate: session.sessionDate,
      status: session.status,
      athletesCount: session._count.trainingSessionData,
      temperatureCelsius: session.weatherCondition?.temperatureCelsius ?? null,
      windSpeedKnots: session.weatherCondition?.windSpeedKnots ?? null,
    }));

    const upcomingSessions: UpcomingSessionSummary[] = upcomingSessionsResult.map((session) => ({
      id: session.id,
      title: session.title,
      sessionDate: session.sessionDate,
      status: session.status,
      athletesCount: session._count.trainingSessionData,
    }));

    return {
      totalAthletes,
      sessionsThisMonth,
      upcomingSessionsCount,
      averageRating: ratingsAggregate._avg.performanceRating,
      recentSessions,
      upcomingSessions,
    };
  }
}

export const dashboardService = new DashboardService();
