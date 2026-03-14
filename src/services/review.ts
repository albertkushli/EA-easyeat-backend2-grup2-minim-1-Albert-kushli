import mongoose from 'mongoose';
import { ReviewModel, IReview } from '../models/review';

const createReview = async (data: Partial<IReview>): Promise<IReview> => {
    const review = new ReviewModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await review.save();
};

const getReview = async (reviewId: string): Promise<IReview | null> => {
    return await ReviewModel.findById(reviewId);
};

const getAllReviews = async (): Promise<IReview[]> => {
    return await ReviewModel.find();
};

const updateReview = async (reviewId: string, data: Partial<IReview>): Promise<IReview | null> => {
    const review = await ReviewModel.findById(reviewId);
    if (review) {
        review.set(data);
        return await review.save();
    }
    return null;
};

const deleteReview = async (reviewId: string): Promise<IReview | null> => {
    return await ReviewModel.findByIdAndDelete(reviewId);
};

const getReviewsByRestaurant = async (restaurantId: string): Promise<IReview[]> => {
    return await ReviewModel.find({ restaurant_id: restaurantId })
        .populate('customer_id', 'name profilePictures')
        .lean();
};

const getReviewsByCustomer = async (customerId: string): Promise<IReview[]> => {
    return await ReviewModel.find({ customer_id: customerId })
        .populate('restaurant_id', 'profile.name profile.image')
        .lean();
};

const likeReview = async (reviewId: string): Promise<IReview | null> => {
    return await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $inc: { likes: 1 } },
        { new: true }
    );
};

export default {
    createReview,
    getReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByRestaurant,
    getReviewsByCustomer,
    likeReview
};