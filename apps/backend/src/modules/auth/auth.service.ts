import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { prisma } from '../../shared/db';
import { config } from '../../config';
import {
  InvalidCredentialsError,
  EmailAlreadyExistsError,
  UserInactiveError,
  InvalidTokenError,
  TokenExpiredError,
  TokenRevokedError,
  UserNotFoundError,
} from '../../shared/errors';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  AuthResponse,
  AuthTokens,
  TokenPayload,
  UserResponse,
} from './auth.types';
import { toUserResponse } from './auth.types';

const JWT_SECRET = config.jwt.secret;
const ACCESS_TOKEN_EXPIRY: string | number = config.jwt.accessExpiresIn;
const REFRESH_TOKEN_EXPIRY: string | number = config.jwt.refreshExpiresIn;
const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        certificationLevel: input.certificationLevel,
        clubAffiliation: input.clubAffiliation,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: toUserResponse(user),
      tokens,
    };
  }

  /**
   * Autentica un usuario y retorna tokens
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new UserInactiveError();
    }

    // Opcional: Requerir email verificado
    // if (!user.emailVerified) {
    //   throw new EmailNotVerifiedError();
    // }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      input.deviceInfo,
      input.userAgent,
      input.ipAddress
    );

    return {
      user: toUserResponse(user),
      tokens,
    };
  }

  /**
   * Renueva el access token usando un refresh token válido
   */
  async refreshToken(input: RefreshTokenInput): Promise<AuthTokens> {
    let payload: TokenPayload;

    try {
      payload = jwt.verify(input.refreshToken, JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }

    if (payload.type !== 'refresh') {
      throw new InvalidTokenError('Token type inválido');
    }

    const tokenHash = await bcrypt.hash(input.refreshToken, SALT_ROUNDS);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken) {
      // Token no existe o fue revocado
      // Posible ataque: revocar toda la familia de tokens
      if (payload.familyId) {
        await this.revokeTokenFamily(payload.familyId, 'Sospecha de reutilización de token');
      }
      throw new InvalidTokenError('Token no encontrado');
    }

    if (storedToken.isRevoked) {
      // Token ya fue revocado, revocar toda la familia
      await this.revokeTokenFamily(storedToken.familyId, 'Intento de uso de token revocado');
      throw new TokenRevokedError();
    }

    if (storedToken.expiresAt < new Date()) {
      throw new TokenExpiredError();
    }

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      throw new UserInactiveError();
    }

    // Revocar el token viejo (rotación de tokens)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true, revokedAt: new Date(), revokedReason: 'Token renovado' },
    });

    // Generar nuevos tokens con la misma familia
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      input.deviceInfo,
      input.userAgent,
      input.ipAddress,
      storedToken.familyId
    );

    return tokens;
  }

  /**
   * Cierra sesión revocando el refresh token
   */
  async logout(input: LogoutInput): Promise<void> {
    try {
      const tokenHash = await bcrypt.hash(input.refreshToken, SALT_ROUNDS);
      const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (storedToken) {
        await prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { isRevoked: true, revokedAt: new Date(), revokedReason: 'Logout del usuario' },
        });
      }
    } catch {
      // Si el token no es válido, igualmente consideramos el logout exitoso
    }
  }

  /**
   * Revoca todos los tokens de una familia (seguridad)
   */
  private async revokeTokenFamily(familyId: string, reason: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { familyId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date(), revokedReason: reason },
    });
  }

  /**
   * Genera access token y refresh token
   */
  private async generateTokens(
    userId: string,
    email: string,
    deviceInfo?: string,
    userAgent?: string,
    ipAddress?: string,
    existingFamilyId?: string
  ): Promise<AuthTokens> {
    const familyId = existingFamilyId || randomUUID();

    // Access Token (corta duración)
    const accessTokenPayload: TokenPayload = {
      userId,
      email,
      type: 'access',
    };

    // @ts-expect-error - Issue con tipos de jsonwebtoken
    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    // Refresh Token (larga duración)
    const refreshTokenPayload: TokenPayload = {
      userId,
      email,
      type: 'refresh',
      familyId,
    };

    // @ts-expect-error - Issue con tipos de jsonwebtoken
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Guardar el refresh token en la base de datos
    const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId,
        deviceInfo,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verifica un access token y retorna el payload
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

      if (payload.type !== 'access') {
        throw new InvalidTokenError('Token type inválido');
      }

      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }

  /**
   * Obtiene el perfil de un usuario por su ID
   */
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.isActive) {
      throw new UserInactiveError();
    }

    return toUserResponse(user);
  }
}

export const authService = new AuthService();
