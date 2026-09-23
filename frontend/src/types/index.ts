export type UserRole = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENCY_MANAGER' | 'TEAM_MEMBER' | 'CLIENT_VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  organizationLocation?: string;
}

export interface ClientBrandProfile {
  id: string;
  clientId: string;
  brandVoice: string;
  targetAudience: string;
  coreServices: string;
  competitors?: string;
  socialChannels?: string;
  contentPillars?: string;
  brandGuidelines?: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  industry: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'PAUSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  brandProfile?: ClientBrandProfile;
  campaignsCount?: number;
  pendingApprovalsCount?: number;
  openTasksCount?: number;
}

export interface Campaign {
  id: string;
  organizationId: string;
  clientId: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId?: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TaskHandoff {
  id: string;
  taskId: string;
  fromAgentId: string;
  toAgentId: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface Task {
  id: string;
  organizationId: string;
  clientId?: string | null;
  campaignId?: string | null;
  assignedUserId?: string | null;
  assignedAgentId?: string | null;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_FOR_APPROVAL' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  requiresApproval: boolean;
  approvalReason?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  assignedUserName?: string;
  assignedAgentName?: string;
  commentsCount?: number;
  handoffsCount?: number;
  comments?: TaskComment[];
  handoffs?: TaskHandoff[];
}

export interface ApprovalAuditItem {
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface ApprovalRequest {
  id: string;
  organizationId: string;
  clientId: string;
  taskId?: string | null;
  creatorAgentId?: string | null;
  type: 'CONTENT_CALENDAR' | 'REEL_SCRIPT' | 'CAPTION' | 'CLIENT_RESPONSE' | 'STRATEGY_PLAN' | 'AD_BUDGET' | 'PUBLIC_REPLY' | 'CAMPAIGN_CHANGE';
  title: string;
  contentPreview: string;
  contextData?: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  decisionReason?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  auditHistory: ApprovalAuditItem[];
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  creatorAgentName?: string;
  creatorAgentCode?: string;
  taskTitle?: string;
  reviewerName?: string;
}

export interface AIAgent {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  department: string;
  description: string;
  avatarIcon: string;
  status: 'ACTIVE' | 'IDLE' | 'BUSY' | 'OFFLINE';
  workloadCount: number;
  currentTask?: string;
  lastActivity?: string;
  systemPrompt?: string;
  modelConfig?: {
    model: string;
    temperature: number;
  };
}

export interface KnowledgeDocument {
  id: string;
  organizationId: string;
  clientId?: string | null;
  title: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'MARKDOWN' | 'CSV';
  category: string;
  extractedText: string;
  tags: string[];
  status: 'INDEXED' | 'PROCESSING' | 'ERROR';
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

export interface Report {
  id: string;
  organizationId: string;
  clientId: string;
  campaignId?: string | null;
  title: string;
  type: 'WEEKLY' | 'MONTHLY';
  period: string;
  kpiMetrics: {
    roas: number;
    reach: number;
    impressions: number;
    engagementRate: string;
    conversions: number;
    adSpend: number;
    cpa: number;
  };
  executiveSummary: string;
  recommendations: string;
  createdAt: string;
  clientName?: string;
  clientIndustry?: string;
}

export interface ActivityLog {
  id: string;
  organizationId: string;
  actorId?: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  details?: any;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structuredData?: {
    summary: string;
    tasks: Array<{
      title: string;
      description: string;
      owner_agent: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      due_date: string | null;
      status: 'todo' | 'in_progress' | 'waiting_for_approval' | 'blocked';
      requires_approval: boolean;
      approval_reason: string | null;
    }>;
    handoffs: Array<{
      from_agent: string;
      to_agent: string;
      message: string;
    }>;
    admin_notification: {
      should_notify: boolean;
      severity: 'info' | 'warning' | 'urgent';
      message: string;
    };
    sources_used: Array<{
      document_id: string;
      document_name: string;
    }>;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  organizationId: string;
  agentCode: string;
  clientId?: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  agentName?: string;
  clientName?: string;
}
