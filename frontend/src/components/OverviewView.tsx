import React from 'react';
import {
  Users,
  CheckSquare,
  ShieldAlert,
  Bot,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Client, Task, ApprovalRequest, AIAgent, ActivityLog } from '../types/index.js';

interface OverviewViewProps {
  clients: Client[];
  tasks: Task[];
  approvals: ApprovalRequest[];
  agents: AIAgent[];
  activityLogs: ActivityLog[];
  onNavigate: (tab: string) => void;
  onOpenAiWorkspace: (agentCode?: string, initialPrompt?: string) => void;
  onOpenApprovalModal: (approval: ApprovalRequest) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  clients,
  tasks,
  approvals,
  agents,
  activityLogs,
  onNavigate,
  onOpenAiWorkspace,
  onOpenApprovalModal,
}) => {
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const openTasks = tasks.filter((t) => t.status !== 'DONE');

  const stats = [
    {
      label: 'Active Clients',
      value: clients.filter((c) => c.status === 'ACTIVE').length,
      subtext: 'Retainers in Visakhapatnam',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      action: () => onNavigate('clients'),
    },
    {
      label: 'Monthly Retainer Volume',
      value: '₹4,85,000',
      subtext: '+18% vs last month',
      icon: IndianRupee,
      color: 'from-emerald-600 to-teal-600',
      action: () => onNavigate('reports'),
    },
    {
      label: 'Tasks In Queue',
      value: openTasks.length,
      subtext: `${tasks.filter((t) => t.status === 'DONE').length} finished this week`,
      icon: CheckSquare,
      color: 'from-purple-600 to-violet-600',
      action: () => onNavigate('tasks'),
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.length,
      subtext: 'Requires Human Sign-off',
      icon: ShieldAlert,
      color: pendingApprovals.length > 0 ? 'from-amber-500 to-orange-600' : 'from-emerald-600 to-teal-600',
      badge: pendingApprovals.length > 0 ? 'Action Required' : 'All Clear',
      action: () => onNavigate('approvals'),
    },
  ];

  const suggestedPrompts = [
    { label: 'What needs my approval today?', code: 'operations_agent' },
    { label: 'Create Instagram Reel ideas for Kalinga Café', code: 'content_agent' },
    { label: 'Formulate Diwali campaign strategy for clients', code: 'strategy_agent' },
    { label: 'Synthesize weekly KPI performance summary', code: 'reporting_agent' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
              Agency Command Center
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#8B5CF6]" /> Yendada, Visakhapatnam
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1423] tracking-tight">
            Good morning, Genie.
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back to your agency operating system. 6 AI department agents active with human verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="banner-ask-operations"
            onClick={() => onOpenAiWorkspace('operations_agent', 'What needs my approval today?')}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult AI Agents</span>
          </button>
          <button
            id="banner-view-approvals"
            onClick={() => onNavigate('approvals')}
            className="bg-white hover:bg-gray-50 text-[#1A1423] border border-[#1A1423]/10 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Approvals ({pendingApprovals.length})</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Quick Consult:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onOpenAiWorkspace(p.code, p.label)}
            className="text-xs bg-white hover:bg-purple-50/60 text-gray-700 hover:text-[#8B5CF6] px-3.5 py-1.5 rounded-xl border border-[#1A1423]/5 shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>{p.label}</span>
            <ArrowUpRight className="w-3 h-3 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Geometric Metric Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onNavigate('clients')}
          className="bg-white p-6 rounded-2xl border border-[#1A1423]/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Active Clients</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1423]">
              {clients.filter((c) => c.status === 'ACTIVE').length}
            </h3>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
            <span>+2 new in Visakhapatnam</span>
          </p>
        </div>

        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white p-6 rounded-2xl border border-[#1A1423]/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Pending Approvals</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1423]">{pendingApprovals.length}</h3>
            <ShieldAlert className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xs text-orange-500 font-medium mt-1.5">
            {pendingApprovals.length > 0 ? `${pendingApprovals.length} awaiting human sign-off` : 'All clear'}
          </p>
        </div>

        <div
          onClick={() => onNavigate('agents')}
          className="bg-white p-6 rounded-2xl border border-[#1A1423]/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">AI Agents Active</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1423]">{agents.length}</h3>
            <Bot className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-xs text-purple-600 font-medium mt-1.5">
            {tasks.filter((t) => t.status === 'DONE').length} tasks delivered this cycle
          </p>
        </div>

        <div
          onClick={() => onNavigate('reports')}
          className="bg-white p-6 rounded-2xl border border-[#1A1423]/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Retainer Volume</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1423]">₹4,85,000</h3>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1.5">
            ↑ 18% vs last month
          </p>
        </div>
      </div>

      {/* Grid: AI Department Activity (2 cols) & Needs Your Approval (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Department Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="text-[#8B5CF6]">✧</span> AI Department Activity
            </h4>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs font-medium text-[#8B5CF6] hover:underline"
            >
              View All Agents
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => onOpenAiWorkspace(agent.code)}
                className="bg-white p-5 rounded-2xl border border-[#1A1423]/5 shadow-sm flex items-start gap-4 hover:border-[#8B5CF6]/30 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 bg-purple-50/80 rounded-xl flex items-center justify-center text-[#8B5CF6] font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-sm text-[#1A1423] truncate">{agent.name}</h5>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {agent.currentTask || agent.department}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {agent.workloadCount} tasks
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Needs Your Approval */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="text-amber-500">✓</span> Needs Your Approval
            </h4>
            <span className="text-xs text-gray-400">{pendingApprovals.length} pending</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#1A1423]/5 shadow-sm divide-y divide-[#1A1423]/5 overflow-hidden">
            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-800">Queue is Clear</p>
                <p className="text-[11px] text-gray-400 mt-1">No items currently requiring human review.</p>
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenApprovalModal(item)}
                  className="p-4 hover:bg-gray-50/60 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
                      {item.type.replace('_', ' ')}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#1A1423] mt-1 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Client: {item.clientName}</p>
                </div>
              ))
            )}

            <div className="p-3.5 bg-purple-50/60 hover:bg-purple-100/70 transition-colors flex items-center justify-center">
              <button
                onClick={() => onNavigate('approvals')}
                className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest hover:underline"
              >
                View All Approvals ({pendingApprovals.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Live Operations Log */}
      <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A1423]/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="font-serif font-bold text-base text-[#1A1423]">Agency Live Operations Log</h3>
          </div>
          <span className="text-xs text-gray-400">Yendada Operations Command Audit</span>
        </div>

        <div className="divide-y divide-[#1A1423]/5">
          {activityLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />
                <span className="font-semibold text-[#1A1423] shrink-0">{log.actorName}:</span>
                <span className="text-gray-600 truncate">{log.summary}</span>
              </div>
              <span className="text-[11px] text-gray-400 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
