import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar,
  Target,
  Activity,
  Zap,
  Brain,
  FileText,
  Settings
} from 'lucide-react';

interface UsageData {
  app: string;
  category: string;
  timeSpent: number; // in minutes
  sessions: number;
  lastUsed: Date;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface TimeDistribution {
  hour: number;
  usage: number;
  category: string;
}

interface UserBehavior {
  peakHours: number[];
  mostProductiveDay: string;
  averageSessionLength: number;
  focusTime: number;
  breakTime: number;
  multitaskingScore: number;
}

interface ProductivityMetrics {
  tasksCompleted: number;
  goalsAchieved: number;
  efficiencyScore: number;
  focusScore: number;
  collaborationScore: number;
  automationScore: number;
}

export const UsageStatistics: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'time' | 'behavior' | 'productivity'>('overview');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Mock data - in production, this would come from Firebase
  const [usageData] = useState<UsageData[]>([
    { app: 'Tasks', category: 'productivity', timeSpent: 180, sessions: 25, lastUsed: new Date(), trend: 'up', icon: '⚡' },
    { app: 'AI Assistant', category: 'ai', timeSpent: 120, sessions: 18, lastUsed: new Date(), trend: 'up', icon: '🤖' },
    { app: 'Calendar', category: 'productivity', timeSpent: 90, sessions: 12, lastUsed: new Date(), trend: 'stable', icon: '🗓️' },
    { app: 'Files', category: 'system', timeSpent: 75, sessions: 8, lastUsed: new Date(), trend: 'down', icon: '🗂️' },
    { app: 'Gaming Suite', category: 'entertainment', timeSpent: 240, sessions: 6, lastUsed: new Date(), trend: 'up', icon: '🎲' },
    { app: 'Settings', category: 'system', timeSpent: 30, sessions: 4, lastUsed: new Date(), trend: 'stable', icon: '🔧' },
  ]);

  const [timeDistribution] = useState<TimeDistribution[]>([
    { hour: 0, usage: 5, category: 'entertainment' },
    { hour: 1, usage: 2, category: 'entertainment' },
    { hour: 2, usage: 1, category: 'entertainment' },
    { hour: 3, usage: 0, category: 'system' },
    { hour: 4, usage: 0, category: 'system' },
    { hour: 5, usage: 0, category: 'system' },
    { hour: 6, usage: 10, category: 'productivity' },
    { hour: 7, usage: 25, category: 'productivity' },
    { hour: 8, usage: 45, category: 'productivity' },
    { hour: 9, usage: 60, category: 'productivity' },
    { hour: 10, usage: 55, category: 'productivity' },
    { hour: 11, usage: 50, category: 'productivity' },
    { hour: 12, usage: 30, category: 'productivity' },
    { hour: 13, usage: 35, category: 'productivity' },
    { hour: 14, usage: 40, category: 'productivity' },
    { hour: 15, usage: 45, category: 'productivity' },
    { hour: 16, usage: 35, category: 'productivity' },
    { hour: 17, usage: 25, category: 'productivity' },
    { hour: 18, usage: 20, category: 'entertainment' },
    { hour: 19, usage: 30, category: 'entertainment' },
    { hour: 20, usage: 40, category: 'entertainment' },
    { hour: 21, usage: 35, category: 'entertainment' },
    { hour: 22, usage: 25, category: 'entertainment' },
    { hour: 23, usage: 15, category: 'entertainment' },
  ]);

  const [userBehavior] = useState<UserBehavior>({
    peakHours: [9, 10, 11, 14, 15],
    mostProductiveDay: 'Tuesday',
    averageSessionLength: 25,
    focusTime: 68,
    breakTime: 32,
    multitaskingScore: 75
  });

  const [productivityMetrics] = useState<ProductivityMetrics>({
    tasksCompleted: 47,
    goalsAchieved: 12,
    efficiencyScore: 87,
    focusScore: 72,
    collaborationScore: 65,
    automationScore: 80
  });

