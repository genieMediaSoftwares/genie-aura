import bcrypt from 'bcryptjs';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  userId: string;
  role: 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENCY_MANAGER' | 'TEAM_MEMBER' | 'CLIENT_VIEWER';
  createdAt: string;
}

export interface ClientBrandProfile {
  id: string;
  clientId: string;
  brandVoice: string;
  targetAudience: string;
  coreServices: string;
  competitors: string;
  socialChannels: string;
  contentPillars: string;
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
  status: 'ACTIVE' | 'ONBOARDING' | 'REVIEW' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  brandProfile?: ClientBrandProfile;
}

export interface Campaign {
  id: string;
  organizationId: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  department: string;
  systemPrompt: string;
  status: 'ACTIVE' | 'WAITING' | 'NEEDS_APPROVAL' | 'BLOCKED';
  currentTask?: string;
  workloadCount: number;
  lastActivity: string;
  modelConfig?: {
    model: string;
    temperature: number;
  };
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
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_FOR_APPROVAL' | 'BLOCKED' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  requiresApproval: boolean;
  approvalReason?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  organizationId: string;
  clientId: string;
  taskId?: string | null;
  creatorAgentId?: string | null;
  type: 'CONTENT_CALENDAR' | 'CAPTION' | 'REEL_SCRIPT' | 'CLIENT_RESPONSE_DRAFT' | 'STRATEGY_PLAN' | 'AD_BUDGET_RECOMMENDATION' | 'PUBLIC_SOCIAL_REPLY' | 'CAMPAIGN_CHANGE';
  title: string;
  contentPreview: string;
  contextData: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  decisionReason?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  auditHistory: Array<{
    action: string;
    actor: string;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  organizationId: string;
  clientId?: string | null;
  title: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'MARKDOWN' | 'CSV';
  category: string;
  fileUrl?: string;
  extractedText: string;
  tags: string[];
  status: 'INDEXED' | 'PROCESSING' | 'ERROR';
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  isRead: boolean;
  link?: string;
  createdAt: string;
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
}

export interface AgentConversation {
  id: string;
  organizationId: string;
  agentCode: string;
  clientId?: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    structuredData?: any;
    createdAt: string;
  }>;
}

