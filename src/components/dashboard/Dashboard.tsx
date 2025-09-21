import React, { useState, useEffect } from 'react';
import { ClientCard } from './ClientCard';
import { GlassCard } from './GlassCard';

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
        client.id === clientId 
          ? { ...client, status: 'idle' as const }
          : client
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
    console.log(`Viewing logs for client: ${clientId}`);
    // This would open the Live Activity Modal
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-cyber-grid bg-grid relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-bg-primary pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="cyberpunk-display mb-2">
            AuraOS Control Center
          </h1>
          <p className="cyberpunk-subtitle">
            Real-time system monitoring and control
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="text-center" glowColor="green">
            <div className="cyberpunk-heading-1 text-2xl mb-2">
              {systemStats.totalOperations}
            </div>
            <div className="cyberpunk-label">
              Total Operations
            </div>
          </GlassCard>

          <GlassCard className="text-center" glowColor="blue">
            <div className="cyberpunk-heading-1 text-2xl mb-2">
              {systemStats.successRate}%
            </div>
            <div className="cyberpunk-label">
              Success Rate
            </div>
          </GlassCard>

          <GlassCard className="text-center" glowColor="purple">
            <div className="cyberpunk-heading-1 text-2xl mb-2">
              {systemStats.activeClients}
            </div>
            <div className="cyberpunk-label">
              Active Clients
            </div>
          </GlassCard>

          <GlassCard className="text-center" glowColor="blue">
            <div className="cyberpunk-heading-1 text-2xl mb-2">
              {systemStats.uptime}
            </div>
            <div className="cyberpunk-label">
              System Uptime
            </div>
          </GlassCard>
        </div>

        {/* Active Clients */}
        <div className="mb-8">
          <h2 className="cyberpunk-heading-1 mb-6">
            Active Clients & Agents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                id={client.id}
                name={client.name}
                type={client.type}
                status={client.status}
                successCount={client.successCount}
                errorCount={client.errorCount}
                lastActivity={client.lastActivity}
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
        <GlassCard title="Recent Activity" subtitle="Live system events" glowColor="blue">
          <div className="space-y-3">
            {[
              { time: '14:32:15', event: 'Telegram Bot processed 12 messages', type: 'success', icon: '✓' },
              { time: '14:31:42', event: 'Learning Brain completed training cycle', type: 'info', icon: '🧠' },
              { time: '14:30:08', event: 'MCP Tools connection timeout', type: 'warning', icon: '⚠️' },
              { time: '14:28:33', event: 'Autopilot System scheduled maintenance', type: 'info', icon: '🔧' },
              { time: '14:27:19', event: 'New workflow automation created', type: 'success', icon: '✨' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-glass-secondary rounded-md">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <div className="cyberpunk-body text-sm">
                    {activity.event}
                  </div>
                  <div className="cyberpunk-label text-xs text-text-secondary">
                    {activity.time}
                  </div>
                </div>
                <div className={`
                  w-2 h-2 rounded-full
                  ${activity.type === 'success' ? 'bg-status-success' : ''}
                  ${activity.type === 'warning' ? 'bg-status-warning' : ''}
                  ${activity.type === 'info' ? 'bg-status-info' : ''}
                `} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Cyberpunk Scan Line Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50 animate-cyber-scan" />
      </div>
    </div>
  );
};
