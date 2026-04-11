import mongoose from 'mongoose';
import { AdminModel} from '../models/admin';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const validateadminCredentials = async (email: string, password: string) => {
    const admin = await AdminModel.findOne({ email }).select('+password');
    if (!admin) return null;

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return null;

    return admin;
};

export const getTokens = (admin: any) => {
    const accessToken = generateAccessToken(
        String(admin._id),
        admin.name,
        admin.email,
        admin.role
    );
    const refreshToken = generateRefreshToken(
        String(admin._id),
        admin.name,
        admin.email,
        admin.role
    );
    return { accessToken, refreshToken };
};

export const refreshadminSession = async (incomingRefreshToken: string) => {
    const payload = verifyRefreshToken(incomingRefreshToken);
    if (payload.type !== 'refresh') throw new Error('Invalid token type');
    const admin = await AdminModel.findById(payload.id);
    if (!admin) throw new Error('Admin not found');
    return getTokens(admin);
};
