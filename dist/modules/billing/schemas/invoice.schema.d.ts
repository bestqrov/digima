import { Document, Types } from 'mongoose';
import { BillingStatus } from '../../../shared/enums';
export type InvoiceDocument = Invoice & Document;
export declare class Invoice {
    agencyId: Types.ObjectId;
    tripId?: Types.ObjectId;
    invoiceNumber: string;
    amount: number;
    taxes: number;
    discount: number;
    get totalAmount(): number;
    status: BillingStatus;
    dueDate: Date;
    paidDate?: Date;
    clientName: string;
    clientEmail?: string;
    clientAddress?: string;
    description?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice> & Invoice & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>> & import("mongoose").FlatRecord<Invoice> & {
    _id: Types.ObjectId;
}>;
