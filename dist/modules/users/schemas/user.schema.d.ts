import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { UserRole } from '../../../shared/enums';
export type UserDocument = User & Document;
export declare class User {
    agencyId: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    isActive: boolean;
    emailVerified: boolean;
    tokenVersion: number;
    refreshToken?: string;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
