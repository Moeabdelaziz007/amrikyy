// Advanced Automation Tasks Page - Professional Template Better than n8n
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Square, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle,
  Activity, Settings, Plus, Filter, Search, Zap, Bot, Code, Database,
  Workflow, Globe, Shield, TrendingUp, Users, BarChart3, Smartphone,
  Download, Upload, Copy, Edit, Trash2, Eye, PlayCircle, PauseCircle,
  ChevronDown, ChevronRight, Star, Heart, Share2, MessageSquare,
  Calendar, Timer, Target, Lightbulb, Cpu, Network, Cloud, Lock
} from 'lucide-react';

// Import our custom automation components
import WorkspaceManager from '@/components/automation/WorkspaceManager';
import MCPToolsIntegration from '@/components/automation/MCPToolsIntegration';
import AIWorkflowOptimizer from '@/components/automation/AIWorkflowOptimizer';
import WorkflowBuilder from '@/components/automation/WorkflowBuilder';
import RealTimeMonitor from '@/components/automation/RealTimeMonitor';
import WebSocketDemo from '@/components/automation/WebSocketDemo';
y

// Import API service and WebSocket
import { automationApi } from '@/services/automation-api';
import { useAutomationWebSocket } from '@/services/websocket-client';

// Enhanced interfaces for professional automation
interface AutomationTask {
  id: string;
  name: string;
  description: string;
  type: 'workflow' | 'trigger' | 'action' | 'condition' | 'ai' | 'mcp';
  category: 'social_media' | 'email' | 'data' | 'ai' | 'integration' | 'notification';
  status: 'active' | 'inactive' | 'draft' | 'error' | 'running' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  workspace: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  avgDuration: number;
  aiOptimized: boolean;
  mcpEnabled: boolean;
  complexity: 'simple' | 'intermediate' | 'advanced';
  dependencies: string[];
  variables: Record<string, any>;
  logs: TaskLog[];
  metrics: TaskMetrics;
}

interface TaskLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

interface TaskMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTime: number;
  lastExecutionTime: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  taskCount: number;
  isDefault: boolean;
  isPublic: boolean;
  permissions: string[];
  tags: string[];
  collaborators: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'owner' | 'admin' | 'editor' | 'viewer';
    joinedAt: string;
  }>;
  settings: {
    autoSave: boolean;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    layout: 'grid' | 'list' | 'kanban';
    sortBy: 'name' | 'date' | 'priority' | 'status';
    groupBy: 'none' | 'status' | 'priority' | 'category';
  };
  createdAt: string;
  updatedAt: string;
}

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'data' | 'database' | 'web' | 'ai' | 'automation' | 'integration';
  icon: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'updating';
  capabilities: string[];
  usage: number;
  lastUsed: string;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
    uptime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
  settings: {
    autoUpdate: boolean;
    notifications: boolean;
    logging: boolean;
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
    security: {
      encryption: boolean;
      authentication: boolean;
      authorization: boolean;
    };
  };
  dependencies: string[];
  integrations: Array<{
    id: string;
    name: string;
    type: 'api' | 'webhook' | 'database' | 'file' | 'message';
    status: 'connected' | 'disconnected' | 'error';
    config: Record<string, any>;
    lastSync: string;
  }>;
  documentation: string;
  examples: Array<{
    id: string;
    name: string;
    description: string;
    code: string;
    language: string;
    complexity: 'simple' | 'intermediate' | 'advanced';
    successRate: number;
    performance: {
      executionTime: number;
      resourceUsage: number;
      accuracy: number;
    };
  }>;
  isOfficial: boolean;
  isVerified: boolean;
  rating: number;
  downloads: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AIAssistant {
  id: string;
  name: string;
  description: string;
  model: string;
  capabilities: string[];
  status: 'active' | 'inactive';
  usage: number;
  accuracy: number;
}

