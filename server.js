const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Mock data for tasks
const mockTasks = [
  {
    id: 'task-1',
    title: 'System Health Check',
    description: 'Perform comprehensive system health check and maintenance',
    status: 'in-progress',
    priority: 'high',
    assignee: 'System Bot',
    dueDate: '2024-01-20',
    createdAt: '2024-01-15',
    tags: ['system', 'maintenance', 'health'],
    progress: 75
  },
  {
    id: 'task-2',
    title: 'Update Documentation',
    description: 'Update system documentation and user guides',
    status: 'pending',
    priority: 'medium',
    assignee: 'Documentation Team',
    dueDate: '2024-01-25',
    createdAt: '2024-01-16',
    tags: ['documentation', 'update'],
    progress: 0
  },
  {
    id: 'task-3',
    title: 'Security Audit',
    description: 'Conduct security audit and vulnerability assessment',
    status: 'completed',
    priority: 'high',
    assignee: 'Security Team',
    dueDate: '2024-01-18',
    createdAt: '2024-01-10',
    tags: ['security', 'audit'],
    progress: 100
  },
  {
    id: 'task-4',
    title: 'Performance Optimization',
    description: 'Optimize system performance and reduce load times',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Performance Team',
    dueDate: '2024-01-30',
    createdAt: '2024-01-17',
    tags: ['performance', 'optimization'],
    progress: 45
  }
];

// Mock data for demonstration
const mockTelegramBot = {
  status: 'connected',
  messages: [
    { id: 1, sender: 'User', content: 'Hello bot!', timestamp: '2024-01-15 10:30', type: 'incoming' },
    { id: 2, sender: 'Bot', content: 'Hello! How can I help you?', timestamp: '2024-01-15 10:31', type: 'outgoing' },
    { id: 3, sender: 'User', content: 'What can you do?', timestamp: '2024-01-15 10:32', type: 'incoming' },
    { id: 4, sender: 'Bot', content: 'I can help with automation tasks, answer questions, and manage your AIOS system!', timestamp: '2024-01-15 10:33', type: 'outgoing' }
  ],
  config: {
    token: '***hidden***',
    webhookUrl: 'https://aios-97581.web.app/webhook',
    enabled: true
  }
};

const mockAutomationWorkflows = [
  {
    id: 'workflow-1',
    name: 'Daily System Check',
    description: 'Automated daily system health check and maintenance',
    status: 'active',
    progress: 75
  },
  {
    id: 'workflow-2',
    name: 'Data Backup',
    description: 'Automated backup of user data and system configurations',
    status: 'inactive',
    progress: 0
  },
  {
    id: 'workflow-3',
    name: 'Performance Monitor',
    description: 'Continuous monitoring of system performance metrics',
    status: 'active',
    progress: 90
  }
];

