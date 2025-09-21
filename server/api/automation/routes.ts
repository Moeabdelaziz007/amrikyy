// Automation API Routes - Backend Endpoints
import { Router } from 'express';
import { z } from 'zod';
import { db } from './database';
import { 
  automationTasks, 
  taskExecutions, 
  executionLogs,
  workspaces, 
  workspaceMembers,
  mcpTools,
  toolIntegrations,
  workflowSuggestions,
  optimizationResults,
  workflowTemplates,
  systemHealth,
  monitoringMetrics,
  systemAlerts,
  users
} from './schema';
import { eq, and, desc, asc, like, inArray, gte, lte, count, sql } from 'drizzle-orm';
import { withDatabaseErrorHandling } from './database';
import { getEnhancedTravelAgency } from '../../enhanced-travel-agency';
import { 
  CreateWorkspaceSchema, 
  CreateTaskSchema, 
  CreateWorkflowSchema,
  UpdateTaskStatusSchema,
  ExecuteTaskSchema,
  CreateSuggestionSchema
} from './types';
import { getWebSocketServer } from './websocket';

const router = Router();

// Middleware for authentication (simplified for demo)
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }
  
  // In a real app, you'd verify the JWT token here
  req.user = { id: 'user-123', email: 'demo@example.com', name: 'Demo User' };
  next();
};

// Apply authentication to all routes
router.use(authenticate);

// Utility function to build pagination response
const buildPaginationResponse = (data: any[], page: number, limit: number, total: number) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});

// Workspace Routes
router.get('/workspaces', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { page = 1, limit = 10, search, userId } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(workspaces);
  
  if (search) {
    query = query.where(
      sql`${workspaces.name} ILIKE ${'%' + search + '%'} OR ${workspaces.description} ILIKE ${'%' + search + '%'}`
    );
  }
  
  if (userId) {
    query = query.where(eq(workspaces.ownerId, userId));
  }
  
  const [workspacesData, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset).orderBy(desc(workspaces.createdAt)),
    db.select({ count: count() }).from(workspaces)
  ]);
  
  res.json(buildPaginationResponse(workspacesData, parseInt(page), parseInt(limit), totalCount[0].count));
}));

router.get('/workspaces/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const workspace = await db.select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1);
  
  if (workspace.length === 0) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Workspace not found' } });
  }
  
  res.json({ success: true, data: workspace[0] });
}));

router.post('/workspaces', withDatabaseErrorHandling(async (req: any, res: any) => {
  const validatedData = CreateWorkspaceSchema.parse(req.body);
  
  const newWorkspace = {
    ...validatedData,
    ownerId: req.user.id,
    taskCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const [workspace] = await db.insert(workspaces).values(newWorkspace).returning();
  
  // Broadcast workspace update via WebSocket
  const wsServer = getWebSocketServer();
  if (wsServer) {
    wsServer.broadcastWorkspaceUpdate(workspace);
  }
  
  res.status(201).json({ success: true, data: workspace });
}));

router.put('/workspaces/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const updateData = { ...req.body, updatedAt: new Date() };
  
  const [updatedWorkspace] = await db.update(workspaces)
    .set(updateData)
    .where(eq(workspaces.id, id))
    .returning();
  
  if (!updatedWorkspace) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Workspace not found' } });
  }
  
  res.json({ success: true, data: updatedWorkspace });
}));

router.delete('/workspaces/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  await db.delete(workspaces).where(eq(workspaces.id, id));
  
  res.json({ success: true, data: { message: 'Workspace deleted successfully' } });
}));

// Automation Tasks Routes
router.get('/tasks', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { 
    page = 1, 
    limit = 10, 
    workspaceId, 
    status, 
    category, 
    priority,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(automationTasks);
  
  // Apply filters
  const conditions = [];
  
  if (workspaceId) conditions.push(eq(automationTasks.workspaceId, workspaceId));
  if (status) conditions.push(eq(automationTasks.status, status));
  if (category) conditions.push(eq(automationTasks.category, category));
  if (priority) conditions.push(eq(automationTasks.priority, priority));
  
  if (search) {
    conditions.push(
      sql`${automationTasks.name} ILIKE ${'%' + search + '%'} OR ${automationTasks.description} ILIKE ${'%' + search + '%'}`
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  // Apply sorting
  const sortColumn = automationTasks[sortBy as keyof typeof automationTasks];
  if (sortColumn) {
    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));
  } else {
    query = query.orderBy(desc(automationTasks.createdAt));
  }
  
  const [tasks, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset),
    db.select({ count: count() }).from(automationTasks)
  ]);
  
  res.json(buildPaginationResponse(tasks, parseInt(page), parseInt(limit), totalCount[0].count));
}));

