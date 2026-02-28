import { SubscriptionStatus } from '../../../shared/enums';
export declare class CreateSubscriptionDto {
    agencyId: string;
    planId: string;
    status?: SubscriptionStatus;
    startDate?: string;
    endDate?: string;
    nextBillingDate?: string;
}
declare const UpdateSubscriptionDto_base: import("@nestjs/common").Type<Partial<CreateSubscriptionDto>>;
export declare class UpdateSubscriptionDto extends UpdateSubscriptionDto_base {
}
export declare class UpdateSubscriptionStatusDto {
    status: SubscriptionStatus;
    reason?: string;
    nextBillingDate?: string;
}
export declare class RenewSubscriptionDto {
    planId?: string;
    nextBillingDate?: string;
}
export declare class CancelSubscriptionDto {
    reason?: string;
    immediate?: boolean;
}
export {};
