import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  logger.error('Autopilot Service Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Autopilot Service Redis Client Connected');
});

redisClient.on('ready', () => {
  logger.info('Autopilot Service Redis Client Ready');
});

redisClient.on('end', () => {
  logger.info('Autopilot Service Redis Client Disconnected');
});

export { redisClient };
