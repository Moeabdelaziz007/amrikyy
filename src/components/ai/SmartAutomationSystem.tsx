import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

interface SmartRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'behavior' | 'pattern' | 'ai-detected';
    conditions: string[];
    aiConfidence?: number;
  };
  action: {
    type: 'create_task' | 'send_notification' | 'optimize_system' | 'learn_pattern';
    parameters: any;
    aiSuggestion?: string;
  };
  isActive: boolean;
  learningData: {
    successRate: number;
    usageCount: number;
    lastLearned: Date;
    aiInsights: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AIInsight {
  id: string;
  type: 'productivity' | 'optimization' | 'pattern' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
  timestamp: Date;
}

export const SmartAutomationSystem: React.FC = () => {
  const { user } = useAuth();
  const [smartRules, setSmartRules] = useState<SmartRule[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [aiLearning, setAiLearning] = useState(false);
  const [systemOptimization, setSystemOptimization] = useState({
    cpuOptimization: 0,
    memoryOptimization: 0,
    networkOptimization: 0,
    productivityScore: 0
  });

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch Smart Rules
    const qRules = query(
      collection(db, 'smartRules'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeRules = onSnapshot(qRules, (snapshot) => {
      const rulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        learningData: {
          ...doc.data().learningData,
          lastLearned: doc.data().learningData?.lastLearned?.toDate()
        }
      })) as SmartRule[];
      setSmartRules(rulesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching smart rules:', error);
      setLoading(false);
    });

    // Fetch AI Insights
    const qInsights = query(
      collection(db, 'aiInsights'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribeInsights = onSnapshot(qInsights, (snapshot) => {
      const insightsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as AIInsight[];
      setAiInsights(insightsData);
    }, (error) => {
      console.error('Error fetching AI insights:', error);
    });

    return () => {
      unsubscribeRules();
      unsubscribeInsights();
    };
  }, [user]);

  // AI Learning Simulation
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(() => {
      if (user && Math.random() > 0.7) {
        generateAIInsight();
        updateSystemOptimization();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const generateAIInsight = async () => {
    if (!user) return;

    const insights = [
      {
        type: 'productivity' as const,
        title: 'Peak Productivity Detected',
        description: 'You are most productive between 10 AM - 12 PM. Consider scheduling important tasks during this time.',
        confidence: 0.85,
        actionable: true,
        suggestedAction: 'Schedule high-priority tasks for 10 AM - 12 PM'
      },
      {
        type: 'optimization' as const,
        title: 'System Performance Optimization',
        description: 'CPU usage is consistently high during video calls. Consider closing unnecessary applications.',
        confidence: 0.92,
        actionable: true,
        suggestedAction: 'Auto-close non-essential apps during video calls'
      },
      {
        type: 'pattern' as const,
        title: 'Work Pattern Analysis',
        description: 'You tend to complete tasks faster when working in 25-minute focused sessions.',
        confidence: 0.78,
        actionable: true,
        suggestedAction: 'Implement Pomodoro technique automation'
      },
      {
        type: 'prediction' as const,
        title: 'Task Completion Prediction',
        description: 'Based on current progress, you will likely complete your project 2 days ahead of schedule.',
        confidence: 0.88,
        actionable: false
      }
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    try {
      await addDoc(collection(db, 'aiInsights'), {
        userId: user.uid,
        ...randomInsight,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
    }
  };

  const updateSystemOptimization = () => {
    setSystemOptimization(prev => ({
      cpuOptimization: Math.min(100, prev.cpuOptimization + Math.random() * 5),
      memoryOptimization: Math.min(100, prev.memoryOptimization + Math.random() * 3),
      networkOptimization: Math.min(100, prev.networkOptimization + Math.random() * 4),
      productivityScore: Math.min(100, prev.productivityScore + Math.random() * 2)
    }));
  };

  const createSmartRule = async (ruleData: Partial<SmartRule>) => {
    if (!user) return;

    try {
      const newRule: Omit<SmartRule, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: any; updatedAt: any } = {
        userId: user.uid,
        name: ruleData.name || 'Smart Rule',
        description: ruleData.description || '',
        trigger: ruleData.trigger || { type: 'time', conditions: [] },
        action: ruleData.action || { type: 'create_task', parameters: {} },
        isActive: ruleData.isActive ?? true,
        learningData: {
          successRate: 0,
          usageCount: 0,
          lastLearned: new Date(),
          aiInsights: []
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'smartRules'), newRule);
      setShowCreateRule(false);
    } catch (error) {
      console.error('Error creating smart rule:', error);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'smartRules', ruleId), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling rule status:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this smart rule?')) {
      try {
        await deleteDoc(doc(db, 'smartRules', ruleId));
      } catch (error) {
        console.error('Error deleting rule:', error);
      }
    }
  };

  const startAILearning = async () => {
    setAiLearning(true);
    
    // Simulate AI learning process
    setTimeout(() => {
      setAiLearning(false);
      generateAIInsight();
    }, 3000);
  };

  const applyInsightAction = async (insight: AIInsight) => {
    if (!insight.actionable || !insight.suggestedAction) return;

    try {
      // Create a smart rule based on the insight
      await createSmartRule({
        name: `Auto: ${insight.title}`,
        description: insight.description,
        trigger: {
          type: 'ai-detected',
          conditions: [insight.suggestedAction],
          aiConfidence: insight.confidence
        },
        action: {
          type: 'learn_pattern',
          parameters: { insightId: insight.id },
          aiSuggestion: insight.suggestedAction
        }
      });

      // Mark insight as applied
      await addDoc(collection(db, 'aiInsights'), {
        
        type: 'optimization',
        title: 'Insight Applied',
        description: `Applied insight: ${insight.title}`,
        confidence: 1.0,
        actionable: false,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error applying insight:', error);
    }
  };

  if (loading) {
    return (
      <div className="smart-automation-system">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AI-powered automation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="smart-automation-system">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access AI-powered automation</p>
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
    <div className="smart-automation-system">
      <div className="automation-header">
        <h2>🤖 Smart Automation System</h2>
        <div className="header-actions">
          <button 
            className={`ai-learning-btn ${aiLearning ? 'learning' : ''}`}
            onClick={startAILearning}
            disabled={aiLearning}
          >
            {aiLearning ? '🧠 Learning...' : '🧠 AI Learning'}
          </button>
          <button 
            className="create-rule-btn"
            onClick={() => setShowCreateRule(true)}
          >
            + Create Smart Rule
          </button>
        </div>
      </div>

      {/* System Optimization Dashboard */}
      <div className="optimization-dashboard">
        <h3>📊 System Optimization</h3>
        <div className="optimization-grid">
          <div className="optimization-card">
            <div className="optimization-icon">⚡</div>
            <div className="optimization-info">
              <h4>CPU Optimization</h4>
              <div className="optimization-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${systemOptimization.cpuOptimization}%` }}
                ></div>
                <span>{Math.round(systemOptimization.cpuOptimization)}%</span>
              </div>
            </div>
          </div>
          
          <div className="optimization-card">
            <div className="optimization-icon">💾</div>
            <div className="optimization-info">
              <h4>Memory Optimization</h4>
              <div className="optimization-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${systemOptimization.memoryOptimization}%` }}
                ></div>
                <span>{Math.round(systemOptimization.memoryOptimization)}%</span>
              </div>
            </div>
          </div>
          
          <div className="optimization-card">
            <div className="optimization-icon">🌐</div>
            <div className="optimization-info">
              <h4>Network Optimization</h4>
              <div className="optimization-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${systemOptimization.networkOptimization}%` }}
                ></div>
                <span>{Math.round(systemOptimization.networkOptimization)}%</span>
              </div>
            </div>
          </div>
          
          <div className="optimization-card">
            <div className="optimization-icon">📈</div>
            <div className="optimization-info">
              <h4>Productivity Score</h4>
              <div className="optimization-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${systemOptimization.productivityScore}%` }}
                ></div>
                <span>{Math.round(systemOptimization.productivityScore)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="ai-insights-section">
        <h3>🧠 AI Insights</h3>
        <div className="insights-grid">
          {aiInsights.map(insight => (
            <div key={insight.id} className={`insight-card ${insight.type}`}>
              <div className="insight-header">
                <h4>{insight.title}</h4>
                <div className="confidence-badge">
                  {Math.round(insight.confidence * 100)}%
                </div>
              </div>
              <p className="insight-description">{insight.description}</p>
              {insight.actionable && insight.suggestedAction && (
                <div className="insight-action">
                  <p className="suggested-action">{insight.suggestedAction}</p>
                  <button 
                    className="apply-action-btn"
                    onClick={() => applyInsightAction(insight)}
                  >
                    Apply Action
                  </button>
                </div>
              )}
              <div className="insight-meta">
                <span className="insight-type">{insight.type}</span>
                <span className="insight-time">
                  {insight.timestamp.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Rules */}
      <div className="smart-rules-section">
        <h3>⚡ Smart Rules</h3>
        <div className="rules-grid">
          {smartRules.map(rule => (
            <div key={rule.id} className={`rule-card ${rule.isActive ? 'active' : 'inactive'}`}>
              <div className="rule-header">
                <h4>{rule.name}</h4>
                <div className="rule-status">
                  <span className={`status-indicator ${rule.isActive ? 'active' : 'inactive'}`}>
                    {rule.isActive ? '🟢' : '🔴'}
                  </span>
                  <span>{rule.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <p className="rule-description">{rule.description}</p>
              <div className="rule-details">
                <div className="rule-trigger">
                  <strong>Trigger:</strong> {rule.trigger.type}
                  {rule.trigger.aiConfidence && (
                    <span className="ai-confidence">
                      AI Confidence: {Math.round(rule.trigger.aiConfidence * 100)}%
                    </span>
                  )}
                </div>
                <div className="rule-action">
                  <strong>Action:</strong> {rule.action.type}
                </div>
              </div>
              <div className="learning-metrics">
                <div className="metric">
                  <span>Success Rate:</span>
                  <span>{Math.round(rule.learningData.successRate * 100)}%</span>
                </div>
                <div className="metric">
                  <span>Usage Count:</span>
                  <span>{rule.learningData.usageCount}</span>
                </div>
              </div>
              <div className="rule-actions">
                <button
                  onClick={() => toggleRuleStatus(rule.id, rule.isActive)}
                  className={`action-btn ${rule.isActive ? 'deactivate' : 'activate'}`}
                >
                  {rule.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateRule && (
        <div className="create-rule-overlay">
          <div className="create-rule-modal">
            <h3>Create Smart Rule</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              createSmartRule({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                trigger: {
                  type: formData.get('triggerType') as any,
                  conditions: [(formData.get('conditions') as string) || '']
                },
                action: {
                  type: formData.get('actionType') as any,
                  parameters: {}
                }
              });
            }}>
              <input
                type="text"
                name="name"
                placeholder="Rule Name"
                required
              />
              <textarea aria-label="Text area"
                name="description"
                placeholder="Description"
                rows={3}
              ></textarea>
              <select aria-label="Select option" name="triggerType" required>
                <option value="time">Time-based</option>
                <option value="behavior">Behavior-based</option>
                <option value="pattern">Pattern-based</option>
                <option value="ai-detected">AI-detected</option>
              </select>
              <input
                type="text"
                name="conditions"
                placeholder="Trigger Conditions"
              />
              <select aria-label="Select option" name="actionType" required>
                <option value="create_task">Create Task</option>
                <option value="send_notification">Send Notification</option>
                <option value="optimize_system">Optimize System</option>
                <option value="learn_pattern">Learn Pattern</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Create Rule</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateRule(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
