import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  orgName: z.string().optional().default('Genie Media & Studio'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const clientCreateSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry is required'),
  location: z.string().default('Visakhapatnam'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().optional(),
  status: z.enum(['ACTIVE', 'ONBOARDING', 'REVIEW', 'ARCHIVED']).default('ACTIVE'),
  brandProfile: z.object({
    brandVoice: z.string().min(5, 'Brand voice is required'),
    targetAudience: z.string().min(5, 'Target audience is required'),
    coreServices: z.string().min(3, 'Core services are required'),
    competitors: z.string().default('Local market competitors'),
    socialChannels: z.string().default('Instagram, Facebook'),
    contentPillars: z.string().default('Brand Awareness, Product Features, Customer Stories'),
    brandGuidelines: z.string().optional(),
  }).optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial();

export const taskCreateSchema = z.object({
  clientId: z.string().optional().nullable(),
  campaignId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  assignedAgentId: z.string().optional().nullable(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description is required'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'WAITING_FOR_APPROVAL', 'BLOCKED', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional().nullable(),
  requiresApproval: z.boolean().default(false),
  approvalReason: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const taskCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

export const approvalReviewSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED', 'CHANGES_REQUESTED']),
  reason: z.string().optional(),
  feedbackComments: z.string().optional(),
});

export const agentChatSchema = z.object({
  agentCode: z.string().min(1, 'Agent code is required'),
  clientId: z.string().optional().nullable(),
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional().nullable(),
});

export const convertOutputSchema = z.object({
  type: z.enum(['TASK', 'APPROVAL', 'CONTENT_DRAFT', 'REPORT']),
  title: z.string().min(2),
  clientId: z.string().optional().nullable(),
  description: z.string().min(2),
  meta: z.record(z.string(), z.any()).optional(),
});

export const knowledgeDocUploadSchema = z.object({
  title: z.string().min(2, 'Document title is required'),
  clientId: z.string().optional().nullable(),
  type: z.enum(['PDF', 'DOCX', 'TXT', 'MARKDOWN', 'CSV']).default('TXT'),
  category: z.string().min(2, 'Category is required'),
  extractedText: z.string().min(5, 'Text content is required'),
  tags: z.array(z.string()).default([]),
});

export const reportGenerateSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  campaignId: z.string().optional().nullable(),
  type: z.enum(['WEEKLY', 'MONTHLY']).default('WEEKLY'),
  period: z.string().min(2, 'Period is required'),
});

export const agentUpdateConfigSchema = z.object({
  status: z.enum(['ACTIVE', 'WAITING', 'NEEDS_APPROVAL', 'BLOCKED']).optional(),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  modelAlias: z.string().optional(),
});
