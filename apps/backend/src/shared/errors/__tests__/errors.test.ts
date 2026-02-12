import { describe, it, expect } from 'vitest';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  InvalidCredentialsError,
  EmailNotVerifiedError,
  TokenExpiredError,
  InvalidTokenError,
  EmailAlreadyExistsError,
  UserInactiveError,
  TokenRevokedError,
  UserNotFoundError,
} from '..';

describe('AppError hierarchy', () => {
  it('AppError aplica valores por defecto', () => {
    const error = new AppError('boom');

    expect(error.message).toBe('boom');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.stack).toBeDefined();
  });

  it('AppError acepta statusCode e isOperational personalizados', () => {
    const error = new AppError('fatal', 503, false);

    expect(error.statusCode).toBe(503);
    expect(error.isOperational).toBe(false);
  });

  it('errores HTTP base exponen statusCode correcto', () => {
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new ValidationError().statusCode).toBe(422);
    expect(new InternalServerError().statusCode).toBe(500);
  });

  it('errores de auth mantienen defaults y herencia', () => {
    const authErrors = [
      new InvalidCredentialsError(),
      new EmailNotVerifiedError(),
      new TokenExpiredError(),
      new InvalidTokenError(),
      new EmailAlreadyExistsError(),
      new UserInactiveError(),
      new TokenRevokedError(),
      new UserNotFoundError(),
    ];

    for (const authError of authErrors) {
      expect(authError).toBeInstanceOf(AppError);
      expect(authError).toBeInstanceOf(Error);
      expect(authError.isOperational).toBe(true);
      expect(authError.statusCode).toBeGreaterThanOrEqual(400);
    }
  });
});
