import React, { useState, useEffect } from 'react';
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

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    value: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
  actions: Array<{
    type: 'create_task' | 'send_notification' | 'update_status' | 'run_script';
    parameters: any;
  }>;
  isActive: boolean;
  lastRun: Date | null;
  runCount: number;
  successRate: number;
  createdAt: Date;
}

interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  status: 'success' | 'error' | 'running';
  message: string;
  timestamp: Date;
  duration: number;
}

export const AutopilotApp: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger: {
      type: 'schedule' as 'schedule' | 'event' | 'condition',
      value: '',
      frequency: 'daily' as 'daily' | 'weekly' | 'monthly'
    },
    actions: [{
      type: 'create_task' as 'create_task' | 'send_notification' | 'update_status' | 'run_script',
      parameters: {}
    }]
  });
  const [systemStatus, setSystemStatus] = useState({
    totalRules: 0,
    activeRules: 0,
    totalRuns: 0,
    successRate: 0,
    lastActivity: 'Never'
  });
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadAutomationData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAutomationData = () => {
    if (!user) return;
    
    // Load automation rules
    const rulesRef = collection(db, 'automationRules');
    const rulesQuery = query(rulesRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribeRules = onSnapshot(rulesQuery, (snapshot) => {
      const rulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRun: doc.data().lastRun?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as AutomationRule[];
      setRules(rulesData);
      updateSystemStatus(rulesData);
    }, (error) => {
      console.error('Failed to load automation rules:', error);
    });

    // Load automation logs
    const logsRef = collection(db, 'automationLogs');
    const logsQuery = query(logsRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as AutomationLog[];
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load automation logs:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeRules();
      unsubscribeLogs();
    };
  };

  const updateSystemStatus = (rulesData: AutomationRule[]) => {
    const totalRules = rulesData.length;
    const activeRules = rulesData.filter(rule => rule.isActive).length;
    const totalRuns = rulesData.reduce((sum, rule) => sum + rule.runCount, 0);
    const successRate = rulesData.length > 0 
      ? rulesData.reduce((sum, rule) => sum + rule.successRate, 0) / rulesData.length 
      : 0;
    
    const lastActivity = rulesData.length > 0 
      ? rulesData.reduce((latest, rule) => {
          if (!rule.lastRun) return latest;
          if (!latest) return rule.lastRun;
          return rule.lastRun > latest ? rule.lastRun : latest;
        }, null as Date | null)?.toLocaleString() || 'Never'
      : 'Never';

    setSystemStatus({
      totalRules,
      activeRules,
      totalRuns,
      successRate,
      lastActivity
    });
  };

  const createRule = async () => {
    if (!newRule.name.trim() || !user) return;

    try {
      const ruleData = {
        ...newRule,
        userId: user.uid,
        isActive: true,
        lastRun: null,
        runCount: 0,
        successRate: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'automationRules'), ruleData);
      setShowCreateForm(false);
      setNewRule({
        name: '',
        description: '',
        trigger: { type: 'schedule', value: '', frequency: 'daily' },
        actions: [{ type: 'create_task', parameters: {} }]
      });
    } catch (error) {
      console.error('Failed to create automation rule:', error);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const ruleRef = doc(db, 'automationRules', ruleId);
      await updateDoc(ruleRef, {
        isActive: !isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const runRule = async (ruleId: string) => {
    try {
      const rule = rules.find(r => r.id === ruleId);
      if (!rule) return;

      // Create log entry
      const logData = {
        ruleId: rule.id,
        ruleName: rule.name,
        status: 'running',
        message: 'Rule execution started',
        timestamp: serverTimestamp(),
        duration: 0,
        userId: user?.uid
      };

      const logRef = await addDoc(collection(db, 'automationLogs'), logData);

      // Simulate rule execution
      setTimeout(async () => {
        const success = Math.random() > 0.2; // 80% success rate
        const duration = Math.floor(Math.random() * 2000) + 500; // 500-2500ms

        await updateDoc(logRef, {
          status: success ? 'success' : 'error',
          message: success ? 'Rule executed successfully' : 'Rule execution failed',
          duration
        });

        // Update rule stats
        const ruleRef = doc(db, 'automationRules', ruleId);
        await updateDoc(ruleRef, {
          lastRun: serverTimestamp(),
          runCount: rule.runCount + 1,
          successRate: ((rule.successRate * rule.runCount) + (success ? 100 : 0)) / (rule.runCount + 1)
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to run rule:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await deleteDoc(doc(db, 'automationRules', ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule': return '⏰';
      case 'event': return '🎯';
      case 'condition': return '🔍';
      default: return '⚡';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      case 'running': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="autopilot-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading autopilot system...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="autopilot-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access autopilot features</p>
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
    <div className="autopilot-app">
      <div className="autopilot-header">
        <h2>🛸 Autopilot</h2>
        <div className="header-actions">
          <button 
            className="create-rule-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + New Rule
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-card">
          <div className="status-icon">📊</div>
          <div className="status-info">
            <h4>Total Rules</h4>
            <span className="status-value">{systemStatus.totalRules}</span>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon">⚡</div>
          <div className="status-info">
            <h4>Active Rules</h4>
            <span className="status-value">{systemStatus.activeRules}</span>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon">🔄</div>
          <div className="status-info">
            <h4>Total Runs</h4>
            <span className="status-value">{systemStatus.totalRuns}</span>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon">✅</div>
          <div className="status-info">
            <h4>Success Rate</h4>
            <span className="status-value">{systemStatus.successRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          ⚡ Automation Rules
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Execution Logs
        </button>
      </div>

      {/* Create Rule Form */}
      {showCreateForm && (
        <div className="create-rule-overlay">
          <div className="create-rule-form">
            <h3>Create Automation Rule</h3>
            <input
              type="text"
              placeholder="Rule Name"
              value={newRule.name}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea 
              aria-label="Rule description"
              placeholder="Rule Description"
              value={newRule.description}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <div className="trigger-settings">
              <h4>Trigger</h4>
              <select 
                aria-label="Trigger type selection"
                value={newRule.trigger.type}
                onChange={(e) => setNewRule(prev => ({ 
                  ...prev, 
                  trigger: { ...prev.trigger, type: e.target.value as any }
                }))}
              >
                <option value="schedule">Schedule</option>
                <option value="event">Event</option>
                <option value="condition">Condition</option>
              </select>
              {newRule.trigger.type === 'schedule' && (
                <select 
                  aria-label="Frequency selection"
                  value={newRule.trigger.frequency}
                  onChange={(e) => setNewRule(prev => ({ 
                    ...prev, 
                    trigger: { ...prev.trigger, frequency: e.target.value as any }
                  }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            </div>
            <div className="form-actions">
              <button onClick={createRule} className="submit-btn">Create Rule</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="rules-section">
          <div className="rules-grid">
            {rules.map(rule => (
              <div key={rule.id} className="rule-card">
                <div className="rule-header">
                  <div className="rule-info">
                    <h4>{rule.name}</h4>
                    <p>{rule.description}</p>
                  </div>
                  <div className="rule-status">
                    <span className={`status-dot ${rule.isActive ? 'active' : 'inactive'}`}></span>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="rule-details">
                  <div className="rule-trigger">
                    <span className="trigger-icon">{getTriggerIcon(rule.trigger.type)}</span>
                    <span>{rule.trigger.type}: {rule.trigger.value || rule.trigger.frequency}</span>
                  </div>
                  <div className="rule-stats">
                    <span>Runs: {rule.runCount}</span>
                    <span>Success: {rule.successRate.toFixed(1)}%</span>
                    <span>Last: {rule.lastRun?.toLocaleDateString() || 'Never'}</span>
                  </div>
                </div>
                <div className="rule-actions">
                  <button 
                    onClick={() => runRule(rule.id)}
                    className="action-btn primary"
                  >
                    ▶️ Run Now
                  </button>
                  <button 
                    onClick={() => toggleRule(rule.id, rule.isActive)}
                    className={`action-btn ${rule.isActive ? 'warning' : 'success'}`}
                  >
                    {rule.isActive ? '⏸️ Pause' : '▶️ Resume'}
                  </button>
                  <button 
                    onClick={() => deleteRule(rule.id)}
                    className="action-btn danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="logs-section">
          <div className="logs-list">
            {logs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <h4>{log.ruleName}</h4>
                  <span className={`log-status ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </div>
                <p className="log-message">{log.message}</p>
                <div className="log-meta">
                  <span>{log.timestamp.toLocaleString()}</span>
                  <span>{log.duration}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
