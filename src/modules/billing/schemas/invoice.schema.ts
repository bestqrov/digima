import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BillingStatus } from '../../../shared/enums';

export type InvoiceDocument = Invoice & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true })
  agencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Trip' })
  tripId?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 0, min: 0 })
  taxes: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop()
  get totalAmount(): number {
    return this.amount + this.taxes - this.discount;
  }

  @Prop({ 
    type: String, 
    enum: BillingStatus, 
    default: BillingStatus.DRAFT 
  })
  status: BillingStatus;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate?: Date;

  @Prop()
  clientName: string;

  @Prop()
  clientEmail?: string;

  @Prop()
  clientAddress?: string;

  @Prop()
  description?: string;

  @Prop()
  notes?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);