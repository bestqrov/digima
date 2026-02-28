import { UserRole } from '../../../shared/enums';
export declare class CreateUserDto {
    agencyId: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    timezone?: string;
    language?: string;
    emailVerified?: boolean;
    isActive?: boolean;
}
