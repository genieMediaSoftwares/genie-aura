import { Router, Request, Response } from 'express';

export const openapiRouter = Router();

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'GenieAura - AI Agency Operating System API',
    description: 'REST API for Genie Media & Studio (Yendada, Visakhapatnam, India). Multi-tenant agency command center for clients, campaigns, tasks, approvals, AI agents, knowledge base, and reports.',
    version: '1.0.0',
    contact: {
      name: 'Genie Media Engineering',
      email: 'tech@geniemedia.in',
    },
  },
  servers: [
    { url: '/api/v1', description: 'API v1 Current Host' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'System health check',
        responses: { '200': { description: 'All systems operational' } },
      },
    },
    '/auth/signin': {
      post: {
        summary: 'User sign in',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@geniemedia.in' },
                  password: { type: 'string', example: 'admin123' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Authenticated successfully' } },
      },
    },
    '/clients': {
      get: {
        summary: 'List organization clients',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Clients list' } },
      },
      post: {
        summary: 'Create client with brand profile',
        responses: { '201': { description: 'Client created' } },
      },
    },
    '/tasks': {
      get: {
        summary: 'List and filter tasks',
        parameters: [
          { name: 'clientId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Tasks list' } },
      },
      post: {
        summary: 'Create new task',
        responses: { '201': { description: 'Task created' } },
      },
    },
    '/approvals': {
      get: {
        summary: 'List approval requests',
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string', default: 'PENDING' } }],
        responses: { '200': { description: 'Approvals list' } },
      },
    },
    '/approvals/{id}/review': {
      post: {
        summary: 'Record human approval decision (Approve / Reject / Changes Requested)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  decision: { type: 'string', enum: ['APPROVED', 'REJECTED', 'CHANGES_REQUESTED'] },
                  feedbackComments: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Decision recorded' } },
      },
    },
    '/agents': {
      get: {
        summary: 'List all 6 department agents with workloads',
        responses: { '200': { description: 'Agents list' } },
      },
    },
    '/conversations/chat': {
      post: {
        summary: 'Send prompt to AI Department Agent via Gemini',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  agentCode: { type: 'string', example: 'operations_agent' },
                  clientId: { type: 'string', example: 'client-kalinga' },
                  message: { type: 'string', example: 'What needs my approval today?' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Structured AI Response' } },
      },
    },
    '/knowledge-base': {
      get: {
        summary: 'List and search knowledge base documents',
        responses: { '200': { description: 'Document list' } },
      },
    },
    '/reports': {
      get: {
        summary: 'List weekly and monthly performance reports',
        responses: { '200': { description: 'Report list' } },
      },
    },
  },
};

openapiRouter.get(['/', '/docs', ''], (req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GenieAura - Swagger API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar { background: #130F26 !important; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; color: #fff; }
    .topbar h1 { margin: 0; font-size: 18px; font-weight: 600; color: #FDFBF7; }
    .topbar span { font-size: 13px; color: #C084FC; }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>GenieAura &bull; OpenAPI Documentation</h1>
    <span>Genie Media & Studio &bull; Yendada, Visakhapatnam</span>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/v1/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    };
  </script>
</body>
</html>
  `);
});

openapiRouter.get('/openapi.json', (req: Request, res: Response): void => {
  res.json(openApiSpec);
});
