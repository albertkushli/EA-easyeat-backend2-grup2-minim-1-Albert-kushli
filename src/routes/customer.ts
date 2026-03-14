import express from 'express';
import controller from '../controllers/customer';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Customers
 *     description: CRUD endpoints for customers.
 *
 * components:
 *   schemas:
 *     PointsWallet:
 *       type: object
 *       required:
 *         - restaurant_id
 *         - points
 *       properties:
 *         restaurant_id:
 *           type: string
 *           description: Restaurant ObjectId
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         points:
 *           type: number
 *           example: 120
 * 
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         name:
 *           type: string
 *           example: "Nizar"
 *         email:
 *           type: string
 *           example: "nizar@gmail.com"
 *         passwordHash:
 *           type: string
 *           example: "$2b$10$abcdefghijklmnopqrstuv"
 *         profilePictures:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "https://example.com/profile1.jpg"
 *             - "https://example.com/profile2.jpg"
 *         pointsWallet:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PointsWallet'
 *         visitHistory:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Visit ObjectIds
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789014"
 *             - "65f1c2a1b2c3d4e5f6789015"
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Restaurant ObjectIds
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789016"
 *             - "65f1c2a1b2c3d4e5f6789017"
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of BadgeCustomer ObjectIds
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789018"
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Review ObjectIds
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789019"
 * 
 *     CustomerCreateUpdate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "Nizar"
 *         email:
 *           type: string
 *           example: "nizar@gmail.com"
 *         passwordHash:
 *           type: string
 *           example: "$2b$10$abcdefghijklmnopqrstuv"
 *         profilePictures:
 *           type: array
 *           items:
 *             type: string
 *         pointsWallet:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PointsWallet'
 *         visitHistory:
 *           type: array
 *           items:
 *             type: string
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 */

router.post('/', ValidateJoi(Schemas.customer.create), controller.createCustomer);

/**
 * @openapi
 * /customers/{customerId}:
 *   get:
 *     summary: Gets a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's ObjectId
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:customerId', controller.readCustomer);

/**
 * @openapi
 * /customers:
 *   get:
 *     summary: Lists all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.readAll);

/**
 * @openapi
 * /customers/{customerId}:
 *   put:
 *     summary: Updates a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerCreateUpdate'
 *     responses:
 *       201:
 *         description: Updated
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed (Joi)
 */
router.put('/:customerId', ValidateJoi(Schemas.customer.update), controller.updateCustomer);

/**
 * @openapi
 * /customers/{customerId}:
 *   delete:
 *     summary: Deletes a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's ObjectId
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.delete('/:customerId', controller.deleteCustomer);

export default router;
