import { Document, Types } from 'mongoose';
import { PlanInterval, PlanStatus } from '../../../shared/enums';
export type PlanDocument = Plan & Document;
export declare class Plan {
    name: string;
    displayName: string;
    description: string;
    price: number;
    interval: PlanInterval;
    maxVehicles: number;
    maxDrivers: number;
    maxTripsPerMonth: number;
    features: string[];
    status: PlanStatus;
    sortOrder: number;
    isPopular: boolean;
    isVisible: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PlanSchema: import("mongoose").Schema<Plan, import("mongoose").Model<Plan, any, any, any, Document<unknown, any, Plan> & Plan & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plan, Document<unknown, {}, import("mongoose").FlatRecord<Plan>> & import("mongoose").FlatRecord<Plan> & {
    _id: Types.ObjectId;
}>;
