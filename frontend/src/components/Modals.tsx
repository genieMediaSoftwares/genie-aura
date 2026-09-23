import React, { useState } from 'react';
import {
  X,
  Plus,
  Bot,
  User,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ShieldAlert,
  Send,
  Sparkles,
} from 'lucide-react';
import { Client, Task, KnowledgeDocument, AIAgent } from '../types/index.js';

// 1. New Client Modal
export const NewClientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Hospitality');
  const [location, setLocation] = useState('Visakhapatnam');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [brandVoice, setBrandVoice] = useState('Warm, authentic, premium coastal aesthetic');
  const [targetAudience, setTargetAudience] = useState('Local Vizag residents, food enthusiasts, tourists');
  const [coreServices, setCoreServices] = useState('Social Media, Content Production, Meta Ads');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        industry,
        location,
        contactPerson: contactPerson || `${name} Manager`,
        contactEmail: contactEmail || `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        status: 'ACTIVE',
        brandProfile: {
          brandVoice,
          targetAudience,
          coreServices,
          competitors: 'Local regional brands',
          socialChannels: 'Instagram, Facebook, Google Business',
          contentPillars: 'Brand Story, Behind-the-Scenes, Customer Spotlights',
        },
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl space-y-5 border border-[#1A1423]/5">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1423]/5">
          <h3 className="text-lg font-serif font-semibold text-[#1A1423]">Onboard New Agency Client</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Client Business Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Dolphin Bay Resort"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Industry</label>
              <input
                required
                type="text"
                placeholder="e.g. Hospitality / Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Location / Area</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="client@domain.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1A1423]/5">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block mb-2">
              Brand Profile Dossier (Grounds AI Agents):
            </span>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#1A1423] block mb-1">Brand Voice & Persona</label>
                <textarea
                  rows={2}
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
              <div>
                <label className="font-bold text-[#1A1423] block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
              <div>
                <label className="font-bold text-[#1A1423] block mb-1">Retainer Services</label>
                <input
                  type="text"
                  value={coreServices}
                  onChange={(e) => setCoreServices(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1423]/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-purple-200 transition-all"
            >
              {isSubmitting ? 'Onboarding...' : 'Create Client & Brand Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. New Task Modal
export const NewTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  agents: AIAgent[];
  onSubmit: (data: any) => Promise<void>;
}> = ({ isOpen, onClose, clients, agents, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [assignedAgentId, setAssignedAgentId] = useState(agents[0]?.id || '');
  const [priority, setPriority] = useState('MEDIUM');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [approvalReason, setApprovalReason] = useState('Standard agency review before dispatch');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        clientId: clientId || null,
        assignedAgentId: assignedAgentId || null,
        priority,
        requiresApproval,
        approvalReason: requiresApproval ? approvalReason : null,
        status: 'TODO',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl space-y-5 border border-[#1A1423]/5">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1423]/5">
          <h3 className="text-lg font-serif font-semibold text-[#1A1423]">Create New Agency Task</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#1A1423] block mb-1">Task Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Draft 3 Sunset Reels for Kalinga Café"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A1423] block mb-1">Description & Creative Brief</label>
            <textarea
              rows={3}
              placeholder="Include campaign context, hooks, and guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                <option value="">General Scope</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Assignee Agent</label>
              <select
                value={assignedAgentId}
                onChange={(e) => setAssignedAgentId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="req-appr"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
              />
              <label htmlFor="req-appr" className="font-bold text-[#1A1423] cursor-pointer">
                Requires Human Sign-off
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1423]/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-purple-200 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Task Detail Modal
export const TaskDetailModal: React.FC<{
  task: Task | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAddComment: (taskId: string, comment: string) => Promise<void>;
}> = ({ task, onClose, onUpdateStatus, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(task.id, commentText);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl space-y-5 border border-[#1A1423]/5">
        <div className="flex items-start justify-between pb-4 border-b border-[#1A1423]/5">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase">
              {task.clientName || 'Agency Scope'}
            </span>
            <h3 className="text-lg font-serif font-semibold text-[#1A1423] mt-1">{task.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Selector */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs">
          <span className="font-bold text-[#1A1423]">Workflow Status:</span>
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value as Task['status'])}
            className="p-1.5 rounded-xl border border-[#1A1423]/10 bg-white font-semibold text-[#1A1423]"
          >
            <option value="TODO">To Do / Queue</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_APPROVAL">Waiting For Approval</option>
            <option value="DONE">Completed</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Task Description & Brief:
          </span>
          <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs text-gray-700 leading-relaxed">
            {task.description}
          </div>
        </div>

        {/* Assignee info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-[#1A1423]/5 bg-[#FDFCF9]">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Assigned To</span>
            <span className="font-bold text-[#1A1423]">{task.assignedAgentName || task.assignedUserName || 'Unassigned'}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#1A1423]/5 bg-[#FDFCF9]">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Priority</span>
            <span className="font-bold text-amber-700">{task.priority}</span>
          </div>
        </div>

        {/* Comments stream */}
        <div className="pt-4 border-t border-[#1A1423]/5 space-y-3">
          <span className="text-xs font-bold text-[#1A1423] uppercase tracking-wider block">
            Discussion & Activity:
          </span>

          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Add feedback or update..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-2.5 text-xs rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 4. Upload Knowledge Document Modal
export const UploadDocModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSubmit: (data: any) => Promise<void>;
}> = ({ isOpen, onClose, clients, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Brand Guidelines');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [extractedText, setExtractedText] = useState('');
  const [tags, setTags] = useState('brand, vizag, guidelines');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        clientId: clientId || null,
        extractedText,
        tags: tags.split(',').map((t) => t.trim()),
        type: 'TXT',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl space-y-5 border border-[#1A1423]/5">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1423]/5">
          <h3 className="text-lg font-serif font-semibold text-[#1A1423]">Upload Knowledge Document</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#1A1423] block mb-1">Document Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Kalinga Café Winter Menu & Origin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                <option value="Brand Guidelines">Brand Guidelines</option>
                <option value="Menu & Story">Menu & Story</option>
                <option value="SOPs">SOPs</option>
                <option value="Audience Research">Audience Research</option>
                <option value="Rate Cards">Rate Cards</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Client (Optional)</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                <option value="">Agency Global</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A1423] block mb-1">
              Document Text / Brand Context *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Paste document text, menu details, brand rules, or SOP guidelines..."
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] leading-relaxed focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          <div className="pt-4 border-t border-[#1A1423]/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-purple-200 transition-all"
            >
              {isSubmitting ? 'Indexing...' : 'Upload & Index'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Generate Report Modal
export const GenerateReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSubmit: (data: any) => Promise<void>;
}> = ({ isOpen, onClose, clients, onSubmit }) => {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [type, setType] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [period, setPeriod] = useState('September 1–7, 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ clientId, type, period });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1423]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl space-y-5 border border-[#1A1423]/5">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1423]/5">
          <h3 className="text-lg font-serif font-semibold text-[#1A1423]">Generate Client Performance Report</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-[#1A1423] rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#1A1423] block mb-1">Target Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Audit Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              >
                <option value="WEEKLY">Weekly Audit</option>
                <option value="MONTHLY">Monthly Comprehensive</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#1A1423] block mb-1">Period</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <p className="text-gray-400 text-[11px] leading-relaxed">
            Reporting AI will evaluate ROAS, ad spend, conversions, and impressions across Visakhapatnam regional ad networks, synthesizing client-ready recommendations.
          </p>

          <div className="pt-4 border-t border-[#1A1423]/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-purple-200 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Synthesizing...' : 'Synthesize Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
