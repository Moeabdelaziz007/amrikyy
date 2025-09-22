import React, { useState, useEffect } from 'react';
import { ClientCard } from './ClientCard';
import { GlassCard } from './GlassCard';
import LiveLogsModal from './LiveLogsModal';
import AgentsWorkflowCanvas from '../workflow/AgentsWorkflowCanvas';
import MCPToolsPanel from '../mcp/MCPToolsPanel';
import LiveActivityPanel from '../activity/LiveActivityPanel';
import ThemeCustomization from '../settings/ThemeCustomization';

interface Client {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'error' | 'warning' | 'idle';
  successCount: number;
  errorCount: number;
  lastActivity?: string;
}

export const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'client-001',
      name: 'Telegram Bot',
      type: 'Communication Agent',
      status: 'running',
      successCount: 142,
      errorCount: 3,
      lastActivity: '2 minutes ago',
    },
    {
      id: 'client-002',
      name: 'Learning Brain',
      type: 'AI Processing',
      status: 'running',
      successCount: 89,
      errorCount: 0,
      lastActivity: '1 minute ago',
    },
    {
      id: 'client-003',
      name: 'MCP Tools',
      type: 'System Integration',
      status: 'warning',
      successCount: 67,
      errorCount: 12,
      lastActivity: '5 minutes ago',
    },
    {
      id: 'client-004',
      name: 'Autopilot System',
      type: 'Automation Engine',
      status: 'idle',
      successCount: 234,
      errorCount: 8,
      lastActivity: '15 minutes ago',
    },
  ]);

  const [systemStats, setSystemStats] = useState({
    totalOperations: 532,
    successRate: 94.2,
    activeClients: 3,
    uptime: '2d 14h 32m',
  });

  const [logsOpen, setLogsOpen] = useState(false);
  const [logsClient, setLogsClient] = useState<{
    id?: string;
    name?: string;
  } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<
    'dashboard' | 'workflow' | 'mcp' | 'activity' | 'settings'
  >('dashboard');

  // Mock functions for client control
  const handleClientStart = (clientId: string) => {
    console.log(`Starting client: ${clientId}`);
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, status: 'running' as const }
          : client
      )
    );
  };

  const handleClientStop = (clientId: string) => {
    console.log(`Stopping client: ${clientId}`);
    setClients(prev =>
      prev.map(client =>
        client.id === clientId ? { ...client, status: 'idle' as const } : client
      )
    );
  };

  const handleClientRestart = (clientId: string) => {
    console.log(`Restarting client: ${clientId}`);
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, status: 'running' as const, lastActivity: 'Just now' }
          : client
      )
    );
  };

  const handleEmergencyStop = (clientId: string) => {
    console.log(`Emergency stop for client: ${clientId}`);
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, status: 'error' as const }
          : client
      )
    );
  };

  const handleViewLogs = (clientId: string) => {
    const cl = clients.find(c => c.id === clientId);
    setLogsClient({ id: clientId, name: cl?.name });
    setLogsOpen(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isMeta = e.metaKey || e.ctrlKey;
      // Cmd/Ctrl+K: Command palette (reuse logs modal as placeholder if palette not present)
      if (isMeta && key === 'k') {
        e.preventDefault();
        // Open a placeholder command UI: focus search in logs modal
        setLogsClient(null);
        setLogsOpen(true);
        return;
      }
      // Alt+Shift+D: Toggle dark mode
      if (e.altKey && e.shiftKey && key === 'd') {
        e.preventDefault();
        setDarkMode(v => !v);
        return;
      }
      // Cmd/Ctrl+Shift+L: Start (play)
      if (isMeta && e.shiftKey && key === 'l') {
        e.preventDefault();
        const firstIdle = clients.find(c => c.status === 'idle');
        if (firstIdle) {
          setClients(prev =>
            prev.map(c =>
              c.id === firstIdle.id ? { ...c, status: 'running' as const } : c
            )
          );
        }
        return;
      }
      // Cmd/Ctrl+Shift+S: Stop
      if (isMeta && e.shiftKey && key === 's') {
        e.preventDefault();
        const firstRunning = clients.find(c => c.status === 'running');
        if (firstRunning) {
          setClients(prev =>
            prev.map(c =>
              c.id === firstRunning.id ? { ...c, status: 'idle' as const } : c
            )
          );
        }
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [clients]);

  return (
    <div
      className={`min-h-screen bg-bg-primary bg-cyber-grid bg-grid relative ${darkMode ? 'dark' : ''}`}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-bg-primary pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="cyberpunk-display mb-2">AuraOS Control Center</h1>
              <p className="cyberpunk-subtitle">
                Real-time system monitoring and control
              </p>
            </div>

            {/* View Navigation */}
            <div className="flex gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'workflow', label: 'Agents', icon: '🤖' },
                { id: 'mcp', label: 'MCP Tools', icon: '🔧' },
                { id: 'activity', label: 'Activity', icon: '📈' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === view.id
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-glow-blue-md'
                      : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary hover:text-text-primary'
                  }`}
                >
                  {view.icon} {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeView === 'dashboard' && (
          <>
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <GlassCard className="text-center" glowColor="green">
                <div className="cyberpunk-heading-1 text-2xl mb-2">
                  {systemStats.totalOperations}
                </div>
                <div className="cyberpunk-label">Total Operations</div>
              </GlassCard>

              <GlassCard className="text-center" glowColor="blue">
                <div className="cyberpunk-heading-1 text-2xl mb-2">
                  {systemStats.successRate}%
                </div>
                <div className="cyberpunk-label">Success Rate</div>
              </GlassCard>

              <GlassCard className="text-center" glowColor="purple">
                <div className="cyberpunk-heading-1 text-2xl mb-2">
                  {systemStats.activeClients}
                </div>
                <div className="cyberpunk-label">Active Clients</div>
              </GlassCard>

              <GlassCard className="text-center" glowColor="blue">
                <div className="cyberpunk-heading-1 text-2xl mb-2">
                  {systemStats.uptime}
                </div>
                <div className="cyberpunk-label">System Uptime</div>
              </GlassCard>
            </div>

            {/* Active Clients */}
            <div className="mb-8">
              <h2 className="cyberpunk-heading-1 mb-6">
                Active Clients & Agents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map(client => (
                  <ClientCard
                    key={client.id}
                    id={client.id}
                    name={client.name}
                    type={client.type}
                    status={client.status}
                    successCount={client.successCount}
                    errorCount={client.errorCount}
                    lastActivity={client.lastActivity}
                    progressPercent={
                      client.status === 'running'
                        ? Math.floor(Math.random() * 100)
                        : undefined
                    }
                    progressLabel={
                      client.status === 'running' ? 'Processing...' : undefined
                    }
                    onStart={() => handleClientStart(client.id)}
                    onStop={() => handleClientStop(client.id)}
                    onRestart={() => handleClientRestart(client.id)}
                    onEmergencyStop={() => handleEmergencyStop(client.id)}
                    onViewLogs={() => handleViewLogs(client.id)}
                  />
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <GlassCard
              title="Recent Activity"
              subtitle="Live system events"
              glowColor="blue"
            >
              <div className="space-y-3">
                {[
                  {
                    time: '14:32:15',
                    event: 'Telegram Bot processed 12 messages',
                    type: 'success',
                    icon: '✓',
                  },
                  {
                    time: '14:31:42',
                    event: 'Learning Brain completed training cycle',
                    type: 'info',
                    icon: '🧠',
                  },
                  {
                    time: '14:30:08',
                    event: 'MCP Tools connection timeout',
                    type: 'warning',
                    icon: '⚠️',
                  },
                  {
                    time: '14:28:33',
                    event: 'Autopilot System scheduled maintenance',
                    type: 'info',
                    icon: '🔧',
                  },
                  {
                    time: '14:27:19',
                    event: 'New workflow automation created',
                    type: 'success',
                    icon: '✨',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-glass-secondary rounded-md"
                  >
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="cyberpunk-body text-sm">
                        {activity.event}
                      </div>
                      <div className="cyberpunk-label text-xs text-text-secondary">
                        {activity.time}
                      </div>
                    </div>
                    <div
                      className={`
                      w-2 h-2 rounded-full
                      ${activity.type === 'success' ? 'bg-status-success' : ''}
                      ${activity.type === 'warning' ? 'bg-status-warning' : ''}
                      ${activity.type === 'info' ? 'bg-status-info' : ''}
                    `}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {activeView === 'workflow' && <AgentsWorkflowCanvas className="mb-8" />}

        {activeView === 'mcp' && <MCPToolsPanel className="mb-8" />}

        {activeView === 'activity' && <LiveActivityPanel className="mb-8" />}

        {activeView === 'settings' && <ThemeCustomization className="mb-8" />}
      </div>

      {/* Cyberpunk Scan Line Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50 animate-cyber-scan" />
      </div>

      {/* Live Logs Modal */}
      <LiveLogsModal
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        clientId={logsClient?.id}
        clientName={logsClient?.name}
      />
    </div>
  );
};
