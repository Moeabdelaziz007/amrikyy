import React, { useState, useEffect, useCallback, useRef } from 'react';

// AI Assistant Types
interface AIRecommendation {
  id: string;
  type: 'app' | 'action' | 'workflow' | 'insight';
  title: string;
  description: string;
  confidence: number;
  category: string;
  action?: () => void;
  metadata?: Record<string, any>;
}

interface VoiceCommand {
  id: string;
  command: string;
  description: string;
  action: () => void;
  keywords: string[];
}

interface PredictiveSuggestion {
  id: string;
  type: 'text' | 'action' | 'app' | 'workflow';
  suggestion: string;
  context: string;
  confidence: number;
  timestamp: Date;
}

interface AIInsight {
  id: string;
  type: 'productivity' | 'usage' | 'pattern' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: Date;
}

// Mock AI data
const mockRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'app',
    title: 'Open Calendar',
    description: 'You usually check your calendar at this time',
    confidence: 0.85,
    category: 'productivity',
    action: () => console.log('Opening Calendar')
  },
  {
    id: 'rec-2',
    type: 'workflow',
    title: 'Daily Standup Prep',
    description: 'Prepare for your daily standup meeting',
    confidence: 0.92,
    category: 'workflow',
    action: () => console.log('Starting Daily Standup Prep')
  },
  {
    id: 'rec-3',
    type: 'insight',
    title: 'Focus Time Detected',
    description: 'You\'re most productive between 9-11 AM',
    confidence: 0.78,
    category: 'insight'
  }
];

const mockVoiceCommands: VoiceCommand[] = [
  {
    id: 'voice-1',
    command: 'Open Calendar',
    description: 'Opens the calendar application',
    action: () => console.log('Voice: Opening Calendar'),
    keywords: ['calendar', 'schedule', 'meeting', 'appointment']
  },
  {
    id: 'voice-2',
    command: 'Create Task',
    description: 'Creates a new task',
    action: () => console.log('Voice: Creating Task'),
    keywords: ['task', 'todo', 'create', 'add', 'new']
  },
  {
    id: 'voice-3',
    command: 'Show Dashboard',
    description: 'Displays the main dashboard',
    action: () => console.log('Voice: Showing Dashboard'),
    keywords: ['dashboard', 'home', 'main', 'overview']
  },
  {
    id: 'voice-4',
    command: 'Sync All Services',
    description: 'Synchronizes all connected services',
    action: () => console.log('Voice: Syncing All Services'),
    keywords: ['sync', 'synchronize', 'update', 'refresh']
  }
];

const mockPredictiveSuggestions: PredictiveSuggestion[] = [
  {
    id: 'pred-1',
    type: 'text',
    suggestion: 'Schedule meeting for tomorrow at 2 PM',
    context: 'calendar',
    confidence: 0.88,
    timestamp: new Date()
  },
  {
    id: 'pred-2',
    type: 'action',
    suggestion: 'Open Slack',
    context: 'communication',
    confidence: 0.75,
    timestamp: new Date()
  },
  {
    id: 'pred-3',
    type: 'workflow',
    suggestion: 'Start focus session',
    context: 'productivity',
    confidence: 0.82,
    timestamp: new Date()
  }
];

const mockInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'productivity',
    title: 'Peak Productivity Hours',
    description: 'You complete 40% more tasks between 9-11 AM',
    impact: 'high',
    actionable: true,
    timestamp: new Date()
  },
  {
    id: 'insight-2',
    type: 'usage',
    title: 'App Usage Pattern',
    description: 'You use Calendar 3x more on Mondays',
    impact: 'medium',
    actionable: false,
    timestamp: new Date()
  },
  {
    id: 'insight-3',
    type: 'optimization',
    title: 'Storage Optimization',
    description: 'You can free up 2.3GB by cleaning old files',
    impact: 'medium',
    actionable: true,
    timestamp: new Date()
  }
];

