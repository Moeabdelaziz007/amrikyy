import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// AI-Powered Features App
export const AIFeaturesApp: React.FC = () => {
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [smartCategories, setSmartCategories] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>({});
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [aiSettings, setAiSettings] = useState({
    smartSuggestions: true,
    autoCategorization: true,
    deadlinePrediction: true,
    productivityInsights: true,
    smartNotifications: true,
    learningMode: true
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggestions');
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadAIData();
      loadUserTasks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAIData = () => {
    if (!user) return;
    
    // Load AI suggestions
    const suggestionsRef = collection(db, 'aiSuggestions');
    const q = query(suggestionsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAiSuggestions(suggestionsData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load AI suggestions:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadUserTasks = async () => {
    if (!user) return;

    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Generate AI insights based on tasks
      generateAIInsights(tasks);
      generateSmartCategories(tasks);
      generateAutomationRules(tasks);
    } catch (error) {
      console.error('Failed to load tasks for AI analysis:', error);
    }
  };

  const generateAIInsights = (tasks: any[]) => {
    const insights = {
      productivityScore: calculateProductivityScore(tasks),
      peakHours: findPeakHours(tasks),
      commonPatterns: findCommonPatterns(tasks),
      recommendations: generateRecommendations(tasks),
      trends: analyzeTrends(tasks)
    };
    setAiInsights(insights);
  };

  const calculateProductivityScore = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const completionRate = (completed / total) * 100;
    
    // Factor in completion time
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((acc, task) => {
          const created = new Date(task.createdAt.toDate());
          const completed = new Date(task.completedAt.toDate());
          return acc + (completed.getTime() - created.getTime());
        }, 0) / completedTasks.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // Calculate score (0-100)
    const timeScore = Math.max(0, 100 - (avgCompletionTime * 10)); // Penalize long completion times
    return Math.round((completionRate * 0.7) + (timeScore * 0.3));
  };

  const findPeakHours = (tasks: any[]) => {
    const hourCounts = new Array(24).fill(0);
    
    tasks.forEach(task => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt.toDate()).getHours();
        hourCounts[hour]++;
      }
    });

    const maxCount = Math.max(...hourCounts);
    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count === maxCount)
      .map(item => `${item.hour}:00`);

    return peakHours;
  };

  const findCommonPatterns = (tasks: any[]) => {
    const patterns = {
      frequentCategories: {},
      commonPriorities: {},
      typicalDurations: {}
    };

    tasks.forEach(task => {
      // Category patterns
      if (task.category) {
        patterns.frequentCategories[task.category] = (patterns.frequentCategories[task.category] || 0) + 1;
      }

      // Priority patterns
      if (task.priority) {
        patterns.commonPriorities[task.priority] = (patterns.commonPriorities[task.priority] || 0) + 1;
      }

      // Duration patterns
      if (task.completedAt && task.createdAt) {
        const duration = new Date(task.completedAt.toDate()).getTime() - new Date(task.createdAt.toDate()).getTime();
        const durationHours = Math.round(duration / (1000 * 60 * 60));
        patterns.typicalDurations[durationHours] = (patterns.typicalDurations[durationHours] || 0) + 1;
      }
    });

    return patterns;
  };

  const generateRecommendations = (tasks: any[]) => {
    const recommendations = [];

    // Completion rate recommendation
    const completionRate = (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100;
    if (completionRate < 70) {
      recommendations.push({
        type: 'productivity',
        title: 'Improve Task Completion',
        description: 'Your completion rate is below 70%. Consider breaking down large tasks into smaller ones.',
        priority: 'high'
      });
    }

    // Overdue tasks recommendation
    const overdueTasks = tasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== 'completed'
    );
    if (overdueTasks.length > 0) {
      recommendations.push({
        type: 'deadline',
        title: 'Address Overdue Tasks',
        description: `You have ${overdueTasks.length} overdue tasks. Consider rescheduling or delegating.`,
        priority: 'high'
      });
    }

    // Time management recommendation
    const avgCompletionTime = tasks.filter(t => t.completedAt).length > 0 
      ? tasks.filter(t => t.completedAt).reduce((acc, task) => {
          const created = new Date(task.createdAt.toDate());
          const completed = new Date(task.completedAt.toDate());
          return acc + (completed.getTime() - created.getTime());
        }, 0) / tasks.filter(t => t.completedAt).length / (1000 * 60 * 60)
      : 0;

    if (avgCompletionTime > 24) {
      recommendations.push({
        type: 'time',
        title: 'Optimize Time Management',
        description: 'Tasks are taking longer than expected. Consider time-blocking techniques.',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const analyzeTrends = (tasks: any[]) => {
    const trends = {
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      productivityTrend: 'stable'
    };

    // Calculate weekly growth
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekTasks = tasks.filter(t => new Date(t.createdAt.toDate()) >= weekAgo);
    const lastWeekTasks = tasks.filter(t => 
      new Date(t.createdAt.toDate()) >= twoWeeksAgo && 
      new Date(t.createdAt.toDate()) < weekAgo
    );

    if (lastWeekTasks.length > 0) {
      trends.weeklyGrowth = ((thisWeekTasks.length - lastWeekTasks.length) / lastWeekTasks.length) * 100;
    }

    return trends;
  };

  const generateSmartCategories = (tasks: any[]) => {
    const categories = [
      { name: 'Work', icon: '💼', color: 'blue', count: tasks.filter(t => t.category === 'work').length },
      { name: 'Personal', icon: '👤', color: 'green', count: tasks.filter(t => t.category === 'personal').length },
      { name: 'Health', icon: '🏥', color: 'red', count: tasks.filter(t => t.category === 'health').length },
      { name: 'Learning', icon: '📚', color: 'purple', count: tasks.filter(t => t.category === 'learning').length },
      { name: 'Finance', icon: '💰', color: 'yellow', count: tasks.filter(t => t.category === 'finance').length },
      { name: 'Social', icon: '👥', color: 'cyan', count: tasks.filter(t => t.category === 'social').length }
    ];

    setSmartCategories(categories);
  };

  const generateAutomationRules = (tasks: any[]) => {
    const rules = [
      {
        id: 'auto-categorize',
        name: 'Auto-Categorize Tasks',
        description: 'Automatically categorize tasks based on keywords',
        isActive: true,
        conditions: ['title contains "meeting"', 'title contains "call"'],
        actions: ['set category to "work"']
      },
      {
        id: 'deadline-reminder',
        name: 'Deadline Reminders',
        description: 'Send reminders for tasks approaching deadline',
        isActive: true,
        conditions: ['due date < 24 hours', 'status != "completed"'],
        actions: ['send notification', 'set priority to "high"']
      },
      {
        id: 'follow-up',
        name: 'Follow-up Tasks',
        description: 'Create follow-up tasks for completed items',
        isActive: false,
        conditions: ['status == "completed"', 'category == "work"'],
        actions: ['create follow-up task', 'schedule for next week']
      }
    ];

    setAutomationRules(rules);
  };

  const createAISuggestion = async (suggestion: any) => {
    if (!user) return;

    try {
      const suggestionData = {
        ...suggestion,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'aiSuggestions'), suggestionData);
    } catch (error) {
      console.error('Failed to create AI suggestion:', error);
    }
  };

  const applySuggestion = async (suggestionId: string) => {
    try {
      const suggestionRef = doc(db, 'aiSuggestions', suggestionId);
      await updateDoc(suggestionRef, {
        status: 'applied',
        appliedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  const toggleAutomationRule = async (ruleId: string, isActive: boolean) => {
    try {
      const rule = automationRules.find(r => r.id === ruleId);
      if (rule) {
        rule.isActive = isActive;
        setAutomationRules([...automationRules]);
      }
    } catch (error) {
      console.error('Failed to toggle automation rule:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="ai-features-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AI features...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ai-features-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access AI features</p>
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

  return (
    <div className="ai-features-app">
      <div className="ai-header">
        <h2>🤖 AI-Powered Features</h2>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={loadUserTasks}
          >
            🔄 Refresh AI Analysis
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          💡 Smart Suggestions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 AI Insights
        </button>
        <button 
          className={`tab-btn ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          ⚡ Smart Automation
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ AI Settings
        </button>
      </div>

      {/* Smart Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="suggestions-section">
          <div className="suggestions-grid">
            {aiInsights.recommendations?.map((recommendation: any, index: number) => (
              <div key={index} className="suggestion-card">
                <div className="suggestion-header">
                  <h4>{recommendation.title}</h4>
                  <span className={`suggestion-priority ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority}
                  </span>
                </div>
                <p className="suggestion-description">{recommendation.description}</p>
                <div className="suggestion-actions">
                  <button 
                    onClick={() => createAISuggestion(recommendation)}
                    className="action-btn primary"
                  >
                    Apply Suggestion
                  </button>
                  <button className="action-btn secondary">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <h4>Productivity Score</h4>
                <div className="insight-value">{aiInsights.productivityScore || 0}/100</div>
                <div className="insight-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${aiInsights.productivityScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">🕐</div>
              <div className="insight-content">
                <h4>Peak Hours</h4>
                <div className="insight-value">
                  {aiInsights.peakHours?.join(', ') || 'Not enough data'}
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h4>Weekly Growth</h4>
                <div className="insight-value">
                  {aiInsights.trends?.weeklyGrowth > 0 ? '+' : ''}{aiInsights.trends?.weeklyGrowth?.toFixed(1) || 0}%
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Common Patterns</h4>
                <div className="insight-value">
                  {Object.keys(aiInsights.commonPatterns?.frequentCategories || {}).length} categories
                </div>
              </div>
            </div>
          </div>

          {/* Smart Categories */}
          <div className="categories-section">
            <h3>🏷️ Smart Categories</h3>
            <div className="categories-grid">
              {smartCategories.map(category => (
                <div key={category.name} className="category-card">
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-info">
                    <h4>{category.name}</h4>
                    <p>{category.count} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Automation Tab */}
      {activeTab === 'automation' && (
        <div className="automation-section">
          <div className="automation-rules">
            {automationRules.map(rule => (
              <div key={rule.id} className="automation-rule">
                <div className="rule-header">
                  <h4>{rule.name}</h4>
                  <div className="rule-status">
                    <span className={`status-dot ${rule.isActive ? 'active' : 'inactive'}`}></span>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <p className="rule-description">{rule.description}</p>
                <div className="rule-conditions">
                  <h5>Conditions:</h5>
                  <ul>
                    {rule.conditions.map((condition: string, index: number) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div className="rule-actions">
                  <h5>Actions:</h5>
                  <ul>
                    {rule.actions.map((action: string, index: number) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div className="rule-controls">
                  <button 
                    onClick={() => toggleAutomationRule(rule.id, !rule.isActive)}
                    className={`action-btn ${rule.isActive ? 'warning' : 'success'}`}
                  >
                    {rule.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Settings Tab */}
      {activeTab === 'settings' && (
        <div className="settings-section">
          <div className="settings-grid">
            {Object.entries(aiSettings).map(([key, value]) => (
              <div key={key} className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  />
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
