import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  ShieldAlert,
  Bot,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  MapPin,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount,
}) => {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients & Brands', icon: Users },
    { id: 'tasks', label: 'Tasks & Campaigns', icon: CheckSquare },
    {
      id: 'approvals',
      label: 'Approval Center',
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'agents', label: 'AI Department Agents', icon: Bot },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Agency Settings', icon: Settings },
  ];

  return (
    <aside
      id="genie-sidebar"
      className="w-64 bg-[#1A1423] text-[#F3F0F9] flex flex-col justify-between border-r border-white/5 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg flex items-center justify-center shadow-md shadow-purple-900/30 shrink-0">
              <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-white text-xl font-semibold tracking-tight">GenieAura</h1>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#8B5CF6]/25 text-[#D4B3FF] font-medium border border-[#8B5CF6]/30">
                  OS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 tracking-tight">Genie Media & Studio</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-300 bg-[#ffffff05] px-2.5 py-1 rounded-lg border border-white/5">
            <MapPin className="w-3 h-3 text-[#8B5CF6] shrink-0" />
            <span className="truncate">Yendada, Visakhapatnam</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#ffffff10] text-white shadow-xs font-semibold border border-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-[#ffffff05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8B5CF6]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#8B5CF6] text-white' : 'bg-[#8B5CF6]/80 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Quick Links */}
      <div className="p-4 border-t border-white/5 space-y-2.5">
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#ffffff05] transition-colors"
        >
          <span className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            OpenAPI & Swagger UI
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>

        <div className="bg-[#ffffff05] rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#D4B3FF] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'Genie Media'}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">
                {user?.role?.toLowerCase().replace('_', ' ') || 'Agency Admin'}
              </p>
            </div>
          </div>
          <button
            id="sidebar-signout-btn"
            onClick={signOut}
            title="Sign out"
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
