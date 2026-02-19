import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/http';
import { UnauthorizedError } from '../../shared/errors';
import type { AuthRequest } from '../../shared/middleware';
import { dashboardOverviewQuerySchema } from './dashboard.schemas';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = dashboardOverviewQuerySchema.parse(req.query);
      const userId = (req as AuthRequest).user?.userId;

      if (!userId) {
        throw new UnauthorizedError('Token no proporcionado');
      }

      const overview = await dashboardService.getOverview(userId, query);

      res.status(200).json(successResponse(overview));
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
