import { Router, Response } from 'express';
import { db, Client, ClientBrandProfile } from '../data/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { tenantMiddleware, requireRole } from '../middleware/tenantMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { clientCreateSchema, clientUpdateSchema } from '../schemas/index.js';

export const clientsRouter = Router();

clientsRouter.use(authMiddleware);
clientsRouter.use(tenantMiddleware);

// List Clients
clientsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const { search, status } = req.query;

  let clients = db.clients.filter((c) => c.organizationId === orgId);

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    clients = clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    );
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    clients = clients.filter((c) => c.status === status);
  }

  const enrichedClients = clients.map((c) => {
    const campaignsCount = db.campaigns.filter((camp) => camp.clientId === c.id).length;
    const pendingApprovalsCount = db.approvals.filter(
      (a) => a.clientId === c.id && a.status === 'PENDING'
    ).length;
    const openTasksCount = db.tasks.filter(
      (t) => t.clientId === c.id && t.status !== 'DONE'
    ).length;
    const brandProfile = db.clientBrandProfiles.find((bp) => bp.clientId === c.id);

    return {
      ...c,
      campaignsCount,
      pendingApprovalsCount,
      openTasksCount,
      brandProfile,
    };
  });

  res.json({
    success: true,
    data: enrichedClients,
  });
});

// Get Client Details by ID
clientsRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.organizationId!;
  const client = db.clients.find((c) => c.id === req.params.id && c.organizationId === orgId);

  if (!client) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  const brandProfile = db.clientBrandProfiles.find((bp) => bp.clientId === client.id);
  const campaigns = db.campaigns.filter((camp) => camp.clientId === client.id);
  const tasks = db.tasks.filter((t) => t.clientId === client.id);
  const approvals = db.approvals.filter((a) => a.clientId === client.id);
  const documents = db.knowledgeDocuments.filter((d) => d.clientId === client.id);

  res.json({
    success: true,
    data: {
      ...client,
      brandProfile,
      campaigns,
      tasks,
      approvals,
      documents,
    },
  });
});

// Create Client
clientsRouter.post(
  '/',
  requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MANAGER']),
  validateBody(clientCreateSchema),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.organizationId!;
    const now = new Date().toISOString();
    const { name, industry, location, contactPerson, contactEmail, contactPhone, status, brandProfile } = req.body;

    const newClient: Client = {
      id: `client-${Date.now()}`,
      organizationId: orgId,
      name,
      industry,
      location: location || 'Visakhapatnam',
      contactPerson,
      contactEmail,
      contactPhone,
      status: status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    db.clients.push(newClient);

    if (brandProfile) {
      const newBrandProfile: ClientBrandProfile = {
        id: `bp-${Date.now()}`,
        clientId: newClient.id,
        brandVoice: brandProfile.brandVoice,
        targetAudience: brandProfile.targetAudience,
        coreServices: brandProfile.coreServices,
        competitors: brandProfile.competitors || 'Local competitors',
        socialChannels: brandProfile.socialChannels || 'Instagram, Facebook',
        contentPillars: brandProfile.contentPillars || 'Brand Highlights, Community, Offers',
        brandGuidelines: brandProfile.brandGuidelines,
      };
      db.clientBrandProfiles.push(newBrandProfile);
      newClient.brandProfile = newBrandProfile;
    }

    // Log Activity
    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId: orgId,
      actorId: req.user?.id,
      actorName: req.user?.name || 'Admin',
      action: 'CREATED_CLIENT',
      entityType: 'Client',
      entityId: newClient.id,
      summary: `Created new client: ${newClient.name} (${newClient.industry})`,
      timestamp: now,
    });

    res.status(201).json({
      success: true,
      data: newClient,
    });
  }
);

// Update Client
clientsRouter.put(
  '/:id',
  requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MANAGER']),
  validateBody(clientUpdateSchema),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.organizationId!;
    const client = db.clients.find((c) => c.id === req.params.id && c.organizationId === orgId);

    if (!client) {
      res.status(404).json({ success: false, error: 'Client not found' });
      return;
    }

    const { name, industry, location, contactPerson, contactEmail, contactPhone, status, brandProfile } = req.body;

    if (name) client.name = name;
    if (industry) client.industry = industry;
    if (location) client.location = location;
    if (contactPerson) client.contactPerson = contactPerson;
    if (contactEmail) client.contactEmail = contactEmail;
    if (contactPhone !== undefined) client.contactPhone = contactPhone;
    if (status) client.status = status;
    client.updatedAt = new Date().toISOString();

    if (brandProfile) {
      let bp = db.clientBrandProfiles.find((p) => p.clientId === client.id);
      if (bp) {
        Object.assign(bp, brandProfile);
      } else {
        bp = {
          id: `bp-${Date.now()}`,
          clientId: client.id,
          brandVoice: brandProfile.brandVoice || 'Professional',
          targetAudience: brandProfile.targetAudience || 'Target market',
          coreServices: brandProfile.coreServices || 'Services',
          competitors: brandProfile.competitors || 'Competitors',
          socialChannels: brandProfile.socialChannels || 'Instagram',
          contentPillars: brandProfile.contentPillars || 'Brand',
        };
        db.clientBrandProfiles.push(bp);
      }
    }

    res.json({
      success: true,
      data: client,
    });
  }
);

// Archive / Delete Client
clientsRouter.delete(
  '/:id',
  requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.organizationId!;
    const client = db.clients.find((c) => c.id === req.params.id && c.organizationId === orgId);

    if (!client) {
      res.status(404).json({ success: false, error: 'Client not found' });
      return;
    }

    client.status = 'ARCHIVED';
    client.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Client ${client.name} has been archived`,
    });
  }
);
