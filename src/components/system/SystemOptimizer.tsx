import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings, 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Search,
  Filter,
  BarChart3,
  Activity,
  Gauge,
  Thermometer,
  MemoryStick,
  Network,
  Database,
  Shield,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  category: 'cpu' | 'memory' | 'disk' | 'network' | 'battery' | 'temperature';
  current: number;
  max: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  history: number[];
}

interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'storage' | 'network' | 'security' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  impact: 'low' | 'medium' | 'high';
  lastRun: Date | null;
  nextRun: Date | null;
  autoRun: boolean;
}

interface DiagnosticResult {
  id: string;
  test: string;
  category: 'hardware' | 'software' | 'network' | 'security';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  recommendation: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface SystemSettings {
  autoOptimize: boolean;
  performanceMode: 'balanced' | 'performance' | 'power-saver';
  backgroundTasks: boolean;
  autoUpdate: boolean;
  telemetry: boolean;
  crashReporting: boolean;
  diagnosticMode: boolean;
  maintenanceSchedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  resourceLimits: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

export const SystemOptimizer: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'optimization' | 'diagnostics' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - in production, this would come from system APIs
  const [systemMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      category: 'cpu',
      current: 45,
      max: 100,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date(),
      history: [42, 45, 48, 43, 45, 47, 45]
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      category: 'memory',
      current: 67,
      max: 100,
      unit: '%',
      status: 'warning',
      trend: 'up',
      lastUpdated: new Date(),
      history: [60, 62, 65, 67, 69, 67, 67]
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      category: 'disk',
      current: 23,
      max: 100,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date(),
      history: [22, 23, 23, 24, 23, 23, 23]
    },
    {
      id: 'network',
      name: 'Network Activity',
      category: 'network',
      current: 89,
      max: 100,
      unit: '%',
      status: 'critical',
      trend: 'up',
      lastUpdated: new Date(),
      history: [75, 80, 85, 89, 92, 89, 89]
    },
    {
      id: 'battery',
      name: 'Battery Level',
      category: 'battery',
      current: 78,
      max: 100,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      lastUpdated: new Date(),
      history: [85, 82, 80, 78, 76, 78, 78]
    },
    {
      id: 'temperature',
      name: 'Temperature',
      category: 'temperature',
      current: 65,
      max: 85,
      unit: '°C',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date(),
      history: [63, 64, 65, 66, 65, 65, 65]
    }
  ]);

  const [optimizationTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Clear Cache Files',
      description: 'Remove temporary cache files to free up disk space',
      category: 'storage',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      estimatedTime: 5,
      impact: 'medium',
      lastRun: null,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      autoRun: true
    },
    {
      id: '2',
      name: 'Optimize Memory',
      description: 'Defragment memory and close unused processes',
      category: 'performance',
      priority: 'high',
      status: 'running',
      progress: 65,
      estimatedTime: 3,
      impact: 'high',
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextRun: null,
      autoRun: false
    },
    {
      id: '3',
      name: 'Update Security Patches',
      description: 'Install latest security updates and patches',
      category: 'security',
      priority: 'critical',
      status: 'completed',
      progress: 100,
      estimatedTime: 15,
      impact: 'high',
      lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      autoRun: true
    },
    {
      id: '4',
      name: 'Network Optimization',
      description: 'Optimize network settings for better performance',
      category: 'network',
      priority: 'high',
      status: 'failed',
      progress: 0,
      estimatedTime: 10,
      impact: 'medium',
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000),
      autoRun: true
    },
    {
      id: '5',
      name: 'System Maintenance',
      description: 'Perform routine system maintenance tasks',
      category: 'maintenance',
      priority: 'low',
      status: 'pending',
      progress: 0,
      estimatedTime: 20,
      impact: 'low',
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      autoRun: true
    }
  ]);

  const [diagnosticResults] = useState<DiagnosticResult[]>([
    {
      id: '1',
      test: 'CPU Performance',
      category: 'hardware',
      status: 'pass',
      message: 'CPU performance is within normal parameters',
      recommendation: 'No action required',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      severity: 'info'
    },
    {
      id: '2',
      test: 'Memory Integrity',
      category: 'hardware',
      status: 'warning',
      message: 'Memory usage is high but manageable',
      recommendation: 'Consider closing unused applications',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'warning'
    },
    {
      id: '3',
      test: 'Disk Health',
      category: 'hardware',
      status: 'pass',
      message: 'Disk health is excellent',
      recommendation: 'Continue regular maintenance',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      severity: 'info'
    },
    {
      id: '4',
      test: 'Network Connectivity',
      category: 'network',
      status: 'fail',
      message: 'Network connection is unstable',
      recommendation: 'Check network configuration and restart router',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: 'error'
    },
    {
      id: '5',
      test: 'Security Scan',
      category: 'security',
      status: 'pass',
      message: 'No security threats detected',
      recommendation: 'Keep security software updated',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      severity: 'info'
    }
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoOptimize: true,
    performanceMode: 'balanced',
    backgroundTasks: true,
    autoUpdate: true,
    telemetry: false,
    crashReporting: true,
    diagnosticMode: false,
    maintenanceSchedule: 'weekly',
    resourceLimits: {
      cpu: 80,
      memory: 85,
      disk: 90,
      network: 95
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // In production, this would refresh system metrics
        console.log('Refreshing system metrics...');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'cpu': return <Cpu className="w-5 h-5" />;
      case 'memory': return <MemoryStick className="w-5 h-5" />;
      case 'disk': return <HardDrive className="w-5 h-5" />;
      case 'network': return <Network className="w-5 h-5" />;
      case 'battery': return <Battery className="w-5 h-5" />;
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getDiagnosticIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const runOptimization = (taskId: string) => {
    // In production, this would run the optimization task
    console.log('Running optimization task:', taskId);
  };

  const runDiagnostics = () => {
    // In production, this would run system diagnostics
    console.log('Running system diagnostics...');
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResourceLimitChange = (resource: keyof SystemSettings['resourceLimits'], value: number) => {
    setSystemSettings(prev => ({
      ...prev,
      resourceLimits: {
        ...prev.resourceLimits,
        [resource]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="system-optimizer">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading system optimizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-optimizer">
      <div className="optimizer-header">
        <div className="header-content">
          <div className="header-title">
            <Settings className="header-icon" />
            <h1>System Optimizer</h1>
          </div>
          <div className="header-controls">
            <button 
              className="action-button"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="button-icon" /> : <Play className="button-icon" />}
              {autoRefresh ? 'Pause' : 'Resume'}
            </button>
            <button className="action-button" onClick={runDiagnostics}>
              <Activity className="button-icon" />
              Diagnostics
            </button>
            <button className="action-button">
              <RefreshCw className="button-icon" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="optimizer-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <Gauge className="tab-icon" />
          Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          <Zap className="tab-icon" />
          Optimization
        </button>
        <button 
          className={`tab ${activeTab === 'diagnostics' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnostics')}
        >
          <Activity className="tab-icon" />
          Diagnostics
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="optimizer-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="system-status">
              <h3>System Status</h3>
              <div className="status-grid">
                {systemMetrics.map((metric) => (
                  <div key={metric.id} className="status-card">
                    <div className="status-header">
                      <div className="status-icon">
                        {getMetricIcon(metric.category)}
                      </div>
                      <div className="status-badges">
                        {getStatusIcon(metric.status)}
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    <div className="status-info">
                      <h4 className="status-name">{metric.name}</h4>
                      <div className="status-value">
                        {metric.current}{metric.unit}
                      </div>
                      <div className="status-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(metric.current / metric.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-button">
                  <Trash2 className="action-icon" />
                  <span>Clear Cache</span>
                </button>
                <button className="action-button">
                  <RefreshCw className="action-icon" />
                  <span>Restart Services</span>
                </button>
                <button className="action-button">
                  <Shield className="action-icon" />
                  <span>Security Scan</span>
                </button>
                <button className="action-button">
                  <Database className="action-icon" />
                  <span>Clean Registry</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="metrics-tab">
            <div className="metrics-list">
              <h3>System Metrics</h3>
              {systemMetrics.map((metric) => (
                <div key={metric.id} className="metric-item">
                  <div className="metric-icon">
                    {getMetricIcon(metric.category)}
                  </div>
                  <div className="metric-info">
                    <div className="metric-header">
                      <h4 className="metric-name">{metric.name}</h4>
                      <div className="metric-badges">
                        <span className={`status-badge ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                        <span className="trend-badge">
                          {getTrendIcon(metric.trend)}
                        </span>
                      </div>
                    </div>
                    <div className="metric-details">
                      <div className="metric-value">
                        {metric.current}{metric.unit} / {metric.max}{metric.unit}
                      </div>
                      <div className="metric-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(metric.current / metric.max) * 100}%` }}
                        ></div>
                      </div>
                      <div className="metric-history">
                        <span>Last updated: {metric.lastUpdated.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="optimization-tab">
            <div className="optimization-tasks">
              <h3>Optimization Tasks</h3>
              {optimizationTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-icon">
                    {getCategoryIcon(task.category)}
                  </div>
                  <div className="task-info">
                    <div className="task-header">
                      <h4 className="task-name">{task.name}</h4>
                      <div className="task-badges">
                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`status-badge ${task.status}`}>
                          {task.status}
                        </span>
                        <span className="impact-badge">
                          {task.impact} impact
                        </span>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <span>Estimated time: {task.estimatedTime} minutes</span>
                      <span>Last run: {task.lastRun ? task.lastRun.toLocaleString() : 'Never'}</span>
                      <span>Next run: {task.nextRun ? task.nextRun.toLocaleString() : 'Manual'}</span>
                    </div>
                    {task.status === 'running' && (
                      <div className="task-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{task.progress}%</span>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    {task.status === 'pending' && (
                      <button 
                        className="run-button"
                        onClick={() => runOptimization(task.id)}
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </button>
                    )}
                    {task.status === 'running' && (
                      <button className="pause-button">
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                    <button className="settings-button">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="diagnostics-tab">
            <div className="diagnostic-results">
              <h3>Diagnostic Results</h3>
              {diagnosticResults.map((result) => (
                <div key={result.id} className="diagnostic-item">
                  <div className="diagnostic-icon">
                    {getDiagnosticIcon(result.status)}
                  </div>
                  <div className="diagnostic-info">
                    <div className="diagnostic-header">
                      <h4 className="diagnostic-test">{result.test}</h4>
                      <div className="diagnostic-badges">
                        <span className="category-badge">{result.category}</span>
                        <span className={`severity-badge ${getSeverityColor(result.severity)}`}>
                          {result.severity}
                        </span>
                      </div>
                    </div>
                    <div className="diagnostic-message">{result.message}</div>
                    <div className="diagnostic-recommendation">
                      <strong>Recommendation:</strong> {result.recommendation}
                    </div>
                    <div className="diagnostic-timestamp">
                      {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="system-settings">
              <h3>System Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Optimize</h4>
                    <p>Automatically run optimization tasks</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoOptimize}
                      onChange={(e) => handleSettingChange('autoOptimize', e.target.checked)}
                      aria-label="Enable automatic system optimization"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Performance Mode</h4>
                    <p>System performance optimization level</p>
                  </div>
                  <select 
                    value={systemSettings.performanceMode}
                    onChange={(e) => handleSettingChange('performanceMode', e.target.value)}
                    className="performance-select"
                    title="Select performance mode"
                    aria-label="Select performance mode"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="performance">Performance</option>
                    <option value="power-saver">Power Saver</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Background Tasks</h4>
                    <p>Allow background optimization tasks</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.backgroundTasks}
                      onChange={(e) => handleSettingChange('backgroundTasks', e.target.checked)}
                      aria-label="Enable background optimization tasks"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Update</h4>
                    <p>Automatically update system components</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoUpdate}
                      onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
                      aria-label="Enable automatic system updates"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Telemetry</h4>
                    <p>Send anonymous usage data for improvements</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.telemetry}
                      onChange={(e) => handleSettingChange('telemetry', e.target.checked)}
                      aria-label="Enable telemetry data collection"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Crash Reporting</h4>
                    <p>Automatically report crashes for debugging</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.crashReporting}
                      onChange={(e) => handleSettingChange('crashReporting', e.target.checked)}
                      aria-label="Enable crash reporting"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Diagnostic Mode</h4>
                    <p>Enable detailed diagnostic logging</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.diagnosticMode}
                      onChange={(e) => handleSettingChange('diagnosticMode', e.target.checked)}
                      aria-label="Enable diagnostic mode"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Maintenance Schedule</h4>
                    <p>How often to run maintenance tasks</p>
                  </div>
                  <select 
                    value={systemSettings.maintenanceSchedule}
                    onChange={(e) => handleSettingChange('maintenanceSchedule', e.target.value)}
                    className="schedule-select"
                    title="Select maintenance schedule"
                    aria-label="Select maintenance schedule"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Resource Limits</h4>
                    <p>Set limits for system resource usage</p>
                  </div>
                  <div className="resource-limits">
                    <div className="limit-item">
                      <label>CPU: {systemSettings.resourceLimits.cpu}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={systemSettings.resourceLimits.cpu}
                        onChange={(e) => handleResourceLimitChange('cpu', parseInt(e.target.value))}
                        className="limit-slider"
                        aria-label="CPU resource limit"
                      />
                    </div>
                    <div className="limit-item">
                      <label>Memory: {systemSettings.resourceLimits.memory}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={systemSettings.resourceLimits.memory}
                        onChange={(e) => handleResourceLimitChange('memory', parseInt(e.target.value))}
                        className="limit-slider"
                        aria-label="Memory resource limit"
                      />
                    </div>
                    <div className="limit-item">
                      <label>Disk: {systemSettings.resourceLimits.disk}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={systemSettings.resourceLimits.disk}
                        onChange={(e) => handleResourceLimitChange('disk', parseInt(e.target.value))}
                        className="limit-slider"
                        aria-label="Disk resource limit"
                      />
                    </div>
                    <div className="limit-item">
                      <label>Network: {systemSettings.resourceLimits.network}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={systemSettings.resourceLimits.network}
                        onChange={(e) => handleResourceLimitChange('network', parseInt(e.target.value))}
                        className="limit-slider"
                        aria-label="Network resource limit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
