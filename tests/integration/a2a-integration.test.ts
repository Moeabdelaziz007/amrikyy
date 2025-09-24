// Integration Tests for A2A System
// اختبارات التكامل لنظام A2A

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import WebSocket from 'ws';
import { A2AClient } from '../sdk/node/src/index.js';

// Test configuration
const TEST_CONFIG = {
  gatewayUrl: 'http://localhost:3001',
  wsUrl: 'ws://localhost:3004/ws/a2a',
  apiKey: 'test_api_key_123',
  timeout: 10000,
};

// Test data
const TEST_USER = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpass123',
  role: 'user',
};

const TEST_MESSAGE = {
  topic: 'test.integration',
  type: 'test_message',
  target: 'gateway',
  payload: {
    message: 'Integration test message',
    timestamp: new Date().toISOString(),
  },
  priority: 'normal',
};

describe('A2A System Integration Tests', () => {
  let client: A2AClient;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Wait for services to be ready
    await waitForService(TEST_CONFIG.gatewayUrl);
    
    // Initialize client
    client = new A2AClient({
      gatewayUrl: TEST_CONFIG.gatewayUrl,
      apiKey: TEST_CONFIG.apiKey,
      timeout: TEST_CONFIG.timeout,
    });
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      try {
        const result = await client.register(TEST_USER);
        expect(result.success).toBe(true);
        expect(result.user.username).toBe(TEST_USER.username);
        userId = result.user.id;
      } catch (error) {
        // User might already exist, try to login instead
        const loginResult = await client.login(TEST_USER.username, TEST_USER.password);
        expect(loginResult.token).toBeDefined();
        authToken = loginResult.token;
      }
    });

    it('should login with valid credentials', async () => {
      const result = await client.login(TEST_USER.username, TEST_USER.password);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe(TEST_USER.username);
      
      authToken = result.token;
    });

    it('should reject invalid credentials', async () => {
      await expect(
        client.login('invalid', 'invalid')
      ).rejects.toThrow();
    });

    it('should refresh token', async () => {
      const result = await client.refreshToken();
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token).not.toBe(authToken);
      
      authToken = result.token;
    });
  });

  describe('Message Publishing', () => {
    it('should publish message successfully', async () => {
      const result = await client.publishMessage(TEST_MESSAGE.topic, TEST_MESSAGE);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should publish high priority message', async () => {
      const highPriorityMessage = {
        ...TEST_MESSAGE,
        priority: 'high' as const,
        payload: { ...TEST_MESSAGE.payload, priority: 'high' },
      };

      const result = await client.publishMessage('test.priority', highPriorityMessage);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should reject message without authentication', async () => {
      const unauthorizedClient = new A2AClient({
        gatewayUrl: TEST_CONFIG.gatewayUrl,
        timeout: TEST_CONFIG.timeout,
      });

      await expect(
        unauthorizedClient.publishMessage(TEST_MESSAGE.topic, TEST_MESSAGE)
      ).rejects.toThrow();
    });
  });

  describe('Message Subscription', () => {
    it('should subscribe to topic', async () => {
      const result = await client.subscribeToTopic('test.subscription');
      expect(result.success).toBe(true);
      expect(result.topic).toBe('test.subscription');
    });

    it('should unsubscribe from topic', async () => {
      const result = await client.unsubscribeFromTopic('test.subscription');
      expect(result.success).toBe(true);
      expect(result.topic).toBe('test.subscription');
    });

    it('should subscribe with webhook handler', async () => {
      const result = await client.subscribeToTopic(
        'test.webhook',
        'https://webhook.site/test'
      );
      expect(result.success).toBe(true);
      expect(result.handler).toBe('https://webhook.site/test');
    });
  });

  describe('WebSocket Connection', () => {
    it('should connect to WebSocket', async () => {
      await client.connectWebSocket();
      expect(client.isWebSocketConnected()).toBe(true);
    });

    it('should authenticate WebSocket connection', async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Authentication timeout'));
        }, 5000);

        client.on('authenticated', () => {
          clearTimeout(timeout);
          resolve(true);
        });

        client.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    });

    it('should publish message via WebSocket', async () => {
      await client.publishWebSocketMessage('test.ws', {
        message: 'WebSocket test message',
        timestamp: new Date().toISOString(),
      });
    });

    it('should subscribe to topics via WebSocket', async () => {
      await client.subscribeWebSocket(['test.ws.topic1', 'test.ws.topic2']);
      const subscribedTopics = client.getSubscribedTopics();
      expect(subscribedTopics).toContain('test.ws.topic1');
      expect(subscribedTopics).toContain('test.ws.topic2');
    });

    it('should receive messages via WebSocket', async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Message receive timeout'));
        }, 10000);

        client.on('message', (message) => {
          clearTimeout(timeout);
          expect(message).toBeDefined();
          resolve(true);
        });

        // Publish a test message
        client.publishWebSocketMessage('test.ws.receive', {
          message: 'Test message for WebSocket receive',
          timestamp: new Date().toISOString(),
        });
      });
    });
  });

  describe('Health and Status', () => {
    it('should get health status', async () => {
      const health = await client.getHealthStatus();
      expect(health.overall).toMatch(/healthy|degraded|unhealthy/);
      expect(health.checks).toBeInstanceOf(Array);
      expect(health.timestamp).toBeDefined();
    });

    it('should get system metrics', async () => {
      const metrics = await client.getMetrics();
      expect(metrics.requests).toBeDefined();
      expect(metrics.system).toBeDefined();
      expect(metrics.health).toBeDefined();
    });

    it('should get system status', async () => {
      const status = await client.getSystemStatus();
      expect(status.name).toBe('A2A API Gateway');
      expect(status.version).toBeDefined();
      expect(status.status).toBe('running');
    });
  });

  describe('Queue Management', () => {
    it('should get queue information', async () => {
      const queueInfo = await client.getQueueInfo('test.queue');
      expect(queueInfo).toBeDefined();
    });

    it('should purge queue', async () => {
      await client.purgeQueue('test.queue');
      // Queue should be purged successfully
    });
  });

  describe('Custom Metrics', () => {
    it('should record custom metric', async () => {
      await client.recordCustomMetric('test.metric', 42.5, {
        test: 'integration',
        version: '1.0.0',
      });
    });

    it('should increment counter', async () => {
      const value = await client.incrementCounter('test.counter', {
        test: 'integration',
      });
      expect(value).toBeGreaterThan(0);
    });

    it('should set gauge', async () => {
      await client.setGauge('test.gauge', 100, {
        test: 'integration',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const invalidClient = new A2AClient({
        gatewayUrl: 'http://invalid-url:9999',
        timeout: 1000,
      });

      await expect(
        invalidClient.getHealthStatus()
      ).rejects.toThrow();
    });

    it('should handle authentication errors', async () => {
      const unauthorizedClient = new A2AClient({
        gatewayUrl: TEST_CONFIG.gatewayUrl,
        apiKey: 'invalid_key',
        timeout: TEST_CONFIG.timeout,
      });

      await expect(
        unauthorizedClient.publishMessage('test', { type: 'test' })
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        client.publishMessage(`test.concurrent.${i}`, {
          type: 'concurrent_test',
          payload: { index: i, timestamp: new Date().toISOString() },
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.messageId).toBeDefined();
      });
    });

    it('should handle rapid message publishing', async () => {
      const startTime = Date.now();
      const messageCount = 50;

      for (let i = 0; i < messageCount; i++) {
        await client.publishMessage(`test.rapid.${i}`, {
          type: 'rapid_test',
          payload: { index: i, timestamp: new Date().toISOString() },
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const messagesPerSecond = (messageCount / duration) * 1000;

      console.log(`Published ${messageCount} messages in ${duration}ms (${messagesPerSecond.toFixed(2)} msg/s)`);
      expect(messagesPerSecond).toBeGreaterThan(10); // At least 10 messages per second
    });
  });

  describe('End-to-End Workflow', () => {
    it('should complete full workflow: register -> login -> publish -> subscribe -> receive', async () => {
      // This test simulates a complete workflow
      const workflowUser = {
        username: `workflow_${Date.now()}`,
        email: `workflow_${Date.now()}@example.com`,
        password: 'workflow123',
        role: 'user',
      };

      // Register user
      const registerResult = await client.register(workflowUser);
      expect(registerResult.success).toBe(true);

      // Login
      const loginResult = await client.login(workflowUser.username, workflowUser.password);
      expect(loginResult.success).toBe(true);

      // Connect WebSocket
      await client.connectWebSocket();

      // Subscribe to topic
      await client.subscribeWebSocket(['workflow.test']);

      // Publish message
      const publishResult = await client.publishMessage('workflow.test', {
        type: 'workflow_test',
        payload: {
          message: 'End-to-end workflow test',
          timestamp: new Date().toISOString(),
        },
      });
      expect(publishResult.success).toBe(true);

      // Record metrics
      await client.recordCustomMetric('workflow.completed', 1.0, {
        test: 'end_to_end',
      });

      // Check health
      const health = await client.getHealthStatus();
      expect(health.overall).toMatch(/healthy|degraded/);

      console.log('✅ End-to-end workflow completed successfully');
    });
  });
});

// Utility functions
async function waitForService(url: string, maxAttempts: number = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url, { timeout: 1000 });
      console.log(`✅ Service is ready at ${url}`);
      return;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(`Service at ${url} is not ready after ${maxAttempts} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// WebSocket direct tests
describe('WebSocket Direct Tests', () => {
  let ws: WebSocket;

  afterEach(() => {
    if (ws) {
      ws.close();
    }
  });

  it('should connect to WebSocket directly', (done) => {
    ws = new WebSocket(TEST_CONFIG.wsUrl);

    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      done();
    });

    ws.on('error', (error) => {
      done(error);
    });
  });

  it('should receive welcome message', (done) => {
    ws = new WebSocket(TEST_CONFIG.wsUrl);

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('welcome');
      expect(message.clientId).toBeDefined();
      done();
    });

    ws.on('error', (error) => {
      done(error);
    });
  });

  it('should authenticate via WebSocket', (done) => {
    ws = new WebSocket(TEST_CONFIG.wsUrl);

    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'auth',
        payload: { token: authToken },
      }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'auth_success') {
        expect(message.userId).toBeDefined();
        done();
      } else if (message.type === 'auth_error') {
        done(new Error('Authentication failed'));
      }
    });

    ws.on('error', (error) => {
      done(error);
    });
  });
});

// Load testing
describe('Load Tests', () => {
  it('should handle high load', async () => {
    const loadTestClient = new A2AClient({
      gatewayUrl: TEST_CONFIG.gatewayUrl,
      apiKey: TEST_CONFIG.apiKey,
      timeout: TEST_CONFIG.timeout,
    });

    const startTime = Date.now();
    const messageCount = 100;
    const batchSize = 10;

    for (let batch = 0; batch < messageCount / batchSize; batch++) {
      const promises = Array.from({ length: batchSize }, (_, i) => {
        const index = batch * batchSize + i;
        return loadTestClient.publishMessage(`load.test.${index}`, {
          type: 'load_test',
          payload: {
            index,
            batch,
            timestamp: new Date().toISOString(),
          },
        });
      });

      await Promise.all(promises);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const messagesPerSecond = (messageCount / duration) * 1000;

    console.log(`Load test: ${messageCount} messages in ${duration}ms (${messagesPerSecond.toFixed(2)} msg/s)`);
    expect(messagesPerSecond).toBeGreaterThan(5); // At least 5 messages per second
  });
});
