/**
 * Express API for Task Automation Engine
 */

import express from 'express';
import { taskAutomationEngine } from './taskAutomationEngine';
import { TaskType } from './types/task';
// Import appropriate adapter based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const { initializeFirestore } = isDevelopment
  ? require('./adapters/mockFirestoreAdapter')
  : require('./adapters/firestoreAdapter');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Get available task types
app.get('/task-types', (_req, res) => {
  try {
    const taskTypes = taskAutomationEngine.getAvailableTaskTypes();
    res.json({ taskTypes });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get task types',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Development-only endpoint for storage stats
if (isDevelopment) {
  app.get('/dev/stats', (_req, res) => {
    try {
      const { getStorageStats } = require('./adapters/mockFirestoreAdapter');
      const stats = getStorageStats();
      res.json({
        mode: 'development',
        storage: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get storage stats',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post('/dev/clear', (_req, res) => {
    try {
      const { clearAllData } = require('./adapters/mockFirestoreAdapter');
      clearAllData();
      res.json({
        message: 'All data cleared',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to clear data',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { name, type, config, metadata } = req.body;

    // Validate required fields
    if (!name || !type) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'type'],
      });
      return;
    }

    // Validate task type
    if (!Object.values(TaskType).includes(type)) {
      res.status(400).json({
        error: 'Invalid task type',
        validTypes: Object.values(TaskType),
      });
      return;
    }

    const task = await taskAutomationEngine.createTask(
      name,
      type,
      config || {},
      metadata || {}
    );

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create task',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Get a specific task
app.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskAutomationEngine.getTask(id);

    if (!task) {
      res.status(404).json({
        error: 'Task not found',
        taskId: id,
      });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get task',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Execute a task
app.post('/tasks/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    const execution = await taskAutomationEngine.executeTask(id, input);
    res.json(execution);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute task',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Get task execution by ID
app.get('/executions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const execution = await taskAutomationEngine.getTaskExecution(id);

    if (!execution) {
      res.status(404).json({
        error: 'Execution not found',
        executionId: id,
      });
      return;
    }

    res.json(execution);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get execution',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Get all executions for a task
app.get('/tasks/:id/executions', async (req, res) => {
  try {
    const { id } = req.params;
    const executions = await taskAutomationEngine.getTaskExecutions(id);
    res.json({ executions });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get task executions',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Error handling middleware
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Initialize Firestore
try {
  // Initialize Firestore (use service account if available)
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  initializeFirestore(serviceAccountPath);
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
}

export default app;
