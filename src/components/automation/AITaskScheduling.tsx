import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Brain, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Layers, 
  Grid, 
  Navigation, 
  Compass, 
  Globe, 
  Star, 
  Sparkles, 
  Hexagon, 
  Circle, 
  Square, 
  Triangle, 
  Diamond, 
  Heart, 
  Microscope, 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Calculator, 
  Code, 
  Terminal, 
  Server, 
  HardDrive, 
  MemoryStick, 
  Cpu, 
  Wifi, 
  Bluetooth, 
  Radio, 
  Signal, 
  Network, 
  Cloud, 
  Sun, 
  Moon, 
  Thermometer, 
  Gauge, 
  Battery, 
  Power, 
  Lock, 
  Unlock, 
  Shield, 
  Key, 
  Database, 
  Search, 
  Filter, 
  List, 
  Grid as GridIcon, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
  Flag, 
  Pin, 
  MapPin, 
  Home, 
  Building, 
  Car, 
  Plane, 
  Ship, 
  Train, 
  Bike, 
  Truck, 
  Bus, 
  Tent, 
  Umbrella, 
  Trees, 
  Flower, 
  Leaf, 
  Sprout, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Mouse, 
  Turtle, 
  Butterfly, 
  Ant, 
  Spider, 
  Ladybug, 
  Dragonfly, 
  Firefly, 
  Cricket, 
  Grasshopper, 
  Mantis, 
  Beetle, 
  Worm, 
  Snail, 
  Octopus, 
  Squid, 
  Jellyfish, 
  Starfish, 
  Crab, 
  Lobster, 
  Ship as Shrimp, 
  Penguin, 
  Owl, 
  Eagle, 
  Hawk, 
  Falcon, 
  Carrot as Parrot, 
  Crown as Crow,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  Share,
  Eye,
  EyeOff,
  Edit,
  Zap,
  User,
  Users,
  Briefcase,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface AITask {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'health' | 'learning' | 'social' | 'finance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'deferred';
  estimatedDuration: number; // in minutes
  actualDuration: number; // in minutes
  dueDate: Date | null;
  scheduledTime: Date | null;
  completionTime: Date | null;
  dependencies: string[];
  tags: string[];
  aiInsights: AIInsights;
  createdAt: Date;
  updatedAt: Date;
}

interface AIInsights {
  suggestedTime: Date | null;
  confidence: number; // 0-100
  reasoning: string;
  optimalDuration: number;
  energyLevel: 'low' | 'medium' | 'high';
  focusRequired: 'low' | 'medium' | 'high';
  context: string[];
  recommendations: string[];
  similarTasks: string[];
  productivityScore: number; // 0-100
}

interface ScheduleBlock {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'work' | 'break' | 'meeting' | 'personal' | 'buffer';
  taskId: string | null;
  isFlexible: boolean;
  priority: number;
  description: string;
}

interface ProductivityPattern {
  id: string;
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  energyLevels: EnergyLevel[];
  focusAreas: string[];
  optimalTasks: string[];
  effectiveness: number; // 0-100
  lastUpdated: Date;
}

interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  productivity: number; // 0-100
  energy: number; // 0-100
  focus: number; // 0-100
}

interface EnergyLevel {
  time: string; // HH:MM format
  level: number; // 0-100
  type: 'physical' | 'mental' | 'emotional' | 'creative';
}

interface ScheduleOptimization {
  id: string;
  taskId: string;
  originalTime: Date;
  suggestedTime: Date;
  reason: string;
  confidence: number;
  impact: 'positive' | 'neutral' | 'negative';
  alternatives: AlternativeTime[];
}

interface AlternativeTime {
  time: Date;
  score: number;
  reason: string;
}

