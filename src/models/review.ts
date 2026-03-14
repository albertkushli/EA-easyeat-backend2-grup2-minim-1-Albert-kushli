import { Schema, model, Types } from 'mongoose';

// 1️⃣ Interface
export interface IReview {
    _id?: Types.ObjectId;
    customer_id: Types.ObjectId;        // reference to Customer
    restaurant_id: Types.ObjectId;    // reference to Restaurant
    date: Date;
    ratings?: {
        foodQuality?: number;
        staffService?: number;
        cleanliness?: number;
        environment?: number;
    };
    comment?: string;
    photos?: string[];
    likes?: number;
    extraPoints?: number;             // optional points awarded for feedback
}

// 2️⃣ Schema
const reviewSchema = new Schema<IReview>({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    date: { type: Date, required: true },
    ratings: {
        foodQuality: { type: Number, min: 0, max: 10 },
        staffService: { type: Number, min: 0, max: 10 },
        cleanliness: { type: Number, min: 0, max: 10 },
        environment: { type: Number, min: 0, max: 10 },
    },
    comment: { type: String },
    photos: [{ type: String }],
    likes: { type: Number, default: 0 },
    extraPoints: { type: Number, default: 0 }
}, { timestamps: true });

// 3️⃣ Model
export const ReviewModel = model<IReview>('Review', reviewSchema);