import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { UserRole } from '../../../shared/enums';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true })
  agencyId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.DRIVER 
  })
  role: UserRole;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: 0 })
  tokenVersion: number; // For refresh token invalidation

  @Prop()
  refreshToken?: string; // Store hashed refresh token

  @Prop({ default: Date.now })
  lastLogin?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance and multi-tenancy
UserSchema.index({ email: 1, agencyId: 1 }, { unique: true });
UserSchema.index({ agencyId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Virtual to exclude sensitive fields
UserSchema.methods.toJSON = function() {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.tokenVersion;
  return userObj;
};