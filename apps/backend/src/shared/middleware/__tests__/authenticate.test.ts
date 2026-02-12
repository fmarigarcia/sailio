import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuthenticate, type AuthRequest } from '../authenticate';
import { authService } from '../../../modules/auth/auth.service';
import { UnauthorizedError } from '../../errors';

vi.mock('../../../modules/auth/auth.service', () => ({
  authService: {
    verifyAccessToken: vi.fn(),
  },
}));

describe('authenticate middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('debe enviar UnauthorizedError cuando no hay header authorization', () => {
    const req = {
      headers: {},
    } as Request;

    authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('debe enviar UnauthorizedError cuando no usa Bearer', () => {
    const req = {
      headers: {
        authorization: 'Basic abc',
      },
    } as Request;

    authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('debe adjuntar usuario al request cuando token es válido', () => {
    const req = {
      headers: {
        authorization: 'Bearer token-valido',
      },
    } as Request;

    vi.mocked(authService.verifyAccessToken).mockReturnValue({
      userId: 'user-1',
      email: 'test@test.com',
      type: 'access',
    });

    authenticate(req, {} as Response, next);

    expect((req as AuthRequest).user).toEqual({
      userId: 'user-1',
      email: 'test@test.com',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('debe delegar el error cuando verifyAccessToken falla', () => {
    const authError = new Error('invalid-token');
    const req = {
      headers: {
        authorization: 'Bearer token-invalido',
      },
    } as Request;

    vi.mocked(authService.verifyAccessToken).mockImplementation(() => {
      throw authError;
    });

    authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(authError);
  });
});

describe('optionalAuthenticate middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('debe continuar cuando no hay authorization', () => {
    const req = {
      headers: {},
    } as Request;

    optionalAuthenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect((req as AuthRequest).user).toBeUndefined();
  });

  it('debe adjuntar usuario cuando hay token válido', () => {
    const req = {
      headers: {
        authorization: 'Bearer token-opcional',
      },
    } as Request;

    vi.mocked(authService.verifyAccessToken).mockReturnValue({
      userId: 'user-2',
      email: 'optional@test.com',
      type: 'access',
    });

    optionalAuthenticate(req, {} as Response, next);

    expect((req as AuthRequest).user).toEqual({
      userId: 'user-2',
      email: 'optional@test.com',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('debe ignorar errores de token y continuar sin usuario', () => {
    const req = {
      headers: {
        authorization: 'Bearer token-roto',
      },
    } as Request;

    vi.mocked(authService.verifyAccessToken).mockImplementation(() => {
      throw new Error('invalid');
    });

    optionalAuthenticate(req, {} as Response, next);

    expect((req as AuthRequest).user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
