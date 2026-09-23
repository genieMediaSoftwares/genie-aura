import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    system: 'GenieAura - AI Agency Operating System',
    agency: 'Genie Media & Studio',
    location: 'Yendada, Visakhapatnam, India',
    version: '1.0.0',
    services: {
      api: 'operational',
      database: 'connected',
      agents: {
        total: db.agents.length,
        status: 'all_systems_operational',
      },
    },
    metrics: {
      activeClients: db.clients.filter((c) => c.status === 'ACTIVE').length,
      pendingApprovals: db.approvals.filter((a) => a.status === 'PENDING').length,
      tasksInFlight: db.tasks.filter((t) => t.status !== 'DONE').length,
    },
    timestamp: new Date().toISOString(),
  });
});
