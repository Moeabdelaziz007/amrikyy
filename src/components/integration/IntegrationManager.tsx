import React, { useState, useEffect, useCallback } from 'react';

// API Integration Types
interface APIConnection {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'websocket' | 'oauth';
  baseUrl: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: Date;
  config: {
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
  };
}

interface ExternalService {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'social' | 'storage' | 'communication' | 'analytics';
  apiConnection: APIConnection;
  features: string[];
  isConnected: boolean;
}

interface SyncStatus {
  serviceId: string;
  lastSync: Date;
  status: 'success' | 'error' | 'pending';
  recordsSynced: number;
  errorMessage?: string;
}

// Mock external services
const mockServices: ExternalService[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud storage and file management',
    icon: '📁',
    category: 'storage',
    apiConnection: {
      id: 'google-drive-api',
      name: 'Google Drive API',
      type: 'oauth',
      baseUrl: 'https://www.googleapis.com/drive/v3',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'Bearer {token}',
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        retries: 3
      }
    },
    features: ['File upload', 'File download', 'Folder management', 'Search files'],
    isConnected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and collaboration',
    icon: '💬',
    category: 'communication',
    apiConnection: {
      id: 'slack-api',
      name: 'Slack API',
      type: 'rest',
      baseUrl: 'https://slack.com/api',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'Bearer {token}',
          'Content-Type': 'application/json'
        },
        timeout: 5000,
        retries: 2
      }
    },
    features: ['Send messages', 'Create channels', 'File sharing', 'User management'],
    isConnected: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository and project management',
    icon: '🐙',
    category: 'productivity',
    apiConnection: {
      id: 'github-api',
      name: 'GitHub API',
      type: 'rest',
      baseUrl: 'https://api.github.com',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'token {token}',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 8000,
        retries: 3
      }
    },
    features: ['Repository management', 'Issue tracking', 'Pull requests', 'Code search'],
    isConnected: false
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Social media and microblogging',
    icon: '🐦',
    category: 'social',
    apiConnection: {
      id: 'twitter-api',
      name: 'Twitter API v2',
      type: 'oauth',
      baseUrl: 'https://api.twitter.com/2',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'Bearer {token}',
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        retries: 2
      }
    },
    features: ['Post tweets', 'Read timeline', 'User management', 'Analytics'],
    isConnected: false
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace for notes and docs',
    icon: '📝',
    category: 'productivity',
    apiConnection: {
      id: 'notion-api',
      name: 'Notion API',
      type: 'rest',
      baseUrl: 'https://api.notion.com/v1',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'Bearer {token}',
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        timeout: 15000,
        retries: 3
      }
    },
    features: ['Create pages', 'Database management', 'Block operations', 'Search content'],
    isConnected: false
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Project management and task organization',
    icon: '📋',
    category: 'productivity',
    apiConnection: {
      id: 'trello-api',
      name: 'Trello API',
      type: 'rest',
      baseUrl: 'https://api.trello.com/1',
      status: 'disconnected',
      config: {
        headers: {
          'Authorization': 'OAuth {token}',
          'Content-Type': 'application/json'
        },
        timeout: 8000,
        retries: 2
      }
    },
    features: ['Board management', 'Card operations', 'List management', 'Member management'],
    isConnected: false
  }
];

