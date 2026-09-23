import { Router, Response } from 'express';
import { db, Task, TaskComment, TaskHandoff } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { taskCreateSchema, taskUpdateSchema, taskCommentSchema } from '../schemas/index.js';

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);
tasksRouter.use(tenantMiddleware);

// List Tasks with Filters
tasksRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const { clientId, agentId, status, priority, search } = req.query;

  let tasks = db.tasks.filter((t) => t.organizationId === orgId);

  if (clientId && typeof clientId === 'string' && clientId !== 'ALL') {
    tasks = tasks.filter((t) => t.clientId === clientId);
  }

  if (agentId && typeof agentId === 'string' && agentId !== 'ALL') {
    tasks = tasks.filter((t) => t.assignedAgentId === agentId);
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (priority && typeof priority === 'string' && priority !== 'ALL') {
    tasks = tasks.filter((t) => t.priority === priority);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    tasks = tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  // Enrich tasks with Client name, Assignee name, Agent name
  const enrichedTasks = tasks.map((t) => {
    const client = t.clientId ? db.clients.find((c) => c.id === t.clientId) : null;
    const user = t.assignedUserId ? db.users.find((u) => u.id === t.assignedUserId) : null;
    const agent = t.assignedAgentId ? db.agents.find((a) => a.id === t.assignedAgentId) : null;
    const commentsCount = db.taskComments.filter((c) => c.taskId === t.id).length;
    const handoffsCount = db.taskHandoffs.filter((h) => h.taskId === t.id).length;

    return {
      ...t,
      clientName: client?.name,
      assignedUserName: user?.name,
      assignedAgentName: agent?.name,
      commentsCount,
      handoffsCount,
    };
  });

  res.json({
    success: true,
    data: enrichedTasks,
  });
});

// Get Task by ID
tasksRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const task = db.tasks.find((t) => t.id === req.params.id && t.organizationId === orgId);

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  const client = task.clientId ? db.clients.find((c) => c.id === task.clientId) : null;
  const user = task.assignedUserId ? db.users.find((u) => u.id === task.assignedUserId) : null;
  const agent = task.assignedAgentId ? db.agents.find((a) => a.id === task.assignedAgentId) : null;
  const comments = db.taskComments.filter((c) => c.taskId === task.id);
  const handoffs = db.taskHandoffs.filter((h) => h.taskId === task.id);

  res.json({
    success: true,
    data: {
      ...task,
      clientName: client?.name,
      assignedUserName: user?.name,
      assignedAgentName: agent?.name,
      comments,
      handoffs,
    },
  });
});

// Create Task
tasksRouter.post('/', validateBody(taskCreateSchema), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const now = new Date().toISOString();
  const { clientId, campaignId, assignedUserId, assignedAgentId, title, description, status, priority, dueDate, requiresApproval, approvalReason, tags } = req.body;

  const newTask: Task = {
    id: `task-${Date.now()}`,
    organizationId: orgId,
    clientId: clientId || null,
    campaignId: campaignId || null,
    assignedUserId: assignedUserId || null,
    assignedAgentId: assignedAgentId || null,
    title,
    description,
    status: status || 'TODO',
    priority: priority || 'MEDIUM',
    dueDate: dueDate || null,
    requiresApproval: Boolean(requiresApproval),
    approvalReason: approvalReason || null,
    tags: tags || [],
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.unshift(newTask);

  // Log Activity
  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    organizationId: orgId,
    actorId: req.user?.id,
    actorName: req.user?.name || 'Admin',
    action: 'CREATED_TASK',
    entityType: 'Task',
    entityId: newTask.id,
    summary: `Created task: "${newTask.title}"`,
    timestamp: now,
  });

  res.status(201).json({
    success: true,
    data: newTask,
  });
});

// Update Task
tasksRouter.put('/:id', validateBody(taskUpdateSchema), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const task = db.tasks.find((t) => t.id === req.params.id && t.organizationId === orgId);

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  const oldStatus = task.status;
  Object.assign(task, req.body);
  task.updatedAt = new Date().toISOString();

  if (req.body.status && req.body.status !== oldStatus) {
    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId: orgId,
      actorId: req.user?.id,
      actorName: req.user?.name || 'Admin',
      action: 'UPDATED_TASK_STATUS',
      entityType: 'Task',
      entityId: task.id,
      summary: `Moved task "${task.title}" to ${task.status}`,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: task,
  });
});

// Add Task Comment
tasksRouter.post('/:id/comments', validateBody(taskCommentSchema), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const task = db.tasks.find((t) => t.id === req.params.id && t.organizationId === orgId);

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  const newComment: TaskComment = {
    id: `comment-${Date.now()}`,
    taskId: task.id,
    userId: req.user?.id,
    authorName: req.user?.name || 'Team Member',
    content: req.body.content,
    createdAt: new Date().toISOString(),
  };

  db.taskComments.push(newComment);

  res.status(201).json({
    success: true,
    data: newComment,
  });
});

// Log Task Handoff
tasksRouter.post('/:id/handoff', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const task = db.tasks.find((t) => t.id === req.params.id && t.organizationId === orgId);

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  const { fromAgentId, toAgentId, message } = req.body;

  const handoff: TaskHandoff = {
    id: `handoff-${Date.now()}`,
    taskId: task.id,
    fromAgentId,
    toAgentId,
    message,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  };

  db.taskHandoffs.push(handoff);

  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    organizationId: orgId,
    actorName: 'Agent Workflow',
    action: 'AI_TASK_HANDOFF',
    entityType: 'Task',
    entityId: task.id,
    summary: `Handoff from agent to agent: "${message.slice(0, 40)}..."`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    data: handoff,
  });
});
