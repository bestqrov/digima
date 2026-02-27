import { UserRole } from '../enums';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  agencyId: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string; // User ID
  email: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserWithTokens {
  user: any;
  tokens: AuthTokens;
}