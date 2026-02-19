import { Router } from 'express';
import { authenticate } from '../../shared/middleware';
import { dashboardController } from './dashboard.controller';

const router: Router = Router();

router.get('/overview', authenticate, (req, res, next) => {
  void dashboardController.getOverview(req, res, next);
});

export default router;
