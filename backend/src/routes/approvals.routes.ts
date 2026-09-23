import { Router, Response } from 'express';
import { db, ApprovalRequest } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware, requireRole } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { approvalReviewSchema } from '../schemas/index.js';

export const approvalsRouter = Router();

approvalsRouter.use(authMiddleware);
approvalsRouter.use(tenantMiddleware);

// List Approvals with filters (status, type, client)
approvalsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const { status, type, clientId } = req.query;

  let approvals = db.approvals.filter((a) => a.organizationId === orgId);

  if (status && typeof status === 'string' && status !== 'ALL') {
    approvals = approvals.filter((a) => a.status === status);
  }

  if (type && typeof type === 'string' && type !== 'ALL') {
    approvals = approvals.filter((a) => a.type === type);
  }

  if (clientId && typeof clientId === 'string' && clientId !== 'ALL') {
    approvals = approvals.filter((a) => a.clientId === clientId);
  }

  const enriched = approvals.map((a) => {
    const client = db.clients.find((c) => c.id === a.clientId);
    const agent = a.creatorAgentId ? db.agents.find((ag) => ag.id === a.creatorAgentId) : null;
    const reviewer = a.reviewedByUserId ? db.users.find((u) => u.id === a.reviewedByUserId) : null;

    return {
      ...a,
      clientName: client?.name || 'Unknown Client',
      creatorAgentName: agent?.name || 'AI Assistant',
      creatorAgentCode: agent?.code || 'operations_agent',
      reviewerName: reviewer?.name,
    };
  });

  res.json({
    success: true,
    data: enriched,
  });
});

// Get Approval Request by ID
approvalsRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const approval = db.approvals.find((a) => a.id === req.params.id && a.organizationId === orgId);

  if (!approval) {
    res.status(404).json({ success: false, error: 'Approval request not found' });
    return;
  }

  const client = db.clients.find((c) => c.id === approval.clientId);
  const agent = approval.creatorAgentId ? db.agents.find((ag) => ag.id === approval.creatorAgentId) : null;
  const task = approval.taskId ? db.tasks.find((t) => t.id === approval.taskId) : null;
  const reviewer = approval.reviewedByUserId ? db.users.find((u) => u.id === approval.reviewedByUserId) : null;

  res.json({
    success: true,
    data: {
      ...approval,
      clientName: client?.name,
      creatorAgentName: agent?.name,
      taskTitle: task?.title,
      reviewerName: reviewer?.name,
    },
  });
});

// Human Review Decision (Approve, Reject, Request Changes)
approvalsRouter.post(
  '/:id/review',
  requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MANAGER']),
  validateBody(approvalReviewSchema),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.organizationId!;
    const approval = db.approvals.find((a) => a.id === req.params.id && a.organizationId === orgId);

    if (!approval) {
      res.status(404).json({ success: false, error: 'Approval request not found' });
      return;
    }

    const { decision, reason, feedbackComments } = req.body;
    const now = new Date().toISOString();
    const actorName = req.user?.name || 'Agency Admin';

    approval.status = decision;
    approval.decisionReason = reason || feedbackComments || `Marked as ${decision} by ${actorName}`;
    approval.reviewedByUserId = req.user?.id;
    approval.reviewedAt = now;
    approval.updatedAt = now;

    // Append to audit history
    approval.auditHistory.push({
      action: decision,
      actor: `${actorName} (${req.membership?.role})`,
      timestamp: now,
      note: feedbackComments || reason,
    });

    // If associated with a task, update task status accordingly
    if (approval.taskId) {
      const task = db.tasks.find((t) => t.id === approval.taskId);
      if (task) {
        if (decision === 'APPROVED') {
          task.status = 'DONE';
          task.requiresApproval = false;
        } else if (decision === 'CHANGES_REQUESTED') {
          task.status = 'IN_PROGRESS';
        } else if (decision === 'REJECTED') {
          task.status = 'BLOCKED';
        }
        task.updatedAt = now;
      }
    }

    // Log Activity Log
    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId: orgId,
      actorId: req.user?.id,
      actorName,
      action: `HUMAN_${decision}`,
      entityType: 'ApprovalRequest',
      entityId: approval.id,
      summary: `${actorName} marked "${approval.title}" as ${decision}`,
      details: { decision, reason, feedbackComments },
      timestamp: now,
    });

    res.json({
      success: true,
      message: `Approval request ${decision.toLowerCase()} successfully`,
      data: approval,
    });
  }
);
