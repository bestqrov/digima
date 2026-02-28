import { UserRole } from '../../../shared/enums';
export declare class UpdateUserProfileDto {
    name?: string;
    phone?: string;
    avatar?: string;
    timezone?: string;
    language?: string;
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
export declare class UpdateUserStatusDto {
    isActive: boolean;
    reason?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
