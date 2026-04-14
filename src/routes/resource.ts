import express from 'express';
import controller from '../controllers/resource';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Resources
 *     description: Complementary resources (docs, videos, news) linked to a restaurant
 *
 * components:
 *   schemas:
 *     ResourceItem:
 *       type: object
 *       required: [url, type, description]
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789099"
 *         url:
 *           type: string
 *           example: "https://example.com/manual.pdf"
 *         type:
 *           type: string
 *           enum: [manual, video, noticia]
 *           example: "manual"
 *         description:
 *           type: string
 *           example: "Official food-safety manual"
 *
 *     Resource:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789030"
 *         restaurant_id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResourceItem'
 *
 *     ResourceCreate:
 *       type: object
 *       required: [restaurant_id]
 *       properties:
 *         restaurant_id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResourceItem'
 */

/**
 * @openapi
 * /recursos:
 *   post:
 *     summary: Creates a resource document for a restaurant
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceCreate'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed (Joi)
 */
router.post('/', ValidateJoi(Schemas.resource.create), controller.createResource);

/**
 * @openapi
 * /recursos:
 *   get:
 *     summary: Lists all resource documents (paginated and filterable)
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: type
 *         description: Filter by resource type (e.g. manual, video, noticia)
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         description: Generic text search (matches description or url)
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.readAll);

/**
 * @openapi
 * /recursos/restaurant/{restaurantId}:
 *   get:
 *     summary: Gets the resource document for a specific restaurant
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/restaurant/:restaurantId', controller.readByRestaurant);

/**
 * @openapi
 * /recursos/{resourceId}:
 *   get:
 *     summary: Gets a resource document by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:resourceId', controller.readResource);

/**
 * @openapi
 * /recursos/{resourceId}:
 *   put:
 *     summary: Replaces/updates a resource document
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceCreate'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:resourceId', ValidateJoi(Schemas.resource.update), controller.updateResource);

/**
 * @openapi
 * /recursos/{resourceId}/items:
 *   post:
 *     summary: Adds a new item to the resource vector
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceItem'
 *     responses:
 *       200:
 *         description: Item added
 *       404:
 *         description: Not found
 */
router.post('/:resourceId/items', ValidateJoi(Schemas.resource.item), controller.addItem);

/**
 * @openapi
 * /recursos/{resourceId}/items/{itemId}:
 *   delete:
 *     summary: Removes an item from the resource vector
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Not found
 */
router.delete('/:resourceId/items/:itemId', controller.removeItem);

/**
 * @openapi
 * /recursos/{resourceId}/items/{itemId}:
 *   patch:
 *     summary: Updates an existing item in the resource vector
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceItem'
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Not found
 */
router.patch('/:resourceId/items/:itemId', ValidateJoi(Schemas.resource.item), controller.updateItem);

/**
 * @openapi
 * /recursos/{resourceId}:
 *   delete:
 *     summary: Deletes a resource document
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:resourceId', controller.deleteResource);

export default router;