router.get('/tasks/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const task = await db.select()
    .from(automationTasks)
    .where(eq(automationTasks.id, id))
    .limit(1);
  
  if (task.length === 0) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
  
  res.json({ success: true, data: task[0] });
}));

router.post('/tasks', withDatabaseErrorHandling(async (req: any, res: any) => {
  const validatedData = CreateTaskSchema.parse(req.body);
  
  const newTask = {
    ...validatedData,
    userId: req.user.id,
    status: 'draft' as const,
    executionCount: 0,
    successRate: 0,
    avgDuration: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const [task] = await db.insert(automationTasks).values(newTask).returning();
  
  res.status(201).json({ success: true, data: task });
}));

router.put('/tasks/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const updateData = { ...req.body, updatedAt: new Date() };
  
  const [updatedTask] = await db.update(automationTasks)
    .set(updateData)
    .where(eq(automationTasks.id, id))
    .returning();
  
  if (!updatedTask) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
  
  res.json({ success: true, data: updatedTask });
}));

router.delete('/tasks/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  await db.delete(automationTasks).where(eq(automationTasks.id, id));
  
  res.json({ success: true, data: { message: 'Task deleted successfully' } });
}));

router.post('/tasks/:id/execute', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const validatedData = ExecuteTaskSchema.parse(req.body);
  
  // Create execution record
  const execution = {
    taskId: id,
    userId: req.user.id,
    status: 'pending' as const,
    startedAt: new Date(),
    input: validatedData.input,
    retryCount: 0,
    maxRetries: 3,
    metrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      networkIO: 0,
      diskIO: 0
    }
  };
  
  const [newExecution] = await db.insert(taskExecutions).values(execution).returning();
  
  // Update task execution count and last run
  await db.update(automationTasks)
    .set({ 
      executionCount: sql`${automationTasks.executionCount} + 1`,
      lastRun: new Date(),
      updatedAt: new Date()
    })
    .where(eq(automationTasks.id, id));
  
  // Broadcast execution update via WebSocket
  const wsServer = getWebSocketServer();
  if (wsServer) {
    wsServer.broadcastExecutionUpdate(newExecution);
    
    // Also broadcast task update
    const [updatedTask] = await db.select().from(automationTasks).where(eq(automationTasks.id, id));
    if (updatedTask) {
      wsServer.broadcastTaskUpdate(updatedTask);
    }
  }
  
  res.status(201).json({ success: true, data: newExecution });
}));

router.patch('/tasks/:id/pause', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const [updatedTask] = await db.update(automationTasks)
    .set({ status: 'paused', updatedAt: new Date() })
    .where(eq(automationTasks.id, id))
    .returning();
  
  if (!updatedTask) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
  
  res.json({ success: true, data: updatedTask });
}));

router.patch('/tasks/:id/resume', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const [updatedTask] = await db.update(automationTasks)
    .set({ status: 'active', updatedAt: new Date() })
    .where(eq(automationTasks.id, id))
    .returning();
  
  if (!updatedTask) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
  
  res.json({ success: true, data: updatedTask });
}));

router.patch('/tasks/:id/stop', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const [updatedTask] = await db.update(automationTasks)
    .set({ status: 'inactive', updatedAt: new Date() })
    .where(eq(automationTasks.id, id))
    .returning();
  
  if (!updatedTask) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
  
  res.json({ success: true, data: updatedTask });
}));

// Task Executions Routes
router.get('/executions', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { page = 1, limit = 10, taskId, status, userId } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(taskExecutions);
  
  const conditions = [];
  if (taskId) conditions.push(eq(taskExecutions.taskId, taskId));
  if (status) conditions.push(eq(taskExecutions.status, status));
  if (userId) conditions.push(eq(taskExecutions.userId, userId));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const [executions, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset).orderBy(desc(taskExecutions.startedAt)),
    db.select({ count: count() }).from(taskExecutions)
  ]);
  
  res.json(buildPaginationResponse(executions, parseInt(page), parseInt(limit), totalCount[0].count));
}));

