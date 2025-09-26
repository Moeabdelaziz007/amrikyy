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

interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: 'assistant' | 'analyzer' | 'automator' | 'creator';
  status: 'active' | 'inactive' | 'training';
  capabilities: string[];
  performance: {
    tasksCompleted: number;
    accuracy: number;
    responseTime: number;
    userRating: number;
  };
  lastActive: Date;
  createdAt: Date;
}

export const AIAgentsApp: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'assistant' as 'assistant' | 'analyzer' | 'automator' | 'creator',
    capabilities: [] as string[]
  });
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadAgents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAgents = () => {
    if (!user) return;
    
    const agentsRef = collection(db, 'aiAgents');
    const q = query(agentsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as AIAgent[];
      setAgents(agentsData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load AI agents:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const createAgent = async () => {
    if (!newAgent.name.trim() || !user) return;

    try {
      const agentData = {
        ...newAgent,
        userId: user.uid,
        status: 'active',
        performance: {
          tasksCompleted: 0,
          accuracy: 0,
          responseTime: 0,
          userRating: 0
        },
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'aiAgents'), agentData);
      setShowCreateForm(false);
      setNewAgent({ name: '', description: '', type: 'assistant', capabilities: [] });
    } catch (error) {
      console.error('Failed to create AI agent:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeAgent || !user) return;

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      agentId: activeAgent.id
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, activeAgent);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'agent',
        timestamp: new Date(),
        agentId: activeAgent.id
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (message: string, agent: AIAgent): string => {
    const responses = {
      assistant: [
        "I'm here to help you with your tasks and provide assistance.",
        "Let me analyze that for you and provide recommendations.",
        "I can help you organize and prioritize your work.",
        "Would you like me to create a task for that?"
      ],
      analyzer: [
        "Based on my analysis, here are the key insights...",
        "I've identified several patterns in your data.",
        "The trends show significant improvements in productivity.",
        "Let me break down the metrics for you."
      ],
      automator: [
        "I can automate that process for you.",
        "Setting up automated workflow...",
        "I'll handle the repetitive tasks so you can focus on important work.",
        "Automation rules have been applied successfully."
      ],
      creator: [
        "I'll create that content for you right away.",
        "Generating personalized content based on your preferences.",
        "I've created a template that matches your style.",
        "The content is ready for your review."
      ]
    };

    const agentResponses = responses[agent.type];
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'assistant': return '🤖';
      case 'analyzer': return '📊';
      case 'automator': return '⚡';
      case 'creator': return '🎨';
      default: return '🤖';
    }
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'assistant': return 'blue';
      case 'analyzer': return 'green';
      case 'automator': return 'purple';
      case 'creator': return 'orange';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'inactive': return 'text-gray-400 bg-gray-900/20';
      case 'training': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="ai-agents-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AI agents...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ai-agents-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access AI agents</p>
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
    <div className="ai-agents-app">
      <div className="agents-header">
        <h2>🤖 AI Agents</h2>
        <div className="header-actions">
          <button 
            className="create-agent-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + New Agent
          </button>
        </div>
      </div>

      {/* Create Agent Form */}
      {showCreateForm && (
        <div className="create-agent-overlay">
          <div className="create-agent-form">
            <h3>Create New AI Agent</h3>
            <input
              type="text"
              placeholder="Agent Name"
              value={newAgent.name}
              onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea aria-label="Text area"
              placeholder="Agent Description"
              value={newAgent.description}
              onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <select aria-label="Select option"
              value={newAgent.type}
              onChange={(e) => setNewAgent(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="assistant">Assistant</option>
              <option value="analyzer">Analyzer</option>
              <option value="automator">Automator</option>
              <option value="creator">Creator</option>
            </select>
            <div className="form-actions">
              <button onClick={createAgent} className="submit-btn">Create Agent</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="agents-layout">
        {/* Agents List */}
        <div className="agents-sidebar">
          <h3>Your Agents</h3>
          <div className="agents-list">
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`agent-card ${activeAgent?.id === agent.id ? 'active' : ''}`}
                onClick={() => setActiveAgent(agent)}
              >
                <div className="agent-icon">
                  <span className={`agent-type-icon ${getAgentTypeColor(agent.type)}`}>
                    {getAgentTypeIcon(agent.type)}
                  </span>
                </div>
                <div className="agent-info">
                  <h4>{agent.name}</h4>
                  <p>{agent.description}</p>
                  <div className="agent-meta">
                    <span className={`agent-status ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                    <span className="agent-tasks">{agent.performance.tasksCompleted} tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="chat-main">
          {activeAgent ? (
            <>
              <div className="chat-header">
                <div className="agent-info-header">
                  <span className={`agent-icon-large ${getAgentTypeColor(activeAgent.type)}`}>
                    {getAgentTypeIcon(activeAgent.type)}
                  </span>
                  <div>
                    <h3>{activeAgent.name}</h3>
                    <p>{activeAgent.description}</p>
                  </div>
                </div>
                <div className="agent-stats">
                  <div className="stat">
                    <span className="stat-value">{activeAgent.performance.tasksCompleted}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{activeAgent.performance.accuracy}%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{activeAgent.performance.responseTime}ms</span>
                    <span className="stat-label">Response</span>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.filter(msg => msg.agentId === activeAgent.id).map(message => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder={`Message ${activeAgent.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-agent-selected">
              <h3>Select an AI Agent</h3>
              <p>Choose an agent from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
