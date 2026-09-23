import React from 'react';
import {
  Settings,
  Building2,
  Users,
  ShieldCheck,
  Bot,
  ExternalLink,
  MapPin,
  Mail,
  Key,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();

  const team = [
    { name: 'Suresh Varma', role: 'SUPER_ADMIN', email: 'admin@geniemedia.in', title: 'Managing Director & Founder' },
    { name: 'Ananya Rao', role: 'AGENCY_MANAGER', email: 'ananya@geniemedia.in', title: 'Head of Client Operations' },
    { name: 'Rahul Naidu', role: 'TEAM_MEMBER', email: 'rahul@geniemedia.in', title: 'Senior Creative Lead' },
    { name: 'Pooja Sharma', role: 'TEAM_MEMBER', email: 'pooja@geniemedia.in', title: 'Performance Marketing Specialist' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Organization Dossier Card */}
      <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1423] text-white flex items-center justify-center font-bold text-lg font-serif shadow-sm">
              GM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-semibold text-[#1A1423]">Genie Media & Studio</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] tracking-wider">
                  HEADQUARTERS
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B5CF6]" /> Yendada, Visakhapatnam, Andhra Pradesh, India
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Tenant: org-genie-media
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#1A1423]/5 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Core Specialization:</span>
            <p className="text-[#1A1423] font-medium">Digital Strategy, Performance Ads, Regional Content & Studio Production</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Agency Email:</span>
            <p className="text-[#1A1423] font-medium">contact@geniemedia.in</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Timezone:</span>
            <p className="text-[#1A1423] font-medium">Asia/Kolkata (IST - UTC+5:30)</p>
          </div>
        </div>
      </div>

      {/* Security & Human Guardrail Section */}
      <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3.5 border-b border-[#1A1423]/5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h4 className="font-serif font-semibold text-base text-[#1A1423]">
            AI Governance & Safety Controls
          </h4>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
            <div>
              <p className="font-bold text-emerald-950">Mandatory Human-in-the-Loop Sign-Off</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                All 6 AI agents are cryptographically prevented from publishing social content, changing budgets, or sending client messages without approval.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shrink-0">
              ALWAYS ON
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
            <div>
              <p className="font-bold text-[#1A1423]">Tenant Data Isolation</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Strict organization ID scoping enforced across all API endpoints, database queries, and AI prompt context pipelines.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-[#8B5CF6] shrink-0">
              ENFORCED
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
            <div>
              <p className="font-bold text-[#1A1423]">AI Intelligence Core</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Powered by Google Gemini 3.8 Flash via backend-only SDK (@google/genai) with User-Agent auditing.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 shrink-0">
              gemini-3.8-flash
            </span>
          </div>
        </div>
      </div>

      {/* Team Roster with RBAC */}
      <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1A1423]/5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8B5CF6]" />
            <h4 className="font-serif font-semibold text-base text-[#1A1423]">Agency Team & Roles</h4>
          </div>
          <span className="text-xs text-gray-400">{team.length} Members</span>
        </div>

        <div className="divide-y divide-[#1A1423]/5">
          {team.map((member, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center font-bold text-xs shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1A1423] truncate">{member.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{member.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-gray-400 text-[11px] hidden sm:inline">{member.email}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDFCF9] border border-[#1A1423]/5 text-gray-600">
                  {member.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API & Developer Documentation Card */}
      <div className="bg-[#1A1423] text-[#F3F0F9] rounded-2xl p-7 border border-white/5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="font-serif font-semibold text-base text-white">Interactive Swagger & OpenAPI Docs</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-lg">
            Complete OpenAPI 3.0 specification available at <code className="text-[#D4B3FF] font-mono">/api/v1/openapi.json</code> and live Swagger documentation at <code className="text-[#D4B3FF] font-mono">/api/docs</code>.
          </p>
        </div>
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-purple-950/40 transition-all shrink-0"
        >
          <span>Open Swagger UI</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