export const AIAssistant: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockRecommendations);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>(mockVoiceCommands);
  const [predictiveSuggestions, setPredictiveSuggestions] = useState<PredictiveSuggestion[]>(mockPredictiveSuggestions);
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [isListening, setIsListening] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [activeTab, setActiveTab] = useState<'recommendations' | 'voice' | 'predictive' | 'insights'>('recommendations');
  const [aiStatus, setAiStatus] = useState<'active' | 'learning' | 'idle'>('active');
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setAiStatus('learning');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        processVoiceCommand(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setAiStatus('active');
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setAiStatus('active');
      };
    }
  }, []);

  // Process voice command
  const processVoiceCommand = useCallback((transcript: string) => {
    const command = voiceCommands.find(cmd => 
      cmd.keywords.some(keyword => 
        transcript.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (command) {
      command.action();
      // Add to recent commands
      console.log(`Executed voice command: ${command.command}`);
    } else {
      console.log(`Voice command not recognized: ${transcript}`);
    }
  }, [voiceCommands]);

  // Start voice recognition
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Generate new recommendations
  const generateRecommendations = useCallback(() => {
    // Simulate AI generating new recommendations
    const newRecommendations = mockRecommendations.map(rec => ({
      ...rec,
      confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
    }));
    setRecommendations(newRecommendations);
  }, []);

  // Generate predictive suggestions
  const generatePredictiveSuggestions = useCallback((input: string) => {
    if (input.length < 2) return;
    
    // Simulate AI generating suggestions based on input
    const newSuggestions = mockPredictiveSuggestions.map(suggestion => ({
      ...suggestion,
      confidence: Math.random() * 0.3 + 0.7,
      timestamp: new Date()
    }));
    setPredictiveSuggestions(newSuggestions);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    generatePredictiveSuggestions(value);
  }, [generatePredictiveSuggestions]);

  // Execute recommendation
  const executeRecommendation = useCallback((recommendation: AIRecommendation) => {
    if (recommendation.action) {
      recommendation.action();
    }
    console.log(`Executed recommendation: ${recommendation.title}`);
  }, []);

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

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>🤖 AI Assistant</h2>
        <p>Your intelligent companion for productivity and automation</p>
        
        <div className="ai-status">
          <div className={`status-indicator ${aiStatus}`}>
            {aiStatus === 'active' && '🟢'}
            {aiStatus === 'learning' && '🟡'}
            {aiStatus === 'idle' && '⚪'}
          </div>
          <span className="status-text">
            {aiStatus === 'active' && 'AI Active'}
            {aiStatus === 'learning' && 'Learning...'}
            {aiStatus === 'idle' && 'AI Idle'}
          </span>
        </div>
      </div>

      {/* Voice Control */}
      <div className="voice-control-section">
        <h3>🎤 Voice Control</h3>
        <div className="voice-controls">
          <div className="voice-input">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type or speak your command..."
              className="voice-input-field"
            />
            <button
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={!recognitionRef.current}
            >
              {isListening ? '🛑' : '🎤'}
            </button>
          </div>
          
          <div className="voice-commands-list">
            <h4>Available Commands:</h4>
            <div className="commands-grid">
              {voiceCommands.map(command => (
                <div key={command.id} className="command-item">
                  <div className="command-text">{command.command}</div>
                  <div className="command-desc">{command.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Tabs */}
      <div className="ai-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          🧠 Recommendations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'predictive' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictive')}
        >
          📝 Predictive
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="ai-content">
        {activeTab === 'recommendations' && (
          <div className="recommendations-section">
            <div className="section-header">
              <h3>Smart Recommendations</h3>
              <button className="refresh-btn" onClick={generateRecommendations}>
                🔄 Refresh
              </button>
            </div>
            
            <div className="recommendations-grid">
              {recommendations.map(recommendation => (
                <div key={recommendation.id} className="recommendation-card">
                  <div className="recommendation-header">
                    <div className="recommendation-type">
                      {recommendation.type === 'app' && '📱'}
                      {recommendation.type === 'action' && '⚡'}
                      {recommendation.type === 'workflow' && '🔄'}
                      {recommendation.type === 'insight' && '💡'}
                    </div>
                    <div className="recommendation-confidence">
                      <div 
                        className="confidence-bar"
                        style={{ 
                          width: `${recommendation.confidence * 100}%`,
                          backgroundColor: getConfidenceColor(recommendation.confidence)
                        }}
                      />
                      <span className="confidence-text">
                        {Math.round(recommendation.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="recommendation-content">
                    <h4>{recommendation.title}</h4>
                    <p>{recommendation.description}</p>
                    <div className="recommendation-category">
                      {recommendation.category}
                    </div>
                  </div>
                  
                  {recommendation.action && (
                    <button 
                      className="execute-btn"
                      onClick={() => executeRecommendation(recommendation)}
                    >
                      Execute
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="predictive-section">
            <h3>Predictive Suggestions</h3>
            
            <div className="predictive-suggestions">
              {predictiveSuggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-item">
                  <div className="suggestion-type">
                    {suggestion.type === 'text' && '📝'}
                    {suggestion.type === 'action' && '⚡'}
                    {suggestion.type === 'app' && '📱'}
                    {suggestion.type === 'workflow' && '🔄'}
                  </div>
                  
                  <div className="suggestion-content">
                    <div className="suggestion-text">{suggestion.suggestion}</div>
                    <div className="suggestion-context">{suggestion.context}</div>
                  </div>
                  
                  <div className="suggestion-confidence">
                    <div 
                      className="confidence-indicator"
                      style={{ backgroundColor: getConfidenceColor(suggestion.confidence) }}
                    />
                    <span>{Math.round(suggestion.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-section">
            <h3>AI Insights</h3>
            
            <div className="insights-grid">
              {insights.map(insight => (
                <div key={insight.id} className="insight-card">
                  <div className="insight-header">
                    <div className="insight-type">
                      {insight.type === 'productivity' && '📊'}
                      {insight.type === 'usage' && '📈'}
                      {insight.type === 'pattern' && '🔍'}
                      {insight.type === 'optimization' && '⚡'}
                    </div>
                    <div className="insight-impact">
                      <div 
                        className="impact-indicator"
                        style={{ backgroundColor: getImpactColor(insight.impact) }}
                      />
                      <span className="impact-text">{insight.impact}</span>
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
      </div>
    </div>
  );
};

export default AIAssistant;