router.get('/executions/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const execution = await db.select()
    .from(taskExecutions)
    .where(eq(taskExecutions.id, id))
    .limit(1);
  
  if (execution.length === 0) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Execution not found' } });
  }
  
  res.json({ success: true, data: execution[0] });
}));

router.get('/executions/:id/logs', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const { page = 1, limit = 50, level } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(executionLogs).where(eq(executionLogs.executionId, id));
  
  if (level) {
    query = query.where(eq(executionLogs.level, level));
  }
  
  const [logs, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset).orderBy(desc(executionLogs.timestamp)),
    db.select({ count: count() }).from(executionLogs).where(eq(executionLogs.executionId, id))
  ]);
  
  res.json(buildPaginationResponse(logs, parseInt(page), parseInt(limit), totalCount[0].count));
}));

// MCP Tools Routes
router.get('/mcp-tools', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { page = 1, limit = 10, category, status, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(mcpTools);
  
  const conditions = [];
  if (category) conditions.push(eq(mcpTools.category, category));
  if (status) conditions.push(eq(mcpTools.status, status));
  
  if (search) {
    conditions.push(
      sql`${mcpTools.name} ILIKE ${'%' + search + '%'} OR ${mcpTools.description} ILIKE ${'%' + search + '%'}`
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const [tools, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset).orderBy(desc(mcpTools.createdAt)),
    db.select({ count: count() }).from(mcpTools)
  ]);
  
  res.json(buildPaginationResponse(tools, parseInt(page), parseInt(limit), totalCount[0].count));
}));

router.get('/mcp-tools/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const tool = await db.select()
    .from(mcpTools)
    .where(eq(mcpTools.id, id))
    .limit(1);
  
  if (tool.length === 0) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'MCP Tool not found' } });
  }
  
  res.json({ success: true, data: tool[0] });
}));

router.post('/mcp-tools/:id/install', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  
  const [updatedTool] = await db.update(mcpTools)
    .set({ status: 'active', lastUsed: new Date(), updatedAt: new Date() })
    .where(eq(mcpTools.id, id))
    .returning();
  
  if (!updatedTool) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'MCP Tool not found' } });
  }
  
  res.json({ success: true, data: updatedTool });
}));

// System Health Routes
router.get('/system/health', withDatabaseErrorHandling(async (req: any, res: any) => {
  const [latestHealth] = await db.select()
    .from(systemHealth)
    .orderBy(desc(systemHealth.timestamp))
    .limit(1);
  
  if (!latestHealth) {
    // Return default health status if no data exists
    const defaultHealth = {
      id: 'default',
      overall: 'healthy' as const,
      components: {
        cpu: { status: 'healthy', value: 0, unit: '%' },
        memory: { status: 'healthy', value: 0, unit: '%' },
        disk: { status: 'healthy', value: 0, unit: '%' },
        network: { status: 'healthy', value: 0, unit: 'Mbps' },
        database: { status: 'healthy', value: 0, unit: 'ms' },
        queue: { status: 'healthy', value: 0, unit: 'tasks' }
      },
      alerts: [],
      timestamp: new Date()
    };
    
    return res.json({ success: true, data: defaultHealth });
  }
  
  res.json({ success: true, data: latestHealth });
}));

router.get('/system/metrics', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { timeRange = '1h', metrics } = req.query;
  
  let timeFilter = new Date();
  switch (timeRange) {
    case '1h':
      timeFilter.setHours(timeFilter.getHours() - 1);
      break;
    case '6h':
      timeFilter.setHours(timeFilter.getHours() - 6);
      break;
    case '24h':
      timeFilter.setDate(timeFilter.getDate() - 1);
      break;
    case '7d':
      timeFilter.setDate(timeFilter.getDate() - 7);
      break;
  }
  
  let query = db.select().from(monitoringMetrics).where(gte(monitoringMetrics.timestamp, timeFilter));
  
  if (metrics && Array.isArray(metrics)) {
    query = query.where(inArray(monitoringMetrics.name, metrics));
  }
  
  const metricsData = await query.orderBy(desc(monitoringMetrics.timestamp));
  
  res.json({ success: true, data: metricsData });
}));

