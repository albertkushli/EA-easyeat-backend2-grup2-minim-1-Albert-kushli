import { NextFunction, Request, Response } from 'express';
import ResourceService from '../services/resource';

// ─── Create resource document ─────────────────────────────────────────────────

const createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saved = await ResourceService.createResource(req.body);
        return res.status(201).json(saved);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Get one by ID ────────────────────────────────────────────────────────────

const readResource = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId } = req.params;
    try {
        const resource = await ResourceService.getResource(resourceId);
        return resource
            ? res.status(200).json(resource)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Get by restaurant ────────────────────────────────────────────────────────

const readByRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    try {
        const resource = await ResourceService.getResourceByRestaurant(restaurantId);
        return resource
            ? res.status(200).json(resource)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Get all ──────────────────────────────────────────────────────────────────

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page  = parseInt(req.query.page  as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const type  = req.query.type as string;
        const search = req.query.search as string;
        const resources = await ResourceService.getAllResources(page, limit, type, search);
        return res.status(200).json(resources);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Update whole document ────────────────────────────────────────────────────

const updateResource = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId } = req.params;
    try {
        const updated = await ResourceService.updateResource(resourceId, req.body);
        return updated
            ? res.status(200).json(updated)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Add one item to vector ───────────────────────────────────────────────────

const addItem = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId } = req.params;
    try {
        const updated = await ResourceService.addItem(resourceId, req.body);
        return updated
            ? res.status(200).json(updated)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Remove one item from vector ─────────────────────────────────────────────

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId, itemId } = req.params;
    try {
        const updated = await ResourceService.removeItem(resourceId, itemId);
        return updated
            ? res.status(200).json(updated)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Update one item in vector ───────────────────────────────────────────────

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId, itemId } = req.params;
    try {
        const updated = await ResourceService.updateItem(resourceId, itemId, req.body);
        return updated
            ? res.status(200).json(updated)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Delete document ──────────────────────────────────────────────────────────

const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    const { resourceId } = req.params;
    try {
        const deleted = await ResourceService.deleteResource(resourceId);
        return deleted
            ? res.status(200).json(deleted)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
    createResource,
    readResource,
    readByRestaurant,
    readAll,
    updateResource,
    addItem,
    updateItem,
    removeItem,
    deleteResource,
};
