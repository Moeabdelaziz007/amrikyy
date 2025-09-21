// Advanced Real-Time Monitoring and Analytics Dashboard
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, BarChart3, TrendingUp, TrendingDown, Clock, 
  CheckCircle, XCircle, AlertCircle, Play, Pause, Square,
  RefreshCw, Download, Upload, Settings, Eye, EyeOff,
  Zap, Bot, Database, Globe, Users, Server, Cpu, Memory,
  HardDrive, Network, Shield, Lock, Unlock, Filter,
  Search, Calendar, Timer, Target, Lightbulb, Star,
  Heart, Share2, MessageSquare, Bell, BellOff, Maximize2,
  Minimize2, ChevronDown, ChevronRight, ArrowUp, ArrowDown,
  Circle, Square as SquareIcon, Triangle, Hexagon
} from 'lucide-react';

interface MonitoringMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  history: Array<{
    timestamp: string;
    value: number;
  }>;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  progress: number;
  steps: ExecutionStep[];
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    networkIO: number;
    diskIO: number;
  };
  logs: ExecutionLog[];
  errors: ExecutionError[];
}

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  progress: number;
  input?: any;
  output?: any;
  error?: string;
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  data?: any;
}

interface ExecutionError {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    cpu: MonitoringMetric;
    memory: MonitoringMetric;
    disk: MonitoringMetric;
    network: MonitoringMetric;
    database: MonitoringMetric;
    queue: MonitoringMetric;
  };
  alerts: SystemAlert[];
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
  actions: string[];
}

interface RealTimeMonitorProps {
  executions: WorkflowExecution[];
  systemHealth: SystemHealth;
  metrics: MonitoringMetric[];
  onExecutionControl: (executionId: string, action: 'pause' | 'resume' | 'stop') => void;
  onAlertAction: (alertId: string, action: string) => void;
  onMetricUpdate: (metricId: string) => void;
  onRefresh: () => void;
}

