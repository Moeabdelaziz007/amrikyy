// Task Automation Dashboard - React Component
import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Settings,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  description: string;
  type: string;
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'retrying';
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

interface TaskExecution {
  id: string;
  taskId: string;
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'retrying';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metrics: {
    executionTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  retryCount: number;
  maxRetries: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  error?: string;
  metrics: {
    totalNodes: number;
    executedNodes: number;
    executionTime: number;
  };
}

export default function TaskAutomationDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [executions, setExecutions] = useState<TaskExecution[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowExecutions, setWorkflowExecutions] = useState<
    WorkflowExecution[]
  >([]);
  const [selectedTab, setSelectedTab] = useState<
    'tasks' | 'workflows' | 'executions'
  >('tasks');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock data - في التطبيق الحقيقي ستأتي من API
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        name: 'Daily Report Generation',
        description: 'Generate daily analytics report',
        type: 'custom_function',
        status: 'completed',
        priority: 5,
        createdAt: '2024-12-20T09:00:00Z',
        updatedAt: '2024-12-20T09:15:00Z',
        createdBy: 'admin',
        tags: ['reporting', 'daily'],
      },
      {
        id: '2',
        name: 'Service Health Check',
        description: 'Monitor service health and send alerts',
        type: 'workflow_trigger',
        status: 'running',
        priority: 8,
        createdAt: '2024-12-20T08:00:00Z',
        updatedAt: '2024-12-20T10:30:00Z',
        createdBy: 'system',
        tags: ['monitoring', 'health-check'],
      },
      {
        id: '3',
        name: 'Data Backup',
        description: 'Backup critical data to cloud storage',
        type: 'file_operation',
        status: 'failed',
        priority: 7,
        createdAt: '2024-12-20T07:00:00Z',
        updatedAt: '2024-12-20T07:45:00Z',
        createdBy: 'admin',
        tags: ['backup', 'data'],
      },
    ];

    const mockExecutions: TaskExecution[] = [
      {
        id: 'exec1',
        taskId: '1',
        status: 'completed',
        startedAt: '2024-12-20T09:00:00Z',
        completedAt: '2024-12-20T09:15:00Z',
        metrics: {
          executionTime: 900000, // 15 minutes
          memoryUsage: 256,
          cpuUsage: 45,
        },
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: 'exec2',
        taskId: '2',
        status: 'running',
        startedAt: '2024-12-20T10:30:00Z',
        metrics: {
          executionTime: 1800000, // 30 minutes
          memoryUsage: 128,
          cpuUsage: 25,
        },
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: 'exec3',
        taskId: '3',
        status: 'failed',
        startedAt: '2024-12-20T07:00:00Z',
        completedAt: '2024-12-20T07:45:00Z',
        error: 'Connection timeout to cloud storage',
        metrics: {
          executionTime: 2700000, // 45 minutes
          memoryUsage: 512,
          cpuUsage: 80,
        },
        retryCount: 2,
        maxRetries: 3,
      },
    ];

    const mockWorkflows: Workflow[] = [
      {
        id: 'wf1',
        name: 'Service Health Monitoring',
        description: 'Monitor service health and send Telegram notifications',
        status: 'active',
        createdAt: '2024-12-19T10:00:00Z',
        updatedAt: '2024-12-20T08:00:00Z',
        createdBy: 'system',
      },
      {
        id: 'wf2',
        name: 'User Onboarding',
        description: 'Automated user onboarding process',
        status: 'active',
        createdAt: '2024-12-18T14:00:00Z',
        updatedAt: '2024-12-19T16:00:00Z',
        createdBy: 'admin',
      },
    ];

    const mockWorkflowExecutions: WorkflowExecution[] = [
      {
        id: 'wfexec1',
        workflowId: 'wf1',
        status: 'running',
        startedAt: '2024-12-20T10:30:00Z',
        metrics: {
          totalNodes: 5,
          executedNodes: 3,
          executionTime: 120000,
        },
      },
      {
        id: 'wfexec2',
        workflowId: 'wf2',
        status: 'completed',
        startedAt: '2024-12-20T09:00:00Z',
        completedAt: '2024-12-20T09:05:00Z',
        metrics: {
          totalNodes: 4,
          executedNodes: 4,
          executionTime: 300000,
        },
      },
    ];

    setTasks(mockTasks);
    setExecutions(mockExecutions);
    setWorkflows(mockWorkflows);
    setWorkflowExecutions(mockWorkflowExecutions);
    setIsLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'retrying':
        return <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'retrying':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 6) return 'bg-orange-100 text-orange-800';
    if (priority >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredExecutions = executions.filter(execution => {
    const matchesFilter = filter === 'all' || execution.status === filter;
    const task = tasks.find(t => t.id === execution.taskId);
    const matchesSearch =
      task &&
      (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesFilter = filter === 'all' || workflow.status === filter;
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Task Automation Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage your automated tasks and workflows
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Tasks
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tasks.filter(t => t.status === 'running').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {executions.filter(e => e.status === 'completed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Failed Tasks
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tasks.filter(t => t.status === 'failed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <RefreshCw className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Success Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(
                        (executions.filter(e => e.status === 'completed')
                          .length /
                          executions.length) *
                          100
                      )}
                      %
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setSelectedTab('workflows')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'workflows'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Workflows ({workflows.length})
              </button>
              <button
                onClick={() => setSelectedTab('executions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'executions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Executions ({executions.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'tasks' && (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {task.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                            >
                              {task.status}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                            >
                              Priority {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {task.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Square className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'workflows' && (
              <div className="space-y-4">
                {filteredWorkflows.map(workflow => (
                  <div
                    key={workflow.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {workflow.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {workflow.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}
                            >
                              {workflow.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created by {workflow.createdBy}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'executions' && (
              <div className="space-y-4">
                {filteredExecutions.map(execution => {
                  const task = tasks.find(t => t.id === execution.taskId);
                  return (
                    <div
                      key={execution.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {task?.name || `Execution ${execution.id}`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Started:{' '}
                              {execution.startedAt
                                ? new Date(execution.startedAt).toLocaleString()
                                : 'N/A'}
                              {execution.completedAt &&
                                ` • Completed: ${new Date(execution.completedAt).toLocaleString()}`}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}
                              >
                                {execution.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                Duration:{' '}
                                {Math.round(
                                  execution.metrics.executionTime / 1000
                                )}
                                s
                              </span>
                              {execution.retryCount > 0 && (
                                <span className="text-xs text-orange-600">
                                  Retries: {execution.retryCount}/
                                  {execution.maxRetries}
                                </span>
                              )}
                            </div>
                            {execution.error && (
                              <p className="text-xs text-red-600 mt-1">
                                {execution.error}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Square className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
