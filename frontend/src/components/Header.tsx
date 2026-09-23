import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  ShieldCheck,
  Building2,
  Check,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { Client, NotificationItem } from '../types/index.js';
import { api } from '../api/client.js';

interface HeaderProps {
  title: string;
  subtitle: string;
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onOpenAiWorkspace: (agentCode?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  clients,
  selectedClientId,
  onSelectClient,
  onOpenAiWorkspace,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const list = await api.notifications.list();
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <header
      id="genie-header"
      className="bg-white border-b border-[#1A1423]/10 px-8 py-4 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Title and breadcrumb */}
      <div>
        <h1 className="text-xl font-serif font-semibold text-[#1A1423] tracking-tight">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Operational System Badge with Pulsing Dot */}
        <div
          title="Strict Agency Guardrail: All systems operational & human verification active"
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>All Systems Operational</span>
        </div>

        <span className="text-xs text-gray-400 hidden xl:inline">
          Visakhapatnam, India
        </span>

        {/* Global Client Filter */}
        <div className="relative">
          <div className="flex items-center gap-1.5 bg-[#FDFCF9] hover:bg-gray-50 border border-[#1A1423]/10 text-xs font-medium text-[#1A1423] rounded-xl px-3 py-2 cursor-pointer transition-colors">
            <Building2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <select
              id="global-client-selector"
              value={selectedClientId}
              onChange={(e) => onSelectClient(e.target.value)}
              className="bg-transparent border-none outline-hidden cursor-pointer pr-3 font-medium text-[#1A1423]"
            >
              <option value="ALL">All Clients (Portfolio)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ask AI Agent Quick Button */}
        <button
          id="btn-quick-ai-consult"
          onClick={() => onOpenAiWorkspace()}
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Team</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-[#1A1423] hover:bg-[#FDFCF9] rounded-xl relative transition-colors border border-[#1A1423]/10"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#1A1423]/10 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A1423]/5">
                <span className="font-semibold text-xs text-[#1A1423]">Agency Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-[#8B5CF6] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.isRead ? 'bg-[#FDFCF9] text-gray-600' : 'bg-purple-50/70 text-purple-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
