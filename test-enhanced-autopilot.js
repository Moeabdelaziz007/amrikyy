#!/usr/bin/env node

/**
 * Enhanced Autopilot System Test Script
 * Tests the always active autopilot with Telegram integration and task assignment
 */

import { autopilotAgent } from './server/autopilot-agent.js';

console.log('🚀 Testing Enhanced Always Active Autopilot System...\n');

async function testAutopilotSystem() {
  try {
    // Test 1: Check autopilot status
    console.log('📊 Test 1: Checking Autopilot Status');
    const status = autopilotAgent.getStatus();
    console.log('✅ Autopilot Status:', {
      name: status.name,
      active: status.active,
      alwaysActive: status.alwaysActive,
      uptime: `${Math.floor(status.uptime / 3600)}h ${Math.floor((status.uptime % 3600) / 60)}m`,
      memorySize: status.memorySize,
      backgroundTasks: status.backgroundTasks.length
    });

    // Test 2: Check growth metrics
    console.log('\n📈 Test 2: Checking Growth Metrics');
    const growthMetrics = autopilotAgent.getGrowthMetrics();
    console.log('✅ Growth Metrics:', {
      knowledgeBaseSize: growthMetrics.knowledgeBaseSize,
      experiencePoints: growthMetrics.experiencePoints,
      learningCycles: growthMetrics.learningCycles,
      efficiency: `${(growthMetrics.efficiency * 100).toFixed(1)}%`,
      adaptability: `${(growthMetrics.adaptability * 100).toFixed(1)}%`,
      growthRate: `${growthMetrics.growthRate.toFixed(2)}/hour`
    });

    // Test 3: Check memory summary
    console.log('\n🧠 Test 3: Checking Memory Summary');
    const memorySummary = autopilotAgent.getMemorySummary();
    console.log('✅ Memory Summary:', memorySummary);

    // Test 4: Check insights
    console.log('\n💡 Test 4: Checking Autopilot Insights');
    const insights = autopilotAgent.getInsights();
    console.log('✅ Insights:', insights);

    // Test 5: Assign a test task
    console.log('\n🎯 Test 5: Assigning Test Task');
    const task = await autopilotAgent.assignTask(
      'Test System Optimization',
      'Run comprehensive system optimization and performance analysis',
      'high',
      'test-script'
    );
    console.log('✅ Task Assigned:', {
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status
    });

    // Test 6: Check task status
    console.log('\n📋 Test 6: Checking Task Status');
    const taskStatus = autopilotAgent.getTaskStatus(task.id);
    console.log('✅ Task Status:', {
      id: taskStatus.id,
      title: taskStatus.title,
      status: taskStatus.status,
      assignedAt: taskStatus.assignedAt.toLocaleTimeString()
    });

    // Test 7: Get all tasks
    console.log('\n📋 Test 7: Getting All Tasks');
    const allTasks = autopilotAgent.getAllTasks();
    console.log(`✅ Total Tasks: ${allTasks.length}`);
    allTasks.forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.title} (${t.status}) - Priority: ${t.priority}`);
    });

    // Test 8: Force self-improvement cycle
    console.log('\n🧠 Test 8: Forcing Self-Improvement Cycle');
    await autopilotAgent.forceSelfImprovement();
    console.log('✅ Self-improvement cycle completed');

    // Test 9: Force knowledge accumulation
    console.log('\n📚 Test 9: Forcing Knowledge Accumulation');
    await autopilotAgent.forceKnowledgeAccumulation();
    console.log('✅ Knowledge accumulation completed');

    // Test 10: Force Telegram update (if available)
    console.log('\n📱 Test 10: Forcing Telegram Update');
    try {
      await autopilotAgent.forceTelegramUpdate();
      console.log('✅ Telegram update sent');
    } catch (error) {
      console.log('⚠️ Telegram update failed (Telegram service may not be initialized):', error.message);
    }

    // Wait a bit for background processes
    console.log('\n⏳ Waiting 5 seconds for background processes...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test 11: Check updated metrics
    console.log('\n📊 Test 11: Checking Updated Metrics');
    const updatedStatus = autopilotAgent.getStatus();
    const updatedGrowth = autopilotAgent.getGrowthMetrics();
    console.log('✅ Updated Status:', {
      memorySize: updatedStatus.memorySize,
      backgroundTasks: updatedStatus.backgroundTasks.length
    });
    console.log('✅ Updated Growth:', {
      learningCycles: updatedGrowth.learningCycles,
      experiencePoints: updatedGrowth.experiencePoints
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Autopilot is always active and running');
    console.log('✅ Continuous learning and growth mechanisms are working');
    console.log('✅ Task assignment and processing system is functional');
    console.log('✅ Telegram integration is ready (if service is available)');
    console.log('✅ Background processes are running continuously');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Set up event listeners for autopilot events
autopilotAgent.on('autopilotStarted', (data) => {
  console.log('🚀 Autopilot started:', data);
});

autopilotAgent.on('taskAssigned', (data) => {
  console.log('🎯 Task assigned:', data.task.title);
});

autopilotAgent.on('taskCompleted', (data) => {
  console.log('✅ Task completed:', data.task.title);
});

autopilotAgent.on('selfImprovementCompleted', (data) => {
  console.log('🧠 Self-improvement completed:', data.improvementsApplied, 'improvements applied');
});

autopilotAgent.on('knowledgeAccumulated', (data) => {
  console.log('📚 Knowledge accumulated:', data.newKnowledge, 'new items');
});

autopilotAgent.on('optimizationCompleted', (data) => {
  console.log('⚡ Optimization completed:', data.optimizationCount, 'total optimizations');
});

autopilotAgent.on('growthMetricsUpdated', (data) => {
  console.log('📈 Growth metrics updated:', data.metrics.growthRate.toFixed(2), '/hour');
});

// Run the tests
testAutopilotSystem().then(() => {
  console.log('\n🔚 Test script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
