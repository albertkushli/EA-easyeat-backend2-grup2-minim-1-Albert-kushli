import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { IJwtPayload } from '../models/JWTPayload';

// Augment Express Request so downstream handlers can read the typed admin
export interface AuthRequest extends Request {
    admin?: IJwtPayload;
}

/**
 * Verifies the Bearer access token and attaches the decoded payload to
 * `req.admin`. Any route that needs authentication should use this first.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // verifyAccessToken uses config.jwt.accessSecret and returns IJwtPayload
        const decoded = verifyAccessToken(token);

        // Guard: only accept tokens that were issued as access tokens
        if (decoded.type !== 'access') {
            return res.status(401).json({ message: 'Invalid token type' });
        }

        req.admin = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * RBAC factory — call with one or more allowed roles.
 *
 * Usage:
 *   router.get('/admin-only', authenticate, requireRole('admin'), handler)
 *   router.get('/staff-area', authenticate, requireRole('admin', 'owner'), handler)
 *
 * Must be used AFTER `authenticate` so that `req.admin` is populated.
 */
export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.admin) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                message: `Access denied. Required role(s): ${roles.join(', ')}`
            });
        }

        next();
    };
};

/**
 * Convenience shorthand — keeps server.ts backwards-compatible.
 * Equivalent to: authenticate + requireRole('admin')
 */
export const requireAdmin = [authenticate, requireRole('admin')];
