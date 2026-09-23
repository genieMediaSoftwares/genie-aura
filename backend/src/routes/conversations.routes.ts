import { Router, Response } from 'express';
import { db, Task, ApprovalRequest } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { agentChatSchema, convertOutputSchema } from '../schemas/index.js';
import { AgentOrchestrator } from '../ai/agentOrchestrator.js';

export const conversationsRouter = Router();

conversationsRouter.use(authMiddleware);
conversationsRouter.use(tenantMiddleware);

// List Conversations
conversationsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const convs = db.conversations
    .filter((c) => c.organizationId === orgId)
    .map((c) => {
      const agent = db.agents.find((a) => a.code === c.agentCode);
      const client = c.clientId ? db.clients.find((cl) => cl.id === c.clientId) : null;
      return {
        ...c,
        agentName: agent?.name || 'AI Assistant',
        clientName: client?.name,
        lastMessage: c.messages[c.messages.length - 1]?.content || '',
      };
    });

  res.json({
    success: true,
    data: convs,
  });
});

// Get Single Conversation Thread
conversationsRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const conv = db.conversations.find((c) => c.id === req.params.id && c.organizationId === orgId);

  if (!conv) {
    res.status(404).json({ success: false, error: 'Conversation not found' });
    return;
  }

  const agent = db.agents.find((a) => a.code === conv.agentCode);
  const client = conv.clientId ? db.clients.find((cl) => cl.id === conv.clientId) : null;

  res.json({
    success: true,
    data: {
      ...conv,
      agentName: agent?.name,
      agentDepartment: agent?.department,
      clientName: client?.name,
    },
  });
});

// Send Chat Message to AI Agent
conversationsRouter.post('/chat', validateBody(agentChatSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orgId = req.organizationId!;
    const user = req.user!;
    const { agentCode, clientId, message, conversationId } = req.body;

    const result = await AgentOrchestrator.processUserMessage({
      organizationId: orgId,
      agentCode,
      clientId,
      message,
      conversationId,
      userId: user.id,
      userName: user.name,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('AI chat route error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to process AI agent request',
    });
  }
});

// Convert AI Output to Task / Approval / Content Draft / Report
conversationsRouter.post('/convert', validateBody(convertOutputSchema), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const user = req.user!;
  const now = new Date().toISOString();
  const { type, title, clientId, description, meta } = req.body;

  if (type === 'TASK') {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      organizationId: orgId,
      clientId: clientId || null,
      title,
      description,
      status: meta?.status || 'TODO',
      priority: meta?.priority || 'MEDIUM',
      dueDate: meta?.dueDate || null,
      requiresApproval: Boolean(meta?.requiresApproval),
      approvalReason: meta?.approvalReason || null,
      tags: meta?.tags || ['AI-Generated'],
      createdAt: now,
      updatedAt: now,
    };
    db.tasks.unshift(newTask);

    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId: orgId,
      actorId: user.id,
      actorName: user.name,
      action: 'CONVERTED_AI_TASK',
      entityType: 'Task',
      entityId: newTask.id,
      summary: `Converted AI output into task "${title}"`,
      timestamp: now,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully from AI output',
      data: newTask,
    });
    return;
  }

  if (type === 'APPROVAL') {
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      organizationId: orgId,
      clientId: clientId || db.clients[0].id,
      type: meta?.approvalType || 'CONTENT_CALENDAR',
      title,
      contentPreview: description,
      contextData: meta || {},
      status: 'PENDING',
      auditHistory: [
        {
          action: 'CREATED_FROM_AI_WORKSPACE',
          actor: `${user.name} (Agency Admin)`,
          timestamp: now,
          note: 'Submitted from AI chat workspace for formal agency review',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    db.approvals.unshift(newApproval);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      organizationId: orgId,
      title: 'New Approval Queued',
      message: `"${title}" has been submitted for human approval.`,
      severity: 'warning',
      isRead: false,
      link: '/approvals',
      createdAt: now,
    });

    res.status(201).json({
      success: true,
      message: 'Approval request registered in Approval Center',
      data: newApproval,
    });
    return;
  }

  res.status(400).json({ success: false, error: 'Unsupported conversion type' });
});
