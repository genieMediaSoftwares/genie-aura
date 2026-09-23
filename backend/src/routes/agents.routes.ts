import { Router, Response } from 'express';
import { db } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware, requireRole } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { agentUpdateConfigSchema } from '../schemas/index.js';

export const agentsRouter = Router();

agentsRouter.use(authMiddleware);
agentsRouter.use(tenantMiddleware);

// List All 6 Department Agents
agentsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const agents = db.agents.filter((a) => a.organizationId === orgId);

  // Recalculate dynamic workload count from open tasks
  const enriched = agents.map((agent) => {
    const assignedTasks = db.tasks.filter(
      (t) => t.organizationId === orgId && t.assignedAgentId === agent.id && t.status !== 'DONE'
    );
    return {
      ...agent,
      workloadCount: assignedTasks.length || agent.workloadCount,
    };
  });

  res.json({
    success: true,
    data: enriched,
  });
});

// Get Agent by Code (e.g. operations_agent)
agentsRouter.get('/:code', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const agent = db.agents.find(
    (a) => a.organizationId === orgId && (a.code === req.params.code || a.id === req.params.code)
  );

  if (!agent) {
    res.status(404).json({ success: false, error: 'Agent not found' });
    return;
  }

  const assignedTasks = db.tasks.filter(
    (t) => t.organizationId === orgId && t.assignedAgentId === agent.id
  );

  res.json({
    success: true,
    data: {
      ...agent,
      assignedTasks,
    },
  });
});

// Update Agent Config (Admin Only)
agentsRouter.put(
  '/:code/config',
  requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']),
  validateBody(agentUpdateConfigSchema),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.organizationId!;
    const agent = db.agents.find(
      (a) => a.organizationId === orgId && (a.code === req.params.code || a.id === req.params.code)
    );

    if (!agent) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }

    const { status, systemPrompt, temperature, modelAlias } = req.body;
    if (status) agent.status = status;
    if (systemPrompt) agent.systemPrompt = systemPrompt;
    if (temperature !== undefined || modelAlias) {
      agent.modelConfig = {
        model: modelAlias || agent.modelConfig?.model || 'gemini-3.8-flash',
        temperature: temperature !== undefined ? temperature : agent.modelConfig?.temperature || 0.3,
      };
    }

    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId: orgId,
      actorId: req.user?.id,
      actorName: req.user?.name || 'Admin',
      action: 'UPDATED_AGENT_CONFIG',
      entityType: 'Agent',
      entityId: agent.id,
      summary: `Updated configuration for ${agent.name}`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Updated ${agent.name} configuration`,
      data: agent,
    });
  }
);
