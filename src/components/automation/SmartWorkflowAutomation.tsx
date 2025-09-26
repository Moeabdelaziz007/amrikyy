import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Plus, 
  Minus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Download, 
  Upload, 
  Save, 
  Trash2, 
  Copy, 
  Share, 
  Eye, 
  EyeOff, 
  Edit, 
  Clock, 
  Calendar, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Layers, 
  Grid, 
  Navigation, 
  Compass, 
  Globe, 
  Star, 
  Sparkles, 
  Hexagon, 
  Circle, 
  Square, 
  Triangle, 
  Diamond, 
  Heart, 
  Brain, 
  Microscope, 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Calculator, 
  Code, 
  Terminal, 
  Server, 
  HardDrive, 
  MemoryStick, 
  Cpu, 
  Wifi, 
  Bluetooth, 
  Radio, 
  Signal, 
  Network, 
  Cloud, 
  Sun, 
  Moon, 
  Thermometer, 
  Gauge, 
  Battery, 
  Power, 
  Lock, 
  Unlock, 
  Shield, 
  Key, 
  Database, 
  Search, 
  Filter, 
  List, 
  Grid as GridIcon, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
  Flag, 
  Pin, 
  MapPin, 
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
  Crown as Crow
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'communication' | 'data' | 'system' | 'custom';
  status: 'active' | 'inactive' | 'paused' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  schedule: WorkflowSchedule;
  statistics: WorkflowStatistics;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted: Date | null;
  nextExecution: Date | null;
  isTemplate: boolean;
  tags: string[];
}

interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'condition' | 'manual' | 'webhook' | 'api';
  name: string;
  description: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

interface WorkflowAction {
  id: string;
  type: 'notification' | 'email' | 'data' | 'system' | 'api' | 'custom';
  name: string;
  description: string;
  parameters: Record<string, any>;
  order: number;
  isActive: boolean;
  timeout: number;
  retryCount: number;
  maxRetries: number;
}

interface WorkflowCondition {
  id: string;
  type: 'if' | 'else' | 'while' | 'switch' | 'try' | 'catch';
  name: string;
  description: string;
  expression: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

interface WorkflowSchedule {
  type: 'once' | 'recurring' | 'cron' | 'event-driven';
  startDate: Date;
  endDate: Date | null;
  interval: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  cronExpression: string;
  timezone: string;
  isActive: boolean;
}

interface WorkflowStatistics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: number;
  successRate: number;
  errorRate: number;
  totalRuntime: number;
  averageRuntime: number;
  peakRuntime: number;
  minRuntime: number;
  maxRuntime: number;
  executionsToday: number;
  executionsThisWeek: number;
  executionsThisMonth: number;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  startTime: Date;
  endTime: Date | null;
  duration: number;
  trigger: string;
  actions: ExecutionAction[];
  logs: ExecutionLog[];
  error: string | null;
  result: any;
}

interface ExecutionAction {
  id: string;
  actionId: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: Date;
  endTime: Date | null;
  duration: number;
  result: any;
  error: string | null;
}

interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data: any;
  actionId: string | null;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  schedule: WorkflowSchedule;
  isPublic: boolean;
  downloads: number;
  rating: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SmartWorkflowAutomation: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'executions' | 'analytics' | 'settings'>('workflows');
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Mock data - in production, this would come from automation APIs
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Daily Report Automation',
      description: 'Automatically generate and send daily reports',
      category: 'productivity',
      status: 'active',
      priority: 'high',
      triggers: [
        {
          id: '1',
          type: 'schedule',
          name: 'Daily at 9 AM',
          description: 'Trigger every day at 9:00 AM',
          parameters: { time: '09:00', timezone: 'UTC' },
          isActive: true
        }
      ],
      actions: [
        {
          id: '1',
          type: 'data',
          name: 'Generate Report',
          description: 'Generate daily report from data sources',
          parameters: { source: 'database', format: 'pdf' },
          order: 1,
          isActive: true,
          timeout: 300,
          retryCount: 0,
          maxRetries: 3
        },
        {
          id: '2',
          type: 'email',
          name: 'Send Report',
          description: 'Send report to stakeholders',
          parameters: { recipients: ['team@company.com'], subject: 'Daily Report' },
          order: 2,
          isActive: true,
          timeout: 60,
          retryCount: 0,
          maxRetries: 3
        }
      ],
      conditions: [],
      schedule: {
        type: 'recurring',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: null,
        interval: 1,
        unit: 'days',
        cronExpression: '0 9 * * *',
        timezone: 'UTC',
        isActive: true
      },
      statistics: {
        totalExecutions: 156,
        successfulExecutions: 152,
        failedExecutions: 4,
        averageExecutionTime: 45,
        lastExecutionTime: 120,
        successRate: 97.4,
        errorRate: 2.6,
        totalRuntime: 7020,
        averageRuntime: 45,
        peakRuntime: 180,
        minRuntime: 30,
        maxRuntime: 180,
        executionsToday: 1,
        executionsThisWeek: 7,
        executionsThisMonth: 30
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextExecution: new Date(Date.now() + 22 * 60 * 60 * 1000),
      isTemplate: false,
      tags: ['reporting', 'daily', 'automation']
    },
    {
      id: '2',
      name: 'Data Backup Workflow',
      description: 'Automated data backup and verification',
      category: 'system',
      status: 'active',
      priority: 'critical',
      triggers: [
        {
          id: '2',
          type: 'schedule',
          name: 'Weekly Backup',
          description: 'Trigger every Sunday at 2 AM',
          parameters: { time: '02:00', day: 'sunday' },
          isActive: true
        }
      ],
      actions: [
        {
          id: '3',
          type: 'system',
          name: 'Backup Data',
          description: 'Create backup of critical data',
          parameters: { source: '/data', destination: '/backup' },
          order: 1,
          isActive: true,
          timeout: 3600,
          retryCount: 0,
          maxRetries: 2
        },
        {
          id: '4',
          type: 'system',
          name: 'Verify Backup',
          description: 'Verify backup integrity',
          parameters: { checksum: true, compression: 'gzip' },
          order: 2,
          isActive: true,
          timeout: 1800,
          retryCount: 0,
          maxRetries: 2
        }
      ],
      conditions: [],
      schedule: {
        type: 'recurring',
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        endDate: null,
        interval: 1,
        unit: 'weeks',
        cronExpression: '0 2 * * 0',
        timezone: 'UTC',
        isActive: true
      },
      statistics: {
        totalExecutions: 8,
        successfulExecutions: 8,
        failedExecutions: 0,
        averageExecutionTime: 1800,
        lastExecutionTime: 1650,
        successRate: 100,
        errorRate: 0,
        totalRuntime: 14400,
        averageRuntime: 1800,
        peakRuntime: 2100,
        minRuntime: 1500,
        maxRuntime: 2100,
        executionsToday: 0,
        executionsThisWeek: 1,
        executionsThisMonth: 4
      },
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastExecuted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextExecution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isTemplate: false,
      tags: ['backup', 'system', 'critical']
    }
  ]);

  const [templates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'Email Marketing Campaign',
      description: 'Automated email marketing workflow template',
      category: 'communication',
      tags: ['email', 'marketing', 'campaign'],
      triggers: [],
      actions: [],
      conditions: [],
      schedule: {
        type: 'once',
        startDate: new Date(),
        endDate: null,
        interval: 1,
        unit: 'days',
        cronExpression: '',
        timezone: 'UTC',
        isActive: false
      },
      isPublic: true,
      downloads: 1250,
      rating: 4.8,
      author: 'Marketing Team',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Customer Onboarding',
      description: 'Automated customer onboarding process',
      category: 'productivity',
      tags: ['onboarding', 'customer', 'process'],
      triggers: [],
      actions: [],
      conditions: [],
      schedule: {
        type: 'once',
        startDate: new Date(),
        endDate: null,
        interval: 1,
        unit: 'days',
        cronExpression: '',
        timezone: 'UTC',
        isActive: false
      },
      isPublic: true,
      downloads: 890,
      rating: 4.6,
      author: 'Customer Success',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [executions] = useState<WorkflowExecution[]>([
    {
      id: '1',
      workflowId: '1',
      status: 'completed',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000),
      duration: 120,
      trigger: 'Daily at 9 AM',
      actions: [
        {
          id: '1',
          actionId: '1',
          name: 'Generate Report',
          status: 'completed',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000),
          duration: 90,
          result: { reportId: 'RPT-001', size: '2.5MB' },
          error: null
        },
        {
          id: '2',
          actionId: '2',
          name: 'Send Report',
          status: 'completed',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000),
          endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000),
          duration: 30,
          result: { emailId: 'EMAIL-001', recipients: 5 },
          error: null
        }
      ],
      logs: [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          level: 'info',
          message: 'Workflow execution started',
          data: { trigger: 'Daily at 9 AM' },
          actionId: null
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000),
          level: 'info',
          message: 'Report generated successfully',
          data: { reportId: 'RPT-001' },
          actionId: '1'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000),
          level: 'info',
          message: 'Workflow execution completed',
          data: { status: 'success' },
          actionId: null
        }
      ],
      error: null,
      result: { status: 'success', reportId: 'RPT-001' }
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Target className="w-4 h-4" />;
      case 'communication': return <Globe className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'system': return <Server className="w-4 h-4" />;
      case 'custom': return <Code className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'paused': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'running': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'cancelled': return 'text-gray-500';
      case 'timeout': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'running': return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'timeout': return <Clock className="w-4 h-4 text-orange-500" />;
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

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const createWorkflow = () => {
    console.log('Creating new workflow...');
  };

  const createTemplate = () => {
    console.log('Creating new template...');
  };

  const runWorkflow = (workflowId: string) => {
    console.log('Running workflow:', workflowId);
  };

  const pauseWorkflow = (workflowId: string) => {
    console.log('Pausing workflow:', workflowId);
  };

  const resumeWorkflow = (workflowId: string) => {
    console.log('Resuming workflow:', workflowId);
  };

  const stopWorkflow = (workflowId: string) => {
    console.log('Stopping workflow:', workflowId);
  };

  if (loading) {
    return (
      <div className="smart-workflow-automation">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading smart workflow automation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-workflow-automation">
      <div className="automation-header">
        <div className="header-content">
          <div className="header-title">
            <Zap className="header-icon" />
            <h1>Smart Workflow Automation</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createWorkflow}>
              <Plus className="button-icon" />
              Create Workflow
            </button>
            <button className="action-button" onClick={createTemplate}>
              <Layers className="button-icon" />
              Create Template
            </button>
            <button className="action-button">
              <Upload className="button-icon" />
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="automation-tabs">
        <button 
          className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          <Zap className="tab-icon" />
          Workflows
        </button>
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Layers className="tab-icon" />
          Templates
        </button>
        <button 
          className={`tab ${activeTab === 'executions' ? 'active' : ''}`}
          onClick={() => setActiveTab('executions')}
        >
          <Activity className="tab-icon" />
          Executions
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="automation-content">
        {activeTab === 'workflows' && (
          <div className="workflows-tab">
            <div className="workflows-list">
              <h3>Workflows</h3>
              {workflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  className={`workflow-item ${selectedWorkflow === workflow.id ? 'selected' : ''}`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <div className="workflow-icon">
                    {getCategoryIcon(workflow.category)}
                  </div>
                  <div className="workflow-info">
                    <div className="workflow-header">
                      <h4 className="workflow-name">{workflow.name}</h4>
                      <div className="workflow-badges">
                        <span className={`status-badge ${getStatusColor(workflow.status)}`}>
                          {getStatusIcon(workflow.status)}
                          {workflow.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(workflow.priority)}`}>
                          {workflow.priority}
                        </span>
                        <span className="category-badge">{workflow.category}</span>
                      </div>
                    </div>
                    <p className="workflow-description">{workflow.description}</p>
                    <div className="workflow-details">
                      <div className="detail-row">
                        <span className="detail-label">Triggers:</span>
                        <span className="detail-value">{workflow.triggers.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Actions:</span>
                        <span className="detail-value">{workflow.actions.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Success Rate:</span>
                        <span className="detail-value">{workflow.statistics.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Total Executions:</span>
                        <span className="detail-value">{workflow.statistics.totalExecutions}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Executed:</span>
                        <span className="detail-value">
                          {workflow.lastExecuted ? workflow.lastExecuted.toLocaleString() : 'Never'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Next Execution:</span>
                        <span className="detail-value">
                          {workflow.nextExecution ? workflow.nextExecution.toLocaleString() : 'Not scheduled'}
                        </span>
                      </div>
                    </div>
                    <div className="workflow-tags">
                      {workflow.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="workflow-actions">
                    <button 
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        runWorkflow(workflow.id);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Run
                    </button>
                    {workflow.status === 'active' ? (
                      <button 
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          pauseWorkflow(workflow.id);
                        }}
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    ) : (
                      <button 
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resumeWorkflow(workflow.id);
                        }}
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </button>
                    )}
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-tab">
            <div className="templates-grid">
              <h3>Workflow Templates</h3>
              {templates.map((template) => (
                <div key={template.id} className="template-item">
                  <div className="template-icon">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="template-info">
                    <div className="template-header">
                      <h4 className="template-name">{template.name}</h4>
                      <div className="template-badges">
                        <span className="category-badge">{template.category}</span>
                        {template.isPublic && (
                          <span className="public-badge">
                            <Globe className="w-3 h-3" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="template-description">{template.description}</p>
                    <div className="template-details">
                      <div className="detail-row">
                        <span className="detail-label">Author:</span>
                        <span className="detail-value">{template.author}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Downloads:</span>
                        <span className="detail-value">{template.downloads.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Rating:</span>
                        <span className="detail-value">{template.rating}/5.0</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Updated:</span>
                        <span className="detail-value">{template.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="template-tags">
                      {template.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="template-actions">
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executions' && (
          <div className="executions-tab">
            <div className="executions-list">
              <h3>Recent Executions</h3>
              {executions.map((execution) => (
                <div key={execution.id} className="execution-item">
                  <div className="execution-icon">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="execution-info">
                    <div className="execution-header">
                      <h4 className="execution-workflow">Workflow Execution</h4>
                      <div className="execution-badges">
                        <span className={`status-badge ${getStatusColor(execution.status)}`}>
                          {getStatusIcon(execution.status)}
                          {execution.status}
                        </span>
                        <span className="duration-badge">{formatDuration(execution.duration)}</span>
                      </div>
                    </div>
                    <div className="execution-details">
                      <div className="detail-row">
                        <span className="detail-label">Trigger:</span>
                        <span className="detail-value">{execution.trigger}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Start Time:</span>
                        <span className="detail-value">{execution.startTime.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">End Time:</span>
                        <span className="detail-value">
                          {execution.endTime ? execution.endTime.toLocaleString() : 'Running...'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Actions:</span>
                        <span className="detail-value">{execution.actions.length}</span>
                      </div>
                    </div>
                    <div className="execution-actions">
                      {execution.actions.map((action) => (
                        <div key={action.id} className="action-item">
                          <div className="action-header">
                            <span className="action-name">{action.name}</span>
                            <span className={`action-status ${getStatusColor(action.status)}`}>
                              {getStatusIcon(action.status)}
                              {action.status}
                            </span>
                          </div>
                          <div className="action-details">
                            <span>Duration: {formatDuration(action.duration)}</span>
                            {action.error && (
                              <span className="error-message">Error: {action.error}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="execution-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Logs
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-dashboard">
              <h3>Automation Analytics</h3>
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Zap className="metric-icon" />
                    <span className="metric-label">Total Workflows</span>
                  </div>
                  <div className="metric-value">{workflows.length}</div>
                  <div className="metric-status">
                    {workflows.filter(w => w.status === 'active').length} active
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Activity className="metric-icon" />
                    <span className="metric-label">Total Executions</span>
                  </div>
                  <div className="metric-value">
                    {workflows.reduce((sum, w) => sum + w.statistics.totalExecutions, 0)}
                  </div>
                  <div className="metric-status">All time</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <CheckCircle className="metric-icon" />
                    <span className="metric-label">Success Rate</span>
                  </div>
                  <div className="metric-value">
                    {workflows.length > 0 
                      ? (workflows.reduce((sum, w) => sum + w.statistics.successRate, 0) / workflows.length).toFixed(1)
                      : 0}%
                  </div>
                  <div className="metric-status">Average</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Clock className="metric-icon" />
                    <span className="metric-label">Avg Runtime</span>
                  </div>
                  <div className="metric-value">
                    {workflows.length > 0 
                      ? formatDuration(Math.round(workflows.reduce((sum, w) => sum + w.statistics.averageRuntime, 0) / workflows.length))
                      : '0s'}
                  </div>
                  <div className="metric-status">Per execution</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="automation-settings">
              <h3>Automation Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto-execution</h4>
                    <p>Automatically execute workflows when triggers are met</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable auto-execution" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Error Notifications</h4>
                    <p>Send notifications when workflows fail</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable error notifications" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Execution Logging</h4>
                    <p>Log all workflow executions for debugging</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable execution logging" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Performance Monitoring</h4>
                    <p>Monitor workflow performance and optimization</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable performance monitoring" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Resource Limits</h4>
                    <p>Set limits on resource usage per workflow</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" title="Enable resource limits" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Backup Workflows</h4>
                    <p>Automatically backup workflow configurations</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable workflow backup" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
