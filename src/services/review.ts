import mongoose from 'mongoose';
import { ReviewModel, IReview } from '../models/review';

// Crear review
const createReview = async (data: Partial<IReview>): Promise<IReview> => {
    const review = new ReviewModel(data);
    return await review.save();
};

// Obtener una review
const getReview = async (reviewId: string): Promise<IReview | null> => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return null;

    return await ReviewModel.findById(reviewId)
        .populate('customer_id', 'name profilePictures')
        .populate('restaurant_id', 'name')
        .lean();
};

// Obtener todas las reviews
const getAllReviews = async (): Promise<IReview[]> => {
    return await ReviewModel.find()
        .populate('customer_id', 'name')
        .populate('restaurant_id', 'name')
        .lean();
};

// Actualizar review
const updateReview = async (
    reviewId: string,
    data: Partial<IReview>
): Promise<IReview | null> => {

    if (!mongoose.Types.ObjectId.isValid(reviewId)) return null;

    // Evitar que cambien IDs
    delete data._id;
    delete data.customer_id;
    delete data.restaurant_id;

    return await ReviewModel.findByIdAndUpdate(
        reviewId,
        data,
        { new: true, runValidators: true }
    ).lean();
};

// Eliminar review
const deleteReview = async (reviewId: string): Promise<IReview | null> => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return null;

    return await ReviewModel.findByIdAndDelete(reviewId).lean();
};

// Obtener reviews por restaurante
const getReviewsByRestaurant = async (restaurantId: string): Promise<IReview[]> => {
    return await ReviewModel.find({ restaurant_id: restaurantId })
        .populate('customer_id', 'name profilePictures')
        .lean();
};

// Obtener reviews por cliente
const getReviewsByCustomer = async (
  customerId: string,
  limit = 5,
  skip = 0,
  minRating?: number,
  sortByLikes?: boolean
) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return { data: [], total: 0 };
  }

  const filter: any = {
    customer_id: customerId,
    deleted: false
  };


  if (minRating) {
    filter.rating = { $gte: minRating };
  }


  const sort: any = {};
  if (sortByLikes) {
    sort.likes = -1;
  }

  const [reviews, total] = await Promise.all([
    ReviewModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'restaurant_id',
        select: 'profile'
      })
      .lean(),

    ReviewModel.countDocuments(filter)
  ]);

  return {
    data: reviews.map((r: any) => ({
      ...r,
      restaurant_id: {
        _id: r.restaurant_id._id,
        name: r.restaurant_id.profile?.name
      }
    })),
    total
  };
};

// Dar like
const likeReview = async (reviewId: string): Promise<IReview | null> => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return null;

    return await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $inc: { likes: 1 } },
        { new: true }
    ).lean();
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