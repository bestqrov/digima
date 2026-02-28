import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { VehicleStatus } from '../../../shared/enums';
export type VehicleDocument = Vehicle & Document;
export declare class Vehicle {
    agencyId: Types.ObjectId;
    plateNumber: string;
    model: string;
    brand?: string;
    year?: number;
    color?: string;
    status: VehicleStatus;
    capacity?: number;
    fuelType?: string;
    licensePlate?: string;
    insuranceNumber?: string;
    insuranceExpiry?: Date;
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const VehicleSchema: import("mongoose").Schema<Vehicle, import("mongoose").Model<Vehicle, any, any, any, Document<unknown, any, Vehicle> & Vehicle & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vehicle, Document<unknown, {}, import("mongoose").FlatRecord<Vehicle>> & import("mongoose").FlatRecord<Vehicle> & {
    _id: Types.ObjectId;
}>;
