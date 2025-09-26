import React, { useState, useEffect, useCallback } from 'react';

// Real-time sync types
interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete' | 'sync';
  service: string;
  resource: string;
  timestamp: Date;
  data?: any;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

interface SyncRule {
  id: string;
  name: string;
  source: string;
  target: string;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  filters?: {
    resourceType?: string;
    conditions?: Record<string, any>;
  };
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'webhook';
  endpoint: string;
  authType: 'none' | 'basic' | 'oauth' | 'api-key';
  isConnected: boolean;
  lastSync?: Date;
  recordCount: number;
}

// Mock data sources
const mockDataSources: DataSource[] = [
  {
    id: 'firestore-users',
    name: 'Firestore Users',
    type: 'database',
    endpoint: 'firestore://users',
    authType: 'oauth',
    isConnected: true,
    lastSync: new Date(),
    recordCount: 1250
  },
  {
    id: 'github-repos',
    name: 'GitHub Repositories',
    type: 'api',
    endpoint: 'https://api.github.com/user/repos',
    authType: 'oauth',
    isConnected: true,
    lastSync: new Date(Date.now() - 300000), // 5 minutes ago
    recordCount: 45
  },
  {
    id: 'slack-messages',
    name: 'Slack Messages',
    type: 'api',
    endpoint: 'https://slack.com/api/conversations.history',
    authType: 'oauth',
    isConnected: false,
    recordCount: 0
  },
  {
    id: 'google-drive-files',
    name: 'Google Drive Files',
    type: 'api',
    endpoint: 'https://www.googleapis.com/drive/v3/files',
    authType: 'oauth',
    isConnected: true,
    lastSync: new Date(Date.now() - 600000), // 10 minutes ago
    recordCount: 320
  }
];

// Mock sync rules
const mockSyncRules: SyncRule[] = [
  {
    id: 'github-to-tasks',
    name: 'GitHub Issues → Tasks',
    source: 'github-repos',
    target: 'firestore-users',
    frequency: 'hourly',
    filters: {
      resourceType: 'issues',
      conditions: { state: 'open' }
    },
    isActive: true,
    lastRun: new Date(Date.now() - 1800000), // 30 minutes ago
    nextRun: new Date(Date.now() + 1800000) // 30 minutes from now
  },
  {
    id: 'drive-to-files',
    name: 'Google Drive → File Manager',
    source: 'google-drive-files',
    target: 'firestore-users',
    frequency: 'realtime',
    filters: {
      resourceType: 'files'
    },
    isActive: true,
    lastRun: new Date(Date.now() - 30000), // 30 seconds ago
    nextRun: new Date(Date.now() + 10000) // 10 seconds from now
  },
  {
    id: 'slack-to-messages',
    name: 'Slack Messages → Notifications',
    source: 'slack-messages',
    target: 'firestore-users',
    frequency: 'realtime',
    filters: {
      resourceType: 'messages'
    },
    isActive: false,
    lastRun: new Date(Date.now() - 3600000), // 1 hour ago
    nextRun: new Date(Date.now() + 3600000) // 1 hour from now
  }
];

