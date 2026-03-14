import { Schema, model, Types } from 'mongoose';

// 1️⃣ Interface
export interface IVisit {
    _id?: Types.ObjectId;
    customer_id: Types.ObjectId;            // reference to Customer
    restaurant_id: Types.ObjectId;          // reference to Restaurant
    date: Date;
    pointsEarned?: number;
    billAmount?: number;
}

// 2️⃣ Schema
const visitSchema = new Schema<IVisit>({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    date: { type: Date, default: () => new Date(), required: true },
    pointsEarned: { type: Number, default: 0 },
    billAmount: { type: Number, default: 0 }
}, { timestamps: true });

// 3️⃣ Model
export const VisitModel = model<IVisit>('Visit', visitSchema);