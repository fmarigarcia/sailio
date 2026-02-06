/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth.service';
import { prisma } from '../../../shared/db';
import {
  InvalidCredentialsError,
  EmailAlreadyExistsError,
  UserInactiveError,
  InvalidTokenError,
  TokenExpiredError,
} from '../../../shared/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

vi.mock('../../../shared/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hashedpassword',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      const mockBcryptHash = vi.mocked(bcrypt.hash);
      const mockUserCreate = vi.mocked(prisma.user.create);
      const mockJwtSign = vi.mocked(jwt.sign);
      const mockRefreshTokenCreate = vi.mocked(prisma.refreshToken.create);

      mockUserFindUnique.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue('hashedpassword' as never);
      mockUserCreate.mockResolvedValue(mockUser);
      mockJwtSign.mockReturnValue('mocktoken' as never);
      mockRefreshTokenCreate.mockResolvedValue({} as never);

      const result = await authService.register({
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.user.email).toBe('test@test.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(mockUserCreate).toHaveBeenCalled();
    });

    it('debe lanzar error si el email ya existe', async () => {
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      mockUserFindUnique.mockResolvedValue({} as never);

      await expect(
        authService.register({
          email: 'existing@test.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow(EmailAlreadyExistsError);
    });
  });

  describe('login', () => {
    it('debe autenticar usuario con credenciales válidas', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        passwordHash: 'hashedpassword',
        isActive: true,
        emailVerified: true,
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);
      const mockBcryptHash = vi.mocked(bcrypt.hash);
      const mockJwtSign = vi.mocked(jwt.sign);
      const mockRefreshTokenCreate = vi.mocked(prisma.refreshToken.create);

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockBcryptHash.mockResolvedValue('hashedtoken' as never);
      mockJwtSign.mockReturnValue('mocktoken' as never);
      mockRefreshTokenCreate.mockResolvedValue({} as never);

      const result = await authService.login({
        email: 'test@test.com',
        password: 'Password123',
      });

      expect(result.user.email).toBe('test@test.com');
      expect(result.tokens).toBeDefined();
    });

    it('debe lanzar error con credenciales inválidas', async () => {
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('debe lanzar error si usuario está inactivo', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        passwordHash: 'hashedpassword',
        isActive: false,
        emailVerified: true,
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true as never);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'Password123',
        })
      ).rejects.toThrow(UserInactiveError);
    });
  });

  describe('verifyAccessToken', () => {
    it('debe verificar token válido', () => {
      const mockPayload = {
        userId: '123',
        email: 'test@test.com',
        type: 'access' as const,
      };

      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockReturnValue(mockPayload as never);

      const result = authService.verifyAccessToken('validtoken');

      expect(result.userId).toBe('123');
      expect(result.type).toBe('access');
    });

    it('debe lanzar error con token inválido', () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyAccessToken('invalidtoken')).toThrow(InvalidTokenError);
    });

    it('debe lanzar error con token expirado', () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      expect(() => authService.verifyAccessToken('expiredtoken')).toThrow(TokenExpiredError);
    });
  });

  describe('logout', () => {
    it('debe revocar el refresh token', async () => {
      const mockToken = {
        id: 'token123',
        userId: '123',
        tokenHash: 'hashedtoken',
        familyId: 'family123',
        expiresAt: new Date(),
        isRevoked: false,
        deviceInfo: null,
        ipAddress: null,
        userAgent: null,
        revokedAt: null,
        revokedReason: null,
        createdAt: new Date(),
      };

      const mockBcryptHash = vi.mocked(bcrypt.hash);
      const mockRefreshTokenFindUnique = vi.mocked(prisma.refreshToken.findUnique);
      const mockRefreshTokenUpdate = vi.mocked(prisma.refreshToken.update);

      mockBcryptHash.mockResolvedValue('hashedtoken' as never);
      mockRefreshTokenFindUnique.mockResolvedValue(mockToken);
      mockRefreshTokenUpdate.mockResolvedValue({} as never);

      await authService.logout({ refreshToken: 'validtoken' });

      expect(mockRefreshTokenUpdate).toHaveBeenCalledWith({
        where: { id: 'token123' },
        data: expect.objectContaining({
          isRevoked: true,
          revokedReason: 'Logout del usuario',
        }),
      });
    });
  });
});
