import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Mail,
  CheckSquare,
  ShieldAlert,
  BookOpen,
  Calendar,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Client, Task, ApprovalRequest } from '../types/index.js';

interface ClientDetailModalProps {
  client: Client | null;
  tasks: Task[];
  approvals: ApprovalRequest[];
  onClose: () => void;
  onOpenAiWorkspace: (agentCode?: string, initialPrompt?: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  tasks,
  approvals,
  onClose,
  onOpenAiWorkspace,
}) => {
  if (!client) return null;

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientApprovals = approvals.filter((a) => a.clientId === client.id);
  const bp = client.brandProfile;

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl space-y-6 border border-[#1A1423]/5">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#1A1423]/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/10 flex items-center justify-center text-[#8B5CF6] font-serif font-bold text-lg shadow-sm">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-semibold text-[#1A1423]">{client.name}</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                  {client.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>{client.industry}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" /> {client.location}
                </span>
                <span>&bull;</span>
                <span>{client.contactEmail}</span>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Dossier */}
        {bp && (
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Brand Profile Dossier (Grounds All AI Agents)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Brand Voice</span>
                <p className="text-[#1A1423] leading-relaxed font-medium">{bp.brandVoice}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Target Audience</span>
                <p className="text-[#1A1423] leading-relaxed font-medium">{bp.targetAudience}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Content Pillars</span>
                <p className="text-gray-600 leading-relaxed">{bp.contentPillars}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Retainer Services</span>
                <p className="text-gray-600 leading-relaxed">{bp.coreServices}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Tasks & Approvals for this client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Tasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1A1423] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Active Tasks ({clientTasks.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {clientTasks.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No tasks created yet.</p>
              ) : (
                clientTasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1423] truncate max-w-[180px]">{t.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6]">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Approvals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1A1423] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Human Approvals ({clientApprovals.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {clientApprovals.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No approvals on record.</p>
              ) : (
                clientApprovals.map((a) => (
                  <div key={a.id} className="p-2.5 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1423] truncate max-w-[180px]">{a.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === 'PENDING' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#1A1423]/5 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenAiWorkspace('content_agent', `Create bilingual reel ideas for ${client.name}`);
            }}
            className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Creative with Content AI</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
