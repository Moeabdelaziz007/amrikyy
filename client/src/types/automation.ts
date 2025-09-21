// Automation Types - Core data structures for automation system

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
  };
  automation: {
    autoSave: boolean;
    confirmActions: boolean;
    maxConcurrentTasks: number;
  };
}

// Automation Task Types
export interface AutomationTask {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'workflow' | 'script' | 'integration' | 'monitoring';
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  type: 'workflow' | 'script' | 'integration' | 'monitoring';
  metadata?: Record<string, any>;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  metadata?: Record<string, any>;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'delay';
  config: Record<string, any>;
  nextStepId?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  id: string;
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  processes: number;
}

// Prompt Library Types
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreatePromptRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface UpdatePromptRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}
