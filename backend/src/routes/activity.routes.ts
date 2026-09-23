import { Router, Response } from 'express';
import { db } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';

export const activityRouter = Router();

activityRouter.use(authMiddleware);
activityRouter.use(tenantMiddleware);

// Get Activity Logs
activityRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const { limit = '50' } = req.query;

  const logs = db.activityLogs
    .filter((a) => a.organizationId === orgId)
    .slice(0, parseInt(limit as string, 10));

  res.json({
    success: true,
    data: logs,
  });
});
