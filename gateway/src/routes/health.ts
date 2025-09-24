import express from 'express';
import { redisClient } from '../services/redis.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

async function getHealthStatus() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      redis: 'unknown',
      gateway: 'healthy'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };

  try {
    // Check Redis connection
    await redisClient.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
    logger.error('Redis health check failed:', error);
  }

  return health;
}

router.get('/', async (req, res) => {
  try {
    const health = await getHealthStatus();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

export { getHealthStatus };
export default router;