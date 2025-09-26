import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Real-time Collaboration App
export const CollaborationApp: React.FC = () => {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [sharedTasks, setSharedTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newCollaboration, setNewCollaboration] = useState({
    name: '',
    description: '',
    members: [] as string[]
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadCollaborations();
      loadActiveUsers();
      loadSharedTasks();
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCollaborations = () => {
    if (!user) return;
    
    const collaborationsRef = collection(db, 'collaborations');
    const q = query(collaborationsRef, where('members', 'array-contains', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collaborationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCollaborations(collaborationsData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load collaborations:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadActiveUsers = () => {
    if (!user) return;
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isOnline', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveUsers(usersData);
    }, (error) => {
      console.error('Failed to load active users:', error);
    });

    return unsubscribe;
  };

  const loadSharedTasks = () => {
    if (!user) return;
    
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('isShared', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSharedTasks(tasksData);
    }, (error) => {
      console.error('Failed to load shared tasks:', error);
    });

    return unsubscribe;
  };

  const loadMessages = () => {
    if (!user) return;
    
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData.slice(0, 50)); // Limit to last 50 messages
    }, (error) => {
      console.error('Failed to load messages:', error);
    });

    return unsubscribe;
  };

  const createCollaboration = async () => {
    if (!newCollaboration.name.trim() || !user) return;

    try {
      const collaborationData = {
        ...newCollaboration,
        createdBy: user.uid,
        members: [...newCollaboration.members, user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'collaborations'), collaborationData);
      
      setNewCollaboration({
        name: '',
        description: '',
        members: []
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create collaboration:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const messageData = {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const shareTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        isShared: true,
        sharedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to share task:', error);
    }
  };

  const joinCollaboration = async (collaborationId: string) => {
    if (!user) return;

    try {
      const collaborationRef = doc(db, 'collaborations', collaborationId);
      const collaboration = collaborations.find(c => c.id === collaborationId);
      
      if (collaboration && !collaboration.members.includes(user.uid)) {
        await updateDoc(collaborationRef, {
          members: [...collaboration.members, user.uid],
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Failed to join collaboration:', error);
    }
  };

  if (loading) {
    return (
      <div className="collaboration-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading collaborations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="collaboration-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access collaboration features</p>
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
    <div className="collaboration-app">
      <div className="collaboration-header">
        <h2>🤝 Real-time Collaboration</h2>
        <div className="header-actions">
          <button 
            className="create-collaboration-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + New Collaboration
          </button>
        </div>
      </div>

      {/* Active Users */}
      <div className="active-users-section">
        <h3>👥 Active Users ({activeUsers.length})</h3>
        <div className="active-users-grid">
          {activeUsers.map(user => (
            <div key={user.id} className="active-user-card">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/40'} 
                alt={user.displayName || 'User'} 
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{user.displayName || 'Anonymous'}</div>
                <div className="user-status">
                  <span className="status-dot online"></span>
                  Online
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborations */}
      <div className="collaborations-section">
        <h3>🏢 Your Collaborations ({collaborations.length})</h3>
        <div className="collaborations-grid">
          {collaborations.map(collaboration => (
            <div key={collaboration.id} className="collaboration-card">
              <div className="collaboration-header">
                <h4>{collaboration.name}</h4>
                <div className="collaboration-members">
                  {collaboration.members.length} members
                </div>
              </div>
              <p className="collaboration-description">{collaboration.description}</p>
              <div className="collaboration-actions">
                <button className="action-btn primary">Open</button>
                <button className="action-btn secondary">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Tasks */}
      <div className="shared-tasks-section">
        <h3>📋 Shared Tasks ({sharedTasks.length})</h3>
        <div className="shared-tasks-list">
          {sharedTasks.map(task => (
            <div key={task.id} className="shared-task-card">
              <div className="task-info">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`task-status ${task.status}`}>{task.status}</span>
                  <span className="task-priority">{task.priority}</span>
                  <span className="task-assignee">by {task.userName || 'Unknown'}</span>
                </div>
              </div>
              <div className="task-actions">
                <button className="action-btn success">View</button>
                <button className="action-btn info">Comment</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Chat */}
      <div className="chat-section">
        <h3>💬 Team Chat</h3>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.userId === user.uid ? 'own' : 'other'}`}>
                <img 
                  src={message.userPhoto || 'https://via.placeholder.com/32'} 
                  alt={message.userName} 
                  className="message-avatar"
                />
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-user">{message.userName}</span>
                    <span className="message-time">
                      {message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString() : 'Now'}
                    </span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
            />
            <button onClick={sendMessage} className="send-btn">Send</button>
          </div>
        </div>
      </div>

      {/* Create Collaboration Form */}
      {showCreateForm && (
        <div className="create-form-overlay">
          <div className="create-form glass-effect">
            <h3>Create New Collaboration</h3>
            <input
              type="text"
              placeholder="Collaboration Name"
              value={newCollaboration.name}
              onChange={e => setNewCollaboration(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea aria-label="Text area"
              placeholder="Description"
              value={newCollaboration.description}
              onChange={e => setNewCollaboration(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <div className="form-actions">
              <button onClick={createCollaboration} className="submit-btn">Create</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
