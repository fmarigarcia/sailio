import type { User } from '@prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  certificationLevel?: string;
  clubAffiliation?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  deviceInfo?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
  deviceInfo?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  certificationLevel: string | null;
  clubAffiliation: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  familyId?: string;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    certificationLevel: user.certificationLevel,
    clubAffiliation: user.clubAffiliation,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
