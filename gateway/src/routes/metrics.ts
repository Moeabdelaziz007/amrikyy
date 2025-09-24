import express from 'express';
import { register, collectDefaultMetrics } from 'prom-client';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Collect default metrics
collectDefaultMetrics();

// Custom metrics
const httpRequestsTotal = new register.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new register.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const eventProcessedTotal = new register.Counter({
  name: 'event_processed_total',
  help: 'Total number of events processed',
  labelNames: ['source', 'type', 'status']
});

// Metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    logger.error('Failed to collect metrics:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    res.json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'Health check failed' 
    });
  }
});

export { httpRequestsTotal, httpRequestDuration, eventProcessedTotal };
export default router;