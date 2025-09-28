import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  BarChart3, 
  Target, 
  TrendingUp,
  Users,
  FileText,
  Zap,
  Brain,
  Settings,
  Bell,
  Star,
  Award,
  Timer,
  PieChart,
  Activity,
  BookOpen,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useTheme } from '../themes/AdvancedThemeSystem';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: Date | null;
  tags: string[];
  estimatedTime: number; // in minutes
  actualTime: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  tasks: Task[];
  team: string[];
  deadline: Date | null;
  createdAt: Date;
}

interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  description: string;
  category: string;
}

interface Analytics {
  totalTasks: number;
  completedTasks: number;
  averageTaskTime: number;
  productivityScore: number;
  weeklyProgress: number[];
  topCategories: Array<{ name: string; count: number; color: string }>;
  timeDistribution: Array<{ category: string; hours: number; percentage: number }>;
}

const ProductivitySuite: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'projects' | 'time' | 'analytics' | 'goals'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('productivity-tasks');
    const savedProjects = localStorage.getItem('productivity-projects');
    const savedTimeEntries = localStorage.getItem('productivity-time-entries');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTimeEntries) setTimeEntries(JSON.parse(savedTimeEntries));
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    localStorage.setItem('productivity-tasks', JSON.stringify(tasks));
    localStorage.setItem('productivity-projects', JSON.stringify(projects));
    localStorage.setItem('productivity-time-entries', JSON.stringify(timeEntries));
  }, [tasks, projects, timeEntries]);

  useEffect(() => {
    saveData();
  }, [saveData]);

  // Calculate analytics
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const averageTaskTime = tasks.reduce((sum, task) => sum + task.actualTime, 0) / Math.max(totalTasks, 1);
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Weekly progress (last 7 days)
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayTasks = tasks.filter(task => 
        task.updatedAt && new Date(task.updatedAt).toDateString() === date.toDateString()
      );
      return dayTasks.filter(task => task.status === 'completed').length;
    });

    // Top categories
    const categoryCount = tasks.reduce((acc, task) => {
      task.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
      }));

    // Time distribution
    const timeByCategory = timeEntries.reduce((acc, entry) => {
      const duration = entry.endTime 
        ? (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60)
        : 0;
      acc[entry.category] = (acc[entry.category] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);

    const totalTime = Object.values(timeByCategory).reduce((sum, time) => sum + time, 0);
    const timeDistribution = Object.entries(timeByCategory).map(([category, hours]) => ({
      category,
      hours,
      percentage: totalTime > 0 ? Math.round((hours / totalTime) * 100) : 0
    }));

    setAnalytics({
      totalTasks,
      completedTasks,
      averageTaskTime,
      productivityScore,
      weeklyProgress,
      topCategories,
      timeDistribution
    });
  }, [tasks, timeEntries]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualTime'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      actualTime: 0
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startTimer = (task: Task) => {
    setCurrentTask(task);
    setIsTimerRunning(true);
    setTimerStartTime(new Date());
  };

  const stopTimer = () => {
    if (currentTask && timerStartTime) {
      const duration = Math.round((Date.now() - timerStartTime.getTime()) / (1000 * 60)); // minutes
      updateTask(currentTask.id, { actualTime: currentTask.actualTime + duration });
      
      const newTimeEntry: TimeEntry = {
        id: Date.now().toString(),
        taskId: currentTask.id,
        startTime: timerStartTime,
        endTime: new Date(),
        description: `Worked on ${currentTask.title}`,
        category: currentTask.tags[0] || 'General'
      };
      setTimeEntries(prev => [...prev, newTimeEntry]);
    }
    
    setIsTimerRunning(false);
    setCurrentTask(null);
    setTimerStartTime(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="themed-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Total Tasks</p>
              <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>{analytics?.totalTasks || 0}</p>
            </div>
            <CheckSquare className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{analytics?.completedTasks || 0}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className="text-2xl font-bold text-purple-600">{analytics?.productivityScore || 0}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Task Time</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(analytics?.averageTaskTime || 0)}m</p>
            </div>
            <Timer className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="flex items-end space-x-2 h-32">
          {analytics?.weeklyProgress.map((count, index) => {
            const height = (count / Math.max(...analytics.weeklyProgress, [1])) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <p className="text-xs text-gray-600 mt-2">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {tasks.slice(-5).reverse().map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </div>
                <span className="font-medium text-gray-900">{task.title}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{task.actualTime}m</span>
                <button
                  onClick={() => updateTask(task.id, { status: task.status === 'completed' ? 'todo' : 'completed' })}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <CheckSquare className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Tracking */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
        {isTimerRunning && currentTask ? (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Working on: {currentTask.title}</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {timerStartTime ? Math.floor((Date.now() - timerStartTime.getTime()) / 1000 / 60) : 0}m
            </p>
            <button
              onClick={stopTimer}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop Timer
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Start tracking time for a task</p>
            <select 
              onChange={(e) => {
                const task = tasks.find(t => t.id === e.target.value);
                if (task) startTimer(task);
              }}
              className="px-4 py-2 border rounded-lg"
              defaultValue=""
            >
              <option value="">Select a task...</option>
              {tasks.filter(t => t.status === 'in-progress').map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const TasksTab = () => (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          addTask({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as Task['priority'],
            status: 'todo',
            dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
            estimatedTime: parseInt(formData.get('estimatedTime') as string) || 0
          });
          (e.target as HTMLFormElement).reset();
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              type="text"
              placeholder="Task title"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="dueDate"
              type="datetime-local"
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <textarea
            name="description"
            placeholder="Task description"
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="priority" className="px-3 py-2 border rounded-lg">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              name="tags"
              type="text"
              placeholder="Tags (comma-separated)"
              className="px-3 py-2 border rounded-lg"
            />
            <input
              name="estimatedTime"
              type="number"
              placeholder="Estimated time (minutes)"
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                </div>
                {task.description && (
                  <p className="text-gray-600 mb-3">{task.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {task.dueDate && (
                    <span>Due: {task.dueDate.toLocaleDateString()}</span>
                  )}
                  <span>Est: {task.estimatedTime}m</span>
                  <span>Actual: {task.actualTime}m</span>
                  {task.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value as Task['status'] })}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => startTimer(task)}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isTimerRunning}
                >
                  <Timer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
        <div className="space-y-3">
          {analytics?.topCategories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <span className="text-gray-600">{category.count} tasks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Distribution</h3>
        <div className="space-y-3">
          {analytics?.timeDistribution.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{item.category}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-16">
                  {item.hours.toFixed(1)}h ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Completion Rate</h4>
            <div className="text-3xl font-bold text-green-600">
              {analytics ? Math.round((analytics.completedTasks / Math.max(analytics.totalTasks, 1)) * 100) : 0}%
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Average Task Time</h4>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(analytics?.averageTaskTime || 0)}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen themed-scrollbar" style={{ background: currentTheme.gradients.background }}>
      {/* Header */}
      <div className="themed-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Rocket className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
                <h1 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>Productivity Suite</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isTimerRunning && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Timer Running</span>
                </div>
              )}
              <Settings className="h-5 w-5" style={{ color: currentTheme.colors.textSecondary }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="themed-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'projects', label: 'Projects', icon: Users },
              { id: 'time', label: 'Time Tracking', icon: Timer },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'goals', label: 'Goals', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm themed-nav-item ${
                  activeTab === id ? 'active' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'projects' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Projects Coming Soon</h3>
            <p className="text-gray-600">Project management features will be available in the next update.</p>
          </div>
        )}
        {activeTab === 'time' && (
          <div className="text-center py-12">
            <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Time Tracking</h3>
            <p className="text-gray-600">Use the timer in the dashboard to track your work time.</p>
          </div>
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'goals' && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Goals Coming Soon</h3>
            <p className="text-gray-600">Goal setting and tracking features will be available in the next update.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivitySuite;
