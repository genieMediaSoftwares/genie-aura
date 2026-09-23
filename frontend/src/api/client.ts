import {
  User,
  Client,
  Task,
  ApprovalRequest,
  AIAgent,
  KnowledgeDocument,
  Report,
  ActivityLog,
  NotificationItem,
  Conversation,
} from '../types/index.js';

const API_BASE = '/api/v1';

class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem('genieaura_token');
    } catch {
      return null;
    }
  }

  public setToken(token: string) {
    try {
      localStorage.setItem('genieaura_token', token);
    } catch (e) {
      console.error(e);
    }
  }

  public clearToken() {
    try {
      localStorage.removeItem('genieaura_token');
    } catch (e) {
      console.error(e);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'An unexpected API error occurred');
    }

    return data.data !== undefined ? data.data : (data as T);
  }

  // Auth APIs
  public readonly auth = {
    signIn: async (credentials: { email: string; password: string }) => {
      const res = await this.request<{ token: string; refreshToken: string; user: User }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    },
    signUp: async (payload: { name: string; email: string; password: string; orgName: string }) => {
      const res = await this.request<{ token: string; refreshToken: string; user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    },
    getMe: () => this.request<User>('/auth/me'),
    logout: () => {
      this.clearToken();
    },
  };

  // Clients APIs
  public readonly clients = {
    list: (params?: { search?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<Client[]>(`/clients${qs}`);
    },
    get: (id: string) => this.request<Client>(`/clients/${id}`),
    create: (payload: any) =>
      this.request<Client>('/clients', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: any) =>
      this.request<Client>(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: string) =>
      this.request<{ message: string }>(`/clients/${id}`, {
        method: 'DELETE',
      }),
  };

  // Tasks APIs
  public readonly tasks = {
    list: (params?: { clientId?: string; agentId?: string; status?: string; priority?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.clientId) query.set('clientId', params.clientId);
      if (params?.agentId) query.set('agentId', params.agentId);
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<Task[]>(`/tasks${qs}`);
    },
    get: (id: string) => this.request<Task>(`/tasks/${id}`),
    create: (payload: Partial<Task>) =>
      this.request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: Partial<Task>) =>
      this.request<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    addComment: (taskId: string, content: string) =>
      this.request<any>(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    handoff: (taskId: string, payload: { fromAgentId: string; toAgentId: string; message: string }) =>
      this.request<any>(`/tasks/${taskId}/handoff`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // Approvals APIs
  public readonly approvals = {
    list: (params?: { status?: string; type?: string; clientId?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.type) query.set('type', params.type);
      if (params?.clientId) query.set('clientId', params.clientId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<ApprovalRequest[]>(`/approvals${qs}`);
    },
    get: (id: string) => this.request<ApprovalRequest>(`/approvals/${id}`),
    review: (id: string, payload: { decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'; reason?: string; feedbackComments?: string }) =>
      this.request<ApprovalRequest>(`/approvals/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // Agents APIs
  public readonly agents = {
    list: () => this.request<AIAgent[]>('/agents'),
    get: (code: string) => this.request<AIAgent>(`/agents/${code}`),
    updateConfig: (code: string, payload: any) =>
      this.request<AIAgent>(`/agents/${code}/config`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
  };

  // Conversations & AI Chat APIs
  public readonly conversations = {
    list: () => this.request<Conversation[]>('/conversations'),
    get: (id: string) => this.request<Conversation>(`/conversations/${id}`),
    chat: (payload: { agentCode: string; clientId?: string | null; message: string; conversationId?: string | null }) =>
      this.request<{ conversationId: string; aiResponse: any; agentName: string }>('/conversations/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    convert: (payload: { type: 'TASK' | 'APPROVAL' | 'CONTENT_DRAFT' | 'REPORT'; title: string; clientId?: string | null; description: string; meta?: any }) =>
      this.request<any>('/conversations/convert', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // Knowledge Base APIs
  public readonly knowledge = {
    list: (params?: { search?: string; category?: string; clientId?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.category) query.set('category', params.category);
      if (params?.clientId) query.set('clientId', params.clientId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<KnowledgeDocument[]>(`/knowledge-base${qs}`);
    },
    get: (id: string) => this.request<KnowledgeDocument>(`/knowledge-base/${id}`),
    upload: (payload: any) =>
      this.request<KnowledgeDocument>('/knowledge-base/upload', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // Reports APIs
  public readonly reports = {
    list: (params?: { clientId?: string; type?: string }) => {
      const query = new URLSearchParams();
      if (params?.clientId) query.set('clientId', params.clientId);
      if (params?.type) query.set('type', params.type);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<Report[]>(`/reports${qs}`);
    },
    get: (id: string) => this.request<Report>(`/reports/${id}`),
    generate: (payload: { clientId: string; campaignId?: string; type: 'WEEKLY' | 'MONTHLY'; period: string }) =>
      this.request<Report>('/reports/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getExportUrl: (id: string) => `${API_BASE}/reports/${id}/export-csv`,
  };

  // Activity Logs
  public readonly activity = {
    list: (limit = 40) => this.request<ActivityLog[]>(`/activity?limit=${limit}`),
  };

  // Notifications
  public readonly notifications = {
    list: () => this.request<NotificationItem[]>('/notifications'),
    markRead: (id: string) =>
      this.request<any>(`/notifications/${id}/read`, {
        method: 'PUT',
      }),
    markAllRead: () =>
      this.request<any>('/notifications/read-all', {
        method: 'PUT',
      }),
  };
}

export const api = new ApiClient();
