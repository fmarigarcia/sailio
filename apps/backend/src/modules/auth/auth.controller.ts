import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema } from './auth.schemas';
import { successResponse } from '../../shared/http';
import type { AuthRequest } from '../../shared/middleware';
import { UnauthorizedError } from '../../shared/errors';

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      res.status(201).json(
        successResponse({
          user: result.user,
          tokens: result.tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });

      const result = await authService.login(validatedData);

      res.status(200).json(
        successResponse({
          user: result.user,
          tokens: result.tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = refreshTokenSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });

      const tokens = await authService.refreshToken(validatedData);

      res.status(200).json(successResponse({ tokens }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = logoutSchema.parse(req.body);
      await authService.logout(validatedData);

      res.status(200).json(successResponse({ message: 'Sesión cerrada exitosamente' }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;

      if (!userId) {
        throw new UnauthorizedError();
      }

      const user = await authService.getProfile(userId);

      res.status(200).json(successResponse({ user }));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
