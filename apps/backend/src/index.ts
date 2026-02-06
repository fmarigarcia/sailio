import { createApp } from './app';
import { config } from './config';
import { logger } from './shared/utils';
import { prisma } from './shared/db';

/**
 * Inicia el servidor
 */
const startServer = async (): Promise<void> => {
  try {
    // Verificar conexión a la base de datos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    app.listen(config.port, config.host, () => {
      logger.info(
        `Server running in ${config.nodeEnv} mode on http://${config.host}:${config.port}`
      );
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

/**
 * Manejo de cierre graceful
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await prisma.$disconnect();
    logger.info('Database disconnected');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    process.exit(1);
  }
};

// Iniciar servidor
void startServer();

// Listeners para señales de terminación
process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ err: reason }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ err: error }, 'Uncaught Exception');
  process.exit(1);
});
