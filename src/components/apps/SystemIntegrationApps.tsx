import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';

// Telegram Bot App
export const TelegramBotApp: React.FC = () => {
  const [botStatus, setBotStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [botConfig, setBotConfig] = useState({
    token: '',
    webhookUrl: '',
    enabled: false
  });

  useEffect(() => {
    loadBotStatus();
    loadMessages();
    loadBotConfig();
  }, []);

  const loadBotStatus = async () => {
    try {
      const response = await apiClient.request('/api/telegram/status');
      setBotStatus(response.status);
    } catch (error) {
      console.error('Failed to load bot status:', error);
      setBotStatus('error');
    }
  };

  const loadMessages = async () => {
    try {
      const response = await apiClient.request('/api/telegram/messages');
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadBotConfig = async () => {
    try {
      const response = await apiClient.request('/api/telegram/config');
      setBotConfig(response.config || botConfig);
    } catch (error) {
      console.error('Failed to load bot config:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await apiClient.request('/api/telegram/send', {
        method: 'POST',
        body: JSON.stringify({ message: newMessage })
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleBot = async () => {
    try {
      const action = botConfig.enabled ? 'stop' : 'start';
      await apiClient.request(`/api/telegram/${action}`, {
        method: 'POST'
      });
      setBotConfig(prev => ({ ...prev, enabled: !prev.enabled }));
      loadBotStatus();
    } catch (error) {
      console.error('Failed to toggle bot:', error);
    }
  };

  const updateConfig = async () => {
    try {
      await apiClient.request('/api/telegram/config', {
        method: 'PUT',
        body: JSON.stringify(botConfig)
      });
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  return (
    <div className="telegram-bot-app">
      <div className="telegram-header">
        <h2>🤖 Telegram Bot</h2>
        <div className={`bot-status ${botStatus}`}>
          <span className="status-indicator"></span>
          {botStatus.charAt(0).toUpperCase() + botStatus.slice(1)}
        </div>
      </div>

      <div className="telegram-content">
        <div className="bot-controls">
          <div className="control-section">
            <h3>Bot Configuration</h3>
            <div className="config-form">
              <div className="form-group">
                <label>Bot Token</label>
                <input
                  type="password"
                  value={botConfig.token}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, token: e.target.value }))}
                  placeholder="Enter bot token..."
                />
              </div>
              <div className="form-group">
                <label>Webhook URL</label>
                <input
                  type="url"
                  value={botConfig.webhookUrl}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              <div className="form-actions">
                <button onClick={updateConfig} className="action-btn">
                  Save Config
                </button>
                <button 
                  onClick={toggleBot} 
                  className={`toggle-btn ${botConfig.enabled ? 'stop' : 'start'}`}
                >
                  {botConfig.enabled ? 'Stop Bot' : 'Start Bot'}
                </button>
              </div>
            </div>
          </div>

          <div className="control-section">
            <h3>Send Message</h3>
            <div className="message-form">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={3}
              />
              <button onClick={sendMessage} className="send-btn">
                Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="messages-section">
          <h3>Recent Messages</h3>
          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Automation Dashboard App
export const AutomationDashboardApp: React.FC = () => {
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [automationStats, setAutomationStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    completedTasks: 0,
    failedTasks: 0
  });

  useEffect(() => {
    loadWorkflows();
    loadActiveWorkflows();
    loadStats();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await apiClient.getAutomationWorkflows();
      setWorkflows(response.workflows || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const loadActiveWorkflows = async () => {
    try {
      const response = await apiClient.request('/api/automation/active');
      setActiveWorkflows(response.workflows || []);
    } catch (error) {
      console.error('Failed to load active workflows:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.request('/api/automation/stats');
      setAutomationStats(response.stats || automationStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      await apiClient.executeWorkflow(workflowId, {});
      loadActiveWorkflows();
      loadStats();
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  const stopWorkflow = async (workflowId: string) => {
    try {
      await apiClient.request(`/api/automation/workflows/${workflowId}/stop`, {
        method: 'POST'
      });
      loadActiveWorkflows();
    } catch (error) {
      console.error('Failed to stop workflow:', error);
    }
  };

  return (
    <div className="automation-dashboard">
      <div className="automation-header">
        <h2>⚡ Automation Dashboard</h2>
        <div className="automation-stats">
          <div className="stat-item">
            <span className="stat-value">{automationStats.totalWorkflows}</span>
            <span className="stat-label">Total Workflows</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.activeWorkflows}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.failedTasks}</span>
            <span className="stat-label">Failed</span>
          </div>
        </div>
      </div>

      <div className="automation-content">
        <div className="workflows-section">
          <h3>Available Workflows</h3>
          <div className="workflows-grid">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="workflow-card">
                <div className="workflow-header">
                  <h4>{workflow.name}</h4>
                  <span className={`workflow-status ${workflow.status}`}>
                    {workflow.status}
                  </span>
                </div>
                <div className="workflow-description">
                  {workflow.description}
                </div>
                <div className="workflow-actions">
                  <button 
                    onClick={() => executeWorkflow(workflow.id)}
                    className="execute-btn"
                  >
                    Execute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="active-workflows-section">
          <h3>Active Workflows</h3>
          <div className="active-workflows-list">
            {activeWorkflows.length === 0 ? (
              <div className="no-active-workflows">
                <p>No active workflows</p>
              </div>
            ) : (
              activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="active-workflow">
                  <div className="workflow-info">
                    <h4>{workflow.name}</h4>
                    <span className="workflow-progress">
                      {workflow.progress}% complete
                    </span>
                  </div>
                  <div className="workflow-controls">
                    <button 
                      onClick={() => stopWorkflow(workflow.id)}
                      className="stop-btn"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// MCP Tools App
export const MCPToolsApp: React.FC = () => {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [toolParams, setToolParams] = useState({});

  useEffect(() => {
    loadMCPTools();
  }, []);

  const loadMCPTools = async () => {
    try {
      const response = await apiClient.getMCPTools();
      setTools(response.tools || []);
    } catch (error) {
      console.error('Failed to load MCP tools:', error);
    }
  };

  const executeTool = async () => {
    if (!selectedTool) return;

    try {
      const response = await apiClient.executeMCPTool(selectedTool.id, toolParams);
      setExecutionResult(response);
    } catch (error) {
      console.error('Failed to execute tool:', error);
      setExecutionResult({ error: error.message });
    }
  };

  const updateParam = (paramName: string, value: any) => {
    setToolParams(prev => ({ ...prev, [paramName]: value }));
  };

  return (
    <div className="mcp-tools-app">
      <div className="mcp-header">
        <h2>🔧 MCP Tools</h2>
        <p>Model Context Protocol Tools Integration</p>
      </div>

      <div className="mcp-content">
        <div className="tools-sidebar">
          <h3>Available Tools</h3>
          <div className="tools-list">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className={`tool-item ${selectedTool?.id === tool.id ? 'active' : ''}`}
                onClick={() => setSelectedTool(tool)}
              >
                <div className="tool-icon">{tool.icon || '🔧'}</div>
                <div className="tool-info">
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-description">{tool.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-executor">
          {selectedTool ? (
            <div className="executor-content">
              <div className="tool-details">
                <h3>{selectedTool.name}</h3>
                <p>{selectedTool.description}</p>
              </div>

              <div className="tool-parameters">
                <h4>Parameters</h4>
                {selectedTool.parameters?.map((param) => (
                  <div key={param.name} className="param-group">
                    <label>{param.name}</label>
                    <input
                      type={param.type || 'text'}
                      value={toolParams[param.name] || ''}
                      onChange={(e) => updateParam(param.name, e.target.value)}
                      placeholder={param.description}
                    />
                  </div>
                ))}
              </div>

              <div className="execution-controls">
                <button onClick={executeTool} className="execute-btn">
                  Execute Tool
                </button>
              </div>

              {executionResult && (
                <div className="execution-result">
                  <h4>Result</h4>
                  <pre className="result-content">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="no-tool-selected">
              <p>Select a tool from the sidebar to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
