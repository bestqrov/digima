import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { TripStatus } from '../../../shared/enums';
export type TripDocument = Trip & Document;
export declare class Trip {
    agencyId: Types.ObjectId;
    vehicleId: Types.ObjectId;
    driverId: Types.ObjectId;
    clientName: string;
    clientPhone?: string;
    clientEmail?: string;
    pickupLocation: string;
    dropoffLocation: string;
    date: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    price: number;
    discount?: number;
    status: TripStatus;
    notes?: string;
    startTime?: Date;
    endTime?: Date;
    distance?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const TripSchema: import("mongoose").Schema<Trip, import("mongoose").Model<Trip, any, any, any, Document<unknown, any, Trip> & Trip & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Trip, Document<unknown, {}, import("mongoose").FlatRecord<Trip>> & import("mongoose").FlatRecord<Trip> & {
    _id: Types.ObjectId;
}>;
