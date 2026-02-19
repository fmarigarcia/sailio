import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardService } from '../dashboard.service';
import { prisma } from '../../../shared/db';
import { UserInactiveError, UserNotFoundError } from '../../../shared/errors';

vi.mock('../../../shared/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    athlete: {
      count: vi.fn(),
    },
    session: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    trainingSessionData: {
      aggregate: vi.fn(),
    },
  },
}));

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-19T10:00:00.000Z'));
  });

  it('retorna overview agregado con datos del coach', async () => {
    const expectedMonthStart = new Date(2026, 1, 1);
    const expectedNextMonthStart = new Date(2026, 2, 1);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'coach-1', isActive: true } as never);
    vi.mocked(prisma.athlete.count).mockResolvedValue(8);
    vi.mocked(prisma.session.count).mockResolvedValueOnce(5).mockResolvedValueOnce(2);
    vi.mocked(prisma.trainingSessionData.aggregate).mockResolvedValue({
      _avg: {
        performanceRating: 7.5,
      },
    } as never);
    vi.mocked(prisma.session.findMany)
      .mockResolvedValueOnce([
        {
          id: 'recent-1',
          title: 'Reciente 1',
          sessionDate: new Date('2026-02-18T08:00:00.000Z'),
          status: 'completed',
          weatherCondition: {
            temperatureCelsius: 20,
            windSpeedKnots: 14,
          },
          _count: {
            trainingSessionData: 4,
          },
        },
      ] as never)
      .mockResolvedValueOnce([
        {
          id: 'upcoming-1',
          title: 'Próxima 1',
          sessionDate: new Date('2026-02-20T08:00:00.000Z'),
          status: 'planned',
          _count: {
            trainingSessionData: 3,
          },
        },
      ] as never);

    const result = await service.getOverview('coach-1', {});

    expect(result.totalAthletes).toBe(8);
    expect(result.sessionsThisMonth).toBe(5);
    expect(result.upcomingSessionsCount).toBe(2);
    expect(result.averageRating).toBe(7.5);
    expect(result.recentSessions).toHaveLength(1);
    expect(result.upcomingSessions).toHaveLength(1);
    expect(prisma.session.count).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({
          coachId: 'coach-1',
          sessionDate: {
            gte: expectedMonthStart,
            lt: expectedNextMonthStart,
          },
        }),
      })
    );
  });

  it('retorna averageRating null cuando no hay ratings', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'coach-1', isActive: true } as never);
    vi.mocked(prisma.athlete.count).mockResolvedValue(1);
    vi.mocked(prisma.session.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    vi.mocked(prisma.trainingSessionData.aggregate).mockResolvedValue({
      _avg: {
        performanceRating: null,
      },
    } as never);
    vi.mocked(prisma.session.findMany)
      .mockResolvedValueOnce([] as never)
      .mockResolvedValueOnce([] as never);

    const result = await service.getOverview('coach-1', {});

    expect(result.averageRating).toBeNull();
    expect(result.recentSessions).toEqual([]);
    expect(result.upcomingSessions).toEqual([]);
  });

  it('lanza UserNotFoundError si el coach no existe', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(service.getOverview('missing-coach', {})).rejects.toThrow(UserNotFoundError);
  });

  it('lanza UserInactiveError si el coach está inactivo', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'coach-1',
      isActive: false,
    } as never);

    await expect(service.getOverview('coach-1', {})).rejects.toThrow(UserInactiveError);
  });
});
