import { PlanInterval, PlanStatus } from '../../../shared/enums';
export declare class PlanLimitsDto {
    maxVehicles: number;
    maxDrivers: number;
    maxTripsPerMonth: number;
    apiRateLimit?: number;
    storageLimit?: number;
}
export declare class CreatePlanDto {
    name: string;
    description?: string;
    price: number;
    interval: PlanInterval;
    limits: PlanLimitsDto;
    features?: string[];
    status?: PlanStatus;
    isDemo?: boolean;
    demoDurationDays?: number;
    sortOrder?: number;
    isRecommended?: boolean;
}
declare const UpdatePlanDto_base: import("@nestjs/common").Type<Partial<CreatePlanDto>>;
export declare class UpdatePlanDto extends UpdatePlanDto_base {
}
export declare class UpdatePlanStatusDto {
    status: PlanStatus;
    reason?: string;
}
export {};
