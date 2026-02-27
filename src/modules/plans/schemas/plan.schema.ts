import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PlanInterval, PlanStatus } from '../../../shared/enums';

export type PlanDocument = Plan & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Plan {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ 
    type: String, 
    enum: PlanInterval, 
    default: PlanInterval.MONTHLY 
  })
  interval: PlanInterval;

  @Prop({ required: true, min: 1 })
  maxVehicles: number;

  @Prop({ required: true, min: 1 })
  maxDrivers: number;

  @Prop({ required: true, min: 1 })
  maxTripsPerMonth: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ 
    type: String, 
    enum: PlanStatus, 
    default: PlanStatus.ACTIVE 
  })
  status: PlanStatus;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

// Indexes
PlanSchema.index({ status: 1, isVisible: 1 });
PlanSchema.index({ sortOrder: 1 });
PlanSchema.index({ name: 1 }, { unique: true });