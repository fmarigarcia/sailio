import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler, notFoundHandler } from './shared/middleware';

/**
 * Crea y configura la aplicación Express
 */
export const createApp = (): Application => {
  const app = express();

  // Seguridad
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api', (_req, res) => {
    res.json({
      message: 'Sailio API - Backend base structure',
      version: '0.1.0',
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (debe ser el último middleware)
  app.use(errorHandler);

  return app;
};
