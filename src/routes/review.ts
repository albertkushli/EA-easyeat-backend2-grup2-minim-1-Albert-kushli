import express from 'express';
import controller from '../controllers/review';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Reviews
 *     description: CRUD endpoints for reviews
 *
 * components:
 *   schemas:
 *     Ratings:
 *       type: object
 *       properties:
 *         foodQuality:
 *           type: number
 *           example: 8
 *         staffService:
 *           type: number
 *           example: 9
 *         cleanliness:
 *           type: number
 *           example: 7
 *         environment:
 *           type: number
 *           example: 8
 *
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789011"
 *         customer_id:
 *           type: string
 *           description: Customer ObjectId
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         restaurant_id:
 *           type: string
 *           description: Restaurant ObjectId
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-03-10"
 *         ratings:
 *           $ref: '#/components/schemas/Ratings'
 *         comment:
 *           type: string
 *           example: "Amazing food!"
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "https://example.com/photo1.jpg"
 *         likes:
 *           type: number
 *           example: 10
 *         extraPoints:
 *           type: number
 *           example: 5
 *
 *     ReviewCreateUpdate:
 *       type: object
 *       required:
 *         - customer_id
 *         - restaurant_id
 *         - date
 *       properties:
 *         customer_id:
 *           type: string
 *         restaurant_id:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         ratings:
 *           $ref: '#/components/schemas/Ratings'
 *         comment:
 *           type: string
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         likes:
 *           type: number
 *         extraPoints:
 *           type: number
 */


/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Creates a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed (Joi)
 */
router.post('/', ValidateJoi(Schemas.review.create), controller.createReview);


/**
 * @openapi
 * /reviews/{reviewId}:
 *   get:
 *     summary: Gets a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ObjectId
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:reviewId', controller.readReview);


/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Lists all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.readAll);


/**
 * @openapi
 * /reviews/{reviewId}:
 *   put:
 *     summary: Updates a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreateUpdate'
 *     responses:
 *       201:
 *         description: Updated
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed
 */
router.put('/:reviewId', ValidateJoi(Schemas.review.update), controller.updateReview);


/**
 * @openapi
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Deletes a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ObjectId
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.delete('/:reviewId', controller.deleteReview);

/**
 * @openapi
 * /reviews/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all reviews for a restaurant
 *     tags: [Reviews]
 */
 router.get('/restaurant/:restaurantId', controller.readByRestaurant);


/**
 * @openapi
 * /reviews/customer/{customerId}:
 *   get:
 *     summary: Get all reviews by a customer
 *     tags: [Reviews]
 */
router.get('/customer/:customerId', controller.readByCustomer);

/**
 * @openapi
 * /reviews/{reviewId}/like:
 *   post:
 *     summary: Adds a like to a review
 *     tags: [Reviews]
 */
router.post('/:reviewId/like', controller.likeReview);


export default router;