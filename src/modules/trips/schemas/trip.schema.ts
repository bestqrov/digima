import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { TripStatus } from '../../../shared/enums';

export type TripDocument = Trip & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Trip {
  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true })
  agencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driverId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  clientName: string;

  @Prop()
  clientPhone?: string;

  @Prop()
  clientEmail?: string;

  @Prop({ required: true })
  pickupLocation: string;

  @Prop({ required: true })
  dropoffLocation: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  estimatedDuration?: number; // in minutes

  @Prop()
  actualDuration?: number; // in minutes

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ 
    type: String, 
    enum: TripStatus, 
    default: TripStatus.SCHEDULED 
  })
  status: TripStatus;

  @Prop()
  notes?: string;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop()
  distance?: number; // in kilometers

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);