import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bot,
  Building2,
  Clock,
  MessageSquare,
  FileText,
  History,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { ApprovalRequest } from '../types/index.js';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  onReviewDecision: (
    id: string,
    decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED',
    reason?: string,
    feedback?: string
  ) => Promise<void>;
  onOpenAiWorkspace: (agentCode?: string, initialPrompt?: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onReviewDecision,
  onOpenAiWorkspace,
}) => {
  const [filterStatus, setFilterStatus] = useState<'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'ALL'>('PENDING');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(
    approvals.find((a) => a.status === 'PENDING') || approvals[0] || null
  );
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = approvals.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
    if (!selectedApproval) return;
    setIsSubmitting(true);
    try {
      await onReviewDecision(selectedApproval.id, decision, undefined, feedbackText);
      setFeedbackText('');
      // Update local selection
      const nextPending = approvals.find((a) => a.id !== selectedApproval.id && a.status === 'PENDING');
      if (nextPending) {
        setSelectedApproval(nextPending);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CHANGES_REQUESTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Safety Protocol Banner */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-5 text-xs text-amber-950 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-serif font-semibold text-amber-950 text-sm">
            Agency Human-in-the-Loop Protocol Enforced
          </h4>
          <p className="text-amber-800/90 mt-1 leading-relaxed">
            By agency policy, <strong>no AI agent can publish content, dispatch client emails, change ad budgets, or trigger external actions</strong> without an explicit, cryptographically traceable human approval record.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#1A1423]/5 shadow-sm">
        <div className="flex rounded-xl border border-[#1A1423]/10 p-0.5 bg-[#FDFCF9]">
          {(['PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'ALL'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-white shadow-xs text-[#8B5CF6]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {status === 'ALL' ? 'All Records' : status.replace('_', ' ')}
              {status === 'PENDING' && (
                <span className="ml-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {approvals.filter((a) => a.status === 'PENDING').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Showing {filtered.length} approval item{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Main Split Layout: Left list (5 cols), Right review workbench (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Queue List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-8 text-center text-gray-400 text-xs">
              No approval requests match this filter.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedApproval?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedApproval(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md'
                      : 'border-[#1A1423]/5 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#1A1423] line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.contentPreview}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-gray-700 truncate">{item.clientName}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Bot className="w-3 h-3 text-[#8B5CF6]" />
                      <span>{item.creatorAgentName}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Inspection & Decision Workbench */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm sticky top-20">
          {selectedApproval ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                    {selectedApproval.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase ${getStatusBadge(
                      selectedApproval.status
                    )}`}
                  >
                    {selectedApproval.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#1A1423]">{selectedApproval.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2 pb-3.5 border-b border-[#1A1423]/5">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> Client:{' '}
                    <strong className="text-gray-800">{selectedApproval.clientName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#8B5CF6]" /> Created by:{' '}
                    <strong className="text-gray-800">{selectedApproval.creatorAgentName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(selectedApproval.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Content Preview Box */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wider">
                  Proposed Content / Campaign Action Preview:
                </label>
                <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs leading-relaxed text-gray-800 font-sans whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {selectedApproval.contentPreview}
                </div>
              </div>

              {/* Source docs or context */}
              {selectedApproval.contextData && (
                <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-900">
                  <span className="font-bold block mb-1">Context & Knowledge Grounding:</span>
                  <p className="text-purple-800/90 text-[11px]">
                    Validated against client brand guidelines and Visakhapatnam regional audience norms.
                  </p>
                </div>
              )}

              {/* Decision Actions (If Pending) */}
              {selectedApproval.status === 'PENDING' ? (
                <div className="pt-4 border-t border-[#1A1423]/5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Human Review Feedback & Instructions (Optional):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add specific changes requested or notes for team audit..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      id="btn-approve"
                      disabled={isSubmitting}
                      onClick={() => handleDecision('APPROVED')}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Authorize Action</span>
                    </button>

                    <button
                      id="btn-request-changes"
                      disabled={isSubmitting}
                      onClick={() => handleDecision('CHANGES_REQUESTED')}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      id="btn-reject"
                      disabled={isSubmitting}
                      onClick={() => handleDecision('REJECTED')}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Decision Recorded: {selectedApproval.status}</span>
                  </div>
                  {selectedApproval.decisionReason && (
                    <p className="text-gray-600 mt-1 italic">
                      Note: &ldquo;{selectedApproval.decisionReason}&rdquo;
                    </p>
                  )}
                  {selectedApproval.reviewedAt && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Reviewed on {new Date(selectedApproval.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Complete Audit Trail */}
              <div className="pt-4 border-t border-[#1A1423]/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
                  <History className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Audit History</span>
                </div>
                <div className="space-y-2">
                  {selectedApproval.auditHistory.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5 text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-[#1A1423]">{h.actor}</span>
                        <span className="text-gray-500 ml-1.5">({h.action})</span>
                        {h.note && <p className="text-gray-600 mt-0.5">{h.note}</p>}
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Select an item from the approval queue to inspect and review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
