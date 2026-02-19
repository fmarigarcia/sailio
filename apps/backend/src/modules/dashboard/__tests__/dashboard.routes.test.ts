import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';
import dashboardRoutes from '../dashboard.routes';
import { errorHandler } from '../../../shared/middleware/errorHandler';
import { UnauthorizedError } from '../../../shared/errors';
import { dashboardService } from '../dashboard.service';

const authenticateMock = vi.fn();

vi.mock('../../../shared/middleware', async () => {
  const actual = await vi.importActual<typeof import('../../../shared/middleware')>(
    '../../../shared/middleware'
  );

  return {
    ...actual,
    authenticate: (req: Request, res: Response, next: NextFunction) =>
      authenticateMock(req, res, next),
  };
});

vi.mock('../dashboard.service', () => ({
  dashboardService: {
    getOverview: vi.fn(),
  },
}));

describe('Dashboard routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authenticateMock.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
      (req as Request & { user: { userId: string; email: string } }).user = {
        userId: 'coach-1',
        email: 'coach@test.com',
      };
      next();
    });
  });

  it('GET /dashboard/overview responde 200 en flujo exitoso', async () => {
    const app = express();
    app.use(express.json());
    app.use('/dashboard', dashboardRoutes);
    app.use(errorHandler);

    vi.mocked(dashboardService.getOverview).mockResolvedValue({
      totalAthletes: 4,
      sessionsThisMonth: 3,
      upcomingSessionsCount: 1,
      averageRating: null,
      recentSessions: [],
      upcomingSessions: [],
    });

    const response = await request(app).get('/dashboard/overview');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.totalAthletes).toBe(4);
  });

  it('GET /dashboard/overview responde 401 cuando auth falla', async () => {
    const app = express();
    app.use(express.json());
    app.use('/dashboard', dashboardRoutes);
    app.use(errorHandler);

    authenticateMock.mockImplementation((_req: Request, _res: Response, next: NextFunction) =>
      next(new UnauthorizedError('Token no proporcionado'))
    );

    const response = await request(app).get('/dashboard/overview');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });
});
