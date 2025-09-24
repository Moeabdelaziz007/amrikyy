// Test setup file
import { jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  generateRandomString: (length = 10) => {
    return Math.random().toString(36).substring(2, 2 + length);
  },
  
  generateRandomEmail: () => {
    return `test-${Date.now()}@example.com`;
  },
  
  generateRandomUser: () => ({
    username: `testuser_${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'user',
  }),
  
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
};
