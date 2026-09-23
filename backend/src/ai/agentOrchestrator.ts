import { db } from '../data/db.js';
import { aiProvider } from './geminiProvider.js';
import { AGENT_PROMPTS } from './prompts.js';
import { AISummaryResponse } from './IAIProvider.js';

export class AgentOrchestrator {
  public static async processUserMessage(params: {
    organizationId: string;
    agentCode: string;
    clientId?: string | null;
    message: string;
    conversationId?: string | null;
    userId: string;
    userName: string;
  }): Promise<{
    conversationId: string;
    aiResponse: AISummaryResponse;
    agentName: string;
  }> {
    const { organizationId, agentCode, clientId, message, userId, userName } = params;

    // Find Agent
    const agent = db.agents.find(
      (a) => a.organizationId === organizationId && a.code === agentCode
    ) || db.agents[0];

    // Find Client Context if provided
    let clientName = 'General Agency Context';
    let brandProfileText = '';
    if (clientId) {
      const client = db.clients.find(
        (c) => c.organizationId === organizationId && c.id === clientId
      );
      if (client) {
        clientName = client.name;
        const bp = db.clientBrandProfiles.find((p) => p.clientId === client.id);
        if (bp) {
          brandProfileText = `Voice: ${bp.brandVoice}. Audience: ${bp.targetAudience}. Core Services: ${bp.coreServices}. Pillars: ${bp.contentPillars}`;
        }
      }
    }

    // Find relevant Knowledge Base Docs
    const relevantDocs = db.knowledgeDocuments
      .filter((d) => d.organizationId === organizationId && (!d.clientId || d.clientId === clientId))
      .slice(0, 3)
      .map((d) => `[${d.id}]: ${d.title} (${d.category}) - ${d.extractedText.slice(0, 200)}...`)
      .join('\n');

    const systemInstruction =
      (AGENT_PROMPTS as any)[agentCode] || AGENT_PROMPTS.operations_agent;

    // Call AI provider
    const aiOutput = await aiProvider.generateStructuredResponse(
      message,
      systemInstruction,
      {
        clientName,
        brandProfile: brandProfileText,
        knowledgeDocs: relevantDocs,
      }
    );

    // Save or retrieve conversation
    let conversation = params.conversationId
      ? db.conversations.find((c) => c.id === params.conversationId && c.organizationId === organizationId)
      : null;

    if (!conversation) {
      conversation = {
        id: `conv-${Date.now()}`,
        organizationId,
        agentCode,
        clientId,
        title: message.slice(0, 40) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      db.conversations.unshift(conversation);
    }

    // Save User message
    conversation.messages.push({
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    });

    // Save Assistant message with structured JSON
    conversation.messages.push({
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: aiOutput.summary,
      structuredData: aiOutput,
      createdAt: new Date().toISOString(),
    });

    conversation.updatedAt = new Date().toISOString();

    // Log Activity
    db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organizationId,
      actorId: userId,
      actorName: userName,
      action: 'AI_AGENT_INTERACTION',
      entityType: 'AgentConversation',
      entityId: conversation.id,
      summary: `Consulted ${agent.name} regarding "${message.slice(0, 35)}..."`,
      timestamp: new Date().toISOString(),
    });

    // Create Notification if required
    if (aiOutput.admin_notification?.should_notify) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        organizationId,
        title: `${agent.name} Notification`,
        message: aiOutput.admin_notification.message,
        severity: aiOutput.admin_notification.severity,
        isRead: false,
        link: `/workspace?convId=${conversation.id}`,
        createdAt: new Date().toISOString(),
      });
    }

    // Update agent's workload and last activity
    agent.lastActivity = new Date().toISOString();
    agent.currentTask = aiOutput.summary.slice(0, 70) + '...';

    return {
      conversationId: conversation.id,
      aiResponse: aiOutput,
      agentName: agent.name,
    };
  }
}