const mockMCPTools = [
  {
    id: 'file-manager',
    name: 'File Manager',
    description: 'Manage files and directories',
    icon: '📁',
    parameters: [
      { name: 'action', type: 'select', description: 'Action to perform', options: ['list', 'create', 'delete', 'move'] },
      { name: 'path', type: 'text', description: 'File or directory path' }
    ]
  },
  {
    id: 'web-scraper',
    name: 'Web Scraper',
    description: 'Extract data from websites',
    icon: '🕷️',
    parameters: [
      { name: 'url', type: 'url', description: 'Website URL to scrape' },
      { name: 'selector', type: 'text', description: 'CSS selector for data extraction' }
    ]
  },
  {
    id: 'api-client',
    name: 'API Client',
    description: 'Make HTTP requests to external APIs',
    icon: '🌐',
    parameters: [
      { name: 'url', type: 'url', description: 'API endpoint URL' },
      { name: 'method', type: 'select', description: 'HTTP method', options: ['GET', 'POST', 'PUT', 'DELETE'] },
      { name: 'headers', type: 'text', description: 'Request headers (JSON format)' }
    ]
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Telegram Bot API endpoints
app.get('/api/telegram/status', (req, res) => {
  res.json({ status: mockTelegramBot.status });
});

app.get('/api/telegram/messages', (req, res) => {
  res.json({ messages: mockTelegramBot.messages });
});

app.get('/api/telegram/config', (req, res) => {
  res.json({ config: mockTelegramBot.config });
});

app.post('/api/telegram/send', (req, res) => {
  const { message } = req.body;
  const newMessage = {
    id: mockTelegramBot.messages.length + 1,
    sender: 'Bot',
    content: `Echo: ${message}`,
    timestamp: new Date().toLocaleString(),
    type: 'outgoing'
  };
  mockTelegramBot.messages.push(newMessage);
  res.json({ success: true, message: newMessage });
});

app.post('/api/telegram/start', (req, res) => {
  mockTelegramBot.status = 'connected';
  mockTelegramBot.config.enabled = true;
  res.json({ success: true, status: 'started' });
});

app.post('/api/telegram/stop', (req, res) => {
  mockTelegramBot.status = 'disconnected';
  mockTelegramBot.config.enabled = false;
  res.json({ success: true, status: 'stopped' });
});

app.put('/api/telegram/config', (req, res) => {
  mockTelegramBot.config = { ...mockTelegramBot.config, ...req.body };
  res.json({ success: true, config: mockTelegramBot.config });
});

// Automation API endpoints
app.get('/api/automation/workflows', (req, res) => {
  res.json({ workflows: mockAutomationWorkflows });
});

app.get('/api/automation/active', (req, res) => {
  const activeWorkflows = mockAutomationWorkflows.filter(w => w.status === 'active');
  res.json({ workflows: activeWorkflows });
});

app.get('/api/automation/stats', (req, res) => {
  res.json({
    stats: {
      totalWorkflows: mockAutomationWorkflows.length,
      activeWorkflows: mockAutomationWorkflows.filter(w => w.status === 'active').length,
      completedTasks: 156,
      failedTasks: 3
    }
  });
});

app.post('/api/automation/workflows/:id/execute', (req, res) => {
  const { id } = req.params;
  const workflow = mockAutomationWorkflows.find(w => w.id === id);
  if (workflow) {
    workflow.status = 'active';
    workflow.progress = 0;
    res.json({ success: true, workflow });
  } else {
    res.status(404).json({ error: 'Workflow not found' });
  }
});

app.post('/api/automation/workflows/:id/stop', (req, res) => {
  const { id } = req.params;
  const workflow = mockAutomationWorkflows.find(w => w.id === id);
  if (workflow) {
    workflow.status = 'inactive';
    workflow.progress = 0;
    res.json({ success: true, workflow });
  } else {
    res.status(404).json({ error: 'Workflow not found' });
  }
});

// MCP Tools API endpoints
app.get('/api/v1/mcp-tools', (req, res) => {
  res.json({ tools: mockMCPTools });
});

app.post('/api/v1/mcp-tools/:id/execute', (req, res) => {
  const { id } = req.params;
  const { action, path, url, selector, method, headers } = req.body;
  
  const tool = mockMCPTools.find(t => t.id === id);
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }

  // Mock execution results
  let result;
  switch (id) {
    case 'file-manager':
      result = {
        success: true,
        action,
        path,
        files: ['file1.txt', 'file2.txt', 'folder1/'],
        message: `Successfully executed ${action} on ${path}`
      };
      break;
    case 'web-scraper':
      result = {
        success: true,
        url,
        selector,
        data: ['Sample data 1', 'Sample data 2', 'Sample data 3'],
        message: `Successfully scraped data from ${url}`
      };
      break;
    case 'api-client':
      result = {
        success: true,
        url,
        method,
        headers,
        response: { status: 200, data: 'Mock API response' },
        message: `Successfully made ${method} request to ${url}`
      };
      break;
    default:
      result = {
        success: true,
        message: `Tool ${id} executed successfully`,
        data: req.body
      };
  }

  res.json(result);
});

// Task Management API endpoints
app.get('/api/v1/tasks', (req, res) => {
  const { status, priority, assignee } = req.query;
  let filteredTasks = [...mockTasks];

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  if (assignee) {
    filteredTasks = filteredTasks.filter(task => task.assignee === assignee);
  }

  res.json({ tasks: filteredTasks });
});

app.get('/api/v1/tasks/stats', (req, res) => {
  const stats = {
    total: mockTasks.length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
    pending: mockTasks.filter(t => t.status === 'pending').length,
    overdue: mockTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };
  
  res.json({ stats });
});

app.get('/api/v1/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = mockTasks.find(t => t.id === id);
  
  if (task) {
    res.json({ task });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/v1/tasks', (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0],
    progress: 0
  };
  
  mockTasks.push(newTask);
  res.status(201).json({ task: newTask });
});

app.put('/api/v1/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = mockTasks.findIndex(t => t.id === id);
  
  if (taskIndex !== -1) {
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...req.body };
    res.json({ task: mockTasks[taskIndex] });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/v1/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = mockTasks.findIndex(t => t.id === id);
  
  if (taskIndex !== -1) {
    const deletedTask = mockTasks.splice(taskIndex, 1)[0];
    res.json({ task: deletedTask });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/v1/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const taskIndex = mockTasks.findIndex(t => t.id === id);
  
  if (taskIndex !== -1) {
    mockTasks[taskIndex].status = 'completed';
    mockTasks[taskIndex].progress = 100;
    res.json({ task: mockTasks[taskIndex] });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Serve React app for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Amrikyy AIOS Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend served at http://localhost:${PORT}`);
});

module.exports = app;
