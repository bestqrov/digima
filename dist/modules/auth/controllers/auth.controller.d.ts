import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, VerifyEmailDto, ResendVerificationDto } from '../dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../../../shared/interfaces").UserWithTokens>;
    login(loginDto: LoginDto): Promise<import("../../../shared/interfaces").UserWithTokens>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<import("../../../shared/interfaces").AuthTokens>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        success: boolean;
    }>;
    resendVerification(resendDto: ResendVerificationDto): Promise<{
        success: boolean;
    }>;
    getMe(user: any): Promise<{
        user: any;
    }>;
}