export const RealtimeSyncManager: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [syncRules, setSyncRules] = useState<SyncRule[]>(mockSyncRules);
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  // WebSocket connection simulation
  useEffect(() => {
    if (isRealtimeEnabled) {
      // Simulate real-time sync events
      const interval = setInterval(() => {
        const newEvent: SyncEvent = {
          id: `sync-${Date.now()}`,
          type: 'sync',
          service: mockDataSources[Math.floor(Math.random() * mockDataSources.length)].name,
          resource: 'data',
          timestamp: new Date(),
          status: Math.random() > 0.1 ? 'success' : 'error',
          errorMessage: Math.random() > 0.9 ? 'Connection timeout' : undefined
        };
        
        setSyncEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
        
        // Update data source sync times
        setDataSources(prev => prev.map(ds => ({
          ...ds,
          lastSync: Math.random() > 0.7 ? new Date() : ds.lastSync
        })));
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isRealtimeEnabled]);

  // Toggle real-time sync
  const toggleRealtimeSync = useCallback(() => {
    setIsRealtimeEnabled(prev => !prev);
    setConnectionStatus(prev => prev === 'connected' ? 'disconnected' : 'connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  }, []);

  // Run sync rule manually
  const runSyncRule = useCallback(async (ruleId: string) => {
    const rule = syncRules.find(r => r.id === ruleId);
    if (!rule) return;
    
    // Update rule status
    setSyncRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { ...r, lastRun: new Date(), nextRun: new Date(Date.now() + 3600000) }
        : r
    ));
    
    // Add sync event
    const syncEvent: SyncEvent = {
      id: `manual-sync-${Date.now()}`,
      type: 'sync',
      service: rule.source,
      resource: rule.target,
      timestamp: new Date(),
      status: 'success'
    };
    
    setSyncEvents(prev => [syncEvent, ...prev.slice(0, 49)]);
  }, [syncRules]);

  // Toggle sync rule
  const toggleSyncRule = useCallback((ruleId: string) => {
    setSyncRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  }, []);

  // Get connection status color
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get frequency display
  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case 'realtime': return '🔄 Real-time';
      case 'hourly': return '⏰ Hourly';
      case 'daily': return '📅 Daily';
      case 'weekly': return '📆 Weekly';
      default: return frequency;
    }
  };

  return (
    <div className="realtime-sync-manager">
      <div className="sync-header">
        <h2>🔄 Real-time Synchronization</h2>
        <p>Manage data synchronization across all connected services</p>
        
        <div className="sync-controls">
          <div className="connection-status">
            <div 
              className={`status-indicator ${connectionStatus}`}
            />
            <span className="status-text">
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'connecting' && 'Connecting...'}
              {connectionStatus === 'disconnected' && 'Disconnected'}
            </span>
          </div>
          
          <button 
            className={`realtime-toggle ${isRealtimeEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleRealtimeSync}
          >
            {isRealtimeEnabled ? '🔄 Real-time ON' : '⏸️ Real-time OFF'}
          </button>
        </div>
      </div>

      <div className="sync-content">
        {/* Data Sources */}
        <div className="sync-section">
          <h3>📊 Data Sources</h3>
          <div className="data-sources-grid">
            {dataSources.map(source => (
              <div key={source.id} className={`data-source-card ${source.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="source-header">
                  <div className="source-icon">
                    {source.type === 'api' && '🌐'}
                    {source.type === 'database' && '🗄️'}
                    {source.type === 'file' && '📁'}
                    {source.type === 'webhook' && '🔗'}
                  </div>
                  <div className="source-info">
                    <h4>{source.name}</h4>
                    <p>{source.endpoint}</p>
                  </div>
                  <div className="source-status">
                    <div className={`status-dot ${source.isConnected ? 'connected' : 'disconnected'}`} />
                  </div>
                </div>
                
                <div className="source-stats">
                  <div className="stat">
                    <span className="stat-label">Records:</span>
                    <span className="stat-value">{source.recordCount.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Last Sync:</span>
                    <span className="stat-value">
                      {source.lastSync ? source.lastSync.toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Rules */}
        <div className="sync-section">
          <h3>⚙️ Sync Rules</h3>
          <div className="sync-rules-list">
            {syncRules.map(rule => (
              <div key={rule.id} className={`sync-rule-card ${rule.isActive ? 'active' : 'inactive'}`}>
                <div className="rule-header">
                  <div className="rule-info">
                    <h4>{rule.name}</h4>
                    <p>{rule.source} → {rule.target}</p>
                  </div>
                  <div className="rule-controls">
                    <button 
                      className={`toggle-btn ${rule.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleSyncRule(rule.id)}
                    >
                      {rule.isActive ? '✅' : '⏸️'}
                    </button>
                    <button 
                      className="run-btn"
                      onClick={() => runSyncRule(rule.id)}
                      disabled={!rule.isActive}
                    >
                      ▶️ Run
                    </button>
                  </div>
                </div>
                
                <div className="rule-details">
                  <div className="rule-frequency">
                    {getFrequencyDisplay(rule.frequency)}
                  </div>
                  <div className="rule-timing">
                    <div className="timing-item">
                      <span className="timing-label">Last Run:</span>
                      <span className="timing-value">
                        {rule.lastRun ? rule.lastRun.toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="timing-item">
                      <span className="timing-label">Next Run:</span>
                      <span className="timing-value">
                        {rule.nextRun ? rule.nextRun.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Events */}
        <div className="sync-section">
          <h3>📋 Recent Sync Events</h3>
          <div className="sync-events-list">
            {syncEvents.length === 0 ? (
              <div className="no-events">
                <p>No sync events yet. Enable real-time sync to see activity.</p>
              </div>
            ) : (
              syncEvents.map(event => (
                <div key={event.id} className={`sync-event ${event.status}`}>
                  <div className="event-header">
                    <div className="event-type">
                      {event.type === 'create' && '➕'}
                      {event.type === 'update' && '🔄'}
                      {event.type === 'delete' && '❌'}
                      {event.type === 'sync' && '🔄'}
                    </div>
                    <div className="event-info">
                      <span className="event-service">{event.service}</span>
                      <span className="event-resource">{event.resource}</span>
                    </div>
                    <div className="event-time">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                    <div className={`event-status ${event.status}`}>
                      {event.status === 'success' && '✅'}
                      {event.status === 'error' && '❌'}
                      {event.status === 'pending' && '⏳'}
                    </div>
                  </div>
                  {event.errorMessage && (
                    <div className="event-error">
                      Error: {event.errorMessage}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeSyncManager;