export const AITaskScheduling: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'insights' | 'patterns' | 'optimization'>('schedule');
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Mock data - in production, this would come from AI scheduling APIs
  const [tasks] = useState<AITask[]>([
    {
      id: '1',
      title: 'Review Q4 Financial Reports',
      description: 'Analyze and review quarterly financial reports for Q4',
      category: 'work',
      priority: 'high',
      status: 'pending',
      estimatedDuration: 120,
      actualDuration: 0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      completionTime: null,
      dependencies: [],
      tags: ['finance', 'reports', 'analysis'],
      aiInsights: {
        suggestedTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        confidence: 85,
        reasoning: 'High focus task, best scheduled during peak mental energy hours',
        optimalDuration: 90,
        energyLevel: 'high',
        focusRequired: 'high',
        context: ['morning', 'quiet environment', 'no interruptions'],
        recommendations: ['Schedule during 9-11 AM', 'Block calendar for 2 hours', 'Prepare materials in advance'],
        similarTasks: ['2', '3'],
        productivityScore: 92
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Team Standup Meeting',
      description: 'Daily team standup meeting to discuss progress and blockers',
      category: 'work',
      priority: 'medium',
      status: 'scheduled',
      estimatedDuration: 30,
      actualDuration: 0,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      scheduledTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      completionTime: null,
      dependencies: [],
      tags: ['meeting', 'team', 'daily'],
      aiInsights: {
        suggestedTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        confidence: 95,
        reasoning: 'Regular team meeting, optimal time for team coordination',
        optimalDuration: 30,
        energyLevel: 'medium',
        focusRequired: 'medium',
        context: ['team availability', 'morning routine', 'coordination'],
        recommendations: ['Keep to 30 minutes', 'Prepare agenda', 'Follow up on action items'],
        similarTasks: ['1', '4'],
        productivityScore: 78
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Gym Workout',
      description: 'Regular gym workout session',
      category: 'health',
      priority: 'medium',
      status: 'pending',
      estimatedDuration: 60,
      actualDuration: 0,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      completionTime: null,
      dependencies: [],
      tags: ['fitness', 'health', 'routine'],
      aiInsights: {
        suggestedTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        confidence: 80,
        reasoning: 'Afternoon workout aligns with natural energy patterns',
        optimalDuration: 60,
        energyLevel: 'medium',
        focusRequired: 'low',
        context: ['afternoon', 'physical activity', 'routine'],
        recommendations: ['Schedule after lunch', 'Prepare workout clothes', 'Stay hydrated'],
        similarTasks: ['5'],
        productivityScore: 65
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [scheduleBlocks] = useState<ScheduleBlock[]>([
    {
      id: '1',
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      duration: 30,
      type: 'meeting',
      taskId: '2',
      isFlexible: false,
      priority: 8,
      description: 'Team Standup Meeting'
    },
    {
      id: '2',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      duration: 120,
      type: 'work',
      taskId: '1',
      isFlexible: true,
      priority: 9,
      description: 'Review Q4 Financial Reports'
    },
    {
      id: '3',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
      duration: 60,
      type: 'personal',
      taskId: '3',
      isFlexible: true,
      priority: 6,
      description: 'Gym Workout'
    }
  ]);

  const [productivityPatterns] = useState<ProductivityPattern[]>([
    {
      id: '1',
      name: 'Morning Focus Pattern',
      description: 'High productivity during morning hours',
      timeSlots: [
        { startTime: '09:00', endTime: '11:00', dayOfWeek: 1, productivity: 95, energy: 90, focus: 95 },
        { startTime: '09:00', endTime: '11:00', dayOfWeek: 2, productivity: 92, energy: 88, focus: 93 },
        { startTime: '09:00', endTime: '11:00', dayOfWeek: 3, productivity: 90, energy: 85, focus: 90 }
      ],
      energyLevels: [
        { time: '09:00', level: 90, type: 'mental' },
        { time: '10:00', level: 95, type: 'mental' },
        { time: '11:00', level: 85, type: 'mental' }
      ],
      focusAreas: ['analysis', 'writing', 'planning', 'problem-solving'],
      optimalTasks: ['1', '2'],
      effectiveness: 92,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [optimizations] = useState<ScheduleOptimization[]>([
    {
      id: '1',
      taskId: '1',
      originalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      suggestedTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      reason: 'Better alignment with peak mental energy',
      confidence: 85,
      impact: 'positive',
      alternatives: [
        { time: new Date(Date.now() + 1.5 * 60 * 60 * 1000), score: 85, reason: 'Peak mental energy' },
        { time: new Date(Date.now() + 3 * 60 * 60 * 1000), score: 75, reason: 'Good focus time' },
        { time: new Date(Date.now() + 4.5 * 60 * 60 * 1000), score: 65, reason: 'Moderate energy' }
      ]
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return <Briefcase className="w-4 h-4" />;
      case 'personal': return <User className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'finance': return <DollarSign className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'in-progress': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'cancelled': return 'text-gray-500';
      case 'deferred': return 'text-orange-500';
      case 'scheduled': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'deferred': return <Pause className="w-4 h-4 text-orange-500" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'urgent': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'text-blue-500';
      case 'break': return 'text-green-500';
      case 'meeting': return 'text-purple-500';
      case 'personal': return 'text-orange-500';
      case 'buffer': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const createTask = () => {
    console.log('Creating new AI task...');
  };

  const optimizeSchedule = () => {
    console.log('Optimizing schedule...');
  };

  const generateInsights = () => {
    console.log('Generating AI insights...');
  };

  if (loading) {
    return (
      <div className="ai-task-scheduling">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading AI task scheduling...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-task-scheduling">
      <div className="scheduling-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>AI Task Scheduling</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createTask}>
              <Plus className="button-icon" />
              Create Task
            </button>
            <button className="action-button" onClick={optimizeSchedule}>
              <Zap className="button-icon" />
              Optimize
            </button>
            <button className="action-button" onClick={generateInsights}>
              <Brain className="button-icon" />
              Generate Insights
            </button>
          </div>
        </div>
      </div>

      <div className="scheduling-tabs">
        <button 
          className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar className="tab-icon" />
          Schedule
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Target className="tab-icon" />
          Tasks
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Brain className="tab-icon" />
          Insights
        </button>
        <button 
          className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <BarChart3 className="tab-icon" />
          Patterns
        </button>
        <button 
          className={`tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          <TrendingUp className="tab-icon" />
          Optimization
        </button>
      </div>

      <div className="scheduling-content">
        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            <div className="schedule-timeline">
              <h3>Today's Schedule</h3>
              <div className="timeline-container">
                {scheduleBlocks.map((block) => (
                  <div key={block.id} className="schedule-block">
                    <div className="block-time">
                      <span className="start-time">{block.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="end-time">{block.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="block-content">
                      <div className="block-header">
                        <h4 className="block-title">{block.description}</h4>
                        <div className="block-badges">
                          <span className={`type-badge ${getTypeColor(block.type)}`}>
                            {block.type}
                          </span>
                          <span className="duration-badge">{formatDuration(block.duration)}</span>
                          {block.isFlexible && (
                            <span className="flexible-badge">
                              <Settings className="w-3 h-3" />
                              Flexible
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="block-details">
                        <span>Priority: {block.priority}/10</span>
                        <span>Duration: {formatDuration(block.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tasks-list">
              <h3>AI-Scheduled Tasks</h3>
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item ${selectedTask === task.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="task-icon">
                    {getCategoryIcon(task.category)}
                  </div>
                  <div className="task-info">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <div className="task-badges">
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="category-badge">{task.category}</span>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <div className="detail-row">
                        <span className="detail-label">Estimated Duration:</span>
                        <span className="detail-value">{formatDuration(task.estimatedDuration)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Scheduled Time:</span>
                        <span className="detail-value">
                          {task.scheduledTime ? task.scheduledTime.toLocaleString() : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Due Date:</span>
                        <span className="detail-value">
                          {task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">AI Confidence:</span>
                        <span className="detail-value">{task.aiInsights.confidence}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Productivity Score:</span>
                        <span className="detail-value">{task.aiInsights.productivityScore}/100</span>
                      </div>
                    </div>
                    <div className="task-insights">
                      <h5>AI Insights:</h5>
                      <p className="insight-reasoning">{task.aiInsights.reasoning}</p>
                      <div className="insight-recommendations">
                        {task.aiInsights.recommendations.map((rec, index) => (
                          <span key={index} className="recommendation-tag">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="task-tags">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="action-button">
                      <Brain className="w-4 h-4" />
                      Optimize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="insights-dashboard">
              <h3>AI Insights Dashboard</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-header">
                    <Brain className="insight-icon" />
                    <h4>Productivity Patterns</h4>
                  </div>
                  <div className="insight-content">
                    <p>Your peak productivity hours are 9-11 AM with 92% effectiveness for analytical tasks.</p>
                    <div className="insight-metrics">
                      <div className="metric">
                        <span className="metric-label">Peak Hours:</span>
                        <span className="metric-value">9-11 AM</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Effectiveness:</span>
                        <span className="metric-value">92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <Target className="insight-icon" />
                    <h4>Task Optimization</h4>
                  </div>
                  <div className="insight-content">
                    <p>Schedule high-focus tasks during morning hours for maximum efficiency.</p>
                    <div className="insight-metrics">
                      <div className="metric">
                        <span className="metric-label">Optimal Tasks:</span>
                        <span className="metric-value">3 scheduled</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Efficiency Gain:</span>
                        <span className="metric-value">+15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <TrendingUp className="insight-icon" />
                    <h4>Energy Management</h4>
                  </div>
                  <div className="insight-content">
                    <p>Your energy levels peak in the morning and dip after lunch.</p>
                    <div className="insight-metrics">
                      <div className="metric">
                        <span className="metric-label">Peak Energy:</span>
                        <span className="metric-value">9-11 AM</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Low Energy:</span>
                        <span className="metric-value">2-4 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <Calendar className="insight-icon" />
                    <h4>Schedule Recommendations</h4>
                  </div>
                  <div className="insight-content">
                    <p>Consider moving the financial review to 9:30 AM for better focus.</p>
                    <div className="insight-metrics">
                      <div className="metric">
                        <span className="metric-label">Suggestions:</span>
                        <span className="metric-value">2 pending</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Confidence:</span>
                        <span className="metric-value">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-tab">
            <div className="patterns-list">
              <h3>Productivity Patterns</h3>
              {productivityPatterns.map((pattern) => (
                <div key={pattern.id} className="pattern-item">
                  <div className="pattern-icon">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="pattern-info">
                    <div className="pattern-header">
                      <h4 className="pattern-name">{pattern.name}</h4>
                      <div className="pattern-badges">
                        <span className="effectiveness-badge">{pattern.effectiveness}% effective</span>
                        <span className="updated-badge">
                          Updated {pattern.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="pattern-description">{pattern.description}</p>
                    <div className="pattern-details">
                      <div className="detail-row">
                        <span className="detail-label">Time Slots:</span>
                        <span className="detail-value">{pattern.timeSlots.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Focus Areas:</span>
                        <span className="detail-value">{pattern.focusAreas.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Optimal Tasks:</span>
                        <span className="detail-value">{pattern.optimalTasks.length}</span>
                      </div>
                    </div>
                    <div className="pattern-time-slots">
                      <h5>Time Slots:</h5>
                      {pattern.timeSlots.map((slot, index) => (
                        <div key={index} className="time-slot">
                          <span className="slot-time">{slot.startTime} - {slot.endTime}</span>
                          <span className="slot-productivity">Productivity: {slot.productivity}%</span>
                          <span className="slot-energy">Energy: {slot.energy}%</span>
                          <span className="slot-focus">Focus: {slot.focus}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pattern-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit Pattern
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="optimization-tab">
            <div className="optimization-list">
              <h3>Schedule Optimizations</h3>
              {optimizations.map((optimization) => (
                <div key={optimization.id} className="optimization-item">
                  <div className="optimization-icon">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="optimization-info">
                    <div className="optimization-header">
                      <h4 className="optimization-title">Schedule Optimization</h4>
                      <div className="optimization-badges">
                        <span className={`impact-badge ${optimization.impact === 'positive' ? 'positive' : optimization.impact === 'negative' ? 'negative' : 'neutral'}`}>
                          {optimization.impact}
                        </span>
                        <span className="confidence-badge">{optimization.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="optimization-details">
                      <div className="detail-row">
                        <span className="detail-label">Original Time:</span>
                        <span className="detail-value">{optimization.originalTime.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Suggested Time:</span>
                        <span className="detail-value">{optimization.suggestedTime.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Reason:</span>
                        <span className="detail-value">{optimization.reason}</span>
                      </div>
                    </div>
                    <div className="optimization-alternatives">
                      <h5>Alternative Times:</h5>
                      {optimization.alternatives.map((alt, index) => (
                        <div key={index} className="alternative-time">
                          <span className="alt-time">{alt.time.toLocaleString()}</span>
                          <span className="alt-score">Score: {alt.score}/100</span>
                          <span className="alt-reason">{alt.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="optimization-actions">
                    <button className="action-button">
                      <CheckCircle className="w-4 h-4" />
                      Apply
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
