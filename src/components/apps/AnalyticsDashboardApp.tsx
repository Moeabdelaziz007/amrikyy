import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Analytics Dashboard App
export const AnalyticsDashboardApp: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    tasks: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      overdue: 0,
      completionRate: 0
    },
    productivity: {
      tasksCompletedToday: 0,
      averageCompletionTime: 0,
      mostProductiveHour: '9 AM',
      streak: 0
    },
    trends: {
      weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
      monthlyGrowth: 0,
      priorityDistribution: { high: 0, medium: 0, low: 0 },
      categoryBreakdown: {}
    },
    system: {
      activeUsers: 1,
      totalSessions: 0,
      averageSessionTime: 0,
      systemUptime: '99.9%'
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        calculateAnalytics(tasksData);
        setLoading(false);
      }, (error) => {
        console.error('Failed to load analytics:', error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Analytics loading error:', error);
      setLoading(false);
    }
  };

  const calculateAnalytics = (tasksData: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Task statistics
    const total = tasksData.length;
    const completed = tasksData.filter(t => t.status === 'completed').length;
    const inProgress = tasksData.filter(t => t.status === 'in-progress').length;
    const pending = tasksData.filter(t => t.status === 'pending').length;
    const overdue = tasksData.filter(t => 
      new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Productivity metrics
    const tasksCompletedToday = tasksData.filter(t => 
      t.status === 'completed' && 
      t.completedAt && 
      new Date(t.completedAt.toDate()) >= today
    ).length;

    const completedTasks = tasksData.filter(t => t.status === 'completed' && t.completedAt);
    const averageCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((acc, task) => {
          const created = new Date(task.createdAt.toDate());
          const completed = new Date(task.completedAt.toDate());
          return acc + (completed.getTime() - created.getTime());
        }, 0) / completedTasks.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // Weekly completion trend
    const weeklyCompletion = [0, 0, 0, 0, 0, 0, 0];
    completedTasks.forEach(task => {
      const completedDate = new Date(task.completedAt.toDate());
      const dayOfWeek = completedDate.getDay();
      if (completedDate >= weekAgo) {
        weeklyCompletion[dayOfWeek]++;
      }
    });

    // Priority distribution
    const priorityDistribution = {
      high: tasksData.filter(t => t.priority === 'high').length,
      medium: tasksData.filter(t => t.priority === 'medium').length,
      low: tasksData.filter(t => t.priority === 'low').length
    };

    // Calculate streak
    let streak = 0;
    const sortedCompletedTasks = completedTasks
      .sort((a, b) => new Date(b.completedAt.toDate()).getTime() - new Date(a.completedAt.toDate()).getTime());
    
    let currentDate = new Date(today);
    for (const task of sortedCompletedTasks) {
      const taskDate = new Date(task.completedAt.toDate());
      if (taskDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (taskDate < currentDate) {
        break;
      }
    }

    setAnalytics({
      tasks: { total, completed, inProgress, pending, overdue, completionRate },
      productivity: {
        tasksCompletedToday,
        averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
        mostProductiveHour: '9 AM', // Mock data
        streak
      },
      trends: {
        weeklyCompletion,
        monthlyGrowth: Math.round((completionRate - 50) * 10) / 10, // Mock growth
        priorityDistribution,
        categoryBreakdown: {}
      },
      system: {
        activeUsers: 1,
        totalSessions: Math.floor(Math.random() * 100) + 50,
        averageSessionTime: Math.floor(Math.random() * 60) + 30,
        systemUptime: '99.9%'
      }
    });
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProductivityLevel = (tasks: number) => {
    if (tasks >= 10) return { level: 'High', color: 'text-green-400', icon: '🚀' };
    if (tasks >= 5) return { level: 'Medium', color: 'text-yellow-400', icon: '⚡' };
    return { level: 'Low', color: 'text-red-400', icon: '🐌' };
  };

  if (loading) {
    return (
      <div className="analytics-dashboard-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="analytics-dashboard-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to view your analytics</p>
          <button 
            className="auth-btn"
            onClick={() => window.location.reload()}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const productivity = getProductivityLevel(analytics.productivity.tasksCompletedToday);

  return (
    <div className="analytics-dashboard-app">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <div className="header-controls">
          <select aria-label="Select option" 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.tasks.completionRate.toFixed(1)}%</div>
            <div className="metric-label">Completion Rate</div>
            <div className={`metric-trend ${getCompletionRateColor(analytics.tasks.completionRate)}`}>
              {analytics.trends.monthlyGrowth > 0 ? '↗' : '↘'} {Math.abs(analytics.trends.monthlyGrowth)}%
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.tasks.completed}</div>
            <div className="metric-label">Tasks Completed</div>
            <div className="metric-trend text-green-400">
              +{analytics.productivity.tasksCompletedToday} today
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.productivity.streak}</div>
            <div className="metric-label">Day Streak</div>
            <div className="metric-trend text-orange-400">
              Keep it up!
            </div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.productivity.averageCompletionTime}h</div>
            <div className="metric-label">Avg. Completion Time</div>
            <div className="metric-trend text-blue-400">
              Per task
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Visualizations */}
      <div className="charts-grid">
        {/* Weekly Completion Chart */}
        <div className="chart-card">
          <h3>📅 Weekly Completion Trend</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {analytics.trends.weeklyCompletion.map((value, index) => {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const maxValue = Math.max(...analytics.trends.weeklyCompletion);
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                
                return (
                  <div key={index} className="bar-item">
                    <div 
                      className="bar" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="bar-label">{days[index]}</div>
                    <div className="bar-value">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="chart-card">
          <h3>🎯 Priority Distribution</h3>
          <div className="priority-chart">
            <div className="priority-item high">
              <div className="priority-bar">
                <div 
                  className="priority-fill high" 
                  style={{ 
                    width: `${analytics.trends.priorityDistribution.high / analytics.tasks.total * 100}%` 
                  }}
                ></div>
              </div>
              <div className="priority-label">
                <span className="priority-dot high"></span>
                High Priority: {analytics.trends.priorityDistribution.high}
              </div>
            </div>
            <div className="priority-item medium">
              <div className="priority-bar">
                <div 
                  className="priority-fill medium" 
                  style={{ 
                    width: `${analytics.trends.priorityDistribution.medium / analytics.tasks.total * 100}%` 
                  }}
                ></div>
              </div>
              <div className="priority-label">
                <span className="priority-dot medium"></span>
                Medium Priority: {analytics.trends.priorityDistribution.medium}
              </div>
            </div>
            <div className="priority-item low">
              <div className="priority-bar">
                <div 
                  className="priority-fill low" 
                  style={{ 
                    width: `${analytics.trends.priorityDistribution.low / analytics.tasks.total * 100}%` 
                  }}
                ></div>
              </div>
              <div className="priority-label">
                <span className="priority-dot low"></span>
                Low Priority: {analytics.trends.priorityDistribution.low}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="insights-section">
        <h3>💡 Productivity Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">{productivity.icon}</div>
            <div className="insight-content">
              <h4>Today's Productivity</h4>
              <p className={`insight-value ${productivity.color}`}>
                {productivity.level} ({analytics.productivity.tasksCompletedToday} tasks)
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🕘</div>
            <div className="insight-content">
              <h4>Most Productive Hour</h4>
              <p className="insight-value text-blue-400">
                {analytics.productivity.mostProductiveHour}
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Efficiency Score</h4>
              <p className="insight-value text-green-400">
                {analytics.tasks.completionRate > 70 ? 'Excellent' : 
                 analytics.tasks.completionRate > 50 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <h3>🖥️ System Status</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Active Users:</span>
            <span className="status-value">{analytics.system.activeUsers}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Total Sessions:</span>
            <span className="status-value">{analytics.system.totalSessions}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Avg. Session Time:</span>
            <span className="status-value">{analytics.system.averageSessionTime} min</span>
          </div>
          <div className="status-item">
            <span className="status-label">System Uptime:</span>
            <span className="status-value text-green-400">{analytics.system.systemUptime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
