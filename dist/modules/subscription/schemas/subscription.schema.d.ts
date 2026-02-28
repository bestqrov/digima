import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { AgencyStatus } from '../../../shared/enums';
export type SubscriptionDocument = Subscription & Document;
export declare class Subscription {
    agencyId: Types.ObjectId;
    planId: Types.ObjectId;
    status: AgencyStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    trialStart?: Date;
    trialEnd?: Date;
    cancelledAt?: Date;
    cancelAtPeriodEnd?: boolean;
    paymentMethodId?: string;
    failedPaymentAttempts: number;
    lastPaymentDate?: Date;
    nextBillingDate?: Date;
    suspendedAt?: Date;
    suspensionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const SubscriptionSchema: import("mongoose").Schema<Subscription, import("mongoose").Model<Subscription, any, any, any, Document<unknown, any, Subscription> & Subscription & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscription, Document<unknown, {}, import("mongoose").FlatRecord<Subscription>> & import("mongoose").FlatRecord<Subscription> & {
    _id: Types.ObjectId;
}>;
