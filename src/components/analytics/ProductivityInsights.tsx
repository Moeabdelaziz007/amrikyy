import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Clock, 
  Zap,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Activity
} from 'lucide-react';

interface ProductivityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  category: 'efficiency' | 'focus' | 'collaboration' | 'automation' | 'goals';
  description: string;
}

interface Insight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  estimatedImprovement?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  status: 'on-track' | 'behind' | 'completed' | 'overdue';
  category: string;
}

interface WorkPattern {
  peakHours: number[];
  mostProductiveDay: string;
  averageSessionLength: number;
  breakFrequency: number;
  multitaskingLevel: number;
  focusScore: number;
}

export const ProductivityInsights: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'insights' | 'goals' | 'patterns'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from Firebase
  const [productivityMetrics] = useState<ProductivityMetric[]>([
    {
      id: '1',
      name: 'Task Completion Rate',
      value: 87,
      target: 90,
      trend: 'up',
      category: 'efficiency',
      description: 'Percentage of tasks completed on time'
    },
    {
      id: '2',
      name: 'Focus Time',
      value: 72,
      target: 80,
      trend: 'stable',
      category: 'focus',
      description: 'Time spent in deep focus mode'
    },
    {
      id: '3',
      name: 'Collaboration Score',
      value: 65,
      target: 70,
      trend: 'up',
      category: 'collaboration',
      description: 'Team interaction and communication effectiveness'
    },
    {
      id: '4',
      name: 'Automation Usage',
      value: 80,
      target: 85,
      trend: 'up',
      category: 'automation',
      description: 'Percentage of tasks automated'
    },
    {
      id: '5',
      name: 'Goal Achievement',
      value: 75,
      target: 80,
      trend: 'up',
      category: 'goals',
      description: 'Percentage of weekly goals achieved'
    }
  ]);

  const [insights] = useState<Insight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Optimize Peak Hours',
      description: 'Schedule important tasks during your peak productivity hours (9-11 AM)',
      impact: 'high',
      effort: 'low',
      category: 'time-management',
      actionable: true,
      estimatedImprovement: '15% efficiency boost'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Focus Time Declining',
      description: 'Your focus time has decreased by 5% this week. Consider reducing distractions.',
      impact: 'medium',
      effort: 'medium',
      category: 'focus',
      actionable: true,
      estimatedImprovement: '8% focus improvement'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Automation Milestone',
      description: 'Congratulations! You\'ve automated 80% of your repetitive tasks.',
      impact: 'high',
      effort: 'low',
      category: 'automation',
      actionable: false
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Collaboration Enhancement',
      description: 'Increase team collaboration to improve project outcomes',
      impact: 'medium',
      effort: 'high',
      category: 'collaboration',
      actionable: true,
      estimatedImprovement: '12% team productivity'
    }
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Increase Focus Time',
      description: 'Achieve 80% focus time by end of month',
      target: 80,
      current: 72,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'on-track',
      category: 'focus'
    },
    {
      id: '2',
      title: 'Complete 50 Tasks',
      description: 'Finish 50 tasks this week',
      target: 50,
      current: 47,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'on-track',
      category: 'efficiency'
    },
    {
      id: '3',
      title: 'Improve Collaboration',
      description: 'Increase collaboration score to 70%',
      target: 70,
      current: 65,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: 'behind',
      category: 'collaboration'
    }
  ]);

  const [workPatterns] = useState<WorkPattern>({
    peakHours: [9, 10, 11, 14, 15],
    mostProductiveDay: 'Tuesday',
    averageSessionLength: 25,
    breakFrequency: 4,
    multitaskingLevel: 75,
    focusScore: 72
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'achievement': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'opportunity': return <Target className="w-5 h-5 text-purple-500" />;
      default: return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'on-track': return 'text-blue-500';
      case 'behind': return 'text-yellow-500';
      case 'overdue': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency': return <Zap className="w-4 h-4" />;
      case 'focus': return <Brain className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'automation': return <Settings className="w-4 h-4" />;
      case 'goals': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="productivity-insights">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading productivity insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productivity-insights">
      <div className="insights-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>Productivity Insights</h1>
          </div>
        </div>
      </div>

      <div className="insights-tabs">
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
          <Target className="tab-icon" />
          Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Lightbulb className="tab-icon" />
          Insights
        </button>
        <button 
          className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <CheckCircle className="tab-icon" />
          Goals
        </button>
        <button 
          className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Activity className="tab-icon" />
          Patterns
        </button>
      </div>

      <div className="insights-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Target className="metric-icon" />
                  <span className="metric-label">Overall Productivity</span>
                </div>
                <div className="metric-value">82%</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+7%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Brain className="metric-icon" />
                  <span className="metric-label">Focus Score</span>
                </div>
                <div className="metric-value">72%</div>
                <div className="metric-trend">
                  <Activity className="trend-icon" />
                  <span>Stable</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Zap className="metric-icon" />
                  <span className="metric-label">Efficiency</span>
                </div>
                <div className="metric-value">87%</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+5%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Users className="metric-icon" />
                  <span className="metric-label">Collaboration</span>
                </div>
                <div className="metric-value">65%</div>
                <div className="metric-trend">
                  <TrendingUp className="trend-icon" />
                  <span>+3%</span>
                </div>
              </div>
            </div>

            <div className="quick-insights">
              <h3>Quick Insights</h3>
              <div className="insights-grid">
                {insights.slice(0, 4).map((insight) => (
                  <div key={insight.id} className="insight-card">
                    <div className="insight-header">
                      <div className="insight-icon">
                        {getInsightIcon(insight.type)}
                      </div>
                      <span className={`impact-badge ${insight.impact}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <h4 className="insight-title">{insight.title}</h4>
                    <p className="insight-description">{insight.description}</p>
                    {insight.estimatedImprovement && (
                      <div className="improvement-estimate">
                        {insight.estimatedImprovement}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="metrics-tab">
            <div className="metrics-list">
              <h3>Productivity Metrics</h3>
              {productivityMetrics.map((metric) => (
                <div key={metric.id} className="metric-item">
                  <div className="metric-info">
                    <div className="metric-header">
                      <div className="metric-icon">
                        {getCategoryIcon(metric.category)}
                      </div>
                      <div className="metric-details">
                        <h4 className="metric-name">{metric.name}</h4>
                        <p className="metric-description">{metric.description}</p>
                      </div>
                    </div>
                    <div className="metric-values">
                      <div className="current-value">
                        <span className="value">{metric.value}%</span>
                        <span className="target">/ {metric.target}%</span>
                      </div>
                      <div className="metric-trend">
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill width-${Math.round(((metric.value / metric.target) * 100) / 5) * 5}`}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>0%</span>
                      <span>{metric.target}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="insights-list">
              <h3>Actionable Insights</h3>
              {insights.map((insight) => (
                <div key={insight.id} className="insight-item">
                  <div className="insight-icon">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="insight-content">
                    <div className="insight-header">
                      <h4 className="insight-title">{insight.title}</h4>
                      <div className="insight-meta">
                        <span className={`impact-badge ${insight.impact}`}>
                          {insight.impact} impact
                        </span>
                        <span className="effort-badge">
                          {insight.effort} effort
                        </span>
                      </div>
                    </div>
                    <p className="insight-description">{insight.description}</p>
                    {insight.estimatedImprovement && (
                      <div className="improvement-estimate">
                        <Zap className="improvement-icon" />
                        <span>{insight.estimatedImprovement}</span>
                      </div>
                    )}
                  </div>
                  {insight.actionable && (
                    <button className="action-button">
                      Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="goals-tab">
            <div className="goals-list">
              <h3>Productivity Goals</h3>
              {goals.map((goal) => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-info">
                    <div className="goal-header">
                      <h4 className="goal-title">{goal.title}</h4>
                      <span className={`goal-status ${getGoalStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="goal-description">{goal.description}</p>
                    <div className="goal-deadline">
                      <Calendar className="deadline-icon" />
                      <span>Due: {goal.deadline.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-info">
                      <span className="current-progress">{goal.current}</span>
                      <span className="target-progress">/ {goal.target}</span>
                    </div>
                    <div className="progress-bar">
                    <div 
                      className={`progress-fill width-${Math.round(((goal.current / goal.target) * 100) / 5) * 5}`}
                    ></div>
                    </div>
                    <div className="progress-percentage">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-tab">
            <div className="work-patterns">
              <h3>Work Patterns</h3>
              <div className="patterns-grid">
                <div className="pattern-card">
                  <h4>Peak Hours</h4>
                  <div className="pattern-value">
                    {workPatterns.peakHours.map(hour => `${hour}:00`).join(', ')}
                  </div>
                  <p>Your most productive hours</p>
                </div>
                <div className="pattern-card">
                  <h4>Most Productive Day</h4>
                  <div className="pattern-value">{workPatterns.mostProductiveDay}</div>
                  <p>Based on task completion and focus</p>
                </div>
                <div className="pattern-card">
                  <h4>Average Session</h4>
                  <div className="pattern-value">{workPatterns.averageSessionLength} min</div>
                  <p>Typical work session length</p>
                </div>
                <div className="pattern-card">
                  <h4>Break Frequency</h4>
                  <div className="pattern-value">Every {workPatterns.breakFrequency} hours</div>
                  <p>How often you take breaks</p>
                </div>
                <div className="pattern-card">
                  <h4>Multitasking Level</h4>
                  <div className="pattern-value">{workPatterns.multitaskingLevel}%</div>
                  <p>Percentage of time multitasking</p>
                </div>
                <div className="pattern-card">
                  <h4>Focus Score</h4>
                  <div className="pattern-value">{workPatterns.focusScore}%</div>
                  <p>Overall focus effectiveness</p>
                </div>
              </div>
            </div>

            <div className="pattern-recommendations">
              <h3>Pattern-Based Recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <div className="rec-icon">⏰</div>
                  <div className="rec-content">
                    <h4>Schedule Deep Work</h4>
                    <p>Use your peak hours (9-11 AM) for complex, focused tasks</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">🧠</div>
                  <div className="rec-content">
                    <h4>Optimize Session Length</h4>
                    <p>Your 25-minute sessions are optimal. Consider Pomodoro technique</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">🎯</div>
                  <div className="rec-content">
                    <h4>Reduce Multitasking</h4>
                    <p>Lower multitasking from 75% to 60% to improve focus</p>
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