// In-Memory Database Store with Tenant Isolation
class DataStore {
  public organizations: Organization[] = [];
  public users: User[] = [];
  public memberships: Membership[] = [];
  public clients: Client[] = [];
  public clientBrandProfiles: ClientBrandProfile[] = [];
  public campaigns: Campaign[] = [];
  public agents: Agent[] = [];
  public tasks: Task[] = [];
  public taskComments: TaskComment[] = [];
  public taskHandoffs: TaskHandoff[] = [];
  public approvals: ApprovalRequest[] = [];
  public knowledgeDocuments: KnowledgeDocument[] = [];
  public notifications: Notification[] = [];
  public activityLogs: ActivityLog[] = [];
  public reports: Report[] = [];
  public conversations: AgentConversation[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    const orgId = 'org-genie-media';
    const now = new Date().toISOString();

    // 1. Organization
    this.organizations.push({
      id: orgId,
      name: 'Genie Media & Studio',
      slug: 'genie-media',
      location: 'Yendada, Visakhapatnam, India',
      createdAt: now,
      updatedAt: now,
    });

    // 2. Users & Memberships
    const passwordHash = bcrypt.hashSync('admin123', 8);

    const adminUser: User = {
      id: 'user-admin',
      email: 'admin@geniemedia.in',
      passwordHash,
      name: 'Aditya Varma',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: now,
      updatedAt: now,
    };

    const managerUser: User = {
      id: 'user-manager',
      email: 'manager@geniemedia.in',
      passwordHash,
      name: 'Sneha Chowdary',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: now,
      updatedAt: now,
    };

    const teamUser: User = {
      id: 'user-team',
      email: 'team@geniemedia.in',
      passwordHash,
      name: 'Karthik Raju',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: now,
      updatedAt: now,
    };

    const clientViewerUser: User = {
      id: 'user-client-viewer',
      email: 'viewer@kalingacafe.com',
      passwordHash,
      name: 'Rohit Kalinga',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(adminUser, managerUser, teamUser, clientViewerUser);

    this.memberships.push(
      { id: 'm-1', organizationId: orgId, userId: adminUser.id, role: 'AGENCY_ADMIN', createdAt: now },
      { id: 'm-2', organizationId: orgId, userId: managerUser.id, role: 'AGENCY_MANAGER', createdAt: now },
      { id: 'm-3', organizationId: orgId, userId: teamUser.id, role: 'TEAM_MEMBER', createdAt: now },
      { id: 'm-4', organizationId: orgId, userId: clientViewerUser.id, role: 'CLIENT_VIEWER', createdAt: now }
    );

    // 3. AI Agents (6 Department Agents)
    this.agents.push(
      {
        id: 'agent-ops',
        organizationId: orgId,
        name: 'Operations AI',
        code: 'operations_agent',
        department: 'Agency Operations & Governance',
        systemPrompt: 'You are Operations AI for Genie Media & Studio in Visakhapatnam. You oversee project milestones, resource allocation, team handoffs, and blocker escalation.',
        status: 'ACTIVE',
        currentTask: 'Balancing upcoming weekend festival campaign deliverables',
        workloadCount: 8,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.2 },
      },
      {
        id: 'agent-am',
        organizationId: orgId,
        name: 'Account Manager AI',
        code: 'account_manager_agent',
        department: 'Client Relations & Brief Ingestion',
        systemPrompt: 'You are Account Manager AI for Genie Media & Studio. You capture client feedback, translate briefs into structured requirements, and draft client communications.',
        status: 'ACTIVE',
        currentTask: 'Drafting Q3 review follow-up for Harbour Clinics',
        workloadCount: 5,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.3 },
      },
      {
        id: 'agent-strat',
        organizationId: orgId,
        name: 'Strategy AI',
        code: 'strategy_agent',
        department: 'Market & Campaign Strategy',
        systemPrompt: 'You are Strategy AI for Genie Media & Studio. You formulate audience segments, competitive positioning, content pillars, and high-converting marketing roadmaps.',
        status: 'NEEDS_APPROVAL',
        currentTask: 'Formulating Autumn Launch Strategy for The Mango Tree Retreat',
        workloadCount: 4,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.4 },
      },
      {
        id: 'agent-content',
        organizationId: orgId,
        name: 'Content AI',
        code: 'content_agent',
        department: 'Creative & Content Production',
        systemPrompt: 'You are Content AI for Genie Media & Studio. You write bilingual Telugu and English captions, viral Instagram reel scripts, LinkedIn thought leadership, and ad copy.',
        status: 'ACTIVE',
        currentTask: 'Generating 6 Reels scripts for Kalinga Café Filter Coffee series',
        workloadCount: 11,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.6 },
      },
      {
        id: 'agent-social',
        organizationId: orgId,
        name: 'Social Media AI',
        code: 'social_media_agent',
        department: 'Distribution & Community Management',
        systemPrompt: 'You are Social Media AI for Genie Media & Studio. You prepare publishing queues, optimize posting schedules for Andhra/Vizag audiences, and draft community replies.',
        status: 'WAITING',
        currentTask: 'Reviewing Instagram comment engagement queue for Coastal Bites',
        workloadCount: 6,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.4 },
      },
      {
        id: 'agent-rep',
        organizationId: orgId,
        name: 'Reporting AI',
        code: 'reporting_agent',
        department: 'Analytics & Attribution',
        systemPrompt: 'You are Reporting AI for Genie Media & Studio. You analyze paid media ROAS, organic engagement metrics, lead funnels, and draft executive summaries.',
        status: 'ACTIVE',
        currentTask: 'Compiling weekly ROAS audit for Vizag Realty Google Ads campaign',
        workloadCount: 3,
        lastActivity: now,
        modelConfig: { model: 'gemini-3.8-flash', temperature: 0.2 },
      }
    );

    // 4. Clients (5 Believable Sample Clients in Visakhapatnam)
    const client1: Client = {
      id: 'client-kalinga',
      organizationId: orgId,
      name: 'Kalinga Café',
      industry: 'Hospitality & Specialty Dining',
      location: 'RK Beach Road, Visakhapatnam',
      contactPerson: 'Rohit Kalinga',
      contactEmail: 'rohit@kalingacafe.com',
      contactPhone: '+91 891 254 7890',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const client2: Client = {
      id: 'client-harbour',
      organizationId: orgId,
      name: 'Harbour Clinics',
      industry: 'Healthcare & Wellness Network',
      location: 'MVP Colony & Gajuwaka, Visakhapatnam',
      contactPerson: 'Dr. Radhika Rao',
      contactEmail: 'dr.radhika@harbourclinics.com',
      contactPhone: '+91 891 278 1122',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const client3: Client = {
      id: 'client-mangotree',
      organizationId: orgId,
      name: 'The Mango Tree',
      industry: 'Farm-to-Table & Eco-Retreat',
      location: 'Anandapuram Valley, Visakhapatnam',
      contactPerson: 'Srinivas Murthy',
      contactEmail: 'srinivas@mangotreeretreat.in',
      contactPhone: '+91 944 012 3456',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const client4: Client = {
      id: 'client-vizagrealty',
      organizationId: orgId,
      name: 'Vizag Realty',
      industry: 'Luxury Coastal Real Estate',
      location: 'Rushikonda Hills, Visakhapatnam',
      contactPerson: 'Pavan Varma',
      contactEmail: 'pavan@vizagrealty.co.in',
      contactPhone: '+91 891 289 9000',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const client5: Client = {
      id: 'client-coastalbites',
      organizationId: orgId,
      name: 'Coastal Bites',
      industry: 'Cloud Kitchen & Regional Andhra Delicacies',
      location: 'Yendada & Siripuram, Visakhapatnam',
      contactPerson: 'Harish Naidu',
      contactEmail: 'orders@coastalbites.in',
      contactPhone: '+91 988 501 2233',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    this.clients.push(client1, client2, client3, client4, client5);

    // 5. Brand Profiles
    this.clientBrandProfiles.push(
      {
        id: 'bp-1',
        clientId: client1.id,
        brandVoice: 'Warm, nostalgic, artisanal, beachfront coastal charm. Welcoming and rich with heritage.',
        targetAudience: 'Vizag locals, IT professionals, college youth, and beach tourists aged 18–45 looking for artisanal coffee and coastal snacks.',
        coreServices: 'Single-origin Araku filter coffee, fusion dosas, sunset acoustic sessions, artisanal bakery.',
        competitors: 'Bean Board, Café Coffee Day, Brew N Bistro',
        socialChannels: 'Instagram (@kalingacafe_vizag), Facebook, Google Business Profile',
        contentPillars: 'Coffee Culture, Sunset Beach Vibes, Chef Behind-the-Scenes, Customer Acoustic Nights',
        brandGuidelines: 'Warm amber (#D97706), creamy vanilla (#FDF6E2), earthy espresso (#3E2723)',
      },
      {
        id: 'bp-2',
        clientId: client2.id,
        brandVoice: 'Empathetic, scientifically rigorous, reassuring, trustworthy, and community-first.',
        targetAudience: 'Families, senior citizens, and wellness-oriented corporate employees in MVP Colony, Seethammadhara, and Gajuwaka.',
        coreServices: 'Preventive cardiology, diabetes management clinics, pediatric health, home diagnostics.',
        competitors: 'Apollo Clinics, Care Hospital OPD, Pinnacle Hospitals',
        socialChannels: 'Facebook, LinkedIn, Instagram, WhatsApp Health Updates',
        contentPillars: 'Doctor Health Bites, Patient Recovery Testimonials, Preventative Checkup Awareness',
        brandGuidelines: 'Clinical Navy (#1E3A8A), Healing Mint (#10B981), White (#FFFFFF)',
      },
      {
        id: 'bp-3',
        clientId: client3.id,
        brandVoice: 'Serene, natural, rustic luxury, organic purity, mindfulness and sustainable living.',
        targetAudience: 'Eco-conscious travelers, corporate retreat organizers, and couples seeking organic weekend getaways.',
        coreServices: 'Farm-to-fork dining, clay cottage cottages, organic mango orchard tours, pottery workshops.',
        competitors: 'Tyda Jungle Bells, Haritha Resorts, Sun Ray Village',
        socialChannels: 'Instagram, Pinterest, YouTube Shorts',
        contentPillars: 'Orchard Harvest Stories, Farm-to-Table Cooking, Slow Living Retreats',
        brandGuidelines: 'Forest Green (#15803D), Mango Gold (#EAB308), Earth (#78350F)',
      },
      {
        id: 'bp-4',
        clientId: client4.id,
        brandVoice: 'Elite, visionary, architectural excellence, high-yield investment authority.',
        targetAudience: 'HNIs, NRIs (USA, Gulf, UK hailing from Andhra), and senior IT leadership looking for sea-facing penthouses in Rushikonda.',
        coreServices: 'Sea-view luxury gated villas, commercial tech park leasing, beachfront plots.',
        competitors: 'MK Builders, Radiant Developers, MVV Builders',
        socialChannels: 'LinkedIn, Instagram, High-end YouTube Property Tours',
        contentPillars: 'Rushikonda Coastal Living, Infrastructure Growth in Vizag Executive Capital, Architectural Spotlights',
        brandGuidelines: 'Deep Indigo (#1E1B4B), Champagne Gold (#D97706), Platinum Gray (#E2E8F0)',
      },
      {
        id: 'bp-5',
        clientId: client5.id,
        brandVoice: 'Spicy, vibrant, humorous, late-night cravings champion, authentic Andhra flavor.',
        targetAudience: 'Hostel students, IT park workers in Madhurawada, bachelors, and late-night foodies in Vizag.',
        coreServices: 'Royyala (Prawn) Biryani, Gongura Chicken Pulao, Midnight Delivery combos.',
        competitors: 'Kamat Restaurant, Alpha Hotel, Sri Kanya',
        socialChannels: 'Instagram Reels, Swiggy/Zomato Promos, WhatsApp broadcast',
        contentPillars: 'Sizzling Food ASMR, Midnight Craving Memes, Secret Spicy Andhra Recipes',
        brandGuidelines: 'Chilli Red (#DC2626), Charcoal Black (#18181B), Turmeric Yellow (#FBBF24)',
      }
    );

    // 6. Active Campaigns
    this.campaigns.push(
      {
        id: 'camp-1',
        organizationId: orgId,
        clientId: client1.id,
        title: 'Vizag Monsoon Acoustics & Araku Brew Festival',
        description: 'Multi-week sunset live music series promoting local Araku tribal coffee beans and evening bakery combos.',
        budget: 45000,
        startDate: '2026-08-15T00:00:00Z',
        endDate: '2026-09-30T00:00:00Z',
        status: 'ACTIVE',
        createdAt: now,
      },
      {
        id: 'camp-2',
        organizationId: orgId,
        clientId: client2.id,
        title: 'World Heart Day - Free Cardiac Health Screening Drive',
        description: 'Comprehensive lead generation and community awareness push driving visits to MVP Colony centre.',
        budget: 65000,
        startDate: '2026-09-01T00:00:00Z',
        endDate: '2026-09-29T00:00:00Z',
        status: 'ACTIVE',
        createdAt: now,
      },
      {
        id: 'camp-3',
        organizationId: orgId,
        clientId: client4.id,
        title: 'Ocean Crest Rushikonda NRI Villa Launch',
        description: 'Ultra-luxury video walk-through campaign targeting Telugu NRI communities in California and Texas.',
        budget: 180000,
        startDate: '2026-08-01T00:00:00Z',
        endDate: '2026-10-15T00:00:00Z',
        status: 'ACTIVE',
        createdAt: now,
      }
    );

    // 7. Tasks
    this.tasks.push(
      {
        id: 'task-1',
        organizationId: orgId,
        clientId: client1.id,
        campaignId: 'camp-1',
        assignedUserId: null,
        assignedAgentId: 'agent-content',
        title: 'Write 3 Sunset Acoustic Instagram Reels Scripts',
        description: 'Hook-driven 30s scripts highlighting the ocean waves sound blending with acoustic guitar and hot Araku filter coffee.',
        status: 'WAITING_FOR_APPROVAL',
        priority: 'HIGH',
        dueDate: '2026-09-10T18:00:00Z',
        requiresApproval: true,
        approvalReason: 'Client requires tone approval for coastal vernacular Telugu slangs used in hook.',
        tags: ['Reels', 'Coffee', 'Scriptwriting', 'Kalinga Cafe'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-2',
        organizationId: orgId,
        clientId: client2.id,
        campaignId: 'camp-2',
        assignedUserId: 'user-team',
        assignedAgentId: null,
        title: 'Verify Google Ads Landing Page Lead Form for Heart Day',
        description: 'Ensure WhatsApp auto-confirmation trigger and doctor calendar booking works on Harbour Clinics landing page.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        dueDate: '2026-09-08T12:00:00Z',
        requiresApproval: false,
        tags: ['PPC', 'Landing Page', 'Healthcare', 'Lead Gen'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-3',
        organizationId: orgId,
        clientId: client4.id,
        campaignId: 'camp-3',
        assignedUserId: null,
        assignedAgentId: 'agent-strat',
        title: 'NRI Meta Ad Targeting & Audience Segment Optimization',
        description: 'Revise lookalike audiences of high-net-worth Andhra professionals living in Bay Area & Dallas.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: '2026-09-12T00:00:00Z',
        requiresApproval: true,
        approvalReason: 'Meta budget adjustment of +₹25,000 requires human agency admin signoff.',
        tags: ['Real Estate', 'Meta Ads', 'NRI', 'Vizag Realty'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-4',
        organizationId: orgId,
        clientId: client5.id,
        campaignId: null,
        assignedUserId: null,
        assignedAgentId: 'agent-social',
        title: 'Weekly Zomato/Swiggy Promo Carousel Assets & Copy',
        description: 'Creative design guidelines and discount code "VIZAGSPICE" announcement for Royyala Biryani.',
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: '2026-09-05T15:00:00Z',
        requiresApproval: false,
        tags: ['Food', 'Social Media', 'Discounts'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-5',
        organizationId: orgId,
        clientId: client3.id,
        campaignId: null,
        assignedUserId: null,
        assignedAgentId: 'agent-content',
        title: 'Draft Organic Clay Cottage Retreat Blog Post',
        description: 'SEO optimized 1,200 word travel blog on "Why Vizag Valley is South Indias Hidden Eco-Retreat Haven".',
        status: 'BLOCKED',
        priority: 'MEDIUM',
        dueDate: '2026-09-09T00:00:00Z',
        requiresApproval: false,
        approvalReason: 'Waiting for high-resolution orchard photos from client.',
        tags: ['SEO', 'Content', 'Eco-Tourism'],
        createdAt: now,
        updatedAt: now,
      }
    );

    // 8. Approvals (Critical human-in-the-loop decisions)
    this.approvals.push(
      {
        id: 'appr-1',
        organizationId: orgId,
        clientId: client1.id,
        taskId: 'task-1',
        creatorAgentId: 'agent-content',
        type: 'REEL_SCRIPT',
        title: 'Acoustic Sunset Coffee Reel Script (Telugu/English Bilingual)',
        contentPreview: `[SCENE 1 - 0:00 to 0:04]\nClose-up: Steam rising from brass Davarah-Tumbler, background is orange Vizag beach sunset.\nVoiceover (Warm Telugu): "Kallamundu kadali tharangaalu, chethilo vedivedi Araku coffee..."\n\n[SCENE 2 - 0:05 to 0:15]\nCut to: Finger tapping table rhythmically to live acoustic guitar playing near the open window.\nText on Screen: Every Friday & Saturday 6 PM | Kalinga Café, RK Beach.\n\n[CALL TO ACTION - 0:25 to 0:30]\nTag your coffee buddy who needs peace after a long week!`,
        contextData: {
          platform: 'Instagram Reels',
          suggestedAudio: 'Gentle Acoustic Guitar Sunset Vibes (Original Audio)',
          targetDemographic: 'Vizag 18-35 age group',
          notes: 'Agent reviewed client brand tone guidelines for casual warmth.'
        },
        status: 'PENDING',
        auditHistory: [
          {
            action: 'CREATED',
            actor: 'Content AI',
            timestamp: now,
            note: 'Drafted script according to Kalinga Cafe voice guide.',
          }
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'appr-2',
        organizationId: orgId,
        clientId: client2.id,
        taskId: null,
        creatorAgentId: 'agent-content',
        type: 'CAPTION',
        title: 'World Heart Day Awareness Social Post & Doctor Tip',
        contentPreview: `"Did you know a 30-minute brisk walk along Vizag Beach Road reduces your cardiovascular risk by 35%? Dr. Radhika Rao from Harbour Clinics explains why coastal humidity is no excuse to skip your daily stroll! Visit our MVP Colony center this week for complimentary ECG screenings."`,
        contextData: {
          channels: ['Instagram', 'Facebook', 'LinkedIn'],
          medicalDisclaimerIncluded: true,
        },
        status: 'PENDING',
        auditHistory: [
          { action: 'CREATED', actor: 'Content AI', timestamp: now, note: 'Drafted for doctor review' }
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'appr-3',
        organizationId: orgId,
        clientId: client4.id,
        taskId: 'task-3',
        creatorAgentId: 'agent-strat',
        type: 'AD_BUDGET_RECOMMENDATION',
        title: 'Increase Meta Ads Budget for NRI Rushikonda Campaign',
        contentPreview: `Recommendation:\n- Current Daily Spend: ₹3,500/day\n- Proposed Daily Spend: ₹5,500/day (for next 14 days)\n- Target Geo: San Jose, Dallas, London (Telugu diaspora)\n- Expected Outcome: 42 additional qualified video tour requests\n- Est. Cost Per Qualified Lead: ₹1,650 (vs ₹2,400 industry standard)`,
        contextData: {
          currentRoas: 4.8,
          campaignId: 'camp-3',
          currency: 'INR',
        },
        status: 'PENDING',
        auditHistory: [
          { action: 'CREATED', actor: 'Strategy AI', timestamp: now, note: 'Based on high CTR in test run.' }
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'appr-4',
        organizationId: orgId,
        clientId: client5.id,
        taskId: null,
        creatorAgentId: 'agent-social',
        type: 'CONTENT_CALENDAR',
        title: 'Coastal Bites September Week 2 Content Calendar',
        contentPreview: `Mon: Gongura Chicken Reels ASMR\nWed: "Who makes the best Royyala Biryani in Vizag?" Poll\nFri: Weekend Midnight delivery announcement (open till 3 AM in Yendada)\nSun: Customer reviews carousel`,
        contextData: {
          totalPosts: 4,
          channels: ['Instagram', 'Zomato Social'],
        },
        status: 'APPROVED',
        decisionReason: 'Tone is fun and matches late night delivery audience.',
        reviewedByUserId: 'user-admin',
        reviewedAt: now,
        auditHistory: [
          { action: 'CREATED', actor: 'Social Media AI', timestamp: now },
          { action: 'APPROVED', actor: 'Aditya Varma (Agency Admin)', timestamp: now, note: 'Approved for scheduling' }
        ],
        createdAt: now,
        updatedAt: now,
      }
    );

    // 9. Knowledge Base Documents
    this.knowledgeDocuments.push(
      {
        id: 'doc-1',
        organizationId: orgId,
        clientId: client1.id,
        title: 'Kalinga Café - Complete Menu & Araku Origin Story',
        type: 'PDF',
        category: 'Brand Voice & Menu',
        extractedText: 'Kalinga Café was established in 2021 overlooking the Ramakrishna Beach in Visakhapatnam. We source 100% shade-grown Arabica beans from indigenous farmers in Paderu and Araku Valley. Signature offerings include Filter Coffee Frappé, Coastal Ghee Roast Dosa, and Jackfruit Puffs.',
        tags: ['Coffee', 'Menu', 'Brand Heritage'],
        status: 'INDEXED',
        uploadedBy: 'Aditya Varma',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'doc-2',
        organizationId: orgId,
        clientId: client2.id,
        title: 'Harbour Clinics - Preventative Cardiology USP & Doctor Profiles',
        type: 'DOCX',
        category: 'Clinical Guidelines',
        extractedText: 'Harbour Clinics operates dual centres in MVP Colony and Gajuwaka with 24/7 tele-consultations. Key medical doctors: Dr. Radhika Rao (MD, DM Cardiology - AIIMS Alum), Dr. K. Mohan (Endocrinology). All public messaging must maintain strict medical ethics and never make unverified medical cures.',
        tags: ['Healthcare', 'Compliance', 'Doctors'],
        status: 'INDEXED',
        uploadedBy: 'Sneha Chowdary',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'doc-3',
        organizationId: orgId,
        clientId: client4.id,
        title: 'Vizag Realty - Ocean Crest Rushikonda Project Specifications',
        type: 'PDF',
        category: 'Project Brief',
        extractedText: 'Ocean Crest comprises 24 exclusive 4BHK and 5BHK sea-facing villas on Rushikonda Hills. Pricing ranges from ₹4.5 Cr to ₹7.2 Cr. Key amenities: private infinity plunge pools, private elevator, helipad access, and smart home automation.',
        tags: ['Real Estate', 'Luxury', 'Rushikonda'],
        status: 'INDEXED',
        uploadedBy: 'Aditya Varma',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'doc-4',
        organizationId: orgId,
        clientId: null,
        title: 'Genie Media & Studio - Agency Standard Operating Procedures (SOP 2026)',
        type: 'MARKDOWN',
        category: 'Agency Governance',
        extractedText: 'SOP 2026: 1. No AI-generated public post or client message goes live without explicit human agency admin signoff in GenieAura Approval Center. 2. All Telugu creative hooks must be reviewed for cultural authenticity. 3. Daily task handoffs between agents must be recorded.',
        tags: ['SOP', 'Governance', 'AI Safety'],
        status: 'INDEXED',
        uploadedBy: 'Aditya Varma',
        createdAt: now,
        updatedAt: now,
      }
    );

    // 10. Notifications
    this.notifications.push(
      {
        id: 'notif-1',
        organizationId: orgId,
        title: 'Approval Required',
        message: 'Content AI submitted a bilingual reel script for Kalinga Café needing human review.',
        severity: 'warning',
        isRead: false,
        link: '/approvals',
        createdAt: now,
      },
      {
        id: 'notif-2',
        organizationId: orgId,
        title: 'Task Blocked',
        message: 'The Mango Tree blog post is marked blocked: awaiting high-res orchard imagery.',
        severity: 'urgent',
        isRead: false,
        link: '/tasks',
        createdAt: now,
      },
      {
        id: 'notif-3',
        organizationId: orgId,
        title: 'AI Workflow Completed',
        message: 'Reporting AI compiled weekly ROAS performance summary for Vizag Realty.',
        severity: 'info',
        isRead: true,
        link: '/reports',
        createdAt: now,
      }
    );

    // 11. Activity Logs
    this.activityLogs.push(
      {
        id: 'act-1',
        organizationId: orgId,
        actorId: 'agent-content',
        actorName: 'Content AI',
        action: 'AI_SUBMITTED_APPROVAL',
        entityType: 'ApprovalRequest',
        entityId: 'appr-1',
        summary: 'Submitted Reel script for Kalinga Café to Approval Center',
        timestamp: now,
      },
      {
        id: 'act-2',
        organizationId: orgId,
        actorId: 'agent-ops',
        actorName: 'Operations AI',
        action: 'AI_TASK_HANDOFF',
        entityType: 'Task',
        entityId: 'task-1',
        summary: 'Routed creative brief to Content AI with Araku coffee guidelines',
        timestamp: now,
      },
      {
        id: 'act-3',
        organizationId: orgId,
        actorId: 'user-admin',
        actorName: 'Aditya Varma',
        action: 'APPROVED_CONTENT',
        entityType: 'ApprovalRequest',
        entityId: 'appr-4',
        summary: 'Approved September Week 2 Content Calendar for Coastal Bites',
        timestamp: now,
      }
    );

    // 12. Reports
    this.reports.push(
      {
        id: 'rep-1',
        organizationId: orgId,
        clientId: client1.id,
        campaignId: 'camp-1',
        title: 'Weekly Performance Digest: Monsoon Acoustics Series',
        type: 'WEEKLY',
        period: 'Aug 28 - Sep 04, 2026',
        kpiMetrics: {
          roas: 4.6,
          reach: 52400,
          impressions: 89000,
          engagementRate: '6.8%',
          conversions: 340,
          adSpend: 12000,
          cpa: 35.29,
        },
        executiveSummary: 'The acoustic sunset campaign experienced exceptional engagement across Instagram Reels with save rates 2.4x higher than standard hospitality benchmarks in Visakhapatnam. Friday footfall at RK Beach surged by 38%.',
        recommendations: 'Scale up weekend ad spend on Reels showcasing live performances by 20%. Partner with local Vizag acoustic indie artists for collaborative tag posts.',
        createdAt: now,
      },
      {
        id: 'rep-2',
        organizationId: orgId,
        clientId: client4.id,
        campaignId: 'camp-3',
        title: 'Monthly Luxury Real Estate Leads Audit: Ocean Crest',
        type: 'MONTHLY',
        period: 'August 2026',
        kpiMetrics: {
          roas: 5.8,
          reach: 128000,
          impressions: 310000,
          engagementRate: '4.2%',
          conversions: 24,
          adSpend: 145000,
          cpa: 6041.67,
        },
        executiveSummary: 'Google Search & Meta video campaigns generated 24 high-intent site visit requests from NRI prospects in Silicon Valley and Dubai. Cost per qualified lead improved by 18% following Strategy AI audience refinement.',
        recommendations: 'Introduce 3D virtual interactive walkthroughs directly on landing page to accelerate video inquiry conversion velocity.',
        createdAt: now,
      }
    );
  }
}

export const db = new DataStore();
