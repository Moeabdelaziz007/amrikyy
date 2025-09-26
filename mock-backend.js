#!/usr/bin/env node

// Simple mock backend server for testing the TaskQueue component
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock task data
let tasks = [
  {
    id: '1',
    name: 'Process User Data',
    description: 'Analyze and process user interaction data',
    status: 'running',
    priority: 'high',
    type: 'automation',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(),
    startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    progress: 75,
    logs: ['Task started', 'Data loaded', 'Processing in progress']
  },
  {
    id: '2',
    name: 'Generate Report',
    description: 'Create weekly analytics report',
    status: 'pending',
    priority: 'medium',
    type: 'workflow',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(),
    progress: 0,
    logs: []
  },
  {
    id: '3',
    name: 'Clean Database',
    description: 'Remove old and unused data entries',
    status: 'completed',
    priority: 'low',
    type: 'script',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(),
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
    duration: 90000, // 1.5 minutes
    progress: 100,
    logs: ['Task started', 'Database connection established', 'Cleanup completed', 'Task finished']
  },
  {
    id: '4',
    name: 'Send Notifications',
    description: 'Send weekly digest emails to users',
    status: 'failed',
    priority: 'high',
    type: 'automation',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(),
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 5000,
    progress: 0,
    error: 'SMTP server connection failed',
    logs: ['Task started', 'Connecting to SMTP server', 'Connection failed']
  },
  {
    id: '5',
    name: 'Update AI Models',
    description: 'Retrain machine learning models with new data',
    status: 'pending',
    priority: 'critical',
    type: 'script',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(),
    progress: 0,
    logs: []
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/v1/tasks', (req, res) => {
  res.json({ tasks });
});

app.post('/api/v1/tasks/:id/start', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status === 'running') {
    return res.status(400).json({ error: 'Task is already running' });
  }
  
  task.status = 'running';
  task.startedAt = new Date();
  task.updatedAt = new Date();
  task.progress = 0;
  task.logs = [...(task.logs || []), 'Task started'];
  
  res.json({ success: true, task });
});

app.post('/api/v1/tasks/:id/pause', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status !== 'running') {
    return res.status(400).json({ error: 'Task is not running' });
  }
  
  task.status = 'pending';
  task.updatedAt = new Date();
  task.logs = [...(task.logs || []), 'Task paused'];
  
  res.json({ success: true, task });
});

app.post('/api/v1/tasks/:id/cancel', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status === 'completed') {
    return res.status(400).json({ error: 'Cannot cancel completed task' });
  }
  
  task.status = 'cancelled';
  task.updatedAt = new Date();
  task.logs = [...(task.logs || []), 'Task cancelled'];
  
  res.json({ success: true, task });
});

app.delete('/api/v1/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ success: true });
});

app.post('/api/v1/tasks', (req, res) => {
  const newTask = {
    id: String(tasks.length + 1),
    name: req.body.name || 'New Task',
    description: req.body.description || '',
    status: 'pending',
    priority: req.body.priority || 'medium',
    type: req.body.type || 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: 0,
    logs: []
  };
  
  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Tasks API: http://localhost:${PORT}/api/v1/tasks`);
  console.log(`\n📝 Available tasks:`);
  tasks.forEach(task => {
    console.log(`  - ${task.name} (${task.status})`);
  });
});

// Simulate task progress updates
setInterval(() => {
  tasks.forEach(task => {
    if (task.status === 'running' && task.progress < 100) {
      task.progress = Math.min(task.progress + Math.random() * 10, 100);
      task.updatedAt = new Date();
      
      if (task.progress >= 100) {
        task.status = 'completed';
        task.completedAt = new Date();
        task.duration = task.startedAt ? new Date() - task.startedAt : 0;
        task.logs = [...(task.logs || []), 'Task completed successfully'];
      }
    }
  });
}, 5000); // Update every 5 seconds