router.get('/system/alerts', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { page = 1, limit = 10, type, resolved, severity } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = db.select().from(systemAlerts);
  
  const conditions = [];
  if (type) conditions.push(eq(systemAlerts.type, type));
  if (resolved !== undefined) conditions.push(eq(systemAlerts.resolved, resolved === 'true'));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const [alerts, totalCount] = await Promise.all([
    query.limit(parseInt(limit)).offset(offset).orderBy(desc(systemAlerts.timestamp)),
    db.select({ count: count() }).from(systemAlerts)
  ]);
  
  res.json(buildPaginationResponse(alerts, parseInt(page), parseInt(limit), totalCount[0].count));
}));

// Analytics Routes
router.get('/analytics', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { timeRange = '24h', workspaceId, userId } = req.query;
  
  let timeFilter = new Date();
  switch (timeRange) {
    case '1h':
      timeFilter.setHours(timeFilter.getHours() - 1);
      break;
    case '6h':
      timeFilter.setHours(timeFilter.getHours() - 6);
      break;
    case '24h':
      timeFilter.setDate(timeFilter.getDate() - 1);
      break;
    case '7d':
      timeFilter.setDate(timeFilter.getDate() - 7);
      break;
    case '30d':
      timeFilter.setDate(timeFilter.getDate() - 30);
      break;
  }
  
  // Get task statistics
  const [taskStats] = await db.select({
    total: count(),
    active: count(sql`CASE WHEN ${automationTasks.status} = 'active' THEN 1 END`),
    completed: count(sql`CASE WHEN ${automationTasks.status} = 'completed' THEN 1 END`),
    failed: count(sql`CASE WHEN ${automationTasks.status} = 'failed' THEN 1 END`),
    avgSuccessRate: sql<number>`AVG(${automationTasks.successRate})`
  }).from(automationTasks).where(gte(automationTasks.createdAt, timeFilter));
  
  // Get execution statistics
  const [executionStats] = await db.select({
    total: count(),
    completed: count(sql`CASE WHEN ${taskExecutions.status} = 'completed' THEN 1 END`),
    failed: count(sql`CASE WHEN ${taskExecutions.status} = 'failed' THEN 1 END`),
    avgDuration: sql<number>`AVG(${taskExecutions.duration})`
  }).from(taskExecutions).where(gte(taskExecutions.startedAt, timeFilter));
  
  const analytics = {
    tasks: taskStats,
    executions: executionStats,
    timeRange,
    generatedAt: new Date()
  };
  
  res.json({ success: true, data: analytics });
}));

// Travel Agency Routes
router.get('/travel/destinations', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const destinations = await travelAgency.getDestinations();
  res.json({ success: true, data: destinations });
}));

router.get('/travel/destinations/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const travelAgency = getEnhancedTravelAgency();
  const destination = await travelAgency.getDestination(id);
  if (!destination) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Destination not found' } });
  }
  res.json({ success: true, data: destination });
}));

router.post('/travel/flights/search', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const results = await travelAgency.searchFlights(req.body);
  res.json({ success: true, data: results });
}));

router.post('/travel/hotels/search', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const results = await travelAgency.searchHotels(req.body);
  res.json({ success: true, data: results });
}));

router.post('/travel/recommendations', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { destination } = req.body;
  if (!destination) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Destination is required' } });
  }
  const travelAgency = getEnhancedTravelAgency();
  const packages = await travelAgency.getPersonalizedRecommendations(req.user.id, destination);
  res.json({ success: true, data: packages });
}));

router.post('/travel/book', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const bookingRequest = {
    ...req.body,
    userId: req.user.id
  };
  const booking = await travelAgency.bookTravel(bookingRequest);
  res.status(201).json({ success: true, data: booking });
}));

router.get('/travel/bookings', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const bookings = await travelAgency.getUserBookings(req.user.id);
  res.json({ success: true, data: bookings });
}));

router.get('/travel/bookings/:id', withDatabaseErrorHandling(async (req: any, res: any) => {
  const { id } = req.params;
  const travelAgency = getEnhancedTravelAgency();
  const booking = await travelAgency.getBooking(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Booking not found' } });
  }
  res.json({ success: true, data: booking });
}));

router.get('/travel/ai/insights', withDatabaseErrorHandling(async (req: any, res: any) => {
  const travelAgency = getEnhancedTravelAgency();
  const insights = await travelAgency.getAIRecommendations();
  res.json({ success: true, data: insights });
}));

// Error handling middleware
router.use((error: any, req: any, res: any, next: any) => {
  console.error('API Error:', error);
  
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.errors
      }
    });
  }
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

export default router;
