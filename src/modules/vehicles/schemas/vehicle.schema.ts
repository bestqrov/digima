import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VehicleStatus } from '../../../shared/enums';

export type VehicleDocument = Vehicle & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vehicle {
  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true })
  agencyId: Types.ObjectId;

  @Prop({ required: true, trim: true, uppercase: true })
  plateNumber: string;

  @Prop({ required: true, trim: true })
  model: string;

  @Prop()
  brand?: string;

  @Prop()
  year?: number;

  @Prop()
  color?: string;

  @Prop({ 
    type: String, 
    enum: VehicleStatus, 
    default: VehicleStatus.AVAILABLE 
  })
  status: VehicleStatus;

  @Prop()
  capacity?: number;

  @Prop()
  fuelType?: string;

  @Prop()
  licensePlate?: string;

  @Prop()
  insuranceNumber?: string;

  @Prop()
  insuranceExpiry?: Date;

  @Prop()
  lastMaintenance?: Date;

  @Prop()
  nextMaintenance?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);