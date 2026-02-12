import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AuthController } from '../auth.controller';
import { authService } from '../auth.service';
import { UnauthorizedError } from '../../../shared/errors';

vi.mock('../auth.service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
  },
}));

type MockResponse = Response & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

const createMockResponse = (): MockResponse => {
  const response = {} as MockResponse;
  response.status = vi.fn().mockReturnValue(response);
  response.json = vi.fn().mockReturnValue(response);
  return response;
};

describe('AuthController', () => {
  let controller: AuthController;
  let next: NextFunction;

  beforeEach(() => {
    controller = new AuthController();
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('register responde 201 cuando registro es exitoso', async () => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      },
    } as Request;
    const res = createMockResponse();

    vi.mocked(authService.register).mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    });

    await controller.register(req, res, next);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('register delega errores de validación al next', async () => {
    const req = {
      body: {
        email: 'invalid-email',
        password: 'weak',
        firstName: '',
        lastName: '',
      },
    } as Request;
    const res = createMockResponse();

    await controller.register(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('login agrega userAgent/ip y responde 200', async () => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'Password123',
      },
      headers: {
        'user-agent': 'vitest-agent',
      },
      ip: '127.0.0.1',
    } as Request;
    const res = createMockResponse();

    vi.mocked(authService.login).mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    });

    await controller.login(req, res, next);

    expect(authService.login).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@test.com',
        password: 'Password123',
        userAgent: 'vitest-agent',
        ipAddress: '127.0.0.1',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('refresh responde 200 y retorna tokens', async () => {
    const req = {
      body: {
        refreshToken: 'refresh-token',
      },
      headers: {
        'user-agent': 'vitest-agent',
      },
      ip: '127.0.0.1',
    } as Request;
    const res = createMockResponse();

    vi.mocked(authService.refreshToken).mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    await controller.refresh(req, res, next);

    expect(authService.refreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        refreshToken: 'refresh-token',
        userAgent: 'vitest-agent',
        ipAddress: '127.0.0.1',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('logout responde 200 en flujo exitoso', async () => {
    const req = {
      body: {
        refreshToken: 'refresh-token',
      },
    } as Request;
    const res = createMockResponse();

    vi.mocked(authService.logout).mockResolvedValue();

    await controller.logout(req, res, next);

    expect(authService.logout).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getProfile envía UnauthorizedError si no hay userId', async () => {
    const req = {} as Request;
    const res = createMockResponse();

    await controller.getProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('getProfile responde 200 cuando hay usuario autenticado', async () => {
    const req = {
      user: {
        userId: 'user-1',
        email: 'test@test.com',
      },
    } as unknown as Request;
    const res = createMockResponse();

    vi.mocked(authService.getProfile).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      certificationLevel: null,
      clubAffiliation: null,
      bio: null,
      profileImageUrl: null,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.getProfile(req, res, next);

    expect(authService.getProfile).toHaveBeenCalledWith('user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });
});
