import { Schema, model, Types } from 'mongoose';

export interface IEmployee {
    _id?: Types.ObjectId;
    restaurant_id: Types.ObjectId;
    profile: {
        name: string;
        email?: string;
        phone?: string;
        passwordHash: string;
        role: string;
    };
    active: boolean;
}

const employeeSchema = new Schema<IEmployee>(
    {
        restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        profile: {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String, trim: true },
            passwordHash: { type: String, required: true },
            role: { type: String, enum: ['owner', 'staff'], required: true, default: 'staff' },
        },
        active: { type: Boolean, required: true, default: true},
    },
    { timestamps: true }
);

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);
