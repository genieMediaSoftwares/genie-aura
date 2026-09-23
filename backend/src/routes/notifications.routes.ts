import { Router, Response } from 'express';
import { db } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';

export const notificationsRouter = Router();

notificationsRouter.use(authMiddleware);
notificationsRouter.use(tenantMiddleware);

// Get Notifications
notificationsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const notifs = db.notifications.filter((n) => n.organizationId === orgId);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  res.json({
    success: true,
    data: notifs,
    unreadCount,
  });
});

// Mark Single Notification as Read
notificationsRouter.put('/:id/read', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const notif = db.notifications.find((n) => n.id === req.params.id && n.organizationId === orgId);

  if (notif) {
    notif.isRead = true;
  }

  res.json({ success: true, message: 'Notification marked as read' });
});

// Mark All as Read
notificationsRouter.put('/read-all', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  db.notifications.forEach((n) => {
    if (n.organizationId === orgId) {
      n.isRead = true;
    }
  });

  res.json({ success: true, message: 'All notifications marked as read' });
});
