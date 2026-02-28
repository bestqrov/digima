import { UserRole } from '../enums';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    agencyId: string;
    iat?: number;
    exp?: number;
}
export interface RefreshTokenPayload {
    sub: string;
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
