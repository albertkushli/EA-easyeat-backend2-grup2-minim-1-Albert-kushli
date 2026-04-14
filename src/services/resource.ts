import mongoose from 'mongoose';
import { ResourceModel, IResource, IResourceItem } from '../models/resource';
import { RestaurantModel } from '../models/restaurant';

// ─── Create ───────────────────────────────────────────────────────────────────

const createResource = async (data: Partial<IResource>) => {
    const resource = new ResourceModel({
        _id: new mongoose.Types.ObjectId(),
        ...data,
        items: data.items ?? [],
    });

    const savedResource = await resource.save();

    // Link the resource document to the restaurant
    if (data.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(data.restaurant_id, {
            $set: { recursos: savedResource._id },
        });
    }

    return savedResource;
};

// ─── Read one ─────────────────────────────────────────────────────────────────

const getResource = async (resourceId: string) => {
    return await ResourceModel.findById(resourceId).populate('restaurant_id', 'profile.name');
};

// ─── Read by restaurant ───────────────────────────────────────────────────────

const getResourceByRestaurant = async (restaurantId: string) => {
    return await ResourceModel.findOne({ restaurant_id: restaurantId });
};

// ─── Read all ─────────────────────────────────────────────────────────────────

const getAllResources = async (page: number = 1, limit: number = 10, typeSearch?: string, textSearch?: string) => {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (typeSearch) {
        query['items.type'] = typeSearch;
    }
    if (textSearch) {
        query['$or'] = [
            { 'items.description': { $regex: textSearch, $options: 'i' } },
            { 'items.url': { $regex: textSearch, $options: 'i' } }
        ];
    }
    return await ResourceModel.find(query)
        .populate('restaurant_id', 'profile.name')
        .skip(skip)
        .limit(limit);
};

// ─── Update (replace the whole document) ─────────────────────────────────────

const updateResource = async (resourceId: string, data: Partial<IResource>) => {
    const resource = await ResourceModel.findById(resourceId);
    if (resource) {
        resource.set(data);
        return await resource.save();
    }
    return null;
};

// ─── Add one item to vector ───────────────────────────────────────────────────

const addItem = async (resourceId: string, item: IResourceItem) => {
    return await ResourceModel.findByIdAndUpdate(
        resourceId,
        { $push: { items: item } },
        { new: true, runValidators: true }
    );
};

// ─── Remove one item from vector ─────────────────────────────────────────────

const removeItem = async (resourceId: string, itemId: string) => {
    return await ResourceModel.findByIdAndUpdate(
        resourceId,
        { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } },
        { new: true }
    );
};

// ─── Delete whole resource document ──────────────────────────────────────────

const deleteResource = async (resourceId: string) => {
    const deleted = await ResourceModel.findByIdAndDelete(resourceId);

    if (deleted && deleted.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(deleted.restaurant_id, {
            $unset: { recursos: '' },
        });
    }

    return deleted;
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
    createResource,
    getResource,
    getResourceByRestaurant,
    getAllResources,
    updateResource,
    addItem,
    removeItem,
    deleteResource,
};
