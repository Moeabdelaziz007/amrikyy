import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Activity,
  Zap,
  Brain,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface UserActivity {
  id: string;
  timestamp: Date;
  action: string;
  app: string;
  duration: number;
  category: 'productivity' | 'entertainment' | 'system' | 'ai' | 'collaboration';
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  errorRate: number;
}

interface ProductivityInsight {
  id: string;
  type: 'efficiency' | 'focus' | 'collaboration' | 'automation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  trend: 'up' | 'down' | 'stable';
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastBackup: Date;
  securityScore: number;
  performanceScore: number;
  issues: string[];
}

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'productivity' | 'usage' | 'health'>('overview');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Mock data - in production, this would come from Firebase
  const [userActivity] = useState<UserActivity[]>([
    { id: '1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Task Created', app: 'Tasks', duration: 5, category: 'productivity' },
    { id: '2', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), action: 'AI Assistant Used', app: 'AI Assistant', duration: 15, category: 'ai' },
    { id: '3', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), action: 'File Uploaded', app: 'Files', duration: 2, category: 'system' },
    { id: '4', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), action: 'Calendar Event', app: 'Calendar', duration: 10, category: 'productivity' },
    { id: '5', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), action: 'Gaming Session', app: 'Gaming Suite', duration: 45, category: 'entertainment' },
  ]);

  const [performanceMetrics] = useState<PerformanceMetrics>({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89,
    responseTime: 120,
    errorRate: 0.2
  });

  const [productivityInsights] = useState<ProductivityInsight[]>([
    {
      id: '1',
      type: 'efficiency',
      title: 'Peak Productivity Hours',
      description: 'You are most productive between 9-11 AM',
      impact: 'high',
      recommendation: 'Schedule important tasks during peak hours',
      trend: 'up'
    },
    {
      id: '2',
      type: 'focus',
      title: 'Focus Time Analysis',
      description: 'Average focus session: 25 minutes',
      impact: 'medium',
      recommendation: 'Try Pomodoro technique for better focus',
      trend: 'stable'
    },
    {
      id: '3',
      type: 'automation',
      title: 'Automation Opportunities',
      description: '5 repetitive tasks identified for automation',
      impact: 'high',
      recommendation: 'Set up automation rules for these tasks',
      trend: 'up'
    }
  ]);

  const [systemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.8,
    lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000),
    securityScore: 95,
    performanceScore: 88,
    issues: []
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      productivity: 'bg-blue-500',
      entertainment: 'bg-purple-500',
      system: 'bg-green-500',
      ai: 'bg-cyan-500',
      collaboration: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colors[impact as keyof typeof colors] || 'text-gray-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    const colors = {
      healthy: 'text-green-500',
      warning: 'text-yellow-500',
      critical: 'text-red-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 className="header-icon" />
            <h1>Analytics & Insights</h1>
          </div>
          <div className="header-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="time-range-selector"
              title="Select time range"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <Activity className="tab-icon" />
          Performance
        </button>
        <button 
          className={`tab ${activeTab === 'productivity' ? 'active' : ''}`}
          onClick={() => setActiveTab('productivity')}
        >
          <Target className="tab-icon" />
          Productivity
        </button>
        <button 
          className={`tab ${activeTab === 'usage' ? 'active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          <Users className="tab-icon" />
          Usage
        </button>
        <button 
          className={`tab ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <Zap className="tab-icon" />
          System Health
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <Clock className="metric-icon" />
                  <span className="metric-label">Total Usage</span>
                </div>
                <div className="metric-value">24.5h</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+12%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <CheckCircle className="metric-icon" />
                  <span className="metric-label">Tasks Completed</span>
                </div>
                <div className="metric-value">47</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+8%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Brain className="metric-icon" />
                  <span className="metric-label">AI Interactions</span>
                </div>
                <div className="metric-value">156</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+23%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity className="metric-icon" />
                  <span className="metric-label">Productivity Score</span>
                </div>
                <div className="metric-value">87%</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+5%</span>
                </div>
              </div>
            </div>

            <div className="activity-timeline">
              <h3>Recent Activity</h3>
              <div className="timeline">
                {userActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="timeline-item">
                    <div className={`timeline-marker ${getCategoryColor(activity.category)}`}></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="activity-action">{activity.action}</span>
                        <span className="activity-time">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="timeline-details">
                        <span className="activity-app">{activity.app}</span>
                        <span className="activity-duration">{activity.duration}min</span>
                      </div>
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
              <div className="metric-card">
                <h4>CPU Usage</h4>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill cpu width-${Math.round(performanceMetrics.cpu / 5) * 5}`}
                  ></div>
                </div>
                <span className="metric-value">{performanceMetrics.cpu}%</span>
              </div>

              <div className="metric-card">
                <h4>Memory Usage</h4>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill memory width-${Math.round(performanceMetrics.memory / 5) * 5}`}
                  ></div>
                </div>
                <span className="metric-value">{performanceMetrics.memory}%</span>
              </div>

              <div className="metric-card">
                <h4>Disk Usage</h4>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill disk width-${Math.round(performanceMetrics.disk / 5) * 5}`}
                  ></div>
                </div>
                <span className="metric-value">{performanceMetrics.disk}%</span>
              </div>

              <div className="metric-card">
                <h4>Network Usage</h4>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill network width-${Math.round(performanceMetrics.network / 5) * 5}`}
                  ></div>
                </div>
                <span className="metric-value">{performanceMetrics.network}%</span>
              </div>
            </div>

            <div className="performance-details">
              <div className="detail-card">
                <h4>Response Time</h4>
                <div className="detail-value">{performanceMetrics.responseTime}ms</div>
              </div>
              <div className="detail-card">
                <h4>Error Rate</h4>
                <div className="detail-value">{performanceMetrics.errorRate}%</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productivity' && (
          <div className="productivity-tab">
            <div className="insights-grid">
              {productivityInsights.map((insight) => (
                <div key={insight.id} className="insight-card">
                  <div className="insight-header">
                    <div className="insight-type">
                      <Target className="type-icon" />
                      <span className="type-label">{insight.type}</span>
                    </div>
                    <div className="insight-trend">
                      {getTrendIcon(insight.trend)}
                    </div>
                  </div>
                  <h4 className="insight-title">{insight.title}</h4>
                  <p className="insight-description">{insight.description}</p>
                  <div className="insight-footer">
                    <span className={`impact-badge ${insight.impact}`}>
                      {insight.impact} impact
                    </span>
                    <div className="recommendation">
                      <Info className="rec-icon" />
                      <span>{insight.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="usage-tab">
            <div className="usage-stats">
              <h3>App Usage Statistics</h3>
              <div className="usage-chart">
                {['Tasks', 'AI Assistant', 'Calendar', 'Files', 'Gaming Suite'].map((app, index) => (
                  <div key={app} className="usage-item">
                    <div className="usage-label">{app}</div>
                    <div className="usage-bar">
                      <div 
                        className={`usage-fill width-${Math.round(((index + 1) * 15 + 20) / 5) * 5}`}
                      ></div>
                    </div>
                    <div className="usage-value">{(index + 1) * 15 + 20}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="usage-patterns">
              <h3>Usage Patterns</h3>
              <div className="pattern-grid">
                <div className="pattern-card">
                  <h4>Peak Hours</h4>
                  <div className="pattern-value">9-11 AM</div>
                </div>
                <div className="pattern-card">
                  <h4>Most Used App</h4>
                  <div className="pattern-value">Tasks</div>
                </div>
                <div className="pattern-card">
                  <h4>Average Session</h4>
                  <div className="pattern-value">25 min</div>
                </div>
                <div className="pattern-card">
                  <h4>Focus Time</h4>
                  <div className="pattern-value">68%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="health-tab">
            <div className="health-overview">
              <div className="health-status">
                <div className={`status-indicator ${systemHealth.status}`}>
                  <Zap className="status-icon" />
                </div>
                <div className="status-details">
                  <h3>System Status: <span className={getHealthStatusColor(systemHealth.status)}>{systemHealth.status}</span></h3>
                  <p>Uptime: {systemHealth.uptime}%</p>
                </div>
              </div>
            </div>

            <div className="health-metrics">
              <div className="health-card">
                <h4>Security Score</h4>
                <div className="score-circle">
                  <div className="score-value">{systemHealth.securityScore}</div>
                  <div className="score-label">/100</div>
                </div>
              </div>
              <div className="health-card">
                <h4>Performance Score</h4>
                <div className="score-circle">
                  <div className="score-value">{systemHealth.performanceScore}</div>
                  <div className="score-label">/100</div>
                </div>
              </div>
            </div>

            <div className="health-details">
              <div className="detail-item">
                <span className="detail-label">Last Backup:</span>
                <span className="detail-value">{systemHealth.lastBackup.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Active Issues:</span>
                <span className="detail-value">{systemHealth.issues.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
