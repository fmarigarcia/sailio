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
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Manejo de cierre graceful
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
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
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
