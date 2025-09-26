import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface UltimateFeature {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'automation' | 'analytics' | 'ai' | 'integration';
  status: 'active' | 'beta' | 'coming_soon';
  icon: string;
  metrics: {
    usage: number;
    rating: number;
    efficiency: number;
  };
  lastUsed: Date | null;
  createdAt: Date;
}

interface SystemInsight {
  id: string;
  type: 'performance' | 'security' | 'optimization' | 'recommendation';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  timestamp: Date;
}

export const UltimateApp: React.FC = () => {
  const [features, setFeatures] = useState<UltimateFeature[]>([]);
  const [insights, setInsights] = useState<SystemInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    activeSessions: 0,
    systemUptime: '99.9%',
    performanceScore: 95,
    securityScore: 98,
    efficiencyScore: 92
  });
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadUltimateData();
      loadSystemInsights();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUltimateData = () => {
    if (!user) return;
    
    const featuresRef = collection(db, 'ultimateFeatures');
    const q = query(featuresRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const featuresData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUsed: doc.data().lastUsed?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as UltimateFeature[];
      setFeatures(featuresData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load ultimate features:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadSystemInsights = () => {
    if (!user) return;
    
    const insightsRef = collection(db, 'systemInsights');
    const q = query(insightsRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const insightsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as SystemInsight[];
      setInsights(insightsData);
    }, (error) => {
      console.error('Failed to load system insights:', error);
    });

    return unsubscribe;
  };

  const activateFeature = async (featureId: string) => {
    try {
      const featureRef = doc(db, 'ultimateFeatures', featureId);
      await updateDoc(featureRef, {
        status: 'active',
        lastUsed: serverTimestamp(),
        'metrics.usage': features.find(f => f.id === featureId)?.metrics.usage + 1 || 1
      });
    } catch (error) {
      console.error('Failed to activate feature:', error);
    }
  };

  const acknowledgeInsight = async (insightId: string) => {
    try {
      const insightRef = doc(db, 'systemInsights', insightId);
      await updateDoc(insightRef, {
        status: 'acknowledged',
        acknowledgedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to acknowledge insight:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return '⚡';
      case 'automation': return '🤖';
      case 'analytics': return '📊';
      case 'ai': return '🧠';
      case 'integration': return '🔗';
      default: return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'green';
      case 'automation': return 'blue';
      case 'analytics': return 'purple';
      case 'ai': return 'cyan';
      case 'integration': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'beta': return 'text-yellow-400 bg-yellow-900/20';
      case 'coming_soon': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="ultimate-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ultimate features...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ultimate-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access ultimate features</p>
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
    <div className="ultimate-app">
      <div className="ultimate-header">
        <h2>🌟 Ultimate Features</h2>
        <div className="header-actions">
          <button className="refresh-btn">
            🔄 Refresh System
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="system-metrics">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h4>Total Users</h4>
            <span className="metric-value">{systemMetrics.totalUsers}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-info">
            <h4>Active Sessions</h4>
            <span className="metric-value">{systemMetrics.activeSessions}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-info">
            <h4>System Uptime</h4>
            <span className="metric-value">{systemMetrics.systemUptime}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h4>Performance</h4>
            <span className="metric-value">{systemMetrics.performanceScore}%</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔒</div>
          <div className="metric-info">
            <h4>Security</h4>
            <span className="metric-value">{systemMetrics.securityScore}%</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <h4>Efficiency</h4>
            <span className="metric-value">{systemMetrics.efficiencyScore}%</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ⭐ Features
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          🔍 Insights
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>🚀 Quick Actions</h3>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <span className="action-icon">⚡</span>
                  <span>Optimize System</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">🔒</span>
                  <span>Security Scan</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📊</span>
                  <span>Generate Report</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">🔄</span>
                  <span>Sync Data</span>
                </button>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>📈 Performance Overview</h3>
              <div className="performance-chart">
                <div className="chart-bar" style={{ height: '80%' }}>
                  <span>CPU</span>
                </div>
                <div className="chart-bar" style={{ height: '60%' }}>
                  <span>Memory</span>
                </div>
                <div className="chart-bar" style={{ height: '40%' }}>
                  <span>Storage</span>
                </div>
                <div className="chart-bar" style={{ height: '90%' }}>
                  <span>Network</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>🎯 Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <span>Task completed: "Update documentation"</span>
                  <span className="activity-time">2m ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">🔄</span>
                  <span>Automation rule executed</span>
                  <span className="activity-time">5m ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📊</span>
                  <span>Analytics report generated</span>
                  <span className="activity-time">10m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="features-section">
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <span className={`category-icon ${getCategoryColor(feature.category)}`}>
                      {getCategoryIcon(feature.category)}
                    </span>
                  </div>
                  <div className="feature-info">
                    <h4>{feature.name}</h4>
                    <p>{feature.description}</p>
                  </div>
                  <div className="feature-status">
                    <span className={`status-badge ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
                <div className="feature-metrics">
                  <div className="metric">
                    <span className="metric-label">Usage</span>
                    <span className="metric-value">{feature.metrics.usage}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Rating</span>
                    <span className="metric-value">{feature.metrics.rating}/5</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Efficiency</span>
                    <span className="metric-value">{feature.metrics.efficiency}%</span>
                  </div>
                </div>
                <div className="feature-actions">
                  <button 
                    onClick={() => activateFeature(feature.id)}
                    className="action-btn primary"
                    disabled={feature.status === 'coming_soon'}
                  >
                    {feature.status === 'active' ? '✅ Active' : '🚀 Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-list">
            {insights.map(insight => (
              <div key={insight.id} className="insight-card">
                <div className="insight-header">
                  <div className="insight-icon">
                    {insight.type === 'performance' && '⚡'}
                    {insight.type === 'security' && '🔒'}
                    {insight.type === 'optimization' && '📈'}
                    {insight.type === 'recommendation' && '💡'}
                  </div>
                  <div className="insight-info">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                  <div className="insight-priority">
                    <span className={`priority-badge ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
                <div className="insight-meta">
                  <span>{insight.timestamp.toLocaleString()}</span>
                  <span className={`status-badge ${getStatusColor(insight.status)}`}>
                    {insight.status}
                  </span>
                </div>
                <div className="insight-actions">
                  <button 
                    onClick={() => acknowledgeInsight(insight.id)}
                    className="action-btn secondary"
                  >
                    ✓ Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
