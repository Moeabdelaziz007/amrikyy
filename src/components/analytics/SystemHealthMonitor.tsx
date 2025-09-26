import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, 
  Shield, 
  HardDrive, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Database,
  Server,
  Cpu
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'storage' | 'network' | 'backup';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  actionRequired: boolean;
}

interface BackupStatus {
  lastBackup: Date;
  nextScheduled: Date;
  status: 'success' | 'failed' | 'in-progress' | 'scheduled';
  size: number;
  location: string;
}

interface SecurityStatus {
  score: number;
  lastScan: Date;
  threats: number;
  updates: number;
  firewall: boolean;
  antivirus: boolean;
}

export const SystemHealthMonitor: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'security' | 'storage' | 'alerts'>('overview');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - in production, this would come from system monitoring APIs
  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'CPU Usage',
      value: 45,
      status: 'healthy',
      threshold: { warning: 70, critical: 85 },
      trend: 'stable',
      description: 'Current CPU utilization'
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 67,
      status: 'warning',
      threshold: { warning: 75, critical: 90 },
      trend: 'up',
      description: 'RAM utilization percentage'
    },
    {
      id: '3',
      name: 'Disk Usage',
      value: 23,
      status: 'healthy',
      threshold: { warning: 80, critical: 95 },
      trend: 'stable',
      description: 'Storage space utilization'
    },
    {
      id: '4',
      name: 'Network Latency',
      value: 25,
      status: 'healthy',
      threshold: { warning: 50, critical: 100 },
      trend: 'down',
      description: 'Average network response time'
    },
    {
      id: '5',
      name: 'System Uptime',
      value: 99.8,
      status: 'healthy',
      threshold: { warning: 95, critical: 90 },
      trend: 'stable',
      description: 'System availability percentage'
    }
  ]);

  const [alerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'performance',
      severity: 'medium',
      message: 'High memory usage detected (67%)',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false,
      actionRequired: true
    },
    {
      id: '2',
      type: 'security',
      severity: 'low',
      message: 'Security scan completed - no threats found',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true,
      actionRequired: false
    },
    {
      id: '3',
      type: 'backup',
      severity: 'high',
      message: 'Backup failed - manual intervention required',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: false,
      actionRequired: true
    }
  ]);

  const [backupStatus] = useState<BackupStatus>({
    lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 18 * 60 * 60 * 1000),
    status: 'failed',
    size: 2.5,
    location: 'Cloud Storage'
  });

  const [securityStatus] = useState<SecurityStatus>({
    score: 95,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
    threats: 0,
    updates: 3,
    firewall: true,
    antivirus: true
  });

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Refreshing system health data...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Cpu className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'backup': return <Database className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getBackupStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'in-progress': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="system-health-monitor">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading system health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-health-monitor">
      <div className="health-header">
        <div className="header-content">
          <div className="header-title">
            <Activity className="header-icon" />
            <h1>System Health Monitor</h1>
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
          </div>
        </div>
      </div>

      <div className="health-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <Cpu className="tab-icon" />
          Performance
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield className="tab-icon" />
          Security
        </button>
        <button 
          className={`tab ${activeTab === 'storage' ? 'active' : ''}`}
          onClick={() => setActiveTab('storage')}
        >
          <HardDrive className="tab-icon" />
          Storage
        </button>
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle className="tab-icon" />
          Alerts
        </button>
      </div>

      <div className="health-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="health-summary">
              <div className="summary-card">
                <div className="summary-header">
                  <Activity className="summary-icon" />
                  <h3>Overall Health</h3>
                </div>
                <div className="summary-value">
                  <span className="health-score">87%</span>
                  <span className="health-status">Good</span>
                </div>
                <div className="summary-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+2% this week</span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-header">
                  <Shield className="summary-icon" />
                  <h3>Security Score</h3>
                </div>
                <div className="summary-value">
                  <span className="security-score">{securityStatus.score}%</span>
                  <span className="security-status">Excellent</span>
                </div>
                <div className="summary-details">
                  <span>Threats: {securityStatus.threats}</span>
                  <span>Updates: {securityStatus.updates}</span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-header">
                  <Server className="summary-icon" />
                  <h3>System Uptime</h3>
                </div>
                <div className="summary-value">
                  <span className="uptime-score">99.8%</span>
                  <span className="uptime-status">Excellent</span>
                </div>
                <div className="summary-details">
                  <span>Last restart: 7 days ago</span>
                </div>
              </div>
            </div>

            <div className="quick-metrics">
              <h3>Quick Metrics</h3>
              <div className="metrics-grid">
                {healthMetrics.slice(0, 4).map((metric) => (
                  <div key={metric.id} className="metric-card">
                    <div className="metric-header">
                      <span className="metric-name">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="metric-value">
                      <span className={getStatusColor(metric.status)}>
                        {metric.value}{metric.name.includes('Usage') || metric.name.includes('Uptime') ? '%' : ''}
                      </span>
                    </div>
                    <div className="metric-trend">
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-tab">
            <div className="performance-metrics">
              <h3>Performance Metrics</h3>
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="metric-item">
                  <div className="metric-info">
                    <div className="metric-header">
                      <span className="metric-name">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <p className="metric-description">{metric.description}</p>
                  </div>
                  <div className="metric-values">
                    <div className="current-value">
                      <span className={getStatusColor(metric.status)}>
                        {metric.value}{metric.name.includes('Usage') || metric.name.includes('Uptime') ? '%' : ''}
                      </span>
                    </div>
                    <div className="metric-trend">
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="metric-thresholds">
                    <div className="threshold-bar">
                      <div 
                        className={`threshold-fill width-${Math.round(((metric.value / metric.threshold.critical) * 100) / 5) * 5} ${metric.status}`}
                      ></div>
                    </div>
                    <div className="threshold-labels">
                      <span>0</span>
                      <span>Warning: {metric.threshold.warning}</span>
                      <span>Critical: {metric.threshold.critical}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-tab">
            <div className="security-overview">
              <div className="security-score">
                <h3>Security Overview</h3>
                <div className="score-circle">
                  <div className="score-value">{securityStatus.score}</div>
                  <div className="score-label">/100</div>
                </div>
                <div className="score-status">Excellent</div>
              </div>

              <div className="security-details">
                <div className="detail-item">
                  <Shield className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Firewall</span>
                    <span className={`detail-value ${securityStatus.firewall ? 'enabled' : 'disabled'}`}>
                      {securityStatus.firewall ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Shield className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Antivirus</span>
                    <span className={`detail-value ${securityStatus.antivirus ? 'enabled' : 'disabled'}`}>
                      {securityStatus.antivirus ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <AlertTriangle className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Threats Detected</span>
                    <span className="detail-value">{securityStatus.threats}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Last Scan</span>
                    <span className="detail-value">
                      {securityStatus.lastScan.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="security-actions">
              <h3>Security Actions</h3>
              <div className="actions-grid">
                <button className="action-button">
                  <Shield className="action-icon" />
                  <span>Run Security Scan</span>
                </button>
                <button className="action-button">
                  <Zap className="action-icon" />
                  <span>Update Security</span>
                </button>
                <button className="action-button">
                  <Database className="action-icon" />
                  <span>Backup Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="storage-tab">
            <div className="storage-overview">
              <h3>Storage Overview</h3>
              <div className="storage-metrics">
                <div className="storage-card">
                  <h4>Disk Usage</h4>
                  <div className="storage-value">23%</div>
                  <div className="storage-details">
                    <span>Used: 120GB</span>
                    <span>Total: 500GB</span>
                  </div>
                  <div className="storage-bar">
                    <div className="storage-fill width-25"></div>
                  </div>
                </div>

                <div className="storage-card">
                  <h4>Backup Status</h4>
                  <div className={`backup-status ${getBackupStatusColor(backupStatus.status)}`}>
                    {backupStatus.status}
                  </div>
                  <div className="backup-details">
                    <span>Last: {backupStatus.lastBackup.toLocaleString()}</span>
                    <span>Next: {backupStatus.nextScheduled.toLocaleString()}</span>
                    <span>Size: {backupStatus.size}GB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="storage-actions">
              <h3>Storage Actions</h3>
              <div className="actions-grid">
                <button className="action-button">
                  <HardDrive className="action-icon" />
                  <span>Clean Up Disk</span>
                </button>
                <button className="action-button">
                  <Database className="action-icon" />
                  <span>Run Backup</span>
                </button>
                <button className="action-button">
                  <Server className="action-icon" />
                  <span>Storage Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <div className="alerts-list">
              <h3>System Alerts</h3>
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.severity} ${alert.resolved ? 'resolved' : ''}`}>
                  <div className="alert-icon">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <span className="alert-type">{alert.type}</span>
                      <span className={`alert-severity ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-timestamp">
                      <Clock className="time-icon" />
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="alert-actions">
                    {alert.actionRequired && !alert.resolved && (
                      <button className="action-button small">
                        Take Action
                      </button>
                    )}
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
      </div>
    </div>
  );
};
