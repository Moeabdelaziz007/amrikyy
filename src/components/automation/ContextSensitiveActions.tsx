import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Brain, 
  Eye, 
  Ear, 
  Mic, 
  Camera, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  Settings, 
  Zap, 
  Target, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Save, 
  Download, 
  Upload, 
  Share, 
  Copy, 
  Search, 
  Filter, 
  List, 
  Grid, 
  Layers, 
  Globe, 
  Star, 
  Heart, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Database, 
  Server, 
  Cloud, 
  Wifi, 
  Bluetooth, 
  Battery, 
  Power, 
  Thermometer, 
  Gauge, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
  Flag, 
  Pin, 
  Home, 
  Building, 
  Car, 
  Plane, 
  Ship, 
  Train, 
  Bike, 
  Truck, 
  Bus, 
  Tent, 
  Umbrella, 
  Trees, 
  Flower, 
  Leaf, 
  Sprout, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Mouse, 
  Turtle, 
  Butterfly, 
  Ant, 
  Spider, 
  Ladybug, 
  Dragonfly, 
  Firefly, 
  Cricket, 
  Grasshopper, 
  Mantis, 
  Beetle, 
  Worm, 
  Snail, 
  Octopus, 
  Squid, 
  Jellyfish, 
  Starfish, 
  Crab, 
  Lobster, 
  Ship as Shrimp, 
  Penguin, 
  Owl, 
  Eagle, 
  Hawk, 
  Falcon, 
  Carrot as Parrot, 
  Crown as Crow,
  Bell
} from 'lucide-react';

