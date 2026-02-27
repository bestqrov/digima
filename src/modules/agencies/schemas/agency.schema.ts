import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AgencyStatus } from '../../../shared/enums';

export type AgencyDocument = Agency & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Agency {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  whatsappNumber?: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: AgencyStatus, 
    default: AgencyStatus.DEMO 
  })
  status: AgencyStatus;

  @Prop()
  demoExpiresAt?: Date;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isWhatsappVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationExpiresAt?: Date;

  @Prop()
  phoneVerificationToken?: string;

  @Prop()
  phoneVerificationExpiresAt?: Date;

  @Prop()
  whatsappVerificationToken?: string;

  @Prop()
  whatsappVerificationExpiresAt?: Date;

  @Prop({ default: false })
  marketingConsent: boolean;

  @Prop({ trim: true })
  source?: string; // Traffic origin

  @Prop()
  address?: string;

  @Prop()
  website?: string;

  @Prop()
  logo?: string;

  @Prop()
  timezone?: string;

  @Prop()
  currency?: string;

  @Prop()
  language?: string;

  // Subscription billing info
  @Prop()
  subscriptionStartedAt?: Date;

  @Prop()
  subscriptionEndsAt?: Date;

  @Prop()
  lastPaymentAt?: Date;

  @Prop()
  nextBillingDate?: Date;

  // Usage tracking
  @Prop({ default: 0 })
  currentVehicles: number;

  @Prop({ default: 0 })
  currentDrivers: number;

  @Prop({ default: 0 })
  currentMonthTrips: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const AgencySchema = SchemaFactory.createForClass(Agency);

// Indexes for performance
AgencySchema.index({ email: 1 }, { unique: true });
AgencySchema.index({ status: 1 });
AgencySchema.index({ planId: 1 });
AgencySchema.index({ demoExpiresAt: 1 });
AgencySchema.index({ emailVerificationExpiresAt: 1 });
AgencySchema.index({ phoneVerificationExpiresAt: 1 });
AgencySchema.index({ whatsappVerificationExpiresAt: 1 });

// Method to check if demo is expired
AgencySchema.methods.isDemoExpired = function() {
  return this.status === AgencyStatus.DEMO && 
         this.demoExpiresAt && 
         new Date() > this.demoExpiresAt;
};

// Method to check if agency can access system
AgencySchema.methods.canAccess = function() {
  if (this.status === AgencyStatus.SUSPENDED) {
    return false;
  }
  
  if (this.isDemoExpired() && this.status !== AgencyStatus.ACTIVE) {
    return false;
  }
  
  return true;
};