#!/usr/bin/env node

/**
 * Test script for the Always Active Autopilot Agent
 * This script demonstrates the autopilot's capabilities
 */

import { autopilotAgent } from './server/autopilot-agent.js';

console.log('🚀 Testing Always Active Autopilot Agent...\n');

async function testAutopilot() {
  try {
    // Test 1: Get initial status
    console.log('📊 Test 1: Getting initial status...');
    const status = autopilotAgent.getStatus();
    console.log('✅ Status:', {
      active: status.active,
      alwaysActive: status.alwaysActive,
      backgroundTasks: status.backgroundTasks,
      memorySize: status.memorySize
    });

    // Test 2: Get growth metrics
    console.log('\n📈 Test 2: Getting growth metrics...');
    const growthMetrics = autopilotAgent.getGrowthMetrics();
    console.log('✅ Growth Metrics:', {
      knowledgeBaseSize: growthMetrics.knowledgeBaseSize,
      efficiency: growthMetrics.efficiency,
      adaptability: growthMetrics.adaptability,
      learningCycles: growthMetrics.learningCycles
    });

    // Test 3: Get memory summary
    console.log('\n🧠 Test 3: Getting memory summary...');
    const memorySummary = autopilotAgent.getMemorySummary();
    console.log('✅ Memory Summary:', memorySummary);

    // Test 4: Get insights
    console.log('\n💡 Test 4: Getting insights...');
    const insights = autopilotAgent.getInsights();
    console.log('✅ Insights:', insights);

    // Test 5: Assign a test task
    console.log('\n🎯 Test 5: Assigning a test task...');
    const testTask = await autopilotAgent.assignTask({
      title: 'Test Task - System Analysis',
      description: 'Analyze system performance and generate optimization recommendations',
      priority: 'medium',
      assignedBy: 'Test Script',
      tags: ['test', 'analysis', 'optimization'],
      metadata: { testRun: true, timestamp: new Date().toISOString() }
    });
    console.log('✅ Task assigned:', {
      id: testTask.id,
      title: testTask.title,
      priority: testTask.priority,
      status: testTask.status
    });

    // Test 6: Get pending tasks
    console.log('\n📋 Test 6: Getting pending tasks...');
    const pendingTasks = autopilotAgent.getPendingTasks();
    console.log('✅ Pending Tasks:', pendingTasks.map(task => ({
      title: task.title,
      priority: task.priority,
      status: task.status,
      progress: task.progress
    })));

    // Test 7: Force self-improvement
    console.log('\n🧠 Test 7: Forcing self-improvement...');
    await autopilotAgent.forceSelfImprovement();
    console.log('✅ Self-improvement cycle completed');

    // Test 8: Force knowledge accumulation
    console.log('\n📚 Test 8: Forcing knowledge accumulation...');
    await autopilotAgent.forceKnowledgeAccumulation();
    console.log('✅ Knowledge accumulation completed');

    // Test 9: Get updated status
    console.log('\n📊 Test 9: Getting updated status...');
    const updatedStatus = autopilotAgent.getStatus();
    const updatedGrowthMetrics = autopilotAgent.getGrowthMetrics();
    console.log('✅ Updated Status:', {
      memorySize: updatedStatus.memorySize,
      backgroundTasks: updatedStatus.backgroundTasks.length
    });
    console.log('✅ Updated Growth Metrics:', {
      knowledgeBaseSize: updatedGrowthMetrics.knowledgeBaseSize,
      learningCycles: updatedGrowthMetrics.learningCycles
    });

    // Test 10: Get task history
    console.log('\n📜 Test 10: Getting task history...');
    const taskHistory = autopilotAgent.getTaskHistory(5);
    console.log('✅ Task History:', taskHistory.map(task => ({
      title: task.title,
      status: task.status,
      assignedAt: task.assignedAt.toISOString()
    })));

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📱 The autopilot agent is now running in Always Active mode with:');
    console.log('   • Continuous self-improvement every 5 minutes');
    console.log('   • Knowledge accumulation every 2 minutes');
    console.log('   • Optimization cycles every 10 minutes');
    console.log('   • Growth monitoring every 30 minutes');
    console.log('   • Memory consolidation every hour');
    console.log('   • Telegram integration for updates and task assignment');
    
    console.log('\n🚀 Autopilot is ready to receive tasks via Telegram!');
    console.log('   Use /autopilot_subscribe to get updates');
    console.log('   Use /autopilot_assign to give tasks');
    console.log('   Use /autopilot_status to check status');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testAutopilot().then(() => {
  console.log('\n✅ Test script completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});