export const IntegrationManager: React.FC = () => {
  const [services, setServices] = useState<ExternalService[]>(mockServices);
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<ExternalService | null>(null);
  const [connectionModal, setConnectionModal] = useState(false);

  // Test API connection
  const testConnection = useCallback(async (service: ExternalService) => {
    setIsLoading(true);
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedServices = services.map(s => 
        s.id === service.id 
          ? { 
              ...s, 
              isConnected: true, 
              apiConnection: { 
                ...s.apiConnection, 
                status: 'connected',
                lastSync: new Date()
              }
            }
          : s
      );
      
      setServices(updatedServices);
      
      // Add sync status
      const newSyncStatus: SyncStatus = {
        serviceId: service.id,
        lastSync: new Date(),
        status: 'success',
        recordsSynced: Math.floor(Math.random() * 100)
      };
      
      setSyncStatus(prev => [...prev.filter(s => s.serviceId !== service.id), newSyncStatus]);
      
    } catch (error) {
      console.error('Connection test failed:', error);
      
      const updatedServices = services.map(s => 
        s.id === service.id 
          ? { 
              ...s, 
              apiConnection: { 
                ...s.apiConnection, 
                status: 'error'
              }
            }
          : s
      );
      
      setServices(updatedServices);
    } finally {
      setIsLoading(false);
    }
  }, [services]);

  // Disconnect service
  const disconnectService = useCallback((serviceId: string) => {
    const updatedServices = services.map(s => 
      s.id === serviceId 
        ? { 
            ...s, 
            isConnected: false, 
            apiConnection: { 
              ...s.apiConnection, 
              status: 'disconnected'
            }
          }
        : s
    );
    
    setServices(updatedServices);
    setSyncStatus(prev => prev.filter(s => s.serviceId !== serviceId));
  }, [services]);

  // Sync all connected services
  const syncAllServices = useCallback(async () => {
    const connectedServices = services.filter(s => s.isConnected);
    
    for (const service of connectedServices) {
      try {
        // Simulate sync
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newSyncStatus: SyncStatus = {
          serviceId: service.id,
          lastSync: new Date(),
          status: 'success',
          recordsSynced: Math.floor(Math.random() * 50)
        };
        
        setSyncStatus(prev => [...prev.filter(s => s.serviceId !== service.id), newSyncStatus]);
      } catch (error) {
        const errorSyncStatus: SyncStatus = {
          serviceId: service.id,
          lastSync: new Date(),
          status: 'error',
          recordsSynced: 0,
          errorMessage: 'Sync failed'
        };
        
        setSyncStatus(prev => [...prev.filter(s => s.serviceId !== service.id), errorSyncStatus]);
      }
    }
  }, [services]);

  // Get service by category
  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  // Get sync status for service
  const getSyncStatus = (serviceId: string) => {
    return syncStatus.find(status => status.serviceId === serviceId);
  };

  const categories = ['productivity', 'social', 'storage', 'communication', 'analytics'];

  return (
    <div className="integration-manager">
      <div className="integration-header">
        <h2>🔗 Integration & Connectivity</h2>
        <p>Connect external services and APIs to enhance your workflow</p>
        
        <div className="integration-stats">
          <div className="stat-card">
            <div className="stat-number">{services.filter(s => s.isConnected).length}</div>
            <div className="stat-label">Connected</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{services.length}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{syncStatus.filter(s => s.status === 'success').length}</div>
            <div className="stat-label">Synced</div>
          </div>
        </div>
      </div>

      <div className="integration-actions">
        <button 
          className="sync-all-btn"
          onClick={syncAllServices}
          disabled={services.filter(s => s.isConnected).length === 0}
        >
          🔄 Sync All Services
        </button>
        <button 
          className="add-service-btn"
          onClick={() => setConnectionModal(true)}
        >
          ➕ Add Custom Service
        </button>
      </div>

      <div className="services-grid">
        {categories.map(category => {
          const categoryServices = getServicesByCategory(category);
          if (categoryServices.length === 0) return null;
          
          return (
            <div key={category} className="service-category">
              <h3 className="category-title">
                {category === 'productivity' && '📊 Productivity'}
                {category === 'social' && '📱 Social Media'}
                {category === 'storage' && '☁️ Cloud Storage'}
                {category === 'communication' && '💬 Communication'}
                {category === 'analytics' && '📈 Analytics'}
              </h3>
              
              <div className="services-list">
                {categoryServices.map(service => {
                  const sync = getSyncStatus(service.id);
                  
                  return (
                    <div key={service.id} className={`service-card ${service.isConnected ? 'connected' : 'disconnected'}`}>
                      <div className="service-header">
                        <div className="service-icon">{service.icon}</div>
                        <div className="service-info">
                          <h4>{service.name}</h4>
                          <p>{service.description}</p>
                        </div>
                        <div className="service-status">
                          <div className={`status-indicator ${service.apiConnection.status}`}>
                            {service.apiConnection.status === 'connected' && '🟢'}
                            {service.apiConnection.status === 'disconnected' && '⚪'}
                            {service.apiConnection.status === 'error' && '🔴'}
                            {service.apiConnection.status === 'connecting' && '🟡'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="service-features">
                        {service.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                      
                      {sync && (
                        <div className="sync-info">
                          <div className="sync-status">
                            Last sync: {sync.lastSync.toLocaleString()}
                          </div>
                          <div className="sync-records">
                            Records synced: {sync.recordsSynced}
                          </div>
                        </div>
                      )}
                      
                      <div className="service-actions">
                        {!service.isConnected ? (
                          <button 
                            className="connect-btn"
                            onClick={() => testConnection(service)}
                            disabled={isLoading}
                          >
                            {isLoading ? '🔄 Connecting...' : '🔗 Connect'}
                          </button>
                        ) : (
                          <div className="connected-actions">
                            <button 
                              className="sync-btn"
                              onClick={() => testConnection(service)}
                            >
                              🔄 Sync
                            </button>
                            <button 
                              className="disconnect-btn"
                              onClick={() => disconnectService(service.id)}
                            >
                              ❌ Disconnect
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Modal */}
      {connectionModal && (
        <div className="modal-overlay" onClick={() => setConnectionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Service</h3>
              <button className="close-btn" onClick={() => setConnectionModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Custom service integration coming soon!</p>
              <p>For now, you can connect to the pre-configured services above.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager;
