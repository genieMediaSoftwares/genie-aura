import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Building2,
  ArrowRight,
  CheckSquare,
  ShieldAlert,
  FileText,
  BarChart3,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AIAgent, Client } from '../types/index.js';
import { api } from '../api/client.js';

interface AgentsViewProps {
  agents: AIAgent[];
  clients: Client[];
  initialAgentCode?: string;
  initialPrompt?: string;
  onRefreshData: () => void;
  onNavigate: (tab: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  clients,
  initialAgentCode,
  initialPrompt,
  onRefreshData,
  onNavigate,
}) => {
  const [selectedAgentCode, setSelectedAgentCode] = useState<string>(
    initialAgentCode || 'operations_agent'
  );
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [prompt, setPrompt] = useState<string>(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeAgent =
    agents.find((a) => a.code === selectedAgentCode) || agents[0];

  const agentPromptsMap: Record<string, string[]> = {
    operations_agent: [
      'What needs my approval today?',
      'Break down next week priorities across all 5 clients',
      'Allocate creative tasks between Content AI and Social Media AI',
    ],
    account_manager_agent: [
      'Draft weekly check-in email for Kalinga Café owner',
      'Summarize client feedback from Harbour Clinics cardiology team',
      'Prepare onboarding checklist for new real estate client',
    ],
    strategy_agent: [
      'Formulate Diwali festival campaign strategy for Vizag hospitality clients',
      'Develop positioning strategy targeting Telugu NRIs in the USA',
      'Create 3 competitive differentiators against local Vizag agencies',
    ],
    content_agent: [
      'Write 3 viral Instagram Reel scripts with bilingual Telugu hooks for Kalinga Café',
      'Draft 5 carousel slide captions for Harbour Clinics heart health awareness',
      'Write high-converting Meta ad copy for luxury sea-facing apartments in Rushikonda',
    ],
    social_media_agent: [
      'Optimize Instagram publishing schedule for Visakhapatnam audience',
      'Draft polite responses to positive comments on Kalinga Café coffee reels',
      'Plan hashtag cluster for Vizag local food and lifestyle discovery',
    ],
    reporting_agent: [
      'Synthesize monthly performance audit for Kalinga Café (ROAS 4.2x)',
      'Analyze cost per lead trend across Meta Ads for BayLeaf Restro',
      'Draft executive report ready for client PDF distribution',
    ],
  };

  const handleSendPrompt = async (messageText?: string) => {
    const textToSend = messageText || prompt;
    if (!textToSend.trim() || isProcessing) return;

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await api.conversations.chat({
        agentCode: activeAgent.code,
        clientId: selectedClientId === 'ALL' ? null : selectedClientId,
        message: textToSend,
      });

      setAiOutput(res.aiResponse);
      onRefreshData();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || 'Failed to process AI response');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToTask = async (taskItem: any) => {
    try {
      await api.conversations.convert({
        type: 'TASK',
        title: taskItem.title,
        clientId: selectedClientId === 'ALL' ? null : selectedClientId,
        description: taskItem.description,
        meta: {
          priority: taskItem.priority?.toUpperCase() || 'MEDIUM',
          status: taskItem.status?.toUpperCase() || 'TODO',
          requiresApproval: taskItem.requires_approval,
          approvalReason: taskItem.approval_reason,
        },
      });
      setStatusMessage(`Task "${taskItem.title}" created successfully!`);
      onRefreshData();
    } catch (e: any) {
      setStatusMessage(e.message || 'Failed to convert task');
    }
  };

  const handleSendToApprovals = async (taskItem: any) => {
    try {
      await api.conversations.convert({
        type: 'APPROVAL',
        title: taskItem.title,
        clientId: selectedClientId === 'ALL' ? clients[0]?.id : selectedClientId,
        description: taskItem.description || aiOutput?.summary,
        meta: {
          approvalType: 'CONTENT_CALENDAR',
          reason: taskItem.approval_reason || 'Requires human sign-off before dispatch',
        },
      });
      setStatusMessage(`Item "${taskItem.title}" forwarded to Approval Center!`);
      onRefreshData();
    } catch (e: any) {
      setStatusMessage(e.message || 'Failed to send to approvals');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 6 Agents Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {agents.map((agent) => {
          const isSelected = agent.code === selectedAgentCode;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgentCode(agent.code);
                setAiOutput(null);
                setStatusMessage(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md'
                  : 'bg-white border-[#1A1423]/5 hover:border-gray-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-[#8B5CF6] text-white' : 'bg-[#FDFCF9] text-[#8B5CF6] border border-[#1A1423]/5'
                  }`}>
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Agent Online" />
                </div>
                <h4 className="text-xs font-bold text-[#1A1423] line-clamp-1">{agent.name}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{agent.department}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-between text-[10px] text-gray-400">
                <span className="font-semibold text-gray-600">{agent.workloadCount} tasks</span>
                <span className="text-[#8B5CF6] font-bold">Select</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Agent Workspace */}
      <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm space-y-6">
        {/* Agent Header & Active Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1A1423]/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-semibold text-[#1A1423]">{activeAgent.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                  {activeAgent.department}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{activeAgent.description}</p>
            </div>
          </div>

          {/* Context Selector */}
          <div className="flex items-center gap-2 bg-[#FDFCF9] px-3.5 py-2 rounded-xl border border-[#1A1423]/10">
            <Building2 className="w-4 h-4 text-[#8B5CF6]" />
            <div className="text-xs">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Client Scope:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-transparent font-bold text-[#1A1423] outline-hidden cursor-pointer"
              >
                <option value="ALL">Agency Global Scope</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Recommended Prompts for {activeAgent.name}:
          </span>
          <div className="flex flex-wrap gap-2">
            {(agentPromptsMap[activeAgent.code] || []).map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(promptText);
                  handleSendPrompt(promptText);
                }}
                className="text-xs bg-[#FDFCF9] hover:bg-purple-50/50 text-[#1A1423] font-medium px-3.5 py-2 rounded-xl border border-[#1A1423]/5 transition-colors flex items-center gap-1.5"
              >
                <span>{promptText}</span>
                <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Prompt Input Box */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              id="agent-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Instruct ${activeAgent.name} (e.g. "Create 3 Instagram Reel scripts for Kalinga Café", "What needs my approval today?", or "Draft weekly KPI report")...`}
              className="w-full p-4 text-xs rounded-2xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6] leading-relaxed resize-none"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                id="btn-send-agent-prompt"
                disabled={isProcessing || !prompt.trim()}
                onClick={() => handleSendPrompt()}
                className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run AI Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <span>{statusMessage}</span>
              <button
                onClick={() => onNavigate('tasks')}
                className="font-bold underline text-emerald-800"
              >
                View in Board
              </button>
            </div>
          )}
        </div>

        {/* Structured Output Display */}
        {aiOutput && (
          <div className="mt-6 pt-6 border-t border-[#1A1423]/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="font-serif font-semibold text-base text-[#1A1423]">
                  Structured AI Department Output
                </h4>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                Model: gemini-3.8-flash &bull; Safe JSON verified
              </span>
            </div>

            {/* 1. Summary Box */}
            <div className="p-5 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Executive Synthesis:
              </span>
              <p className="text-xs leading-relaxed text-[#1A1423] whitespace-pre-wrap">
                {aiOutput.summary}
              </p>
            </div>

            {/* 2. Generated Tasks with 1-Click Actions */}
            {aiOutput.tasks && aiOutput.tasks.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Generated Work Items & Tasks ({aiOutput.tasks.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {aiOutput.tasks.map((taskItem: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-[#1A1423]/5 bg-white space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                          {taskItem.owner_agent?.replace('_', ' ') || 'Operations'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 uppercase">
                          {taskItem.priority || 'medium'}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-[#1A1423]">{taskItem.title}</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {taskItem.description}
                      </p>

                      {taskItem.requires_approval && (
                        <div className="p-2 rounded-xl bg-amber-50/80 text-amber-800 text-[10px] font-medium border border-amber-200/60">
                          <strong>Approval note:</strong> {taskItem.approval_reason || 'Requires human verification.'}
                        </div>
                      )}

                      {/* 1-Click Actions */}
                      <div className="pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleConvertToTask(taskItem)}
                          className="text-[11px] bg-[#FDFCF9] hover:bg-purple-50/50 text-[#1A1423] font-semibold px-3 py-1.5 rounded-xl border border-[#1A1423]/5 transition-colors flex items-center gap-1"
                        >
                          <CheckSquare className="w-3 h-3 text-[#8B5CF6]" />
                          <span>Convert to Task</span>
                        </button>
                        {taskItem.requires_approval && (
                          <button
                            onClick={() => handleSendToApprovals(taskItem)}
                            className="text-[11px] bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>Queue for Approval</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Inter-Agent Handoffs */}
            {aiOutput.handoffs && aiOutput.handoffs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Inter-Agent Automated Handoffs:
                </span>
                {aiOutput.handoffs.map((h: any, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-purple-950 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-[#8B5CF6] uppercase text-[10px]">
                        {h.from_agent}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="font-bold text-[#8B5CF6] uppercase text-[10px]">
                        {h.to_agent}
                      </span>
                      <span className="text-gray-700 truncate ml-2">{h.message}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#8B5CF6] bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                      Dispatched
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Sources Used */}
            {aiOutput.sources_used && aiOutput.sources_used.length > 0 && (
              <div className="pt-2.5 border-t border-[#1A1423]/5 flex items-center gap-2 text-xs text-gray-400">
                <span className="font-bold text-gray-400 text-[10px] uppercase">
                  Grounded in Knowledge Documents:
                </span>
                {aiOutput.sources_used.map((s: any, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-[#FDFCF9] border border-[#1A1423]/5 text-[#1A1423] text-[11px] font-medium"
                  >
                    {s.document_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
