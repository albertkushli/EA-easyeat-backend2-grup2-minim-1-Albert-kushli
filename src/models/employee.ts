import { Schema, model, Types } from 'mongoose';

export interface IEmployee {
    _id?: Types.ObjectId;
    restaurant_id: Types.ObjectId;
    profile: {
        name: string;
        password?: string;
        email?: string;
        phone?: string;
        role?: string;
    };
    refreshTokenHash?: string;
    isActive: boolean;
}

const employeeSchema = new Schema<IEmployee>(
    {
        restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        profile: {
            name: { type: String, required: true },
            password: { type: String, select: false },
            email: { type: String },
            phone: { type: String, trim: true },
            role: { type: String, enum: ['owner', 'staff'], default: 'staff' },
        },
        refreshTokenHash: { type: String },
        isActive: { type: Boolean, required: true, default: true},
    },
    { timestamps: true }
);

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);
