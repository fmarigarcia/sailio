import type { Request, Response, NextFunction } from 'express';
import { authService } from '../../modules/auth/auth.service';
import { UnauthorizedError } from '../errors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const payload = authService.verifyAccessToken(token);

    // Agregar información del usuario al request
    (req as AuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero si hay uno lo valida
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = authService.verifyAccessToken(token);

      (req as AuthRequest).user = {
        userId: payload.userId,
        email: payload.email,
      };
    }

    next();
  } catch {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
}
