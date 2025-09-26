import React, { useState, useEffect, useCallback, useRef } from 'react';

// Voice Command Types
interface VoiceCommand {
  id: string;
  command: string;
  description: string;
  keywords: string[];
  action: () => void;
  category: 'navigation' | 'apps' | 'system' | 'automation' | 'custom';
  confidence: number;
  isActive: boolean;
}

interface VoiceSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  commands: VoiceCommand[];
  totalCommands: number;
  successRate: number;
}

interface VoiceSettings {
  isEnabled: boolean;
  language: string;
  sensitivity: 'low' | 'medium' | 'high';
  autoExecute: boolean;
  feedback: boolean;
  wakeWord: string;
}

// Mock voice commands
const mockVoiceCommands: VoiceCommand[] = [
  {
    id: 'cmd-1',
    command: 'Open Calendar',
    description: 'Opens the calendar application',
    keywords: ['calendar', 'schedule', 'meeting', 'appointment', 'open calendar'],
    action: () => console.log('Opening Calendar'),
    category: 'apps',
    confidence: 0.95,
    isActive: true
  },
  {
    id: 'cmd-2',
    command: 'Create Task',
    description: 'Creates a new task',
    keywords: ['task', 'todo', 'create', 'add', 'new task', 'create task'],
    action: () => console.log('Creating Task'),
    category: 'apps',
    confidence: 0.88,
    isActive: true
  },
  {
    id: 'cmd-3',
    command: 'Show Dashboard',
    description: 'Displays the main dashboard',
    keywords: ['dashboard', 'home', 'main', 'overview', 'show dashboard'],
    action: () => console.log('Showing Dashboard'),
    category: 'navigation',
    confidence: 0.92,
    isActive: true
  },
  {
    id: 'cmd-4',
    command: 'Sync All Services',
    description: 'Synchronizes all connected services',
    keywords: ['sync', 'synchronize', 'update', 'refresh', 'sync all'],
    action: () => console.log('Syncing All Services'),
    category: 'system',
    confidence: 0.85,
    isActive: true
  },
  {
    id: 'cmd-5',
    command: 'Start Focus Session',
    description: 'Starts a focused work session',
    keywords: ['focus', 'work', 'session', 'start focus', 'focus mode'],
    action: () => console.log('Starting Focus Session'),
    category: 'automation',
    confidence: 0.90,
    isActive: true
  },
  {
    id: 'cmd-6',
    command: 'Open Settings',
    description: 'Opens the settings application',
    keywords: ['settings', 'preferences', 'config', 'open settings'],
    action: () => console.log('Opening Settings'),
    category: 'apps',
    confidence: 0.93,
    isActive: true
  },
  {
    id: 'cmd-7',
    command: 'Show Notifications',
    description: 'Displays all notifications',
    keywords: ['notifications', 'alerts', 'messages', 'show notifications'],
    action: () => console.log('Showing Notifications'),
    category: 'system',
    confidence: 0.87,
    isActive: true
  },
  {
    id: 'cmd-8',
    command: 'Toggle Dark Mode',
    description: 'Toggles between light and dark mode',
    keywords: ['dark mode', 'theme', 'toggle', 'dark', 'light'],
    action: () => console.log('Toggling Dark Mode'),
    category: 'system',
    confidence: 0.89,
    isActive: true
  }
];

