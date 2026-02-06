import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-redundant-type-constituents
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  global.prisma = prisma;
}

export default prisma;
