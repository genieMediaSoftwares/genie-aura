import { Router, Response } from 'express';
import { db, KnowledgeDocument } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { knowledgeDocUploadSchema } from '../schemas/index.js';

export const knowledgeRouter = Router();

knowledgeRouter.use(authMiddleware);
knowledgeRouter.use(tenantMiddleware);

// List Documents with search and category filter
knowledgeRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const { search, category, clientId } = req.query;

  let docs = db.knowledgeDocuments.filter((d) => d.organizationId === orgId);

  if (clientId && typeof clientId === 'string' && clientId !== 'ALL') {
    docs = docs.filter((d) => d.clientId === clientId);
  }

  if (category && typeof category === 'string' && category !== 'ALL') {
    docs = docs.filter((d) => d.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    docs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.extractedText.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const enriched = docs.map((d) => {
    const client = d.clientId ? db.clients.find((c) => c.id === d.clientId) : null;
    return {
      ...d,
      clientName: client?.name || 'Agency Global Knowledge',
    };
  });

  res.json({
    success: true,
    data: enriched,
  });
});

// Upload / Create Knowledge Document Metadata
knowledgeRouter.post('/upload', validateBody(knowledgeDocUploadSchema), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const user = req.user!;
  const now = new Date().toISOString();
  const { title, clientId, type, category, extractedText, tags } = req.body;

  const newDoc: KnowledgeDocument = {
    id: `doc-${Date.now()}`,
    organizationId: orgId,
    clientId: clientId || null,
    title,
    type: type || 'TXT',
    category,
    extractedText,
    tags: tags || [],
    status: 'INDEXED',
    uploadedBy: user.name,
    createdAt: now,
    updatedAt: now,
  };

  db.knowledgeDocuments.unshift(newDoc);

  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    organizationId: orgId,
    actorId: user.id,
    actorName: user.name,
    action: 'UPLOADED_KNOWLEDGE_DOC',
    entityType: 'KnowledgeDocument',
    entityId: newDoc.id,
    summary: `Added knowledge document: "${newDoc.title}" (${newDoc.category})`,
    timestamp: now,
  });

  res.status(201).json({
    success: true,
    data: newDoc,
  });
});

// Get Single Document by ID
knowledgeRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const doc = db.knowledgeDocuments.find((d) => d.id === req.params.id && d.organizationId === orgId);

  if (!doc) {
    res.status(404).json({ success: false, error: 'Document not found' });
    return;
  }

  const client = doc.clientId ? db.clients.find((c) => c.id === doc.clientId) : null;

  res.json({
    success: true,
    data: {
      ...doc,
      clientName: client?.name || 'Agency Global Knowledge',
    },
  });
});