export default function RealTimeMonitor({
  executions,
  systemHealth,
  metrics,
  onExecutionControl,
  onAlertAction,
  onMetricUpdate,
  onRefresh
}: RealTimeMonitorProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'executions' | 'metrics' | 'logs' | 'alerts'>('overview');
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MonitoringMetric | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedExecutions, setExpandedExecutions] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        onRefresh();
        setLastRefresh(new Date());
      }, refreshInterval);
    } else {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, onRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Circle className="w-4 h-4 text-blue-500" />;
      case 'warning':
        return <Triangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <SquareIcon className="w-4 h-4 text-red-500" />;
      case 'critical':
        return <Hexagon className="w-4 h-4 text-red-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const filteredExecutions = executions.filter(execution => {
    const matchesStatus = filterStatus === 'all' || execution.status === filterStatus;
    const matchesSearch = execution.workflowName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredAlerts = systemHealth.alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.type === filterSeverity;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const toggleExecutionExpansion = useCallback((executionId: string) => {
    setExpandedExecutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(executionId)) {
        newSet.delete(executionId);
      } else {
        newSet.add(executionId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className={`bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Real-Time Monitor</h1>
                <p className="text-sm text-gray-600">
                  Live system monitoring and workflow execution tracking
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {autoRefresh ? 'Auto-refresh' : 'Manual'}
                </span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {autoRefresh ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1000}>1s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
              </select>
            </div>

            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${systemHealth.overall === 'healthy' ? 'bg-green-500' : systemHealth.overall === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                System Status: <span className="capitalize">{systemHealth.overall}</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'executions', label: 'Executions', icon: Activity },
            { id: 'metrics', label: 'Metrics', icon: TrendingUp },
            { id: 'logs', label: 'Logs', icon: MessageSquare },
            { id: 'alerts', label: 'Alerts', icon: AlertCircle }
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

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(systemHealth.components).map(([key, metric]) => (
                <div key={key} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {key === 'cpu' && <Cpu className="w-6 h-6 text-blue-600" />}
                      {key === 'memory' && <Memory className="w-6 h-6 text-green-600" />}
                      {key === 'disk' && <HardDrive className="w-6 h-6 text-purple-600" />}
                      {key === 'network' && <Network className="w-6 h-6 text-orange-600" />}
                      {key === 'database' && <Database className="w-6 h-6 text-indigo-600" />}
                      {key === 'queue' && <Zap className="w-6 h-6 text-yellow-600" />}
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{key}</h3>
                        <p className="text-sm text-gray-600">{metric.unit}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHealthColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.status === 'critical' ? 'bg-red-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Executions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Executions</h3>
              <div className="space-y-4">
                {executions.filter(e => e.status === 'running').slice(0, 5).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(execution.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{execution.workflowName}</h4>
                        <p className="text-sm text-gray-600">
                          Started {new Date(execution.startedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{execution.progress}%</p>
                        <div className="w-20 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onExecutionControl(execution.id, 'pause')}
                          className="p-1 text-gray-400 hover:text-yellow-600"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onExecutionControl(execution.id, 'stop')}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'executions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search executions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Executions List */}
            <div className="space-y-4">
              {filteredExecutions.map((execution) => (
                <div key={execution.id} className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(execution.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{execution.workflowName}</h3>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(execution.startedAt).toLocaleString()}
                            {execution.completedAt && (
                              <span> • Completed: {new Date(execution.completedAt).toLocaleString()}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                        {execution.duration && (
                          <span className="text-sm text-gray-600">
                            Duration: {formatDuration(execution.duration)}
                          </span>
                        )}
                        <button
                          onClick={() => toggleExecutionExpansion(execution.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {expandedExecutions.has(execution.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{execution.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            execution.status === 'completed' ? 'bg-green-500' :
                            execution.status === 'failed' ? 'bg-red-500' :
                            execution.status === 'running' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${execution.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Execution Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {execution.status === 'running' && (
                          <>
                            <button
                              onClick={() => onExecutionControl(execution.id, 'pause')}
                              className="inline-flex items-center px-3 py-1 border border-yellow-300 text-yellow-700 text-sm rounded hover:bg-yellow-50"
                            >
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </button>
                            <button
                              onClick={() => onExecutionControl(execution.id, 'stop')}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50"
                            >
                              <Square className="w-3 h-3 mr-1" />
                              Stop
                            </button>
                          </>
                        )}
                        {execution.status === 'paused' && (
                          <button
                            onClick={() => onExecutionControl(execution.id, 'resume')}
                            className="inline-flex items-center px-3 py-1 border border-green-300 text-green-700 text-sm rounded hover:bg-green-50"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Resume
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Cpu className="w-4 h-4" />
                          <span>{execution.metrics.cpuUsage}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Memory className="w-4 h-4" />
                          <span>{formatBytes(execution.metrics.memoryUsage)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Network className="w-4 h-4" />
                          <span>{formatBytes(execution.metrics.networkIO)}/s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedExecutions.has(execution.id) && (
                    <div className="border-t border-gray-200 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Steps */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Execution Steps</h4>
                          <div className="space-y-2">
                            {execution.steps.map((step, index) => (
                              <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                <div className="flex-shrink-0">
                                  {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                  {step.status === 'running' && <Activity className="w-4 h-4 text-blue-500 animate-pulse" />}
                                  {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                                  {step.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{step.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {step.duration && `Duration: ${formatDuration(step.duration)}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">{step.progress}%</p>
                                  <div className="w-16 bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="bg-blue-600 h-1 rounded-full"
                                      style={{ width: `${step.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Logs */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Recent Logs</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {execution.logs.slice(-10).map((log) => (
                              <div key={log.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                                <div className="flex-shrink-0 mt-0.5">
                                  {log.level === 'info' && <Circle className="w-3 h-3 text-blue-500" />}
                                  {log.level === 'warning' && <Triangle className="w-3 h-3 text-yellow-500" />}
                                  {log.level === 'error' && <SquareIcon className="w-3 h-3 text-red-500" />}
                                  {log.level === 'debug' && <Hexagon className="w-3 h-3 text-gray-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-900">{log.message}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(log.timestamp).toLocaleTimeString()} • {log.source}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHealthColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                    <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">Change</span>
                    <span className={`font-medium ${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.status === 'critical' ? 'bg-red-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.threshold.critical) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Warning: {metric.threshold.warning}</span>
                    <span>Critical: {metric.threshold.critical}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Filters */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Severity</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            alert.type === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                            alert.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' :
                            alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {alert.type}
                          </span>
                          {alert.resolved && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Source: {alert.source}</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        {!alert.resolved && (
                          <div className="flex space-x-2">
                            {alert.actions.map((action) => (
                              <button
                                key={action}
                                onClick={() => onAlertAction(alert.id, action)}
                                className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
