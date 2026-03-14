import { Schema, model, Types } from 'mongoose';

// Interface
export interface ICustomer {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profilePictures?: string[];
    pointsWallet?: Types.ObjectId[];
    visitHistory?: Types.ObjectId[];
    favoriteRestaurants?: Types.ObjectId[];
    badges?: Types.ObjectId[];
    reviews?: Types.ObjectId[];
}

// Schema
const customerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String },
    profilePictures: [{ type: String }],
    pointsWallet: [{ type: Schema.Types.ObjectId, ref: 'PointsWallet' }],
    visitHistory: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
    favoriteRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

// Model
export const CustomerModel = model<ICustomer>('Customer', customerSchema);