interface Context {
  id: string;
  name: string;
  type: 'location' | 'time' | 'user' | 'device' | 'environment' | 'activity' | 'social' | 'preference';
  value: any;
  confidence: number;
  source: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

interface Action {
  id: string;
  name: string;
  description: string;
  type: 'automation' | 'notification' | 'suggestion' | 'preference' | 'security' | 'optimization';
  trigger: ActionTrigger;
  conditions: ActionCondition[];
  execution: ActionExecution;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'paused' | 'error';
  effectiveness: number;
  usageCount: number;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ActionTrigger {
  type: 'context' | 'schedule' | 'event' | 'manual' | 'ai';
  contexts: string[];
  schedule?: string;
  events?: string[];
  conditions: string[];
}

interface ActionCondition {
  id: string;
  type: 'context' | 'time' | 'location' | 'user' | 'device' | 'environment';
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in' | 'not';
  value: any;
  required: boolean;
}

interface ActionExecution {
  type: 'immediate' | 'delayed' | 'conditional' | 'batch';
  delay?: number;
  conditions?: string[];
  actions: ExecutionStep[];
  fallback?: ExecutionStep[];
}

interface ExecutionStep {
  id: string;
  type: 'api' | 'notification' | 'data' | 'system' | 'ui' | 'ai';
  name: string;
  parameters: Record<string, any>;
  order: number;
  timeout: number;
  retry: boolean;
  maxRetries: number;
}

interface ContextRule {
  id: string;
  name: string;
  description: string;
  contexts: string[];
  actions: string[];
  priority: number;
  isActive: boolean;
  effectiveness: number;
  usageCount: number;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ContextEvent {
  id: string;
  type: string;
  context: string;
  value: any;
  confidence: number;
  timestamp: Date;
  source: string;
  metadata: Record<string, any>;
  actions: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export const ContextSensitiveActions: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contexts' | 'actions' | 'rules' | 'events'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Mock data
  const [contexts] = useState<Context[]>([
    {
      id: '1',
      name: 'Current Location',
      type: 'location',
      value: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' },
      confidence: 95,
      source: 'GPS',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      metadata: { accuracy: 10, altitude: 52 }
    },
    {
      id: '2',
      name: 'Current Time',
      type: 'time',
      value: new Date(),
      confidence: 100,
      source: 'System Clock',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      metadata: { timezone: 'PST', workingHours: true }
    },
    {
      id: '3',
      name: 'User Activity',
      type: 'activity',
      value: 'working',
      confidence: 85,
      source: 'Activity Monitor',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      metadata: { app: 'VS Code', duration: 45 }
    }
  ]);

  const [actions] = useState<Action[]>([
    {
      id: '1',
      name: 'Auto-save Documents',
      description: 'Automatically save documents when user is away',
      type: 'automation',
      trigger: {
        type: 'context',
        contexts: ['2', '3'],
        conditions: ['time > 5 minutes', 'activity = away']
      },
      conditions: [
        {
          id: '1',
          type: 'time',
          operator: 'greater',
          value: 5,
          required: true
        },
        {
          id: '2',
          type: 'activity',
          operator: 'equals',
          value: 'away',
          required: true
        }
      ],
      execution: {
        type: 'immediate',
        actions: [
          {
            id: '1',
            type: 'system',
            name: 'Save Document',
            parameters: { action: 'save', target: 'current' },
            order: 1,
            timeout: 30,
            retry: true,
            maxRetries: 3
          }
        ]
      },
      priority: 'medium',
      status: 'active',
      effectiveness: 92,
      usageCount: 45,
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [rules] = useState<ContextRule[]>([
    {
      id: '1',
      name: 'Office Hours Rule',
      description: 'Apply office-specific actions during working hours',
      contexts: ['1', '2'],
      actions: ['1'],
      priority: 8,
      isActive: true,
      effectiveness: 88,
      usageCount: 120,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [events] = useState<ContextEvent[]>([
    {
      id: '1',
      type: 'location_change',
      context: '1',
      value: { lat: 37.7749, lng: -122.4194 },
      confidence: 95,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      source: 'GPS',
      metadata: { previous: { lat: 37.7849, lng: -122.4094 } },
      actions: ['1'],
      status: 'completed',
      result: { saved: true, documents: 3 }
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'device': return <Settings className="w-4 h-4" />;
      case 'environment': return <Globe className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'preference': return <Heart className="w-4 h-4" />;
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'suggestion': return <Target className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'optimization': return <TrendingUp className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'paused': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'pending': return 'text-blue-500';
      case 'processing': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="context-sensitive-actions">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading context-sensitive actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="context-sensitive-actions">
      <div className="actions-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>Context-Sensitive Actions</h1>
          </div>
          <div className="header-controls">
            <button className="action-button">
              <Plus className="button-icon" />
              Create Action
            </button>
            <button className="action-button">
              <Brain className="button-icon" />
              AI Analysis
            </button>
            <button className="action-button">
              <RefreshCw className="button-icon" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="actions-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 className="tab-icon" />
          Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'contexts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contexts')}
        >
          <Eye className="tab-icon" />
          Contexts
        </button>
        <button 
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <Zap className="tab-icon" />
          Actions
        </button>
        <button 
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Settings className="tab-icon" />
          Rules
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Activity className="tab-icon" />
          Events
        </button>
      </div>

      <div className="actions-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="dashboard-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <Eye className="metric-icon" />
                  <span className="metric-label">Active Contexts</span>
                </div>
                <div className="metric-value">{contexts.length}</div>
                <div className="metric-status">
                  {contexts.filter(c => c.confidence > 80).length} high confidence
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Zap className="metric-icon" />
                  <span className="metric-label">Active Actions</span>
                </div>
                <div className="metric-value">{actions.length}</div>
                <div className="metric-status">
                  {actions.filter(a => a.status === 'active').length} enabled
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Settings className="metric-icon" />
                  <span className="metric-label">Context Rules</span>
                </div>
                <div className="metric-value">{rules.length}</div>
                <div className="metric-status">
                  {rules.filter(r => r.isActive).length} active
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity className="metric-icon" />
                  <span className="metric-label">Recent Events</span>
                </div>
                <div className="metric-value">{events.length}</div>
                <div className="metric-status">
                  {events.filter(e => e.status === 'completed').length} completed
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contexts' && (
          <div className="contexts-tab">
            <div className="contexts-list">
              <h3>Current Contexts</h3>
              {contexts.map((context) => (
                <div key={context.id} className="context-item">
                  <div className="context-icon">
                    {getTypeIcon(context.type)}
                  </div>
                  <div className="context-info">
                    <div className="context-header">
                      <h4 className="context-name">{context.name}</h4>
                      <div className="context-badges">
                        <span className="type-badge">{context.type}</span>
                        <span className="confidence-badge">{context.confidence}% confidence</span>
                        <span className="source-badge">{context.source}</span>
                      </div>
                    </div>
                    <div className="context-details">
                      <div className="detail-row">
                        <span className="detail-label">Value:</span>
                        <span className="detail-value">
                          {typeof context.value === 'object' 
                            ? JSON.stringify(context.value) 
                            : context.value.toString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{context.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                    {Object.keys(context.metadata).length > 0 && (
                      <div className="context-metadata">
                        <h5>Metadata:</h5>
                        <div className="metadata-grid">
                          {Object.entries(context.metadata).map(([key, value]) => (
                            <div key={key} className="metadata-item">
                              <span className="metadata-key">{key}:</span>
                              <span className="metadata-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="context-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-tab">
            <div className="actions-list">
              <h3>Context-Sensitive Actions</h3>
              {actions.map((action) => (
                <div key={action.id} className="action-item">
                  <div className="action-icon">
                    {getTypeIcon(action.type)}
                  </div>
                  <div className="action-info">
                    <div className="action-header">
                      <h4 className="action-name">{action.name}</h4>
                      <div className="action-badges">
                        <span className={`status-badge ${getStatusColor(action.status)}`}>
                          {getStatusIcon(action.status)}
                          {action.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                        <span className="type-badge">{action.type}</span>
                      </div>
                    </div>
                    <p className="action-description">{action.description}</p>
                    <div className="action-details">
                      <div className="detail-row">
                        <span className="detail-label">Trigger Type:</span>
                        <span className="detail-value">{action.trigger.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Contexts:</span>
                        <span className="detail-value">{action.trigger.contexts.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Conditions:</span>
                        <span className="detail-value">{action.conditions.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Effectiveness:</span>
                        <span className="detail-value">{action.effectiveness}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Usage Count:</span>
                        <span className="detail-value">{action.usageCount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">
                          {action.lastUsed ? action.lastUsed.toLocaleString() : 'Never'}
                        </span>
                      </div>
                    </div>
                    <div className="action-execution">
                      <h5>Execution Steps:</h5>
                      {action.execution.actions.map((step) => (
                        <div key={step.id} className="execution-step">
                          <div className="step-header">
                            <span className="step-name">{step.name}</span>
                            <span className="step-type">{step.type}</span>
                          </div>
                          <div className="step-details">
                            <span>Order: {step.order}</span>
                            <span>Timeout: {step.timeout}s</span>
                            <span>Retry: {step.retry ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="action-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Test
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="rules-tab">
            <div className="rules-list">
              <h3>Context Rules</h3>
              {rules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-icon">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="rule-info">
                    <div className="rule-header">
                      <h4 className="rule-name">{rule.name}</h4>
                      <div className="rule-badges">
                        <span className="priority-badge">Priority: {rule.priority}</span>
                        {rule.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="rule-description">{rule.description}</p>
                    <div className="rule-details">
                      <div className="detail-row">
                        <span className="detail-label">Contexts:</span>
                        <span className="detail-value">{rule.contexts.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Actions:</span>
                        <span className="detail-value">{rule.actions.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Effectiveness:</span>
                        <span className="detail-value">{rule.effectiveness}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Usage Count:</span>
                        <span className="detail-value">{rule.usageCount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">
                          {rule.lastUsed ? rule.lastUsed.toLocaleString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rule-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-tab">
            <div className="events-list">
              <h3>Recent Events</h3>
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-icon">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="event-info">
                    <div className="event-header">
                      <h4 className="event-type">{event.type}</h4>
                      <div className="event-badges">
                        <span className={`status-badge ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          {event.status}
                        </span>
                        <span className="confidence-badge">{event.confidence}% confidence</span>
                        <span className="source-badge">{event.source}</span>
                      </div>
                    </div>
                    <div className="event-details">
                      <div className="detail-row">
                        <span className="detail-label">Context:</span>
                        <span className="detail-value">{event.context}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Value:</span>
                        <span className="detail-value">
                          {typeof event.value === 'object' 
                            ? JSON.stringify(event.value) 
                            : event.value.toString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Timestamp:</span>
                        <span className="detail-value">{event.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Actions:</span>
                        <span className="detail-value">{event.actions.length}</span>
                      </div>
                    </div>
                    {event.result && (
                      <div className="event-result">
                        <h5>Result:</h5>
                        <div className="result-content">
                          {typeof event.result === 'object' 
                            ? JSON.stringify(event.result, null, 2) 
                            : event.result.toString()}
                        </div>
                      </div>
                    )}
                    {event.error && (
                      <div className="event-error">
                        <h5>Error:</h5>
                        <div className="error-content">{event.error}</div>
                      </div>
                    )}
                  </div>
                  <div className="event-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="action-button">
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
