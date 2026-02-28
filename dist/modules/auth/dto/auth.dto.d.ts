export declare class RegisterDto {
    agencyName: string;
    email: string;
    password: string;
    adminName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    countryCode: string;
    planId: string;
    marketingConsent?: boolean;
    source?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class ResendVerificationDto {
    email: string;
}