export const VoiceCommandSystem: React.FC = () => {
  const [commands, setCommands] = useState<VoiceCommand[]>(mockVoiceCommands);
  const [settings, setSettings] = useState<VoiceSettings>({
    isEnabled: true,
    language: 'en-US',
    sensitivity: 'medium',
    autoExecute: true,
    feedback: true,
    wakeWord: 'Amrikyy'
  });
  const [isListening, setIsListening] = useState(false);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const sessionRef = useRef<VoiceSession | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        if (!sessionRef.current) {
          const newSession: VoiceSession = {
            id: `session-${Date.now()}`,
            startTime: new Date(),
            commands: [],
            totalCommands: 0,
            successRate: 0
          };
          sessionRef.current = newSession;
          setCurrentSession(newSession);
        }
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setLastTranscript(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceCommand(transcript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (sessionRef.current) {
          sessionRef.current.endTime = new Date();
          setCurrentSession(sessionRef.current);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
      };
    }
  }, [settings.language]);

  // Process voice command
  const processVoiceCommand = useCallback((transcript: string) => {
    setIsProcessing(true);
    
    // Find matching command
    const matchingCommand = commands.find(cmd => 
      cmd.isActive && cmd.keywords.some(keyword => 
        transcript.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (matchingCommand) {
      // Calculate confidence based on keyword match
      const matchedKeywords = matchingCommand.keywords.filter(keyword =>
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );
      const calculatedConfidence = matchedKeywords.length / matchingCommand.keywords.length;
      setConfidence(calculatedConfidence);
      
      // Execute command if confidence is high enough
      if (calculatedConfidence >= 0.5) {
        matchingCommand.action();
        
        // Add to recent commands
        setRecentCommands(prev => [matchingCommand, ...prev.slice(0, 9)]);
        
        // Update session
        if (sessionRef.current) {
          sessionRef.current.commands.push(matchingCommand);
          sessionRef.current.totalCommands++;
          sessionRef.current.successRate = 
            sessionRef.current.commands.length / sessionRef.current.totalCommands;
        }
        
        // Provide feedback
        if (settings.feedback) {
          console.log(`Executed: ${matchingCommand.command}`);
        }
      }
    } else {
      setConfidence(0);
      console.log(`Command not recognized: ${transcript}`);
    }
    
    setIsProcessing(false);
  }, [commands, settings.feedback]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && settings.isEnabled) {
      recognitionRef.current.start();
    }
  }, [isListening, settings.isEnabled]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Toggle command
  const toggleCommand = useCallback((commandId: string) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId 
        ? { ...cmd, isActive: !cmd.isActive }
        : cmd
    ));
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return '#3b82f6';
      case 'apps': return '#10b981';
      case 'system': return '#f59e0b';
      case 'automation': return '#8b5cf6';
      case 'custom': return '#ec4899';
      default: return '#6b7280';
    }
  };

  // Get confidence color
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return '#10b981';
    if (conf >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="voice-command-system">
      <div className="voice-header">
        <h2>🎤 Voice Command System</h2>
        <p>Control your Amrikyy AIOS System with voice commands</p>
        
        <div className="voice-status">
          <div className={`status-indicator ${isListening ? 'listening' : 'idle'}`}>
            {isListening ? '🎤' : '⏸️'}
          </div>
          <span className="status-text">
            {isListening ? 'Listening...' : 'Voice Ready'}
          </span>
          {isProcessing && (
            <div className="processing-indicator">
              <div className="processing-spinner" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="voice-controls-section">
        <div className="voice-controls">
          <button
            className={`voice-toggle-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={!settings.isEnabled}
          >
            {isListening ? '🛑 Stop Listening' : '🎤 Start Listening'}
          </button>
          
          <div className="voice-settings">
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.isEnabled}
                onChange={(e) => updateSettings({ isEnabled: e.target.checked })}
              />
              <span>Enable Voice Commands</span>
            </label>
            
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.autoExecute}
                onChange={(e) => updateSettings({ autoExecute: e.target.checked })}
              />
              <span>Auto Execute Commands</span>
            </label>
            
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.feedback}
                onChange={(e) => updateSettings({ feedback: e.target.checked })}
              />
              <span>Voice Feedback</span>
            </label>
          </div>
        </div>
        
        {/* Current Transcript */}
        {lastTranscript && (
          <div className="current-transcript">
            <h4>Last Command:</h4>
            <div className="transcript-text">{lastTranscript}</div>
            {confidence > 0 && (
              <div className="confidence-indicator">
                <div 
                  className="confidence-bar"
                  style={{ 
                    width: `${confidence * 100}%`,
                    backgroundColor: getConfidenceColor(confidence)
                  }}
                />
                <span className="confidence-text">
                  {Math.round(confidence * 100)}% confidence
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Commands */}
      <div className="commands-section">
        <h3>Available Voice Commands</h3>
        <div className="commands-grid">
          {commands.map(command => (
            <div key={command.id} className={`command-card ${command.isActive ? 'active' : 'inactive'}`}>
              <div className="command-header">
                <div className="command-category">
                  <div 
                    className="category-indicator"
                    style={{ backgroundColor: getCategoryColor(command.category) }}
                  />
                  <span className="category-text">{command.category}</span>
                </div>
                <div className="command-toggle">
                  <button
                    className={`toggle-btn ${command.isActive ? 'active' : 'inactive'}`}
                    onClick={() => toggleCommand(command.id)}
                  >
                    {command.isActive ? '✅' : '⏸️'}
                  </button>
                </div>
              </div>
              
              <div className="command-content">
                <h4>{command.command}</h4>
                <p>{command.description}</p>
                
                <div className="command-keywords">
                  <span className="keywords-label">Keywords:</span>
                  <div className="keywords-list">
                    {command.keywords.map(keyword => (
                      <span key={keyword} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
                
                <div className="command-confidence">
                  <div 
                    className="confidence-bar"
                    style={{ 
                      width: `${command.confidence * 100}%`,
                      backgroundColor: getConfidenceColor(command.confidence)
                    }}
                  />
                  <span className="confidence-text">
                    {Math.round(command.confidence * 100)}% accuracy
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Commands */}
      {recentCommands.length > 0 && (
        <div className="recent-commands-section">
          <h3>Recent Commands</h3>
          <div className="recent-commands-list">
            {recentCommands.map((command, index) => (
              <div key={`${command.id}-${index}`} className="recent-command-item">
                <div className="command-icon">
                  {command.category === 'navigation' && '🧭'}
                  {command.category === 'apps' && '📱'}
                  {command.category === 'system' && '⚙️'}
                  {command.category === 'automation' && '🤖'}
                  {command.category === 'custom' && '🎯'}
                </div>
                <div className="command-info">
                  <div className="command-name">{command.command}</div>
                  <div className="command-time">{new Date().toLocaleTimeString()}</div>
                </div>
                <div className="command-status">
                  <div className="status-indicator success" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Session Stats */}
      {currentSession && (
        <div className="session-stats-section">
          <h3>Current Session</h3>
          <div className="session-stats">
            <div className="stat-item">
              <span className="stat-label">Duration:</span>
              <span className="stat-value">
                {Math.round((Date.now() - currentSession.startTime.getTime()) / 1000 / 60)}m
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Commands:</span>
              <span className="stat-value">{currentSession.totalCommands}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate:</span>
              <span className="stat-value">
                {Math.round(currentSession.successRate * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandSystem;
