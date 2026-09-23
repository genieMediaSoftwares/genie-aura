export interface AITaskOutput {
  title: string;
  description: string;
  owner_agent: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  status: 'todo' | 'in_progress' | 'waiting_for_approval' | 'blocked';
  requires_approval: boolean;
  approval_reason: string | null;
}

export interface AIHandoffOutput {
  from_agent: string;
  to_agent: string;
  message: string;
}

export interface AIAdminNotification {
  should_notify: boolean;
  severity: 'info' | 'warning' | 'urgent';
  message: string;
}

export interface AISourceUsed {
  document_id: string;
  document_name: string;
}

export interface AISummaryResponse {
  summary: string;
  tasks: AITaskOutput[];
  handoffs: AIHandoffOutput[];
  admin_notification: AIAdminNotification;
  sources_used: AISourceUsed[];
}

export interface IAIProvider {
  generateStructuredResponse(
    prompt: string,
    systemInstruction: string,
    context?: {
      clientName?: string;
      brandProfile?: string;
      knowledgeDocs?: string;
    }
  ): Promise<AISummaryResponse>;
}
