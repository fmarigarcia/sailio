import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth.service';
import { prisma } from '../../../shared/db';
import {
  InvalidCredentialsError,
  EmailAlreadyExistsError,
  UserInactiveError,
  InvalidTokenError,
  TokenExpiredError,
  TokenRevokedError,
  UserNotFoundError,
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
      findMany: vi.fn(),
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

    it('debe lanzar error si la contraseña no coincide', async () => {
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

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false as never);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'WrongPassword123',
        })
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('refreshToken', () => {
    it('debe lanzar TokenExpiredError cuando el refresh token está expirado', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await expect(
        authService.refreshToken({
          refreshToken: 'expired-token',
        })
      ).rejects.toThrow(TokenExpiredError);
    });

    it('debe lanzar InvalidTokenError cuando jwt.verify falla por token inválido', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(
        authService.refreshToken({
          refreshToken: 'invalid-token',
        })
      ).rejects.toThrow(InvalidTokenError);
    });

    it('debe lanzar InvalidTokenError cuando el tipo de token no es refresh', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'access',
        familyId: 'family-1',
      } as never);

      await expect(
        authService.refreshToken({
          refreshToken: 'access-token',
        })
      ).rejects.toThrow(InvalidTokenError);
    });

    it('debe revocar familia y lanzar InvalidTokenError cuando token no se encuentra', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      const mockFindMany = vi.mocked(prisma.refreshToken.findMany);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);
      const mockUpdateMany = vi.mocked(prisma.refreshToken.updateMany);

      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'refresh',
        familyId: 'family-1',
      } as never);
      mockFindMany.mockResolvedValue([
        {
          id: 'rt-1',
          userId: '123',
          tokenHash: 'hash-1',
          familyId: 'family-1',
          expiresAt: new Date(Date.now() + 60_000),
          isRevoked: false,
          deviceInfo: null,
          ipAddress: null,
          userAgent: null,
          revokedAt: null,
          revokedReason: null,
          createdAt: new Date(),
        },
      ] as never);
      mockBcryptCompare.mockResolvedValue(false as never);
      mockUpdateMany.mockResolvedValue({ count: 1 } as never);

      await expect(
        authService.refreshToken({
          refreshToken: 'not-found-token',
        })
      ).rejects.toThrow(InvalidTokenError);

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { familyId: 'family-1', isRevoked: false },
        data: expect.objectContaining({
          isRevoked: true,
          revokedReason: 'Sospecha de reutilización de token',
        }),
      });
    });

    it('debe revocar familia y lanzar TokenRevokedError cuando se reutiliza token revocado', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      const mockFindMany = vi.mocked(prisma.refreshToken.findMany);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);
      const mockUpdateMany = vi.mocked(prisma.refreshToken.updateMany);

      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'refresh',
        familyId: 'family-2',
      } as never);
      mockFindMany.mockResolvedValue([
        {
          id: 'rt-2',
          userId: '123',
          tokenHash: 'hash-2',
          familyId: 'family-2',
          expiresAt: new Date(Date.now() + 60_000),
          isRevoked: true,
          deviceInfo: null,
          ipAddress: null,
          userAgent: null,
          revokedAt: new Date(),
          revokedReason: 'manual',
          createdAt: new Date(),
        },
      ] as never);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockUpdateMany.mockResolvedValue({ count: 1 } as never);

      await expect(
        authService.refreshToken({
          refreshToken: 'revoked-token',
        })
      ).rejects.toThrow(TokenRevokedError);

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { familyId: 'family-2', isRevoked: false },
        data: expect.objectContaining({
          isRevoked: true,
          revokedReason: 'Intento de uso de token revocado',
        }),
      });
    });

    it('debe lanzar TokenExpiredError cuando el token almacenado expiró', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      const mockFindMany = vi.mocked(prisma.refreshToken.findMany);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);

      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'refresh',
        familyId: 'family-3',
      } as never);
      mockFindMany.mockResolvedValue([
        {
          id: 'rt-3',
          userId: '123',
          tokenHash: 'hash-3',
          familyId: 'family-3',
          expiresAt: new Date(Date.now() - 60_000),
          isRevoked: false,
          deviceInfo: null,
          ipAddress: null,
          userAgent: null,
          revokedAt: null,
          revokedReason: null,
          createdAt: new Date(),
        },
      ] as never);
      mockBcryptCompare.mockResolvedValue(true as never);

      await expect(
        authService.refreshToken({
          refreshToken: 'expired-stored-token',
        })
      ).rejects.toThrow(TokenExpiredError);
    });

    it('debe lanzar UserInactiveError cuando el usuario no existe', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      const mockFindMany = vi.mocked(prisma.refreshToken.findMany);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);

      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'refresh',
        familyId: 'family-4',
      } as never);
      mockFindMany.mockResolvedValue([
        {
          id: 'rt-4',
          userId: '123',
          tokenHash: 'hash-4',
          familyId: 'family-4',
          expiresAt: new Date(Date.now() + 60_000),
          isRevoked: false,
          deviceInfo: null,
          ipAddress: null,
          userAgent: null,
          revokedAt: null,
          revokedReason: null,
          createdAt: new Date(),
        },
      ] as never);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(
        authService.refreshToken({
          refreshToken: 'valid-refresh-token',
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

    it('debe lanzar error si el token no es de tipo access', () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockReturnValue({
        userId: '123',
        email: 'test@test.com',
        type: 'refresh',
      } as never);

      expect(() => authService.verifyAccessToken('refresh-token')).toThrow(InvalidTokenError);
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

      const mockJwtVerify = vi.mocked(jwt.verify);
      const mockBcryptCompare = vi.mocked(bcrypt.compare);
      const mockRefreshTokenFindMany = vi.mocked(prisma.refreshToken.findMany);
      const mockRefreshTokenUpdate = vi.mocked(prisma.refreshToken.update);

      mockJwtVerify.mockReturnValue({ userId: '123', type: 'refresh' } as never);
      mockRefreshTokenFindMany.mockResolvedValue([mockToken]);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockRefreshTokenUpdate.mockResolvedValue({} as never);

      await authService.logout({ refreshToken: 'validtoken' });

      expect(mockRefreshTokenFindMany).toHaveBeenCalledWith({
        where: { userId: '123', isRevoked: false },
      });
      expect(mockBcryptCompare).toHaveBeenCalledWith('validtoken', 'hashedtoken');
      expect(mockRefreshTokenUpdate).toHaveBeenCalledWith({
        where: { id: 'token123' },
        data: expect.objectContaining({
          isRevoked: true,
          revokedReason: 'Logout del usuario',
        }),
      });
    });

    it('debe completar logout aunque jwt.verify falle', async () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(authService.logout({ refreshToken: 'invalid-token' })).resolves.toBeUndefined();
    });
  });

  describe('getProfile', () => {
    it('debe retornar el perfil cuando el usuario existe y está activo', async () => {
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      mockUserFindUnique.mockResolvedValue({
        id: '123',
        email: 'test@test.com',
        passwordHash: 'hashed',
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

      const profile = await authService.getProfile('123');

      expect(profile.id).toBe('123');
      expect(profile.email).toBe('test@test.com');
    });

    it('debe lanzar UserNotFoundError cuando el usuario no existe', async () => {
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(authService.getProfile('missing')).rejects.toThrow(UserNotFoundError);
    });

    it('debe lanzar UserInactiveError cuando el usuario está inactivo', async () => {
      const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
      mockUserFindUnique.mockResolvedValue({
        id: '123',
        email: 'test@test.com',
        passwordHash: 'hashed',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        certificationLevel: null,
        clubAffiliation: null,
        bio: null,
        profileImageUrl: null,
        isActive: false,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.getProfile('123')).rejects.toThrow(UserInactiveError);
    });
  });
});