export default function AutomationTasksPage() {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([]);
  const [aiAssistants, setAiAssistants] = useState<AIAssistant[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'tasks' | 'workflows' | 'mcp' | 'ai' | 'analytics' | 'builder' | 'monitor' | 'workspace' | 'websocket'>('dashboard');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null);
  
  // API Data State
  const [apiTasks, setApiTasks] = useState<AutomationTask[]>([]);
  const [apiWorkspaces, setApiWorkspaces] = useState<Workspace[]>([]);
  const [apiMcpTools, setApiMcpTools] = useState<MCPTool[]>([]);
  const [apiExecutions, setApiExecutions] = useState<TaskExecution[]>([]);
  const [apiSuggestions, setApiSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [apiHealth, setApiHealth] = useState<SystemHealth | null>(null);
  const [apiAnalytics, setApiAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // WebSocket connection for real-time updates
  const {
    isConnected: wsConnected,
    connectionError: wsError,
    subscribe: wsSubscribe,
    requestData: wsRequestData
  } = useAutomationWebSocket(
    'ws://localhost:3001',
    selectedWorkspace !== 'all' ? selectedWorkspace : undefined,
    {
      onTaskUpdate: (data) => {
        console.log('📡 Real-time task update:', data);
        setApiTasks(prev => prev.map(task => 
          task.id === data.id ? { ...task, ...data } : task
        ));
      },
      onExecutionUpdate: (data) => {
        console.log('📡 Real-time execution update:', data);
        setApiExecutions(prev => prev.map(exec => 
          exec.id === data.id ? { ...exec, ...data } : exec
        ));
      },
      onWorkspaceUpdate: (data) => {
        console.log('📡 Real-time workspace update:', data);
        setApiWorkspaces(prev => prev.map(ws => 
          ws.id === data.id ? { ...ws, ...data } : ws
        ));
      },
      onSystemHealth: (data) => {
        console.log('📡 Real-time system health update:', data);
        setApiHealth(data);
      },
      onAlert: (data) => {
        console.log('📡 Real-time alert:', data);
        // Handle alerts (show notifications, update UI, etc.)
      },
      onNotification: (data) => {
        console.log('📡 Real-time notification:', data);
        // Handle notifications
      },
      onConnect: () => {
        console.log('🔌 WebSocket connected - subscribing to updates');
        // Subscribe to relevant updates
        wsSubscribe(['task_update', 'execution_update', 'workspace_update', 'system_health', 'alert']);
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected');
      }
    }
  );

  // API Data Loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load data from API in parallel
        const [
          workspacesResponse,
          tasksResponse,
          mcpToolsResponse,
          executionsResponse,
          suggestionsResponse,
          healthResponse,
          analyticsResponse
        ] = await Promise.allSettled([
          automationApi.getWorkspaces(),
          automationApi.getTasks(),
          automationApi.getMcpTools(),
          automationApi.getTaskExecutions(),
          automationApi.getWorkflowSuggestions(),
          automationApi.getSystemHealth(),
          automationApi.getAnalytics()
        ]);

        // Handle workspaces
        if (workspacesResponse.status === 'fulfilled') {
          setApiWorkspaces(workspacesResponse.value.data || []);
        }

        // Handle tasks
        if (tasksResponse.status === 'fulfilled') {
          setApiTasks(tasksResponse.value.data || []);
        }

        // Handle MCP tools
        if (mcpToolsResponse.status === 'fulfilled') {
          setApiMcpTools(mcpToolsResponse.value.data || []);
        }

        // Handle executions
        if (executionsResponse.status === 'fulfilled') {
          setApiExecutions(executionsResponse.value.data || []);
        }

        // Handle suggestions
        if (suggestionsResponse.status === 'fulfilled') {
          setApiSuggestions(suggestionsResponse.value.data || []);
        }

        // Handle system health
        if (healthResponse.status === 'fulfilled') {
          setApiHealth(healthResponse.value.data || null);
        }

        // Handle analytics
        if (analyticsResponse.status === 'fulfilled') {
          setApiAnalytics(analyticsResponse.value.data || null);
        }

        // Check for any failures
        const failures = [
          workspacesResponse,
          tasksResponse,
          mcpToolsResponse,
          executionsResponse,
          suggestionsResponse,
          healthResponse,
          analyticsResponse
        ].filter(result => result.status === 'rejected');

        if (failures.length > 0) {
          console.warn('Some API calls failed:', failures);
          // Fall back to mock data if API fails
          initializeMockData();
        }

      } catch (error) {
        console.error('Failed to load data from API:', error);
        setError('Failed to load data from API');
        // Fall back to mock data
        initializeMockData();
      } finally {
        setIsLoading(false);
      }
    };

    const initializeMockData = () => {
      // Mock workspaces
      const mockWorkspaces: Workspace[] = [
        {
          id: 'ws-1',
          name: 'Social Media Automation',
          description: 'Automate social media posting and engagement',
          color: '#3B82F6',
          icon: '📱',
          taskCount: 12,
          isDefault: true,
          isPublic: false,
          permissions: ['read', 'write', 'execute'],
          tags: ['social', 'automation', 'marketing'],
          collaborators: [
            {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
              role: 'owner',
              joinedAt: '2024-01-01T00:00:00Z'
            }
          ],
          settings: {
            autoSave: true,
            notifications: true,
            theme: 'light',
            layout: 'grid',
            sortBy: 'name',
            groupBy: 'status'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 'ws-2',
          name: 'Email Marketing',
          description: 'Email campaigns and automation workflows',
          color: '#10B981',
          icon: '📧',
          taskCount: 8,
          isDefault: false,
          isPublic: true,
          permissions: ['read', 'write'],
          tags: ['email', 'marketing', 'campaigns'],
          collaborators: [
            {
              id: 'user-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
              role: 'admin',
              joinedAt: '2024-01-05T00:00:00Z'
            }
          ],
          settings: {
            autoSave: true,
            notifications: false,
            theme: 'dark',
            layout: 'list',
            sortBy: 'date',
            groupBy: 'priority'
          },
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-18T15:30:00Z'
        },
        {
          id: 'ws-3',
          name: 'AI Content Generation',
          description: 'AI-powered content creation and optimization',
          color: '#8B5CF6',
          icon: '🤖',
          taskCount: 15,
          isDefault: false,
          isPublic: false,
          permissions: ['read', 'write', 'execute'],
          tags: ['ai', 'content', 'generation'],
          collaborators: [
            {
              id: 'user-3',
              name: 'Mike Johnson',
              email: 'mike@example.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
              role: 'editor',
              joinedAt: '2024-01-10T00:00:00Z'
            }
          ],
          settings: {
            autoSave: false,
            notifications: true,
            theme: 'auto',
            layout: 'kanban',
            sortBy: 'priority',
            groupBy: 'category'
          },
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-19T09:15:00Z'
        }
      ];

      // Mock MCP tools
      const mockMcpTools: MCPTool[] = [
        {
          id: 'mcp-1',
          name: 'Cursor CLI Integration',
          description: 'Integrate with Cursor CLI for code automation',
          category: 'development',
          icon: '⌨️',
          version: '1.2.0',
          status: 'active',
          capabilities: ['code_generation', 'file_operations', 'git_integration'],
          usage: 95,
          lastUsed: '2024-01-20T10:30:00Z',
          performance: {
            avgResponseTime: 150,
            successRate: 0.98,
            errorRate: 0.02,
            uptime: 0.99,
            resourceUsage: { cpu: 25, memory: 128, storage: 256 }
          },
          settings: {
            autoUpdate: true,
            notifications: true,
            logging: true,
            rateLimit: 1000,
            timeout: 30000,
            retryAttempts: 3,
            security: { encryption: true, authentication: true, authorization: true }
          },
          dependencies: ['nodejs', 'git'],
          integrations: [
            {
              id: 'int-1',
              name: 'GitHub',
              type: 'api',
              status: 'connected',
              config: { token: '***' },
              lastSync: '2024-01-20T10:30:00Z'
            }
          ],
          documentation: 'https://docs.example.com/cursor-cli',
          examples: [
            {
              id: 'ex-1',
              name: 'Basic Code Generation',
              description: 'Generate code from natural language',
              code: 'cursor generate "create a React component"',
              language: 'javascript',
              complexity: 'simple',
              successRate: 0.95,
              performance: { executionTime: 2000, resourceUsage: 50, accuracy: 0.95 }
            }
          ],
          isOfficial: true,
          isVerified: true,
          rating: 4.8,
          downloads: 1250,
          author: {
            id: 'author-1',
            name: 'Cursor Team',
            avatar: 'https://cursor.sh/logo.png',
            verified: true
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
        },
        {
          id: 'mcp-2',
          name: 'Web Scraper',
          description: 'Advanced web scraping and data extraction',
          category: 'data',
          icon: '🕷️',
          version: '2.1.0',
          status: 'active',
          capabilities: ['web_scraping', 'data_extraction', 'content_parsing'],
          usage: 78,
          lastUsed: '2024-01-20T09:45:00Z',
          performance: {
            avgResponseTime: 500,
            successRate: 0.92,
            errorRate: 0.08,
            uptime: 0.98,
            resourceUsage: { cpu: 40, memory: 256, storage: 512 }
          },
          settings: {
            autoUpdate: true,
            notifications: false,
            logging: true,
            rateLimit: 100,
            timeout: 60000,
            retryAttempts: 2,
            security: { encryption: true, authentication: false, authorization: true }
          },
          dependencies: ['puppeteer', 'cheerio'],
          integrations: [],
          documentation: 'https://docs.example.com/web-scraper',
          examples: [],
          isOfficial: false,
          isVerified: true,
          rating: 4.5,
          downloads: 890,
          author: {
            id: 'author-2',
            name: 'Data Tools Inc',
            avatar: 'https://example.com/avatar.png',
            verified: true
          },
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-20T09:45:00Z'
        }
      ];

      // Mock AI assistants
      const mockAiAssistants: AIAssistant[] = [
        {
          id: 'ai-1',
          name: 'Content Optimizer',
          description: 'AI-powered content optimization and enhancement',
          model: 'GPT-4',
          capabilities: ['content_optimization', 'seo_analysis', 'readability_check'],
          status: 'active',
          usage: 89,
          accuracy: 94
        },
        {
          id: 'ai-2',
          name: 'Workflow Designer',
          description: 'Intelligent workflow design and optimization',
          model: 'Claude-3',
          capabilities: ['workflow_design', 'optimization', 'error_detection'],
          status: 'active',
          usage: 76,
          accuracy: 91
        }
      ];

      // Mock tasks
      const mockTasks: AutomationTask[] = [
        {
          id: 'task-1',
          name: 'Smart Social Media Scheduler',
          description: 'AI-powered social media content scheduling with optimal timing',
          type: 'workflow',
          category: 'social_media',
          status: 'active',
          priority: 'high',
          workspace: 'ws-1',
          tags: ['social', 'ai', 'scheduling', 'optimization'],
          createdBy: 'admin',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T09:30:00Z',
          lastRun: '2024-01-20T09:00:00Z',
          nextRun: '2024-01-20T12:00:00Z',
          executionCount: 45,
          successRate: 96.7,
          avgDuration: 120,
          aiOptimized: true,
          mcpEnabled: true,
          complexity: 'advanced',
          dependencies: ['mcp-1', 'ai-1'],
          variables: { platforms: ['twitter', 'linkedin'], timezone: 'UTC' },
          logs: [],
          metrics: {
            totalRuns: 45,
            successfulRuns: 44,
            failedRuns: 1,
            avgExecutionTime: 120,
            lastExecutionTime: 115,
            resourceUsage: { cpu: 25, memory: 128, storage: 256 }
          }
        },
        {
          id: 'task-2',
          name: 'Email Campaign Automation',
          description: 'Automated email marketing campaigns with personalization',
          type: 'workflow',
          category: 'email',
          status: 'running',
          priority: 'medium',
          workspace: 'ws-2',
          tags: ['email', 'marketing', 'automation', 'personalization'],
          createdBy: 'admin',
          createdAt: '2024-01-10T14:00:00Z',
          updatedAt: '2024-01-20T10:15:00Z',
          lastRun: '2024-01-20T10:15:00Z',
          executionCount: 23,
          successRate: 91.3,
          avgDuration: 180,
          aiOptimized: true,
          mcpEnabled: false,
          complexity: 'intermediate',
          dependencies: ['ai-1'],
          variables: { template: 'welcome', segment: 'new_users' },
          logs: [],
          metrics: {
            totalRuns: 23,
            successfulRuns: 21,
            failedRuns: 2,
            avgExecutionTime: 180,
            lastExecutionTime: 175,
            resourceUsage: { cpu: 15, memory: 96, storage: 512 }
          }
        }
      ];

      setWorkspaces(mockWorkspaces);
      setMcpTools(mockMcpTools);
      setAiAssistants(mockAiAssistants);
      setTasks(mockTasks);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <PauseCircle className="w-5 h-5 text-yellow-500" />;
      case 'inactive':
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // API Action Handlers
  const handleCreateTask = useCallback(async (taskData: any) => {
    try {
      const response = await automationApi.createTask(taskData);
      if (response.success && response.data) {
        setApiTasks(prev => [response.data, ...prev]);
        // Update workspace task count
        setApiWorkspaces(prev => prev.map(ws => 
          ws.id === taskData.workspaceId 
            ? { ...ws, taskCount: ws.taskCount + 1 }
            : ws
        ));
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task');
    }
  }, []);

  const handleExecuteTask = useCallback(async (taskId: string, input?: any) => {
    try {
      const response = await automationApi.executeTask(taskId, { input });
      if (response.success && response.data) {
        setApiExecutions(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to execute task:', error);
      setError('Failed to execute task');
    }
  }, []);

  // Use API data when available, fall back to mock data
  const currentTasks = apiTasks.length > 0 ? apiTasks : tasks;
  const currentWorkspaces = apiWorkspaces.length > 0 ? apiWorkspaces : workspaces;
  const currentMcpTools = apiMcpTools.length > 0 ? apiMcpTools : mcpTools;

  const filteredTasks = currentTasks.filter(task => {
    const matchesWorkspace = selectedWorkspace === 'all' || task.workspace === selectedWorkspace;
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesWorkspace && matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Automation Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Automation Hub
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Professional automation platform with AI & MCP integration
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* WebSocket Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={wsConnected ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                  {wsConnected ? 'Live Updates' : 'Offline'}
                </span>
              </div>
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Automation
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Selector */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedWorkspace('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                selectedWorkspace === 'all'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>All Workspaces</span>
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </button>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => setSelectedWorkspace(workspace.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedWorkspace === workspace.id
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{
                  backgroundColor: selectedWorkspace === workspace.id ? workspace.color : undefined
                }}
              >
                <span className="text-lg">{workspace.icon}</span>
                <span>{workspace.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedWorkspace === workspace.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {workspace.taskCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'active' || t.status === 'running').length}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% from last week</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(tasks.reduce((acc, task) => acc + task.successRate, 0) / tasks.length || 0)}%
                </p>
                <p className="text-xs text-blue-600 mt-1">+3.2% improvement</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">MCP Tools</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mcpTools.filter(t => t.status === 'active').length}
                </p>
                <p className="text-xs text-purple-600 mt-1">All systems operational</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Network className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Assistants</p>
                <p className="text-3xl font-bold text-gray-900">
                  {aiAssistants.filter(a => a.status === 'active').length}
                </p>
                <p className="text-xs text-orange-600 mt-1">94% avg accuracy</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Bot className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'tasks', label: 'Tasks', icon: Activity },
                { id: 'workflows', label: 'Workflows', icon: Workflow },
                { id: 'workspace', label: 'Workspace', icon: Globe },
                { id: 'mcp', label: 'MCP Tools', icon: Code },
                { id: 'ai', label: 'AI Optimizer', icon: Bot },
                { id: 'builder', label: 'Workflow Builder', icon: Settings },
                { id: 'monitor', label: 'Real-Time Monitor', icon: Activity },
                { id: 'websocket', label: 'WebSocket Demo', icon: Network },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Filters */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search automations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="running">Running</option>
                  <option value="paused">Paused</option>
                  <option value="error">Error</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {selectedTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Create New Workflow</h3>
                    <p className="text-blue-100 mb-4">Build powerful automation workflows with our visual editor</p>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Start Building
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">AI-Powered Suggestions</h3>
                    <p className="text-green-100 mb-4">Get intelligent automation recommendations based on your usage</p>
                    <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      View Suggestions
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">MCP Integration</h3>
                    <p className="text-orange-100 mb-4">Connect with powerful MCP tools for enhanced automation</p>
                    <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Explore Tools
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.name}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {task.lastRun ? new Date(task.lastRun).toLocaleDateString() : 'Never'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.successRate.toFixed(1)}% success rate
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'tasks' && (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {task.aiOptimized && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                <Bot className="w-3 h-3 mr-1" />
                                AI Optimized
                              </span>
                            )}
                            {task.mcpEnabled && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <Code className="w-3 h-3 mr-1" />
                                MCP Enabled
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Executions: {task.executionCount}</span>
                            <span>Success Rate: {task.successRate.toFixed(1)}%</span>
                            <span>Avg Duration: {task.avgDuration}s</span>
                            <span>Complexity: {task.complexity}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {task.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <PlayCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                          <PauseCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'mcp' && (
              <MCPToolsIntegration
                tools={currentMcpTools}
                onToolInstall={(toolId) => automationApi.installMcpTool(toolId)}
                onToolUninstall={(toolId) => automationApi.uninstallMcpTool(toolId)}
                onToolConfigure={(toolId, settings) => automationApi.configureMcpTool(toolId, settings)}
                onToolExecute={(toolId, parameters) => automationApi.executeMcpTool(toolId, parameters)}
                onToolUpdate={(toolId) => automationApi.updateMcpTool(toolId)}
              />
            )}

            {selectedTab === 'ai' && (
              <AIWorkflowOptimizer
                suggestions={[]}
                optimizations={[]}
                patterns={[]}
                onApplySuggestion={(suggestionId) => console.log('Apply suggestion:', suggestionId)}
                onOptimizeWorkflow={(workflowId) => console.log('Optimize workflow:', workflowId)}
                onGenerateSuggestions={(workflowId) => console.log('Generate suggestions:', workflowId)}
                onAnalyzePatterns={() => console.log('Analyze patterns')}
              />
            )}

            {selectedTab === 'workspace' && (
              <WorkspaceManager
                workspaces={currentWorkspaces}
                tasks={currentTasks}
                onWorkspaceSelect={setSelectedWorkspace}
                onWorkspaceCreate={handleCreateWorkspace}
                onWorkspaceUpdate={(id, updates) => automationApi.updateWorkspace(id, updates)}
                onWorkspaceDelete={(id) => automationApi.deleteWorkspace(id)}
                onTaskMove={(taskId, from, to) => console.log('Move task:', taskId, from, to)}
                selectedWorkspace={selectedWorkspace}
              />
            )}

            {selectedTab === 'builder' && (
              <WorkflowBuilder
                workflow={undefined}
                onSave={(workflow) => console.log('Save workflow:', workflow)}
                onExecute={(workflow) => console.log('Execute workflow:', workflow)}
                onExport={(workflow, format) => console.log('Export workflow:', workflow, format)}
                onImport={(file) => console.log('Import workflow:', file)}
                templates={[]}
                onLoadTemplate={(templateId) => console.log('Load template:', templateId)}
              />
            )}

            {selectedTab === 'monitor' && (
              <RealTimeMonitor
                executions={apiExecutions}
                systemHealth={apiHealth || {
                  overall: 'healthy',
                  components: {
                    cpu: { id: 'cpu', name: 'CPU', value: 45, unit: '%', trend: 'stable', change: 2, threshold: { warning: 80, critical: 95 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] },
                    memory: { id: 'memory', name: 'Memory', value: 62, unit: '%', trend: 'up', change: 5, threshold: { warning: 85, critical: 95 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] },
                    disk: { id: 'disk', name: 'Disk', value: 38, unit: '%', trend: 'stable', change: 1, threshold: { warning: 80, critical: 90 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] },
                    network: { id: 'network', name: 'Network', value: 23, unit: '%', trend: 'down', change: -3, threshold: { warning: 70, critical: 85 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] },
                    database: { id: 'database', name: 'Database', value: 67, unit: '%', trend: 'up', change: 8, threshold: { warning: 80, critical: 95 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] },
                    queue: { id: 'queue', name: 'Queue', value: 12, unit: '%', trend: 'stable', change: 0, threshold: { warning: 70, critical: 90 }, status: 'healthy', timestamp: new Date().toISOString(), history: [] }
                  },
                  alerts: []
                }}
                metrics={[]}
                onExecutionControl={async (executionId, action) => {
                  try {
                    // Handle execution control actions
                    console.log('Control execution:', executionId, action);
                  } catch (error) {
                    console.error('Failed to control execution:', error);
                  }
                }}
                onAlertAction={async (alertId, action) => {
                  try {
                    await automationApi.resolveAlert(alertId, { action });
                  } catch (error) {
                    console.error('Failed to resolve alert:', error);
                  }
                }}
                onMetricUpdate={(metricId) => console.log('Update metric:', metricId)}
                onRefresh={() => console.log('Refresh data')}
              />
            )}

            {selectedTab === 'websocket' && (
              <WebSocketDemo workspaceId={selectedWorkspace !== 'all' ? selectedWorkspace : undefined} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
