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

// Task Management App
export const TaskManagementApp: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  });
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: []
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
        calculateStats(tasksData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setLoading(false);
    }
  };

  const calculateStats = (tasksData) => {
    const now = new Date();
    const stats = {
      total: tasksData.length,
      completed: tasksData.filter(t => t.status === 'completed').length,
      inProgress: tasksData.filter(t => t.status === 'in-progress').length,
      pending: tasksData.filter(t => t.status === 'pending').length,
      overdue: tasksData.filter(t => 
        new Date(t.dueDate) < now && t.status !== 'completed'
      ).length
    };
    setStats(stats);
  };

  const showNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const createTask = async () => {
    if (!newTask.title.trim() || !user) return;

    try {
      const taskData = {
        ...newTask,
        userId: user.uid,
        status: 'pending',
        progress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'tasks'), taskData);
      
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        tags: []
      });
      setShowCreateForm(false);
      
      showNotification({
        type: 'success',
        title: 'Task Created',
        message: `"${newTask.title}" has been created successfully!`
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create task. Please try again.'
      });
    }
  };

  const updateTask = async (taskId: string, updates: any) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      showNotification({
        type: 'info',
        title: 'Task Updated',
        message: 'Task has been updated successfully!'
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update task. Please try again.'
      });
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
        progress: 100,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      showNotification({
        type: 'success',
        title: 'Task Completed',
        message: 'Great job! Task has been completed!'
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to complete task. Please try again.'
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      
      showNotification({
        type: 'info',
        title: 'Task Deleted',
        message: 'Task has been deleted successfully!'
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete task. Please try again.'
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/20';
      case 'in-progress': return 'text-blue-400 bg-blue-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="task-management-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="task-management-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access your tasks</p>
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
    <div className="task-management-app">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification notification-${notification.type}`}
          >
            <div className="notification-content">
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotifications(prev => 
                prev.filter(n => n.id !== notification.id)
              )}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="task-header">
        <h2>📋 Task Management</h2>
        <div className="header-actions">
          <button 
            className="create-task-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="task-filters">
        {['all', 'pending', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="create-task-form">
          <div className="form-header">
            <h3>Create New Task</h3>
            <button 
              className="close-btn"
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </button>
          </div>
          <div className="form-content">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea aria-label="Text area"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select aria-label="Select option"
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Enter assignee..."
                />
              </div>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button onClick={createTask} className="create-btn">
                Create Task
              </button>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-title">{task.title}</div>
                <div className="task-actions">
                  <button 
                    onClick={() => updateTask(task.id, { status: 'in-progress' })}
                    className="action-btn start"
                    disabled={task.status === 'completed'}
                  >
                    ▶
                  </button>
                  <button 
                    onClick={() => completeTask(task.id)}
                    className="action-btn complete"
                    disabled={task.status === 'completed'}
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="action-btn delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
              
              <div className="task-description">{task.description}</div>
              
              <div className="task-meta">
                <div className="task-tags">
                  {task.tags && task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="task-info">
                  <span className={`priority ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`status ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="task-footer">
                <div className="task-assignee">👤 {task.assignee}</div>
                <div className="task-due">📅 {task.dueDate}</div>
                <div className="task-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{task.progress || 0}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};