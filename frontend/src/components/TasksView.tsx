import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Bot,
  User,
  Calendar,
  Clock,
  ShieldAlert,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Task, Client, AIAgent } from '../types/index.js';

interface TasksViewProps {
  tasks: Task[];
  clients: Client[];
  agents: AIAgent[];
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  clients,
  agents,
  onSelectTask,
  onOpenNewTaskModal,
  onUpdateTaskStatus,
}) => {
  const [selectedClient, setSelectedClient] = useState('ALL');
  const [selectedAgent, setSelectedAgent] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');

  const filteredTasks = tasks.filter((t) => {
    const matchesClient = selectedClient === 'ALL' || t.clientId === selectedClient;
    const matchesAgent = selectedAgent === 'ALL' || t.assignedAgentId === selectedAgent;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesClient && matchesAgent && matchesSearch;
  });

  const columns: Array<{ id: Task['status']; title: string; color: string; badge: string }> = [
    { id: 'TODO', title: 'To Do / Queue', color: 'border-slate-300', badge: 'bg-slate-100 text-slate-700' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-300', badge: 'bg-blue-100 text-blue-800' },
    { id: 'WAITING_FOR_APPROVAL', title: 'Waiting For Approval', color: 'border-amber-300', badge: 'bg-amber-100 text-amber-800' },
    { id: 'DONE', title: 'Completed', color: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-800' },
  ];

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#1A1423]/5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="text-xs border border-[#1A1423]/10 bg-[#FDFCF9] rounded-xl px-3 py-2 font-medium text-[#1A1423]"
          >
            <option value="ALL">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="text-xs border border-[#1A1423]/10 bg-[#FDFCF9] rounded-xl px-3 py-2 font-medium text-[#1A1423]"
          >
            <option value="ALL">All Assignees (Agents / Humans)</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex rounded-xl border border-[#1A1423]/10 p-0.5 bg-[#FDFCF9]">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'KANBAN' ? 'bg-white shadow-xs text-[#8B5CF6] font-bold' : 'text-gray-500'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'LIST' ? 'bg-white shadow-xs text-[#8B5CF6] font-bold' : 'text-gray-500'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            id="btn-create-task"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-white/60 rounded-2xl border border-[#1A1423]/5 p-4 min-h-[500px] flex flex-col shadow-xs"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A1423]/5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1A1423]">{col.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards container */}
                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="bg-white rounded-2xl p-4 border border-[#1A1423]/5 shadow-sm hover:border-[#8B5CF6]/30 hover:shadow-md transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] truncate max-w-[120px]">
                          {task.clientName || 'General'}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#1A1423] leading-snug line-clamp-2">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      {task.requiresApproval && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50/80 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Requires Human Approval</span>
                        </div>
                      )}

                      {/* Footer / Assignee */}
                      <div className="pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-between text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5 truncate">
                          {task.assignedAgentName ? (
                            <>
                              <Bot className="w-3 h-3 text-[#8B5CF6]" />
                              <span className="truncate font-medium text-gray-700">{task.assignedAgentName}</span>
                            </>
                          ) : task.assignedUserName ? (
                            <>
                              <User className="w-3 h-3 text-gray-600" />
                              <span className="truncate font-medium text-gray-700">{task.assignedUserName}</span>
                            </>
                          ) : (
                            <span className="italic text-gray-400">Unassigned</span>
                          )}
                        </div>

                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-400 italic">No tasks in this lane</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-[#1A1423]/5 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDFCF9] border-b border-[#1A1423]/5 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1423]/5">
              {filteredTasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="hover:bg-[#FDFCF9] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-[#1A1423] max-w-xs truncate">{t.title}</td>
                  <td className="px-4 py-3 text-gray-600">{t.clientName || 'General'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#8B5CF6]">
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {t.assignedAgentName || t.assignedUserName || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(t);
                      }}
                      className="text-xs font-semibold text-[#8B5CF6] hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
