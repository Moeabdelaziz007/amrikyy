// Advanced Workspace Manager with Drag-and-Drop Interface
import React, { useState, useCallback } from 'react';
import {
  Folder,
  FolderPlus,
  MoreVertical,
  Settings,
  Trash2,
  Edit3,
  Users,
  Lock,
  Globe,
  Star,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Tag,
  Archive,
  Download,
  Upload,
  Share2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Move,
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  taskCount: number;
  isDefault: boolean;
  isPublic: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  collaborators: Collaborator[];
  settings: WorkspaceSettings;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

interface WorkspaceSettings {
  autoSave: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  layout: 'grid' | 'list' | 'kanban';
  sortBy: 'name' | 'date' | 'priority' | 'status';
  groupBy: 'none' | 'status' | 'priority' | 'category';
}

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  workspace: string;
  status: 'active' | 'inactive' | 'draft' | 'error' | 'running' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'workflow' | 'trigger' | 'action' | 'condition' | 'ai' | 'mcp';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  tasks: AutomationTask[];
  onWorkspaceSelect: (workspaceId: string) => void;
  onWorkspaceCreate: (workspace: Partial<Workspace>) => void;
  onWorkspaceUpdate: (workspaceId: string, updates: Partial<Workspace>) => void;
  onWorkspaceDelete: (workspaceId: string) => void;
  onTaskMove: (
    taskId: string,
    fromWorkspace: string,
    toWorkspace: string
  ) => void;
  selectedWorkspace: string;
}

export default function WorkspaceManager({
  workspaces,
  tasks,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceUpdate,
  onWorkspaceDelete,
  onTaskMove,
  selectedWorkspace,
}: WorkspaceManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority' | 'status'>(
    'name'
  );
  const [groupBy, setGroupBy] = useState<
    'none' | 'status' | 'priority' | 'category'
  >('none');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(
    new Set(['all'])
  );

  const filteredTasks = tasks.filter(task => {
    const matchesWorkspace =
      selectedWorkspace === 'all' || task.workspace === selectedWorkspace;
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      filterStatus === 'all' || task.status === filterStatus;
    return matchesWorkspace && matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const groupedTasks =
    groupBy === 'none'
      ? { 'All Tasks': sortedTasks }
      : sortedTasks.reduce(
          (groups, task) => {
            const key = task[groupBy as keyof AutomationTask] as string;
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
            return groups;
          },
          {} as Record<string, AutomationTask[]>
        );

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetWorkspace: string) => {
      e.preventDefault();
      if (draggedTask) {
        const task = tasks.find(t => t.id === draggedTask);
        if (task && task.workspace !== targetWorkspace) {
          onTaskMove(draggedTask, task.workspace, targetWorkspace);
        }
      }
      setDraggedTask(null);
    },
    [draggedTask, tasks, onTaskMove]
  );

  const toggleWorkspaceExpansion = useCallback((workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Folder className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Workspace Manager
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredTasks.length} tasks in{' '}
              {selectedWorkspace === 'all'
                ? 'all workspaces'
                : 'selected workspace'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
            <option value="error">Error</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Group:</label>
            <select
              value={groupBy}
              onChange={e => setGroupBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Workspaces</h3>
            <div className="space-y-2">
              <button
                onClick={() => onWorkspaceSelect('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedWorkspace === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4" />
                  <span>All Workspaces</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {tasks.length}
                </span>
              </button>
              {workspaces.map(workspace => (
                <div key={workspace.id}>
                  <button
                    onClick={() => {
                      onWorkspaceSelect(workspace.id);
                      toggleWorkspaceExpansion(workspace.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedWorkspace === workspace.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {expandedWorkspaces.has(workspace.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="text-lg">{workspace.icon}</span>
                      <span>{workspace.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {workspace.taskCount}
                      </span>
                      {workspace.isDefault && (
                        <Star className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                  </button>
                  {expandedWorkspaces.has(workspace.id) && (
                    <div className="ml-8 mt-2 space-y-1">
                      <div className="text-xs text-gray-500 px-3 py-1">
                        {workspace.description}
                      </div>
                      <div className="flex flex-wrap gap-1 px-3">
                        {workspace.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 px-3 py-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{workspace.collaborators.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {workspace.isPublic ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          <span>
                            {workspace.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Area */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                <div key={groupName}>
                  {groupBy !== 'none' && (
                    <h4 className="text-sm font-medium text-gray-700 mb-3 px-2">
                      {groupName} ({groupTasks.length})
                    </h4>
                  )}
                  <div className="space-y-3">
                    {groupTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        onDragOver={handleDragOver}
                        onDrop={e => handleDrop(e, task.workspace)}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-move"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {task.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
                            >
                              {task.status}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              {task.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{task.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                <div key={groupName}>
                  {groupBy !== 'none' && (
                    <h4 className="text-sm font-medium text-gray-700 mb-3 px-2">
                      {groupName} ({groupTasks.length})
                    </h4>
                  )}
                  <div className="space-y-2">
                    {groupTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        onDragOver={handleDragOver}
                        onDrop={e => handleDrop(e, task.workspace)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-move"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                  {task.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {task.name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {task.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
                                >
                                  {task.status}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {task.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0, 2).map(tag => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center space-x-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Workspace
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter workspace name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter workspace description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {[
                    '#3B82F6',
                    '#10B981',
                    '#8B5CF6',
                    '#F59E0B',
                    '#EF4444',
                    '#06B6D4',
                  ].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    '📱',
                    '📧',
                    '🤖',
                    '⚡',
                    '🔧',
                    '📊',
                    '🎯',
                    '🚀',
                    '💡',
                    '🔗',
                    '📈',
                    '🎨',
                  ].map(icon => (
                    <button
                      key={icon}
                      className="w-10 h-10 text-xl rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
