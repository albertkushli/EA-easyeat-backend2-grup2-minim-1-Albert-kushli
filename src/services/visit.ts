import { VisitModel, IVisit } from '../models/visit';
import { Types } from 'mongoose';

// ─── Create ───────────────────────────────────────────────────────────────────

const createVisit = async (data: Partial<IVisit>) => {
    // 1. Create instance
    const newVisit = new VisitModel(data);

    // 2. Validate & save
    // (Relational checks happen in model pre-save)
    return await newVisit.save();
};

// ─── Read (single) ────────────────────────────────────────────────────────────

const getVisit = async (visitId: string) => {
    const visit = await VisitModel.findOne({ _id: visitId });
    // If not found or soft-deleted, return null
    if (!visit || visit.deletedAt) return null;
    return visit;
};

// ─── Read (collection) ───────────────────────────────────────────────────────

const getAllVisits = async (
    filters: { customer_id?: string; restaurant_id?: string } = {},
) => {
    const query: Record<string, any> = {};

    if (filters.customer_id) {
        query.customer_id = new Types.ObjectId(filters.customer_id);
    }
    if (filters.restaurant_id) {
        query.restaurant_id = new Types.ObjectId(filters.restaurant_id);
    }

    // Use .find() plus the query helper .active() if you implemented it,
    // or manually filter deletedAt: null
    return await VisitModel.find(query).active();
};

// ─── Read (full, populated) ───────────────────────────────────────────────────

const getVisitFull = async (visitId: string) => {
    const visit = await VisitModel.findOne({ _id: visitId })
        .populate('customer_id')
        .populate('restaurant_id');

    if (!visit || visit.deletedAt) return null;
    return visit;
};

// ─── Update ───────────────────────────────────────────────────────────────────

const updateVisit = async (visitId: string, data: Partial<IVisit>) => {
    const visit = await VisitModel.findOne({ _id: visitId });

    if (!visit || visit.deletedAt) return null;

    // Overwrite fields
    Object.assign(visit, data);

    return await visit.save();
};

// ─── Soft delete ──────────────────────────────────────────────────────────────

const deleteVisit = async (visitId: string) => {
    const visit = await VisitModel.findOne({ _id: visitId });

    if (!visit || visit.deletedAt) return null;

    visit.deletedAt = new Date();
    return await visit.save();
};

export default {
    createVisit,
    getVisit,
    getAllVisits,
    getVisitFull,
    updateVisit,
    deleteVisit,
};