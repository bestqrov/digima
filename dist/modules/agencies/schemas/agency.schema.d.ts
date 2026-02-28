import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { AgencyStatus } from '../../../shared/enums';
export type AgencyDocument = Agency & Document;
export declare class Agency {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    countryCode: string;
    planId: Types.ObjectId;
    status: AgencyStatus;
    demoExpiresAt?: Date;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isWhatsappVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpiresAt?: Date;
    phoneVerificationToken?: string;
    phoneVerificationExpiresAt?: Date;
    whatsappVerificationToken?: string;
    whatsappVerificationExpiresAt?: Date;
    marketingConsent: boolean;
    source?: string;
    address?: string;
    website?: string;
    logo?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    subscriptionStartedAt?: Date;
    subscriptionEndsAt?: Date;
    lastPaymentAt?: Date;
    nextBillingDate?: Date;
    currentVehicles: number;
    currentDrivers: number;
    currentMonthTrips: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AgencySchema: import("mongoose").Schema<Agency, import("mongoose").Model<Agency, any, any, any, Document<unknown, any, Agency> & Agency & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agency, Document<unknown, {}, import("mongoose").FlatRecord<Agency>> & import("mongoose").FlatRecord<Agency> & {
    _id: Types.ObjectId;
}>;
