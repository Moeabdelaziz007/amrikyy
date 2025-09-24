/**
 * 🎛️ Main Automation Dashboard Component
 * Central hub for all automation tasks, Telegram integration, and system monitoring
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bot,
  MessageSquare,
  Zap,
  TrendingUp,
  Database,
  Settings,
  Pause,
  RotateCcw,
  XCircle,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import TelegramControlPanel from './TelegramControlPanel';
import AutopilotDashboard from './AutopilotDashboard';

interface AutomationTask {
  id: string;
  name: string;
  type: 'telegram' | 'autopilot' | 'system' | 'data';
  status: 'running' | 'completed' | 'failed' | 'pending' | 'paused';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  estimatedDuration: number;
  description: string;
  lastActivity: Date;
  successRate: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkActivity: number;
  activeConnections: number;
  uptime: number;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeTasks: number;
  successRate: number;
  averageExecutionTime: number;
  telegramMessages: number;
  autopilotWorkflows: number;
}

const MainAutomationDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkActivity: 0,
    activeConnections: 0,
    uptime: 0,
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    activeTasks: 0,
    successRate: 0,
    averageExecutionTime: 0,
    telegramMessages: 0,
    autopilotWorkflows: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const mockTasks: AutomationTask[] = [
        {
          id: '1',
          name: 'Telegram Auto-Reply System',
          type: 'telegram',
          status: 'running',
          progress: 85,
          priority: 'high',
          createdAt: new Date(Date.now() - 300000),
          estimatedDuration: 300,
          description: 'Automated response system for Telegram messages',
          lastActivity: new Date(),
          successRate: 92,
        },
        {
          id: '2',
          name: 'Data Backup Workflow',
          type: 'autopilot',
          status: 'completed',
          progress: 100,
          priority: 'medium',
          createdAt: new Date(Date.now() - 600000),
          estimatedDuration: 180,
          description: 'Automated backup of system data',
          lastActivity: new Date(Date.now() - 120000),
          successRate: 100,
        },
        {
          id: '3',
          name: 'System Optimization',
          type: 'system',
          status: 'running',
          progress: 60,
          priority: 'high',
          createdAt: new Date(Date.now() - 180000),
          estimatedDuration: 240,
          description: 'Real-time system performance optimization',
          lastActivity: new Date(),
          successRate: 88,
        },
        {
          id: '4',
          name: 'Security Scan',
          type: 'system',
          status: 'pending',
          progress: 0,
          priority: 'high',
          createdAt: new Date(Date.now() - 120000),
          estimatedDuration: 600,
          description: 'Comprehensive security vulnerability scan',
          lastActivity: new Date(Date.now() - 120000),
          successRate: 95,
        },
      ];

      const mockMetrics: SystemMetrics = {
        cpuUsage: 45 + Math.random() * 20,
        memoryUsage: 60 + Math.random() * 15,
        diskUsage: 35 + Math.random() * 10,
        networkActivity: 25 + Math.random() * 30,
        activeConnections: 12 + Math.floor(Math.random() * 8),
        uptime: Date.now() - 86400000, // 24 hours ago
      };

      const mockStats: DashboardStats = {
        totalTasks: mockTasks.length,
        completedTasks: mockTasks.filter(t => t.status === 'completed').length,
        failedTasks: mockTasks.filter(t => t.status === 'failed').length,
        activeTasks: mockTasks.filter(t => t.status === 'running').length,
        successRate: 89.5,
        averageExecutionTime: 180,
        telegramMessages: 127,
        autopilotWorkflows: 8,
      };

      setTasks(mockTasks);
      setMetrics(mockMetrics);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'telegram':
        return <MessageSquare className="w-4 h-4" />;
      case 'autopilot':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'data':
        return <Database className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`main-dashboard ${isExpanded ? 'expanded' : 'compact'} transition-all duration-500`}>
      {/* Dashboard Header */}
      <div className="dashboard-header glass-premium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Automation Hub</h1>
              <p className="text-sm text-gray-400">Central control for all automated systems</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRealTimeMode(!isRealTimeMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isRealTimeMode 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {isRealTimeMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {isRealTimeMode ? 'Live' : 'Paused'}
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl glass-premium hover-lift transition-all duration-300"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card glass-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="stat-card glass-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="stat-card glass-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.activeTasks}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="stat-card glass-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Telegram Messages</p>
                <p className="text-2xl font-bold text-white">{stats.telegramMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="metrics-section glass-premium">
          <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="metric-item">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">CPU Usage</span>
                <span className="text-sm font-medium text-white">{metrics.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Memory</span>
                <span className="text-sm font-medium text-white">{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Disk Space</span>
                <span className="text-sm font-medium text-white">{metrics.diskUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Network</span>
                <span className="text-sm font-medium text-white">{metrics.networkActivity.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.networkActivity}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Management */}
        <div className="tasks-section glass-premium">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Tasks</h3>
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="task-item glass-premium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div className="flex items-center gap-2">
                      {getTypeIcon(task.type)}
                      <span className="font-medium text-white">{task.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{task.progress}%</div>
                      <div className="text-xs text-gray-400">{task.successRate}% success</div>
                    </div>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-400">
                  {task.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Panels */}
        {isExpanded && (
          <div className="integration-panels">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Telegram Integration */}
              <div className="integration-panel glass-premium">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-white">Telegram Control</h3>
                </div>
                <TelegramControlPanel onExecute={(action) => console.log('Telegram action:', action)} />
              </div>
              
              {/* Autopilot Integration */}
              <div className="integration-panel glass-premium">
                <div className="flex items-center gap-3 mb-4">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">Autopilot Dashboard</h3>
                </div>
                <AutopilotDashboard onExecute={(action) => console.log('Autopilot action:', action)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainAutomationDashboard;