  useEffect(() => {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalUsage = () => {
    return usageData.reduce((total, app) => total + app.timeSpent, 0);
  };

  const getCategoryUsage = (category: string) => {
    return usageData
      .filter(app => app.category === category)
      .reduce((total, app) => total + app.timeSpent, 0);
  };

  const getPeakHour = () => {
    return timeDistribution.reduce((peak, current) => 
      current.usage > peak.usage ? current : peak
    );
  };

  if (loading) {
    return (
      <div className="usage-statistics">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading usage statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usage-statistics">
      <div className="statistics-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 className="header-icon" />
            <h1>Usage Statistics</h1>
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

      <div className="statistics-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'apps' ? 'active' : ''}`}
          onClick={() => setActiveTab('apps')}
        >
          <PieChart className="tab-icon" />
          Apps
        </button>
        <button 
          className={`tab ${activeTab === 'time' ? 'active' : ''}`}
          onClick={() => setActiveTab('time')}
        >
          <Clock className="tab-icon" />
          Time
        </button>
        <button 
          className={`tab ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavior')}
        >
          <Users className="tab-icon" />
          Behavior
        </button>
        <button 
          className={`tab ${activeTab === 'productivity' ? 'active' : ''}`}
          onClick={() => setActiveTab('productivity')}
        >
          <Target className="tab-icon" />
          Productivity
        </button>
      </div>

      <div className="statistics-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Clock className="metric-icon" />
                  <span className="metric-label">Total Usage</span>
                </div>
                <div className="metric-value">{formatTime(getTotalUsage())}</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+15%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity className="metric-icon" />
                  <span className="metric-label">Active Sessions</span>
                </div>
                <div className="metric-value">
                  {usageData.reduce((total, app) => total + app.sessions, 0)}
                </div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+8%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Target className="metric-icon" />
                  <span className="metric-label">Productivity Score</span>
                </div>
                <div className="metric-value">{productivityMetrics.efficiencyScore}%</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+5%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Zap className="metric-icon" />
                  <span className="metric-label">Peak Hour</span>
                </div>
                <div className="metric-value">{getPeakHour().hour}:00</div>
                <div className="metric-trend">
                  <Activity className="trend-icon" />
                  <span>{getPeakHour().usage}min</span>
                </div>
              </div>
            </div>

            <div className="category-breakdown">
              <h3>Usage by Category</h3>
              <div className="category-chart">
                {['productivity', 'entertainment', 'ai', 'system', 'collaboration'].map(category => {
                  const usage = getCategoryUsage(category);
                  const percentage = (usage / getTotalUsage()) * 100;
                  return (
                    <div key={category} className="category-item">
                      <div className="category-info">
                        <div className={`category-marker ${getCategoryColor(category)}`}></div>
                        <span className="category-name">{category}</span>
                        <span className="category-usage">{formatTime(usage)}</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className={`category-fill ${getCategoryColor(category)} width-${Math.round(percentage / 5) * 5}`}
                        ></div>
                      </div>
                      <span className="category-percentage">{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="apps-tab">
            <div className="apps-list">
              <h3>App Usage Details</h3>
              {usageData
                .sort((a, b) => b.timeSpent - a.timeSpent)
                .map((app, index) => (
                  <div key={app.app} className="app-item">
                    <div className="app-rank">#{index + 1}</div>
                    <div className="app-icon">{app.icon}</div>
                    <div className="app-info">
                      <div className="app-name">{app.app}</div>
                      <div className="app-category">{app.category}</div>
                    </div>
                    <div className="app-stats">
                      <div className="stat-item">
                        <span className="stat-label">Time:</span>
                        <span className="stat-value">{formatTime(app.timeSpent)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Sessions:</span>
                        <span className="stat-value">{app.sessions}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Avg Session:</span>
                        <span className="stat-value">{formatTime(Math.round(app.timeSpent / app.sessions))}</span>
                      </div>
                    </div>
                    <div className="app-trend">
                      {getTrendIcon(app.trend)}
                    </div>
                    <div className="app-usage-bar">
                      <div 
                        className={`usage-fill ${getCategoryColor(app.category)} width-${Math.round(((app.timeSpent / getTotalUsage()) * 100) / 5) * 5}`}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="time-tab">
            <div className="time-distribution">
              <h3>Hourly Usage Distribution</h3>
              <div className="hourly-chart">
                {timeDistribution.map((hour) => (
                  <div key={hour.hour} className="hour-item">
                    <div className="hour-label">{hour.hour}:00</div>
                    <div className="hour-bar">
                      <div 
                        className={`hour-fill ${getCategoryColor(hour.category)} height-${Math.round(((hour.usage / 60) * 100) / 5) * 5}`}
                      ></div>
                    </div>
                    <div className="hour-usage">{hour.usage}min</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="time-insights">
              <h3>Time Insights</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <h4>Peak Productivity</h4>
                  <div className="insight-value">{userBehavior.peakHours.join(', ')}:00</div>
                  <p>Your most productive hours</p>
                </div>
                <div className="insight-card">
                  <h4>Average Session</h4>
                  <div className="insight-value">{userBehavior.averageSessionLength} min</div>
                  <p>Typical session length</p>
                </div>
                <div className="insight-card">
                  <h4>Focus Time</h4>
                  <div className="insight-value">{userBehavior.focusTime}%</div>
                  <p>Time spent in focused work</p>
                </div>
                <div className="insight-card">
                  <h4>Break Time</h4>
                  <div className="insight-value">{userBehavior.breakTime}%</div>
                  <p>Time spent on breaks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="behavior-tab">
            <div className="behavior-metrics">
              <h3>User Behavior Analysis</h3>
              <div className="behavior-grid">
                <div className="behavior-card">
                  <h4>Most Productive Day</h4>
                  <div className="behavior-value">{userBehavior.mostProductiveDay}</div>
                  <p>Based on task completion and focus time</p>
                </div>
                <div className="behavior-card">
                  <h4>Multitasking Score</h4>
                  <div className="behavior-value">{userBehavior.multitaskingScore}%</div>
                  <p>Ability to handle multiple tasks</p>
                </div>
                <div className="behavior-card">
                  <h4>Peak Hours</h4>
                  <div className="behavior-value">{userBehavior.peakHours.length} hours</div>
                  <p>Identified high-productivity periods</p>
                </div>
                <div className="behavior-card">
                  <h4>Session Consistency</h4>
                  <div className="behavior-value">Good</div>
                  <p>Regular usage patterns detected</p>
                </div>
              </div>
            </div>

            <div className="behavior-recommendations">
              <h3>Behavioral Recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <div className="rec-icon">💡</div>
                  <div className="rec-content">
                    <h4>Optimize Peak Hours</h4>
                    <p>Schedule important tasks during your peak productivity hours (9-11 AM, 2-4 PM)</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">🎯</div>
                  <div className="rec-content">
                    <h4>Improve Focus</h4>
                    <p>Consider using the Pomodoro technique to increase focus time from 68% to 80%</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">⚡</div>
                  <div className="rec-content">
                    <h4>Reduce Multitasking</h4>
                    <p>Focus on single tasks to improve quality and reduce context switching</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productivity' && (
          <div className="productivity-tab">
            <div className="productivity-metrics">
              <h3>Productivity Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Target className="metric-icon" />
                    <span className="metric-label">Tasks Completed</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.tasksCompleted}</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+12%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Calendar className="metric-icon" />
                    <span className="metric-label">Goals Achieved</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.goalsAchieved}</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+8%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Zap className="metric-icon" />
                    <span className="metric-label">Efficiency Score</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.efficiencyScore}%</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+5%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Brain className="metric-icon" />
                    <span className="metric-label">Focus Score</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.focusScore}%</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+3%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Users className="metric-icon" />
                    <span className="metric-label">Collaboration Score</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.collaborationScore}%</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+7%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Settings className="metric-icon" />
                    <span className="metric-label">Automation Score</span>
                  </div>
                  <div className="metric-value">{productivityMetrics.automationScore}%</div>
                  <div className="metric-trend">
                    <TrendingUp className="trend-icon" />
                    <span>+15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="productivity-insights">
              <h3>Productivity Insights</h3>
              <div className="insights-list">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <div className="insight-content">
                    <h4>Efficiency Trending Up</h4>
                    <p>Your efficiency score has improved by 5% this week. Keep up the great work!</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-content">
                    <h4>Focus Improvement Opportunity</h4>
                    <p>Consider reducing multitasking to improve your focus score from 72% to 80%+</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🤝</div>
                  <div className="insight-content">
                    <h4>Collaboration Growth</h4>
                    <p>Your collaboration score increased by 7%. Great team engagement!</p>
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
