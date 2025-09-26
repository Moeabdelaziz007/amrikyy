import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'automation' | 'workflow' | 'script' | 'manual';
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  progress?: number;
  logs?: string[];
  error?: string;
}

interface TaskQueueProps {
  className?: string;
}

export const TaskQueue: React.FC<TaskQueueProps> = ({ className = '' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTasks();
    // Set up real-time updates
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter !== 'all' && task.status !== filter) return false;
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder];
        bValue = priorityOrder[bValue as keyof typeof priorityOrder];
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleTaskAction = async (taskId: string, action: 'start' | 'pause' | 'cancel' | 'delete') => {
    try {
      switch (action) {
        case 'start':
          await apiClient.request(`/api/v1/tasks/${taskId}/start`, { method: 'POST' });
          break;
        case 'pause':
          await apiClient.request(`/api/v1/tasks/${taskId}/pause`, { method: 'POST' });
          break;
        case 'cancel':
          await apiClient.request(`/api/v1/tasks/${taskId}/cancel`, { method: 'POST' });
          break;
        case 'delete':
          await apiClient.request(`/api/v1/tasks/${taskId}`, { method: 'DELETE' });
          break;
      }
      await loadTasks();
    } catch (error) {
      console.error(`Failed to ${action} task:`, error);
    }
  };

  const handleBulkAction = async (action: 'start' | 'pause' | 'cancel' | 'delete') => {
    try {
      const promises = selectedTasks.map(taskId => handleTaskAction(taskId, action));
      await Promise.all(promises);
      setSelectedTasks([]);
    } catch (error) {
      console.error(`Failed to ${action} tasks:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-900/20';
      default: return 'text-gray-500 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-900/20';
      case 'running': return 'text-blue-500 bg-blue-900/20';
      case 'completed': return 'text-green-500 bg-green-900/20';
      case 'failed': return 'text-red-500 bg-red-900/20';
      case 'cancelled': return 'text-gray-500 bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className={`task-queue ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-queue ${className}`}>
      <div className="task-queue-header">
        <h3>📋 Task Queue</h3>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={loadTasks}
            title="Refresh tasks"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="task-queue-controls">
        <div className="search-box">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tasks"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            aria-label="Filter tasks by status"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            aria-label="Sort tasks"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">High Priority First</option>
            <option value="priority-asc">Low Priority First</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedTasks.length} task(s) selected</span>
          <div className="bulk-buttons">
            <button 
              onClick={() => handleBulkAction('start')}
              className="bulk-btn start"
              title="Start selected tasks"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
            <button 
              onClick={() => handleBulkAction('pause')}
              className="bulk-btn pause"
              title="Pause selected tasks"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
            <button 
              onClick={() => handleBulkAction('cancel')}
              className="bulk-btn cancel"
              title="Cancel selected tasks"
            >
              <RotateCcw className="w-4 h-4" />
              Cancel
            </button>
            <button 
              onClick={() => handleBulkAction('delete')}
              className="bulk-btn delete"
              title="Delete selected tasks"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
            <p>Create a new task or adjust your filters</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks([...selectedTasks, task.id]);
                    } else {
                      setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                    }
                  }}
                  aria-label={`Select task ${task.name}`}
                />
              </div>
              
              <div className="task-info">
                <div className="task-header">
                  <h4>{task.name}</h4>
                  <div className="task-badges">
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <span className="task-type">{task.type}</span>
                  <span className="task-date">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                  {task.duration && (
                    <span className="task-duration">
                      Duration: {Math.round(task.duration / 1000)}s
                    </span>
                  )}
                  {task.progress !== undefined && (
                    <span className="task-progress">
                      Progress: {task.progress}%
                    </span>
                  )}
                </div>
                
                {task.error && (
                  <div className="task-error">
                    <AlertCircle className="w-4 h-4" />
                    <span>{task.error}</span>
                  </div>
                )}
              </div>
              
              <div className="task-actions">
                {task.status === 'pending' && (
                  <button 
                    onClick={() => handleTaskAction(task.id, 'start')}
                    className="action-btn start"
                    title="Start task"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                
                {task.status === 'running' && (
                  <button 
                    onClick={() => handleTaskAction(task.id, 'pause')}
                    className="action-btn pause"
                    title="Pause task"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                
                {(task.status === 'pending' || task.status === 'running') && (
                  <button 
                    onClick={() => handleTaskAction(task.id, 'cancel')}
                    className="action-btn cancel"
                    title="Cancel task"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                
                <button 
                  onClick={() => handleTaskAction(task.id, 'delete')}
                  className="action-btn delete"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{tasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{tasks.filter(t => t.status === 'pending').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Running:</span>
          <span className="stat-value">{tasks.filter(t => t.status === 'running').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{tasks.filter(t => t.status === 'completed').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Failed:</span>
          <span className="stat-value">{tasks.filter(t => t.status === 'failed').length}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskQueue;
