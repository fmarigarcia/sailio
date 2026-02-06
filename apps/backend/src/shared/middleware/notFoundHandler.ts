import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
