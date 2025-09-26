import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';

interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    frequency: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    swap: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    download: number;
    upload: number;
    latency: number;
    packets: number;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  };
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const PerformanceMonitor: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'realtime' | 'history' | 'alerts' | 'optimization'>('realtime');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Mock data - in production, this would come from system monitoring APIs
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics>({
    timestamp: new Date(),
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 65,
      frequency: 3.2
    },
    memory: {
      used: 6.8,
      total: 16,
      percentage: 42.5,
      swap: 2.1
    },
    disk: {
      used: 120,
      total: 500,
      percentage: 24,
      readSpeed: 150,
      writeSpeed: 120
    },
    network: {
      download: 85.2,
      upload: 12.8,
      latency: 25,
      packets: 15420
    },
    performance: {
      responseTime: 120,
      throughput: 95.5,
      errorRate: 0.2,
      availability: 99.8
    }
  });

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'High CPU usage detected (85%)',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true
    },
    {
      id: '3',
      type: 'error',
      message: 'Network connection unstable',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false
    }
  ]);

  const [optimizationSuggestions] = useState([
    {
      id: '1',
      title: 'Memory Optimization',
      description: 'Close unused applications to free up memory',
      impact: 'high',
      effort: 'low',
      estimatedImprovement: '15%'
    },
    {
      id: '2',
      title: 'Disk Cleanup',
      description: 'Remove temporary files and cache',
      impact: 'medium',
      effort: 'low',
      estimatedImprovement: '8%'
    },
    {
      id: '3',
      title: 'Network Optimization',
      description: 'Update network drivers for better performance',
      impact: 'medium',
      effort: 'medium',
      estimatedImprovement: '12%'
    }
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        setCurrentMetrics(prev => ({
          ...prev,
          timestamp: new Date(),
          cpu: {
            ...prev.cpu,
            usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)),
            temperature: Math.max(40, Math.min(80, prev.cpu.temperature + (Math.random() - 0.5) * 5))
          },
          memory: {
            ...prev.memory,
            percentage: Math.max(20, Math.min(80, prev.memory.percentage + (Math.random() - 0.5) * 5))
          },
          network: {
            ...prev.network,
            download: Math.max(0, prev.network.download + (Math.random() - 0.5) * 20),
            upload: Math.max(0, prev.network.upload + (Math.random() - 0.5) * 10),
            latency: Math.max(10, Math.min(100, prev.network.latency + (Math.random() - 0.5) * 10))
          }
        }));
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  if (loading) {
    return (
      <div className="performance-monitor">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-monitor">
      <div className="monitor-header">
        <div className="header-content">
          <div className="header-title">
            <Activity className="header-icon" />
            <h1>Performance Monitor</h1>
          </div>
          <div className="header-controls">
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto Refresh</span>
            </label>
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="refresh-interval"
              title="Refresh interval"
            >
              <option value={1000}>1s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          </div>
        </div>
      </div>

      <div className="monitor-tabs">
        <button 
          className={`tab ${activeTab === 'realtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          <Activity className="tab-icon" />
          Real-time
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <TrendingUp className="tab-icon" />
          History
        </button>
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle className="tab-icon" />
          Alerts
        </button>
        <button 
          className={`tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          <Zap className="tab-icon" />
          Optimization
        </button>
      </div>

      <div className="monitor-content">
        {activeTab === 'realtime' && (
          <div className="realtime-tab">
            <div className="metrics-grid">
              <div className="metric-card cpu">
                <div className="metric-header">
                  <Cpu className="metric-icon" />
                  <span className="metric-label">CPU</span>
                  {getStatusIcon(currentMetrics.cpu.usage, { warning: 70, critical: 85 })}
                </div>
                <div className="metric-value">
                  <span className={getStatusColor(currentMetrics.cpu.usage, { warning: 70, critical: 85 })}>
                    {currentMetrics.cpu.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="metric-details">
                  <div className="detail-item">
                    <span>Temperature: {currentMetrics.cpu.temperature}°C</span>
                  </div>
                  <div className="detail-item">
                    <span>Frequency: {currentMetrics.cpu.frequency}GHz</span>
                  </div>
                  <div className="detail-item">
                    <span>Cores: {currentMetrics.cpu.cores}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill cpu width-${Math.round(currentMetrics.cpu.usage / 5) * 5}`}
                  ></div>
                </div>
              </div>

              <div className="metric-card memory">
                <div className="metric-header">
                  <HardDrive className="metric-icon" />
                  <span className="metric-label">Memory</span>
                  {getStatusIcon(currentMetrics.memory.percentage, { warning: 75, critical: 90 })}
                </div>
                <div className="metric-value">
                  <span className={getStatusColor(currentMetrics.memory.percentage, { warning: 75, critical: 90 })}>
                    {currentMetrics.memory.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="metric-details">
                  <div className="detail-item">
                    <span>Used: {currentMetrics.memory.used}GB</span>
                  </div>
                  <div className="detail-item">
                    <span>Total: {currentMetrics.memory.total}GB</span>
                  </div>
                  <div className="detail-item">
                    <span>Swap: {currentMetrics.memory.swap}GB</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill memory width-${Math.round(currentMetrics.memory.percentage / 5) * 5}`}
                  ></div>
                </div>
              </div>

              <div className="metric-card disk">
                <div className="metric-header">
                  <HardDrive className="metric-icon" />
                  <span className="metric-label">Disk</span>
                  {getStatusIcon(currentMetrics.disk.percentage, { warning: 80, critical: 95 })}
                </div>
                <div className="metric-value">
                  <span className={getStatusColor(currentMetrics.disk.percentage, { warning: 80, critical: 95 })}>
                    {currentMetrics.disk.percentage}%
                  </span>
                </div>
                <div className="metric-details">
                  <div className="detail-item">
                    <span>Used: {currentMetrics.disk.used}GB</span>
                  </div>
                  <div className="detail-item">
                    <span>Total: {currentMetrics.disk.total}GB</span>
                  </div>
                  <div className="detail-item">
                    <span>Read: {currentMetrics.disk.readSpeed}MB/s</span>
                  </div>
                  <div className="detail-item">
                    <span>Write: {currentMetrics.disk.writeSpeed}MB/s</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill disk width-${Math.round(currentMetrics.disk.percentage / 5) * 5}`}
                  ></div>
                </div>
              </div>

              <div className="metric-card network">
                <div className="metric-header">
                  <Wifi className="metric-icon" />
                  <span className="metric-label">Network</span>
                  {getStatusIcon(currentMetrics.network.latency, { warning: 50, critical: 100 })}
                </div>
                <div className="metric-value">
                  <span className={getStatusColor(currentMetrics.network.latency, { warning: 50, critical: 100 })}>
                    {currentMetrics.network.latency}ms
                  </span>
                </div>
                <div className="metric-details">
                  <div className="detail-item">
                    <span>Download: {currentMetrics.network.download.toFixed(1)}Mbps</span>
                  </div>
                  <div className="detail-item">
                    <span>Upload: {currentMetrics.network.upload.toFixed(1)}Mbps</span>
                  </div>
                  <div className="detail-item">
                    <span>Packets: {currentMetrics.network.packets.toLocaleString()}</span>
                  </div>
                </div>
                <div className="network-bars">
                  <div className="network-bar">
                    <span>↓</span>
                    <div className="bar">
                      <div 
                        className={`bar-fill download width-${Math.round(Math.min(100, (currentMetrics.network.download / 100) * 100) / 5) * 5}`}
                      ></div>
                    </div>
                  </div>
                  <div className="network-bar">
                    <span>↑</span>
                    <div className="bar">
                      <div 
                        className={`bar-fill upload width-${Math.round(Math.min(100, (currentMetrics.network.upload / 50) * 100) / 5) * 5}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="performance-overview">
              <h3>Performance Overview</h3>
              <div className="overview-grid">
                <div className="overview-item">
                  <span className="overview-label">Response Time</span>
                  <span className="overview-value">{currentMetrics.performance.responseTime}ms</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Throughput</span>
                  <span className="overview-value">{currentMetrics.performance.throughput}%</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Error Rate</span>
                  <span className="overview-value">{currentMetrics.performance.errorRate}%</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Availability</span>
                  <span className="overview-value">{currentMetrics.performance.availability}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <div className="history-charts">
              <h3>Performance History</h3>
              <div className="chart-placeholder">
                <div className="chart-mock">
                  <div className="chart-bars">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`chart-bar ${i === 23 ? 'current' : 'historical'}`}
                      ></div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <div className="alerts-list">
              <h3>System Alerts</h3>
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.type} ${alert.resolved ? 'resolved' : ''}`}>
                  <div className="alert-icon">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-timestamp">
                      <Clock className="time-icon" />
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="alert-status">
                    {alert.resolved ? (
                      <CheckCircle className="status-icon resolved" />
                    ) : (
                      <AlertTriangle className="status-icon active" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="optimization-tab">
            <div className="optimization-suggestions">
              <h3>Optimization Suggestions</h3>
              {optimizationSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                  <div className="suggestion-header">
                    <h4>{suggestion.title}</h4>
                    <div className="suggestion-meta">
                      <span className={`impact-badge ${suggestion.impact}`}>
                        {suggestion.impact} impact
                      </span>
                      <span className="effort-badge">
                        {suggestion.effort} effort
                      </span>
                    </div>
                  </div>
                  <p className="suggestion-description">{suggestion.description}</p>
                  <div className="suggestion-footer">
                    <span className="improvement">
                      Estimated improvement: {suggestion.estimatedImprovement}
                    </span>
                    <button className="apply-button">Apply</button>
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
