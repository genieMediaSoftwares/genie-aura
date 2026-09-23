import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.routes.js';
import { clientsRouter } from './routes/clients.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { approvalsRouter } from './routes/approvals.routes.js';
import { agentsRouter } from './routes/agents.routes.js';
import { conversationsRouter } from './routes/conversations.routes.js';
import { knowledgeRouter } from './routes/knowledge.routes.js';
import { reportsRouter } from './routes/reports.routes.js';
import { activityRouter } from './routes/activity.routes.js';
import { notificationsRouter } from './routes/notifications.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { openapiRouter } from './routes/openapi.routes.js';
import { errorHandler } from './middleware/validationMiddleware.js';

export function createBackendApp() {
  const app = express();

  // Basic Security & Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // In development/preview allow all origins or configured list
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-organization-id'],
    })
  );

  app.use(express.json({ limit: '10mb' }));

  // Request Logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Top-Level Convenience Aliases
  app.use('/api/health', healthRouter);
  app.use('/api/docs', openapiRouter);

  // Mount API v1 Routes
  const apiV1 = express.Router();
  apiV1.use('/auth', authRouter);
  apiV1.use('/clients', clientsRouter);
  apiV1.use('/tasks', tasksRouter);
  apiV1.use('/approvals', approvalsRouter);
  apiV1.use('/agents', agentsRouter);
  apiV1.use('/conversations', conversationsRouter);
  apiV1.use('/knowledge-base', knowledgeRouter);
  apiV1.use('/reports', reportsRouter);
  apiV1.use('/activity', activityRouter);
  apiV1.use('/notifications', notificationsRouter);
  apiV1.use('/health', healthRouter);
  apiV1.use('/', openapiRouter);

  app.use('/api/v1', apiV1);

  // Error Handler
  app.use(errorHandler);

  return app;
}
