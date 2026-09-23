import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

export const tenantMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.organizationId) {
    res.status(403).json({
      success: false,
      error: 'Tenant context is missing. Request denied.',
    });
    return;
  }

  // If request contains an explicit organizationId header or param, verify it matches
  const headerOrgId = req.headers['x-organization-id'] as string;
  if (headerOrgId && headerOrgId !== req.organizationId) {
    res.status(403).json({
      success: false,
      error: 'Cross-tenant access violation detected. Access denied.',
    });
    return;
  }

  next();
};

export const requireRole = (allowedRoles: Array<'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENCY_MANAGER' | 'TEAM_MEMBER' | 'CLIENT_VIEWER'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.membership) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.membership.role)) {
      res.status(403).json({
        success: false,
        error: `Insufficient permissions. Requires one of: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
