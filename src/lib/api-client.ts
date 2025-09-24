// API Configuration for AuraOS Frontend
const API_CONFIG = {
  baseURL: 'http://localhost:3001',
  endpoints: {
    health: '/health',
    auth: {
      login: '/api/auth/login',
      status: '/api/auth/status',
      logout: '/api/auth/logout'
    },
    workspaces: '/api/v1/workspaces',
    tasks: '/api/v1/tasks',
    mcpTools: '/api/v1/mcp-tools',
    automation: '/api/v1/automation'
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Development authentication bypass
const DEV_AUTH_TOKEN = 'dev-token-' + Date.now();

class AuraOSAPIClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.authToken = localStorage.getItem('auraos-auth-token') || DEV_AUTH_TOKEN;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
        'Authorization': `Bearer ${this.authToken}`
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request(API_CONFIG.endpoints.health);
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.authToken = response.token || DEV_AUTH_TOKEN;
      localStorage.setItem('auraos-auth-token', this.authToken);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request(API_CONFIG.endpoints.auth.logout, {
        method: 'POST'
      });
    } finally {
      this.authToken = DEV_AUTH_TOKEN;
      localStorage.removeItem('auraos-auth-token');
    }
  }

  // Workspaces
  async getWorkspaces() {
    return this.request(API_CONFIG.endpoints.workspaces);
  }

  async createWorkspace(data: any) {
    return this.request(API_CONFIG.endpoints.workspaces, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Tasks
  async getTasks() {
    return this.request(API_CONFIG.endpoints.tasks);
  }

  async createTask(data: any) {
    return this.request(API_CONFIG.endpoints.tasks, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // MCP Tools
  async getMCPTools() {
    return this.request(API_CONFIG.endpoints.mcpTools);
  }

  async executeMCPTool(toolId: string, params: any) {
    return this.request(`${API_CONFIG.endpoints.mcpTools}/${toolId}/execute`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  // Automation
  async getAutomationWorkflows() {
    return this.request(`${API_CONFIG.endpoints.automation}/workflows`);
  }

  async executeWorkflow(workflowId: string, data: any) {
    return this.request(`${API_CONFIG.endpoints.automation}/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Export singleton instance
export const apiClient = new AuraOSAPIClient();
export default apiClient;
