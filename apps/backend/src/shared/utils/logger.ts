/**
 * Logger configurado con Pino
 */
import pino from 'pino';

/**
 * Configuración del logger según el entorno
 */
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  return pino({
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    // En test, desactivar logging
    enabled: !isTest,
    // En desarrollo, usar pretty print para mejor legibilidad
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  });
};

export const logger = createLogger();
