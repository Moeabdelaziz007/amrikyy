import React, { useState, useEffect, useCallback } from 'react';

// Intelligent Task Types
interface SmartTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  category: string;
  tags: string[];
  dueDate?: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  aiSuggestions: AITaskSuggestion[];
  dependencies: string[];
  context: TaskContext;
}

interface AITaskSuggestion {
  id: string;
  type: 'schedule' | 'priority' | 'breakdown' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  action?: () => void;
}

interface TaskContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayOfWeek: string;
  workload: 'light' | 'medium' | 'heavy';
  energyLevel: 'low' | 'medium' | 'high';
  focusArea: string;
}

interface TaskPattern {
  id: string;
  pattern: string;
  frequency: number;
  confidence: number;
  suggestion: string;
}

interface ProductivityInsight {
  id: string;
  type: 'efficiency' | 'focus' | 'break' | 'schedule';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: Date;
}

// Mock intelligent tasks
const mockSmartTasks: SmartTask[] = [
  {
    id: 'task-1',
    title: 'Review Q4 Budget Proposal',
    description: 'Analyze and provide feedback on the Q4 budget proposal',
    priority: 'high',
    status: 'pending',
    category: 'work',
    tags: ['budget', 'review', 'finance'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    estimatedDuration: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
    aiSuggestions: [
      {
        id: 'sug-1',
        type: 'schedule',
        title: 'Schedule for Morning',
        description: 'You\'re 40% more productive in the morning',
        confidence: 0.85,
        action: () => console.log('Scheduling for morning')
      },
      {
        id: 'sug-2',
        type: 'breakdown',
        title: 'Break into Smaller Tasks',
        description: 'Split into 3 smaller tasks for better focus',
        confidence: 0.78,
        action: () => console.log('Breaking down task')
      }
    ],
    dependencies: [],
    context: {
      timeOfDay: 'morning',
      dayOfWeek: 'Monday',
      workload: 'medium',
      energyLevel: 'high',
      focusArea: 'analytical'
    }
  },
  {
    id: 'task-2',
    title: 'Team Standup Meeting',
    description: 'Daily standup with the development team',
    priority: 'medium',
    status: 'in-progress',
    category: 'meeting',
    tags: ['standup', 'team', 'daily'],
    dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    estimatedDuration: 30,
    actualDuration: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    aiSuggestions: [
      {
        id: 'sug-3',
        type: 'optimization',
        title: 'Prepare Talking Points',
        description: 'AI suggests 3 key points to discuss',
        confidence: 0.92,
        action: () => console.log('Preparing talking points')
      }
    ],
    dependencies: [],
    context: {
      timeOfDay: 'morning',
      dayOfWeek: 'Monday',
      workload: 'light',
      energyLevel: 'medium',
      focusArea: 'communication'
    }
  }
];

const mockTaskPatterns: TaskPattern[] = [
  {
    id: 'pattern-1',
    pattern: 'You complete 80% of high-priority tasks in the morning',
    frequency: 0.85,
    confidence: 0.92,
    suggestion: 'Schedule important tasks for 9-11 AM'
  },
  {
    id: 'pattern-2',
    pattern: 'Tasks with 30-60 minute duration have highest completion rate',
    frequency: 0.78,
    confidence: 0.88,
    suggestion: 'Break large tasks into 45-minute chunks'
  },
  {
    id: 'pattern-3',
    pattern: 'You take 15-minute breaks every 90 minutes',
    frequency: 0.95,
    confidence: 0.96,
    suggestion: 'Set automatic break reminders'
  }
];

const mockProductivityInsights: ProductivityInsight[] = [
  {
    id: 'insight-1',
    type: 'efficiency',
    title: 'Peak Productivity Window',
    description: 'You complete tasks 40% faster between 9-11 AM',
    impact: 'high',
    actionable: true,
    timestamp: new Date()
  },
  {
    id: 'insight-2',
    type: 'focus',
    title: 'Optimal Task Duration',
    description: 'Tasks lasting 45-60 minutes have 85% completion rate',
    impact: 'medium',
    actionable: true,
    timestamp: new Date()
  },
  {
    id: 'insight-3',
    type: 'break',
    title: 'Break Pattern Detected',
    description: 'You naturally take breaks every 90 minutes',
    impact: 'medium',
    actionable: true,
    timestamp: new Date()
  }
];

export const IntelligentTaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<SmartTask[]>(mockSmartTasks);
  const [taskPatterns, setTaskPatterns] = useState<TaskPattern[]>(mockTaskPatterns);
  const [insights, setInsights] = useState<ProductivityInsight[]>(mockProductivityInsights);
  const [activeTab, setActiveTab] = useState<'tasks' | 'patterns' | 'insights' | 'ai'>('tasks');
  const [selectedTask, setSelectedTask] = useState<SmartTask | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  // AI Task Analysis
  const analyzeTasks = useCallback(async () => {
    setIsAIAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new insights
    const newInsights = mockProductivityInsights.map(insight => ({
      ...insight,
      timestamp: new Date()
    }));
    
    setInsights(newInsights);
    setIsAIAnalyzing(false);
  }, []);

  // Update task status
  const updateTaskStatus = useCallback((taskId: string, status: SmartTask['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date() }
        : task
    ));
  }, []);

  // Apply AI suggestion
  const applyAISuggestion = useCallback((taskId: string, suggestionId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const suggestion = task?.aiSuggestions.find(s => s.id === suggestionId);
    
    if (suggestion?.action) {
      suggestion.action();
      console.log(`Applied AI suggestion: ${suggestion.title}`);
    }
  }, [tasks]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="intelligent-task-manager">
      <div className="task-header">
        <h2>🎯 Intelligent Task Management</h2>
        <p>AI-powered task management with smart suggestions and insights</p>
        
        <div className="task-stats">
          <div className="stat-card">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{tasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round(tasks.reduce((sum, t) => sum + t.estimatedDuration, 0) / 60)}h</div>
            <div className="stat-label">Estimated Time</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Button */}
      <div className="ai-analysis-section">
        <button 
          className={`ai-analysis-btn ${isAIAnalyzing ? 'analyzing' : ''}`}
          onClick={analyzeTasks}
          disabled={isAIAnalyzing}
        >
          {isAIAnalyzing ? '🔄 Analyzing...' : '🤖 Analyze Tasks with AI'}
        </button>
      </div>

      {/* Task Tabs */}
      <div className="task-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tasks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          🔍 Patterns
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          🤖 AI Assistant
        </button>
      </div>

      {/* Tab Content */}
      <div className="task-content">
        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className={`task-card ${task.status}`}>
                  <div className="task-header">
                    <div className="task-priority">
                      <div 
                        className="priority-indicator"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      />
                      <span className="priority-text">{task.priority}</span>
                    </div>
                    <div className="task-status">
                      <div 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      />
                      <span className="status-text">{task.status}</span>
                    </div>
                  </div>
                  
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    
                    <div className="task-meta">
                      <div className="task-duration">
                        <span className="meta-label">Duration:</span>
                        <span className="meta-value">{formatDuration(task.estimatedDuration)}</span>
                      </div>
                      <div className="task-category">
                        <span className="meta-label">Category:</span>
                        <span className="meta-value">{task.category}</span>
                      </div>
                      {task.dueDate && (
                        <div className="task-due">
                          <span className="meta-label">Due:</span>
                          <span className="meta-value">{task.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="task-tags">
                      {task.tags.map(tag => (
                        <span key={tag} className="task-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Suggestions */}
                  {task.aiSuggestions.length > 0 && (
                    <div className="ai-suggestions">
                      <h4>AI Suggestions:</h4>
                      {task.aiSuggestions.map(suggestion => (
                        <div key={suggestion.id} className="ai-suggestion">
                          <div className="suggestion-header">
                            <div className="suggestion-type">
                              {suggestion.type === 'schedule' && '📅'}
                              {suggestion.type === 'priority' && '⚡'}
                              {suggestion.type === 'breakdown' && '🔧'}
                              {suggestion.type === 'optimization' && '🎯'}
                            </div>
                            <div className="suggestion-confidence">
                              <div 
                                className="confidence-bar"
                                style={{ 
                                  width: `${suggestion.confidence * 100}%`,
                                  backgroundColor: getConfidenceColor(suggestion.confidence)
                                }}
                              />
                              <span>{Math.round(suggestion.confidence * 100)}%</span>
                            </div>
                          </div>
                          
                          <div className="suggestion-content">
                            <h5>{suggestion.title}</h5>
                            <p>{suggestion.description}</p>
                          </div>
                          
                          {suggestion.action && (
                            <button 
                              className="apply-suggestion-btn"
                              onClick={() => applyAISuggestion(task.id, suggestion.id)}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="task-actions">
                    <button 
                      className="action-btn"
                      onClick={() => updateTaskStatus(task.id, 'in-progress')}
                      disabled={task.status === 'in-progress'}
                    >
                      Start
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      disabled={task.status === 'completed'}
                    >
                      Complete
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setSelectedTask(task)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-section">
            <h3>Task Patterns</h3>
            <div className="patterns-grid">
              {taskPatterns.map(pattern => (
                <div key={pattern.id} className="pattern-card">
                  <div className="pattern-header">
                    <div className="pattern-frequency">
                      <div 
                        className="frequency-bar"
                        style={{ 
                          width: `${pattern.frequency * 100}%`,
                          backgroundColor: getConfidenceColor(pattern.confidence)
                        }}
                      />
                      <span className="frequency-text">
                        {Math.round(pattern.frequency * 100)}% frequency
                      </span>
                    </div>
                    <div className="pattern-confidence">
                      <div 
                        className="confidence-indicator"
                        style={{ backgroundColor: getConfidenceColor(pattern.confidence) }}
                      />
                      <span>{Math.round(pattern.confidence * 100)}% confidence</span>
                    </div>
                  </div>
                  
                  <div className="pattern-content">
                    <h4>{pattern.pattern}</h4>
                    <p className="pattern-suggestion">{pattern.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-section">
            <h3>Productivity Insights</h3>
            <div className="insights-grid">
              {insights.map(insight => (
                <div key={insight.id} className="insight-card">
                  <div className="insight-header">
                    <div className="insight-type">
                      {insight.type === 'efficiency' && '📊'}
                      {insight.type === 'focus' && '🎯'}
                      {insight.type === 'break' && '☕'}
                      {insight.type === 'schedule' && '📅'}
                    </div>
                    <div className="insight-impact">
                      <div 
                        className="impact-indicator"
                        style={{ backgroundColor: getImpactColor(insight.impact) }}
                      />
                      <span className="impact-text">{insight.impact} impact</span>
                    </div>
                  </div>
                  
                  <div className="insight-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                  
                  {insight.actionable && (
                    <button className="action-btn">
                      Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-section">
            <h3>AI Task Assistant</h3>
            <div className="ai-assistant-panel">
              <div className="ai-chat">
                <div className="chat-message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <p>Hi! I'm your AI task assistant. I can help you:</p>
                    <ul>
                      <li>Optimize your task schedule</li>
                      <li>Suggest task breakdowns</li>
                      <li>Identify productivity patterns</li>
                      <li>Recommend focus times</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="ai-quick-actions">
                <button className="quick-action-btn">
                  📅 Optimize Schedule
                </button>
                <button className="quick-action-btn">
                  🔧 Break Down Tasks
                </button>
                <button className="quick-action-btn">
                  🎯 Find Focus Time
                </button>
                <button className="quick-action-btn">
                  📊 Analyze Patterns
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentTaskManager;
