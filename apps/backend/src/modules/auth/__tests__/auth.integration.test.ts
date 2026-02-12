import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';
import authRoutes from '../auth.routes';
import { errorHandler } from '../../../shared/middleware';
import { prisma } from '../../../shared/db';

const AUTH_TEST_EMAIL_PREFIX = `auth-integration-`;

const createTestEmail = (label: string): string =>
  `${label}-${AUTH_TEST_EMAIL_PREFIX}${Date.now()}@test.com`;

describe('Auth Routes Integration', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
    app.use(errorHandler);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar solo datos creados por este archivo de tests
    await prisma.refreshToken.deleteMany({
      where: {
        user: {
          email: {
            contains: AUTH_TEST_EMAIL_PREFIX,
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: AUTH_TEST_EMAIL_PREFIX,
        },
      },
    });
  });

  describe('POST /auth/register', () => {
    it('debe registrar un nuevo usuario', async () => {
      const email = createTestEmail('newuser');

      const response = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'New',
        lastName: 'User',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(email);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('debe fallar con email duplicado', async () => {
      const email = createTestEmail('duplicate');

      await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'First',
        lastName: 'User',
      });

      const response = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'Second',
        lastName: 'User',
      });

      expect(response.status).toBe(409);
    });

    it('debe fallar con contraseña débil', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'weak@test.com',
        password: 'weak',
        firstName: 'Weak',
        lastName: 'Password',
      });

      expect(response.status).toBe(422);
    });

    it('debe fallar con email inválido', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'invalidemail',
        password: 'Password123',
        firstName: 'Invalid',
        lastName: 'Email',
      });

      expect(response.status).toBe(422);
    });
  });

  describe('POST /auth/login', () => {
    const loginEmail = createTestEmail('login');

    beforeEach(async () => {
      await request(app).post('/auth/register').send({
        email: loginEmail,
        password: 'Password123',
        firstName: 'Login',
        lastName: 'Test',
      });
    });

    it('debe autenticar usuario con credenciales válidas', async () => {
      const response = await request(app).post('/auth/login').send({
        email: loginEmail,
        password: 'Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(loginEmail);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('debe fallar con email incorrecto', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'wrong@test.com',
        password: 'Password123',
      });

      expect(response.status).toBe(401);
    });

    it('debe fallar con contraseña incorrecta', async () => {
      const response = await request(app).post('/auth/login').send({
        email: loginEmail,
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('debe renovar tokens con refresh token válido', async () => {
      const email = createTestEmail('refresh');

      const registerResponse = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'Refresh',
        lastName: 'Test',
      });

      const refreshToken = registerResponse.body.data.tokens.refreshToken;

      const response = await request(app).post('/auth/refresh').send({
        refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('debe fallar con refresh token inválido', async () => {
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: 'invalidtoken',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('debe cerrar sesión exitosamente', async () => {
      const email = createTestEmail('logout');

      const registerResponse = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'Logout',
        lastName: 'Test',
      });

      const refreshToken = registerResponse.body.data.tokens.refreshToken;

      const response = await request(app).post('/auth/logout').send({
        refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('debe permitir logout múltiples veces', async () => {
      const email = createTestEmail('multilogout');

      const registerResponse = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'Multi',
        lastName: 'Logout',
      });

      const refreshToken = registerResponse.body.data.tokens.refreshToken;

      await request(app).post('/auth/logout').send({ refreshToken });
      const response = await request(app).post('/auth/logout').send({ refreshToken });

      expect(response.status).toBe(200);
    });
  });

  describe('Token Rotation', () => {
    it('debe revocar token viejo después de refresh', async () => {
      const email = createTestEmail('rotation');

      const registerResponse = await request(app).post('/auth/register').send({
        email,
        password: 'Password123',
        firstName: 'Rotation',
        lastName: 'Test',
      });

      const oldRefreshToken = registerResponse.body.data.tokens.refreshToken;

      // Renovar tokens
      await request(app).post('/auth/refresh').send({
        refreshToken: oldRefreshToken,
      });

      // Intentar usar el token viejo nuevamente
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: oldRefreshToken,
      });

      expect(response.status).toBe(401);
    });
  });
});
