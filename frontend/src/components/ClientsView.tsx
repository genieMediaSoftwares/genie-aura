import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Mail,
  Phone,
  Megaphone,
  CheckSquare,
  ShieldAlert,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { Client } from '../types/index.js';

interface ClientsViewProps {
  clients: Client[];
  onSelectClientDetail: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onOpenAiWorkspace: (agentCode?: string, initialPrompt?: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onSelectClientDetail,
  onOpenNewClientModal,
  onOpenAiWorkspace,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#1A1423]/5 shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search clients by name, industry, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#1A1423]/10 bg-[#FDFCF9] rounded-xl px-3 py-2 font-medium text-[#1A1423]"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>

        <button
          id="btn-add-new-client"
          onClick={onOpenNewClientModal}
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const bp = client.brandProfile;
          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-[#1A1423]/5 p-6 shadow-sm hover:border-[#8B5CF6]/30 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                        {client.industry}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                        {client.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-[#1A1423] mt-2">{client.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" /> {client.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5 flex items-center justify-center text-[#8B5CF6] font-serif font-bold text-sm">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Brand Voice snippet */}
                {bp && (
                  <div className="mt-4 p-3.5 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Brand Voice:
                      </span>
                      <p className="text-gray-700 text-xs line-clamp-2 mt-0.5">{bp.brandVoice}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mt-1">
                        Target Audience:
                      </span>
                      <p className="text-gray-600 text-[11px] line-clamp-1 mt-0.5">{bp.targetAudience}</p>
                    </div>
                  </div>
                )}

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t border-[#1A1423]/5 pt-3">
                  <div className="p-2 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-xs font-bold text-[#1A1423] block">{client.campaignsCount || 1}</span>
                    <span className="text-[10px] text-gray-400">Campaigns</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-xs font-bold text-[#1A1423] block">{client.openTasksCount || 0}</span>
                    <span className="text-[10px] text-gray-400">Open Tasks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/50">
                    <span className="text-xs font-bold text-amber-800 block">
                      {client.pendingApprovalsCount || 0}
                    </span>
                    <span className="text-[10px] text-amber-700">Approvals</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3.5 border-t border-[#1A1423]/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectClientDetail(client)}
                  className="text-xs font-semibold text-[#8B5CF6] hover:underline flex items-center gap-1"
                >
                  <span>Brand Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onOpenAiWorkspace('content_agent', `Create new content calendar plan for ${client.name}`)
                  }
                  className="text-xs bg-[#FDFCF9] hover:bg-purple-50/60 text-[#1A1423] font-semibold px-3 py-1.5 rounded-xl border border-[#1A1423]/5 transition-colors flex items-center gap-1"
                >
                  <span>Generate Content</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8B5CF6]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
