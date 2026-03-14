import mongoose from 'mongoose';
import { VisitModel, IVisit } from '../models/visit';

const createVisit = async (data: Partial<IVisit>) => {
    const visit = new VisitModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await visit.save();
};

const getVisit = async (visitId: string) => {
    return await VisitModel.findById(visitId);
};

const getAllVisits = async (filters: { customer_id?: string; restaurant_id?: string } = {}) => {
    const query: Record<string, any> = {};

    if (filters.customer_id) query.customer_id = new mongoose.Types.ObjectId(filters.customer_id);
    if (filters.restaurant_id) query.restaurant_id = new mongoose.Types.ObjectId(filters.restaurant_id);

    return await VisitModel.find(query);
};

const getVisitFull = async (visitId: string) => {
    return await VisitModel.findById(visitId)
        .populate('customer_id')
        .populate('restaurant_id');
};

const updateVisit = async (visitId: string, data: Partial<IVisit>) => {
    const visit = await VisitModel.findById(visitId);

    if (visit) {
        visit.set(data);
        return await visit.save();
    }

    return null;
};

const deleteVisit = async (visitId: string) => {
    return await VisitModel.findByIdAndDelete(visitId);
};

export default { createVisit, getVisit, getAllVisits, getVisitFull, updateVisit, deleteVisit };