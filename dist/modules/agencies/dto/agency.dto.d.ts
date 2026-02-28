import { AgencyStatus } from '../../../shared/enums';
export declare class CreateAgencyDto {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    countryCode: string;
    planId: string;
    status?: AgencyStatus;
    marketingConsent?: boolean;
    source?: string;
    address?: string;
    website?: string;
    logo?: string;
    timezone?: string;
    currency?: string;
    language?: string;
}
declare const UpdateAgencyDto_base: import("@nestjs/common").Type<Partial<CreateAgencyDto>>;
export declare class UpdateAgencyDto extends UpdateAgencyDto_base {
    isActive?: boolean;
}
export declare class UpdateAgencyStatusDto {
    status: AgencyStatus;
    reason?: string;
}
export declare class AgencyUsageDto {
    currentVehicles: number;
    currentDrivers: number;
    currentMonthTrips: number;
}
export {};
