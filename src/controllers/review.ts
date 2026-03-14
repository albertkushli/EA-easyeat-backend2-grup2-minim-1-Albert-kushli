import { NextFunction, Request, Response } from 'express';
import ReviewService from '../services/review';

const createReview = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const savedReview = await ReviewService.createReview(req.body);
        return res.status(201).json(savedReview);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.reviewId;

    try {
        const review = await ReviewService.getReview(reviewId);
        return review
            ? res.status(200).json(review)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const reviews = await ReviewService.getAllReviews();
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.reviewId;

    try {
        const updatedReview = await ReviewService.updateReview(reviewId, req.body);
        return updatedReview
            ? res.status(201).json(updatedReview)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.reviewId;

    try {
        const review = await ReviewService.deleteReview(reviewId);
        return review
            ? res.status(201).json(review)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readByRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = req.params.restaurantId;

    try {
        const reviews = await ReviewService.getReviewsByRestaurant(restaurantId);
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readByCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.params.customerId;

    try {
        const reviews = await ReviewService.getReviewsByCustomer(customerId);
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const likeReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.reviewId;

    try {
        const review = await ReviewService.likeReview(reviewId);

        return review
            ? res.status(200).json(review)
            : res.status(404).json({ message: 'not found' });

    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default {
    createReview,
    readReview,
    readAll,
    updateReview,
    deleteReview,
    readByRestaurant,
    readByCustomer,
    likeReview
};