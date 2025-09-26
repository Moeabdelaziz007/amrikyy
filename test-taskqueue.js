#!/usr/bin/env node

/**
 * TaskQueue Component Test Suite
 * Tests the TaskQueue functionality with the mock backend
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';
const API_URL = `${BASE_URL}/api/v1`;

// Test data
const testTask = {
  name: 'Test Task',
  description: 'A test task for automation',
  priority: 'high',
  type: 'automation'
};

class TaskQueueTester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async runTest(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      console.log(`✅ PASSED: ${name}`);
      this.passed++;
      this.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}`);
      this.failed++;
      this.tests.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testHealthCheck() {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    if (!response.data.status || response.data.status !== 'healthy') {
      throw new Error('Health check returned unhealthy status');
    }
  }

  async testGetTasks() {
    const response = await axios.get(`${API_URL}/tasks`);
    if (response.status !== 200) {
      throw new Error(`Get tasks failed with status ${response.status}`);
    }
    if (!response.data.tasks || !Array.isArray(response.data.tasks)) {
      throw new Error('Get tasks did not return valid task array');
    }
    if (response.data.tasks.length === 0) {
      throw new Error('No tasks returned');
    }
  }

  async testCreateTask() {
    const response = await axios.post(`${API_URL}/tasks`, testTask);
    if (response.status !== 201) {
      throw new Error(`Create task failed with status ${response.status}`);
    }
    if (!response.data.task || !response.data.task.id) {
      throw new Error('Create task did not return valid task');
    }
    return response.data.task;
  }

  async testStartTask(taskId) {
    const response = await axios.post(`${API_URL}/tasks/${taskId}/start`);
    if (response.status !== 200) {
      throw new Error(`Start task failed with status ${response.status}`);
    }
    if (response.data.task.status !== 'running') {
      throw new Error('Task did not start successfully');
    }
  }

  async testPauseTask(taskId) {
    const response = await axios.post(`${API_URL}/tasks/${taskId}/pause`);
    if (response.status !== 200) {
      throw new Error(`Pause task failed with status ${response.status}`);
    }
    if (response.data.task.status !== 'pending') {
      throw new Error('Task did not pause successfully');
    }
  }

  async testCancelTask(taskId) {
    const response = await axios.post(`${API_URL}/tasks/${taskId}/cancel`);
    if (response.status !== 200) {
      throw new Error(`Cancel task failed with status ${response.status}`);
    }
    if (response.data.task.status !== 'cancelled') {
      throw new Error('Task did not cancel successfully');
    }
  }

  async testDeleteTask(taskId) {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    if (response.status !== 200) {
      throw new Error(`Delete task failed with status ${response.status}`);
    }
  }

  async testTaskNotFound() {
    try {
      await axios.post(`${API_URL}/tasks/nonexistent/start`);
      throw new Error('Expected 404 error for non-existent task');
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        throw new Error(`Expected 404, got ${error.response.status}`);
      }
    }
  }

  async testInvalidTaskOperation() {
    try {
      // Try to pause a task that's not running
      await axios.post(`${API_URL}/tasks/3/pause`); // Task 3 is completed
      throw new Error('Expected 400 error for invalid operation');
    } catch (error) {
      if (error.response && error.response.status !== 400) {
        throw new Error(`Expected 400, got ${error.response.status}`);
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting TaskQueue API Tests\n');

    // Health and basic functionality tests
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Get Tasks', () => this.testGetTasks());
    
    // CRUD operations tests
    const createdTask = await this.runTest('Create Task', () => this.testCreateTask());
    if (createdTask) {
      await this.runTest('Start Task', () => this.testStartTask(createdTask.id));
      await this.runTest('Pause Task', () => this.testPauseTask(createdTask.id));
      await this.runTest('Cancel Task', () => this.testCancelTask(createdTask.id));
      await this.runTest('Delete Task', () => this.testDeleteTask(createdTask.id));
    }
    
    // Error handling tests
    await this.runTest('Task Not Found Error', () => this.testTaskNotFound());
    await this.runTest('Invalid Operation Error', () => this.testInvalidTaskOperation());

    // Print results
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);

    if (this.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }

    return this.failed === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new TaskQueueTester();
  tester.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = TaskQueueTester;
