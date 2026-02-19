import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { DashboardController } from '../dashboard.controller';
import { dashboardService } from '../dashboard.service';
import { UnauthorizedError } from '../../../shared/errors';

vi.mock('../dashboard.service', () => ({
  dashboardService: {
    getOverview: vi.fn(),
  },
}));

type MockResponse = Response & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

const createMockResponse = (): MockResponse => {
  const response = {} as MockResponse;
  response.status = vi.fn().mockReturnValue(response);
  response.json = vi.fn().mockReturnValue(response);
  return response;
};

describe('DashboardController', () => {
  let controller: DashboardController;
  let next: NextFunction;

  beforeEach(() => {
    controller = new DashboardController();
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('responde 200 con overview cuando usuario está autenticado', async () => {
    const req = {
      query: {},
      user: {
        userId: 'coach-1',
        email: 'coach@test.com',
      },
    } as unknown as Request;
    const res = createMockResponse();

    vi.mocked(dashboardService.getOverview).mockResolvedValue({
      totalAthletes: 10,
      sessionsThisMonth: 4,
      upcomingSessionsCount: 2,
      averageRating: 8,
      recentSessions: [],
      upcomingSessions: [],
    });

    await controller.getOverview(req, res, next);

    expect(dashboardService.getOverview).toHaveBeenCalledWith('coach-1', {});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates UnauthorizedError al next cuando no hay usuario autenticado', async () => {
    const req = {
      query: {},
    } as Request;
    const res = createMockResponse();

    await controller.getOverview(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('delegates errores del service al next', async () => {
    const req = {
      query: {},
      user: {
        userId: 'coach-1',
        email: 'coach@test.com',
      },
    } as unknown as Request;
    const res = createMockResponse();
    const serviceError = new Error('service failed');

    vi.mocked(dashboardService.getOverview).mockRejectedValue(serviceError);

    await controller.getOverview(req, res, next);

    expect(next).toHaveBeenCalledWith(serviceError);
  });
});
