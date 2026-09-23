import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db, User, Membership } from '../data/db.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  membership?: Membership;
  organizationId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication token is missing or malformed',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; organizationId: string; role: string };
    const user = db.users.find((u) => u.id === decoded.userId);

    if (!user) {
      res.status(401).json({ success: false, error: 'User account not found' });
      return;
    }

    const membership = db.memberships.find(
      (m) => m.userId === user.id && m.organizationId === decoded.organizationId
    );

    if (!membership) {
      res.status(403).json({ success: false, error: 'User does not belong to this organization' });
      return;
    }

    req.user = user;
    req.membership = membership;
    req.organizationId = membership.organizationId;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication token' });
  }
};
