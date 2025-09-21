// Automation API Service - Connect Frontend to Real Data
import { ApiResponse, PaginationParams } from '@/types/automation';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_VERSION = 'v1';

class AutomationApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_VERSION}`;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  private async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH request
  private async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Workspace API methods
  async getWorkspaces(params?: PaginationParams & { userId?: string }) {
    return this.get('/workspaces', params);
  }

  async getWorkspace(id: string) {
    return this.get(`/workspaces/${id}`);
  }

  async createWorkspace(data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    isPublic?: boolean;
    tags?: string[];
  }) {
    return this.post('/workspaces', data);
  }

  async updateWorkspace(id: string, data: Partial<{
    name: string;
    description: string;
    color: string;
    icon: string;
    isPublic: boolean;
    tags: string[];
    settings: any;
  }>) {
    return this.put(`/workspaces/${id}`, data);
  }

  async deleteWorkspace(id: string) {
    return this.delete(`/workspaces/${id}`);
  }

  async addWorkspaceMember(workspaceId: string, data: {
    userId: string;
    role: 'admin' | 'editor' | 'viewer';
    permissions?: string[];
  }) {
    return this.post(`/workspaces/${workspaceId}/members`, data);
  }

  async removeWorkspaceMember(workspaceId: string, userId: string) {
    return this.delete(`/workspaces/${workspaceId}/members/${userId}`);
  }

  // Automation Tasks API methods
  async getTasks(params?: PaginationParams & {
    workspaceId?: string;
    status?: string;
    category?: string;
    priority?: string;
    userId?: string;
  }) {
    return this.get('/tasks', params);
  }

  async getTask(id: string) {
    return this.get(`/tasks/${id}`);
  }

  async createTask(data: {
    name: string;
    description?: string;
    workspaceId: string;
    type: 'workflow' | 'trigger' | 'action' | 'condition' | 'ai' | 'mcp';
    category: 'social_media' | 'email' | 'data' | 'ai' | 'integration' | 'notification';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    config?: Record<string, any>;
    schedule?: {
      enabled: boolean;
      cron: string;
      timezone: string;
    };
    variables?: Record<string, any>;
  }) {
    return this.post('/tasks', data);
  }

  async updateTask(id: string, data: Partial<{
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'draft' | 'error' | 'running' | 'paused';
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    config: Record<string, any>;
    schedule: any;
    variables: Record<string, any>;
  }>) {
    return this.put(`/tasks/${id}`, data);
  }

  async deleteTask(id: string) {
    return this.delete(`/tasks/${id}`);
  }

  async executeTask(id: string, data?: {
    input?: Record<string, any>;
    variables?: Record<string, any>;
  }) {
    return this.post(`/tasks/${id}/execute`, data);
  }

  async pauseTask(id: string) {
    return this.patch(`/tasks/${id}/pause`);
  }

  async resumeTask(id: string) {
    return this.patch(`/tasks/${id}/resume`);
  }

  async stopTask(id: string) {
    return this.patch(`/tasks/${id}/stop`);
  }

  // Task Execution API methods
  async getTaskExecutions(params?: PaginationParams & {
    taskId?: string;
    status?: string;
    userId?: string;
  }) {
    return this.get('/executions', params);
  }

  async getTaskExecution(id: string) {
    return this.get(`/executions/${id}`);
  }

  async getTaskExecutionLogs(executionId: string, params?: PaginationParams & {
    level?: string;
  }) {
    return this.get(`/executions/${executionId}/logs`, params);
  }

  // MCP Tools API methods
  async getMcpTools(params?: PaginationParams & {
    category?: string;
    status?: string;
    search?: string;
  }) {
    return this.get('/mcp-tools', params);
  }

  async getMcpTool(id: string) {
    return this.get(`/mcp-tools/${id}`);
  }

  async installMcpTool(id: string) {
    return this.post(`/mcp-tools/${id}/install`);
  }

  async uninstallMcpTool(id: string) {
    return this.delete(`/mcp-tools/${id}/uninstall`);
  }

  async configureMcpTool(id: string, data: {
    settings?: any;
    integrations?: any[];
  }) {
    return this.put(`/mcp-tools/${id}/configure`, data);
  }

  async executeMcpTool(id: string, data: {
    parameters?: Record<string, any>;
    input?: any;
  }) {
    return this.post(`/mcp-tools/${id}/execute`, data);
  }

  async updateMcpTool(id: string) {
    return this.post(`/mcp-tools/${id}/update`);
  }

  // Workflow Suggestions API methods
  async getWorkflowSuggestions(params?: PaginationParams & {
    category?: string;
    priority?: string;
    applied?: boolean;
    userId?: string;
  }) {
    return this.get('/suggestions', params);
  }

  async getWorkflowSuggestion(id: string) {
    return this.get(`/suggestions/${id}`);
  }

  async createWorkflowSuggestion(data: {
    title: string;
    description: string;
    category: 'optimization' | 'automation' | 'integration' | 'performance' | 'security' | 'scalability';
    priority: 'low' | 'medium' | 'high' | 'critical';
    impact: 'low' | 'medium' | 'high' | 'transformational';
    effort: 'low' | 'medium' | 'high' | 'extensive';
    confidence: number;
    estimatedSavings: {
      time: number;
      cost: number;
      resources: number;
    };
    implementation: {
      steps: string[];
      requirements: string[];
      timeline: string;
      dependencies: string[];
    };
    aiReasoning: string;
    tags?: string[];
    applicableTasks?: string[];
  }) {
    return this.post('/suggestions', data);
  }

  async applyWorkflowSuggestion(id: string) {
    return this.post(`/suggestions/${id}/apply`);
  }

  async generateSuggestions(data?: {
    workflowId?: string;
    taskId?: string;
    userId?: string;
  }) {
    return this.post('/suggestions/generate', data);
  }

  // Optimization Results API methods
  async getOptimizationResults(params?: PaginationParams & {
    taskId?: string;
    userId?: string;
  }) {
    return this.get('/optimizations', params);
  }

  async getOptimizationResult(id: string) {
    return this.get(`/optimizations/${id}`);
  }

  async optimizeWorkflow(workflowId: string) {
    return this.post(`/workflows/${workflowId}/optimize`);
  }

  // Workflow Templates API methods
  async getWorkflowTemplates(params?: PaginationParams & {
    category?: string;
    isPublic?: boolean;
    isOfficial?: boolean;
    search?: string;
  }) {
    return this.get('/workflow-templates', params);
  }

  async getWorkflowTemplate(id: string) {
    return this.get(`/workflow-templates/${id}`);
  }

  async createWorkflowTemplate(data: {
    name: string;
    description: string;
    category: string;
    isPublic?: boolean;
    nodes: any[];
    connections: any[];
    variables?: any[];
    settings: any;
  }) {
    return this.post('/workflow-templates', data);
  }

  async updateWorkflowTemplate(id: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    isPublic: boolean;
    nodes: any[];
    connections: any[];
    variables: any[];
    settings: any;
  }>) {
    return this.put(`/workflow-templates/${id}`, data);
  }

  async deleteWorkflowTemplate(id: string) {
    return this.delete(`/workflow-templates/${id}`);
  }

  async loadWorkflowTemplate(id: string) {
    return this.post(`/workflow-templates/${id}/load`);
  }

  // System Monitoring API methods
  async getSystemHealth() {
    return this.get('/system/health');
  }

  async getMonitoringMetrics(params?: {
    timeRange?: '1h' | '6h' | '24h' | '7d';
    metrics?: string[];
  }) {
    return this.get('/system/metrics', params);
  }

  async getSystemAlerts(params?: PaginationParams & {
    type?: string;
    resolved?: boolean;
    severity?: string;
  }) {
    return this.get('/system/alerts', params);
  }

  async resolveAlert(id: string, data?: {
    action?: string;
    note?: string;
  }) {
    return this.patch(`/system/alerts/${id}/resolve`, data);
  }

  // Analytics API methods
  async getAnalytics(params?: {
    timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
    workspaceId?: string;
    userId?: string;
  }) {
    return this.get('/analytics', params);
  }

  async getTaskAnalytics(taskId: string, params?: {
    timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  }) {
    return this.get(`/analytics/tasks/${taskId}`, params);
  }

  async getWorkspaceAnalytics(workspaceId: string, params?: {
    timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  }) {
    return this.get(`/analytics/workspaces/${workspaceId}`, params);
  }

  // AI Analysis API methods
  async analyzePatterns(data?: {
    workspaceId?: string;
    userId?: string;
    timeRange?: string;
  }) {
    return this.post('/ai/analyze-patterns', data);
  }

  async getAiInsights(data?: {
    workspaceId?: string;
    userId?: string;
    type?: 'performance' | 'optimization' | 'security';
  }) {
    return this.post('/ai/insights', data);
  }

  // User Profile & Preferences API methods
  async getMe() {
    return this.get('/users/me');
  }

  async updateMe(data: Partial<{ name: string; avatar: string }>) {
    return this.put('/users/me', data);
  }

  async getMyPreferences() {
    return this.get('/users/me/preferences');
  }

  async updateMyPreferences(data: Partial<{ theme: 'light' | 'dark' | 'auto'; notifications: boolean; language: string; reducedMotion: boolean }>) {
    return this.put('/users/me/preferences', data);
  }

  async optimizeWorkflowAi(workflowId: string, data?: {
    focus?: 'performance' | 'cost' | 'reliability';
    constraints?: Record<string, any>;
  }) {
    return this.post(`/ai/optimize/${workflowId}`, data);
  }

  // File Upload API methods
  async uploadFile(file: File, data?: {
    workspaceId?: string;
    taskId?: string;
    type?: string;
  }) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, String(value));
      });
    }

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  async deleteFile(fileId: string) {
    return this.delete(`/files/${fileId}`);
  }

  async getFiles(params?: PaginationParams & {
    workspaceId?: string;
    taskId?: string;
    type?: string;
  }) {
    return this.get('/files', params);
  }

  // Export/Import API methods
  async exportWorkspace(workspaceId: string, format: 'json' | 'yaml' = 'json') {
    return this.get(`/workspaces/${workspaceId}/export`, { format });
  }

  async exportTask(taskId: string, format: 'json' | 'yaml' = 'json') {
    return this.get(`/tasks/${taskId}/export`, { format });
  }

  async importWorkspace(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/workspaces/import', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }

  async importTask(file: File, workspaceId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    return this.request('/tasks/import', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }
}

// Create and export singleton instance
export const automationApi = new AutomationApiService();

// Export the class for testing
export { AutomationApiService };

// Export types for use in components
export type {
  ApiResponse,
  PaginationParams,
} from '@/types/automation';
