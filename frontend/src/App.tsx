import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { OverviewView } from './components/OverviewView.js';
import { ClientsView } from './components/ClientsView.js';
import { TasksView } from './components/TasksView.js';
import { ApprovalsView } from './components/ApprovalsView.js';
import { AgentsView } from './components/AgentsView.js';
import { KnowledgeView } from './components/KnowledgeView.js';
import { ReportsView } from './components/ReportsView.js';
import { SettingsView } from './components/SettingsView.js';
import {
  NewClientModal,
  NewTaskModal,
  TaskDetailModal,
  UploadDocModal,
  GenerateReportModal,
} from './components/Modals.js';
import { ClientDetailModal } from './components/ClientDetailModal.js';
import { AuthModal } from './components/AuthModal.js';
import { api } from './api/client.js';
import {
  Client,
  Task,
  ApprovalRequest,
  AIAgent,
  KnowledgeDocument,
  Report,
  ActivityLog,
} from './types/index.js';
import { Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');

  // Core Data
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Modals state
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Pre-filled AI Workspace parameters
  const [aiWorkspaceParams, setAiWorkspaceParams] = useState<{
    agentCode?: string;
    initialPrompt?: string;
  }>({});

  const refreshAllData = useCallback(async () => {
    try {
      const [
        clientsRes,
        tasksRes,
        approvalsRes,
        agentsRes,
        docsRes,
        reportsRes,
        activityRes,
      ] = await Promise.all([
        api.clients.list(),
        api.tasks.list(),
        api.approvals.list(),
        api.agents.list(),
        api.knowledge.list(),
        api.reports.list(),
        api.activity.list(),
      ]);

      setClients(clientsRes);
      setTasks(tasksRes);
      setApprovals(approvalsRes);
      setAgents(agentsRes);
      setDocuments(docsRes);
      setReports(reportsRes);
      setActivityLogs(activityRes);
    } catch (err) {
      console.error('Error refreshing agency data:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user, refreshAllData]);

  const handleOpenAiWorkspace = (agentCode?: string, initialPrompt?: string) => {
    setAiWorkspaceParams({ agentCode, initialPrompt });
    setCurrentTab('agents');
  };

  const handleReviewDecision = async (
    id: string,
    decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED',
    reason?: string,
    feedback?: string
  ) => {
    await api.approvals.review(id, { decision, reason, feedbackComments: feedback });
    await refreshAllData();
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    await api.tasks.update(taskId, { status: newStatus });
    await refreshAllData();
  };

  const handleAddComment = async (taskId: string, comment: string) => {
    await api.tasks.addComment(taskId, comment);
    const updated = await api.tasks.get(taskId);
    setSelectedTaskDetail(updated);
    await refreshAllData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1A1423] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
        <div className="text-center">
          <p className="font-serif text-xl font-semibold">GenieAura OS</p>
          <p className="text-xs text-gray-400 mt-1">Initializing agency command center...</p>
        </div>
      </div>
    );
  }

  // Filter tasks & approvals if global client is selected
  const displayedTasks =
    selectedClientId === 'ALL'
      ? tasks
      : tasks.filter((t) => t.clientId === selectedClientId);

  const displayedApprovals =
    selectedClientId === 'ALL'
      ? approvals
      : approvals.filter((a) => a.clientId === selectedClientId);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;

  // Title mappings
  const viewMeta: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Command Center',
      subtitle: 'Executive operations, agent statuses, and client portfolio',
    },
    clients: {
      title: 'Clients & Brands',
      subtitle: 'Brand profiles, content pillars, and retainer dossiers',
    },
    tasks: {
      title: 'Tasks & Campaigns',
      subtitle: 'Cross-functional Kanban board spanning AI agents and human leads',
    },
    approvals: {
      title: 'Approval Center',
      subtitle: 'Human-in-the-Loop decision gateway for campaigns and copy',
    },
    agents: {
      title: 'AI Department Agents Hub',
      subtitle: '6 specialized autonomous agents collaborating across agency workflows',
    },
    knowledge: {
      title: 'Knowledge Base',
      subtitle: 'Indexed brand guidelines, menus, rate cards, and regional data',
    },
    reports: {
      title: 'Reports & Analytics',
      subtitle: 'Synthesized performance audits with real CSV downloads',
    },
    settings: {
      title: 'Agency Settings & Governance',
      subtitle: 'Genie Media & Studio configuration, team roles, and safety controls',
    },
  };

  return (
    <div className="min-h-screen flex bg-[#FDFCF9] text-[#1A1423] font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <Header
          title={viewMeta[currentTab]?.title || 'Command Center'}
          subtitle={viewMeta[currentTab]?.subtitle || ''}
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
          onOpenAiWorkspace={handleOpenAiWorkspace}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              clients={clients}
              tasks={displayedTasks}
              approvals={displayedApprovals}
              agents={agents}
              activityLogs={activityLogs}
              onNavigate={setCurrentTab}
              onOpenAiWorkspace={handleOpenAiWorkspace}
              onOpenApprovalModal={(approval) => {
                setCurrentTab('approvals');
              }}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsView
              clients={clients}
              onSelectClientDetail={(c) => setSelectedClientDetail(c)}
              onOpenNewClientModal={() => setIsNewClientOpen(true)}
              onOpenAiWorkspace={handleOpenAiWorkspace}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              tasks={displayedTasks}
              clients={clients}
              agents={agents}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {currentTab === 'approvals' && (
            <ApprovalsView
              approvals={displayedApprovals}
              onReviewDecision={handleReviewDecision}
              onOpenAiWorkspace={handleOpenAiWorkspace}
            />
          )}

          {currentTab === 'agents' && (
            <AgentsView
              agents={agents}
              clients={clients}
              initialAgentCode={aiWorkspaceParams.agentCode}
              initialPrompt={aiWorkspaceParams.initialPrompt}
              onRefreshData={refreshAllData}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeView
              documents={documents}
              clients={clients}
              onOpenUploadModal={() => setIsUploadDocOpen(true)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              reports={reports}
              clients={clients}
              onOpenGenerateModal={() => setIsGenerateReportOpen(true)}
            />
          )}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onSubmit={async (data) => {
          await api.clients.create(data);
          await refreshAllData();
        }}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        clients={clients}
        agents={agents}
        onSubmit={async (data) => {
          await api.tasks.create(data);
          await refreshAllData();
        }}
      />

      <TaskDetailModal
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        onUpdateStatus={handleUpdateTaskStatus}
        onAddComment={handleAddComment}
      />

      <ClientDetailModal
        client={selectedClientDetail}
        tasks={tasks}
        approvals={approvals}
        onClose={() => setSelectedClientDetail(null)}
        onOpenAiWorkspace={handleOpenAiWorkspace}
      />

      <UploadDocModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        clients={clients}
        onSubmit={async (data) => {
          await api.knowledge.upload(data);
          await refreshAllData();
        }}
      />

      <GenerateReportModal
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
        clients={clients}
        onSubmit={async (data) => {
          await api.reports.generate(data);
          await refreshAllData();
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
