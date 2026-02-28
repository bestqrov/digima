import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';
import { AgencyDocument } from '../../agencies/schemas/agency.schema';
import { UsersService } from '../../users/services/users.service';
import { PlansService } from '../../plans/services/plans.service';
import { RegisterDto, LoginDto, RefreshTokenDto, VerifyEmailDto, ResendVerificationDto } from '../dto';
import { AuthTokens, UserWithTokens } from '../../../shared/interfaces';
export declare class AuthService {
    private usersService;
    private plansService;
    private jwtService;
    private configService;
    private userModel;
    private agencyModel;
    constructor(usersService: UsersService, plansService: PlansService, jwtService: JwtService, configService: ConfigService, userModel: Model<UserDocument>, agencyModel: Model<AgencyDocument>);
    register(registerDto: RegisterDto): Promise<UserWithTokens>;
    login(loginDto: LoginDto): Promise<UserWithTokens>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens>;
    logout(userId: string): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        success: boolean;
    }>;
    resendEmailVerification(resendDto: ResendVerificationDto): Promise<{
        success: boolean;
    }>;
    private generateTokens;
    private storeRefreshToken;
    validateUser(email: string, password: string): Promise<any>;
    private generateEmailVerificationToken;
    private sanitizeUser;
}
