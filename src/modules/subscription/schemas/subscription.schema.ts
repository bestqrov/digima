import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AgencyStatus } from '../../../shared/enums';

export type SubscriptionDocument = Subscription & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true, unique: true })
  agencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: AgencyStatus, 
    default: AgencyStatus.DEMO 
  })
  status: AgencyStatus;

  @Prop()
  currentPeriodStart?: Date;

  @Prop()
  currentPeriodEnd?: Date;

  @Prop()
  trialStart?: Date;

  @Prop()
  trialEnd?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancelAtPeriodEnd?: boolean;

  @Prop()
  paymentMethodId?: string; // For future payment integration

  @Prop({ default: 0 })
  failedPaymentAttempts: number;

  @Prop()
  lastPaymentDate?: Date;

  @Prop()
  nextBillingDate?: Date;

  @Prop()
  suspendedAt?: Date;

  @Prop()
  suspensionReason?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Indexes
SubscriptionSchema.index({ agencyId: 1 }, { unique: true });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ planId: 1 });
SubscriptionSchema.index({ nextBillingDate: 1 });
SubscriptionSchema.index({ trialEnd: 1 });