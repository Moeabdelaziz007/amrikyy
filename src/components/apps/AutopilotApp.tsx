import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Data structures
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
    type: 'create_note';
    parameters: any;
  }>;
  isActive: boolean;
  lastRun?: string;
  runCount: number;
  successRate: number;
}

interface AutomationLog {
  id: string;
  ruleName: string;
  status: 'success' | 'error' | 'running';
  message: string;
  timestamp: string;
}

const automationSuggestions = [
  {
    name: 'Daily Morning Briefing',
    description: 'Creates a new note every morning with your daily schedule and top tasks.',
    trigger: { type: 'schedule', value: '08:00', frequency: 'daily' },
    actions: [{ type: 'create_note', parameters: { title: 'Morning Briefing for {date}', content: 'Your tasks for today are...' } }],
  },
  {
    name: 'Weekly Project Summary',
    description: 'Generates a summary note for your main project every Friday.',
    trigger: { type: 'schedule', value: 'Friday', frequency: 'weekly' },
    actions: [{ type: 'create_note', parameters: { title: 'Project Summary for Week {week}', content: 'Summary of activities...' } }],
  },
];

export const AutopilotApp: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState(automationSuggestions[0]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [rulesRes, logsRes] = await Promise.all([
        fetch('/api/autopilot/rules'),
        fetch('/api/autopilot/logs'),
      ]);
      const rulesData = await rulesRes.json();
      const logsData = await logsRes.json();
      setRules(rulesData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load autopilot data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateRule = async (ruleData: Omit<AutomationRule, 'id' | 'isActive' | 'lastRun' | 'runCount' | 'successRate'>) => {
    try {
      const response = await fetch('/api/autopilot/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData),
      });
      if (!response.ok) throw new Error('Failed to create rule');
      await fetchData(); // Refresh data
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleToggleRule = async (rule: AutomationRule) => {
    try {
      const response = await fetch(`/api/autopilot/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rule, isActive: !rule.isActive }),
      });
      if (!response.ok) throw new Error('Failed to toggle rule');
      await fetchData();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        const response = await fetch(`/api/autopilot/rules/${ruleId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete rule');
        await fetchData();
      } catch (error) {
        console.error('Error deleting rule:', error);
      }
    }
  };

  if (loading) return <div>Loading Autopilot...</div>;
  if (!user) return <div>Please sign in to use Autopilot.</div>;

  return (
    <div className="autopilot-app">
      <div className="autopilot-header">
        <h2>🛸 Autopilot</h2>
        <button onClick={() => setShowCreateForm(true)}>+ New Rule</button>
      </div>

      <div className="tab-navigation">
        <button onClick={() => setActiveTab('rules')} className={activeTab === 'rules' ? 'active' : ''}>Rules</button>
        <button onClick={() => setActiveTab('logs')} className={activeTab === 'logs' ? 'active' : ''}>Logs</button>
        <button onClick={() => setActiveTab('suggestions')} className={activeTab === 'suggestions' ? 'active' : ''}>Suggestions</button>
      </div>

      {showCreateForm && (
        <div className="create-rule-form">
          <h3>Create a New Rule</h3>
          <input
            type="text"
            placeholder="Rule Name"
            value={newRule.name}
            onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newRule.description}
            onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
          />
          <button onClick={() => handleCreateRule(newRule)}>Create Rule</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="rules-grid">
          {rules.map(rule => (
            <div key={rule.id} className="rule-card">
              <h4>{rule.name}</h4>
              <p>{rule.description}</p>
              <p>Status: {rule.isActive ? 'Active' : 'Paused'}</p>
              <button onClick={() => handleToggleRule(rule)}>{rule.isActive ? 'Pause' : 'Resume'}</button>
              <button onClick={() => handleDeleteRule(rule.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="logs-list">
          {logs.map(log => (
            <div key={log.id} className="log-item">
              <p><strong>{log.ruleName}</strong>: {log.message} ({log.status})</p>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="suggestions-grid">
          {automationSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">
              <h4>{suggestion.name}</h4>
              <p>{suggestion.description}</p>
              <button onClick={() => handleCreateRule(suggestion)}>+ Add This Automation</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
