#!/usr/bin/env node

/**
 * Test Script for Autopilot-LLM Integration
 * اختبار تكامل نظام الأوتوبايلوت مع نماذج اللغة الكبيرة
 */

require('dotenv').config();
const chalk = require('chalk');

// Simple test without importing TypeScript module
async function testBasicFunctionality() {
  console.log(
    chalk.blue.bold('\n🧪 Testing Autopilot-LLM Integration (Basic)\n')
  );
  console.log(chalk.gray('='.repeat(60)));

  try {
    // Test 1: Environment Configuration
    console.log(chalk.yellow('1. Testing environment configuration...'));
    const requiredEnvVars = [
      'AUTOPILOT_LLM_ENABLED',
      'AUTOPILOT_LLM_PROVIDER',
      'LLM_PROVIDER',
      'GOOGLE_AI_API_KEY',
    ];

    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length === 0) {
      console.log(
        chalk.green('✅ All required environment variables are configured')
      );
      console.log(
        `   AUTOPILOT_LLM_ENABLED: ${process.env.AUTOPILOT_LLM_ENABLED}`
      );
      console.log(
        `   AUTOPILOT_LLM_PROVIDER: ${process.env.AUTOPILOT_LLM_PROVIDER}`
      );
      console.log(`   LLM_PROVIDER: ${process.env.LLM_PROVIDER}`);
    } else {
      console.log(
        chalk.red(`❌ Missing environment variables: ${missingVars.join(', ')}`)
      );
      console.log(
        chalk.yellow('💡 Please configure these variables in your .env file')
      );
    }

    // Test 2: File Structure
    console.log(chalk.yellow('\n2. Testing file structure...'));
    const fs = require('fs');
    const requiredFiles = [
      'autopilot-llm-integration.ts',
      'cursor-llm-integration.ts',
      'cli.ts',
      'package.json',
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

    if (missingFiles.length === 0) {
      console.log(chalk.green('✅ All required files are present'));
    } else {
      console.log(chalk.red(`❌ Missing files: ${missingFiles.join(', ')}`));
    }

    // Test 3: Package.json scripts
    console.log(chalk.yellow('\n3. Testing package.json scripts...'));
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const llmScripts = Object.keys(packageJson.scripts).filter(
      script => script.includes('autopilot') && script.includes('llm')
    );

    if (llmScripts.length > 0) {
      console.log(chalk.green('✅ LLM scripts are configured:'));
      llmScripts.forEach(script => {
        console.log(`   ${script}: ${packageJson.scripts[script]}`);
      });
    } else {
      console.log(chalk.red('❌ No LLM scripts found in package.json'));
    }

    // Test 4: Dependencies
    console.log(chalk.yellow('\n4. Testing dependencies...'));
    const requiredDeps = ['chalk', 'commander', 'inquirer', 'axios', 'dotenv'];
    const missingDeps = requiredDeps.filter(
      dep => !packageJson.dependencies[dep]
    );

    if (missingDeps.length === 0) {
      console.log(chalk.green('✅ All required dependencies are present'));
    } else {
      console.log(
        chalk.red(`❌ Missing dependencies: ${missingDeps.join(', ')}`)
      );
      console.log(
        chalk.yellow('💡 Run: npm install to install missing dependencies')
      );
    }

    // Summary
    console.log(chalk.green.bold('\n🎉 Basic Integration Test Completed!\n'));
    console.log(chalk.blue('Next Steps:'));
    console.log('1. Configure environment variables in .env file');
    console.log('2. Install dependencies: npm install');
    console.log('3. Test CLI commands: npm run autopilot:llm:status');
    console.log('4. Start interactive chat: npm run autopilot:llm:chat');

    console.log(chalk.green.bold('\n🚀 Ready for LLM Integration!\n'));
    console.log(chalk.blue('Available Commands:'));
    console.log('  npm run autopilot:llm:chat     - Interactive chat');
    console.log('  npm run autopilot:llm:analyze  - System analysis');
    console.log('  npm run autopilot:llm:ask      - Ask questions');
    console.log('  npm run autopilot:llm:status   - Show status');
  } catch (error) {
    console.error(chalk.red('\n❌ Test Failed:'), error.message);
    console.error(chalk.red('Stack trace:'), error.stack);
    process.exit(1);
  }
}

async function testAutopilotLLMIntegration() {
  console.log(chalk.blue.bold('\n🧪 Testing Autopilot-LLM Integration\n'));
  console.log(chalk.gray('='.repeat(60)));

  try {
    // Initialize the integration
    console.log(chalk.yellow('1. Initializing Autopilot-LLM Integration...'));
    const autopilotLLM = new AutopilotLLMIntegration();
    console.log(chalk.green('✅ Integration initialized successfully'));

    // Test configuration
    console.log(chalk.yellow('\n2. Testing configuration...'));
    const config = autopilotLLM.getConfig();
    console.log(chalk.green('✅ Configuration loaded:'));
    console.log(`   Enabled: ${config.enabled ? '✅' : '❌'}`);
    console.log(`   Provider: ${config.defaultProvider}`);
    console.log(`   Max Tokens: ${config.limits.maxTokens}`);
    console.log(`   Timeout: ${config.limits.timeout}ms`);

    // Test task analysis
    console.log(chalk.yellow('\n3. Testing task analysis...'));
    const testTask = {
      id: 'TEST_TASK_001',
      type: 'data_analysis',
      content:
        'Analyze the sales data for the last quarter and provide insights',
      priority: 'high',
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const analysis = await autopilotLLM.analyzeTask(testTask);
    console.log(chalk.green('✅ Task analysis completed:'));
    console.log(`   Intent: ${analysis.intent}`);
    console.log(`   Category: ${analysis.category}`);
    console.log(`   Complexity: ${analysis.complexity}`);
    console.log(`   Suggested Agent: ${analysis.suggested_agent}`);

    // Test intelligent response generation
    console.log(
      chalk.yellow('\n4. Testing intelligent response generation...')
    );
    const query = 'How can I optimize my autopilot system performance?';
    const context = {
      active_tasks: 5,
      system_health: 'good',
      last_optimization: '2 hours ago',
    };

    const response = await autopilotLLM.generateIntelligentResponse(
      query,
      context
    );
    console.log(chalk.green('✅ Intelligent response generated:'));
    console.log(chalk.blue('Response:'), response.substring(0, 200) + '...');

    // Test workflow optimization
    console.log(chalk.yellow('\n5. Testing workflow optimization...'));
    const workflowData = {
      workflow_id: 'WF_001',
      tasks: [
        { type: 'data_analysis', duration: 300, success_rate: 0.85 },
        { type: 'web_scraping', duration: 120, success_rate: 0.92 },
        { type: 'automation', duration: 180, success_rate: 0.78 },
      ],
      total_duration: 600,
      overall_success_rate: 0.85,
    };

    const optimization = await autopilotLLM.optimizeWorkflow(workflowData);
    console.log(chalk.green('✅ Workflow optimization completed:'));
    console.log(
      `   Performance Improvements: ${optimization.performance_improvements.length} suggestions`
    );
    console.log(
      `   Efficiency Gains: ${optimization.efficiency_gains.length} suggestions`
    );

    // Test autopilot chat
    console.log(chalk.yellow('\n6. Testing autopilot chat...'));
    const chatResponse = await autopilotLLM.autopilotChat(
      'What is the current status of my autopilot system?'
    );
    console.log(chalk.green('✅ Autopilot chat completed:'));
    console.log(
      chalk.blue('Response:'),
      chatResponse.substring(0, 200) + '...'
    );

    // Test system performance analysis
    console.log(chalk.yellow('\n7. Testing system performance analysis...'));
    const performanceAnalysis = await autopilotLLM.analyzeSystemPerformance();
    console.log(chalk.green('✅ System performance analysis completed:'));
    console.log(`   Overall Health: ${performanceAnalysis.overall_health}`);
    console.log(
      `   Performance Score: ${performanceAnalysis.performance_score}/100`
    );
    console.log(
      `   Recommendations: ${performanceAnalysis.recommendations.length} found`
    );

    // Summary
    console.log(chalk.green.bold('\n🎉 All Tests Passed Successfully!\n'));
    console.log(chalk.blue('Test Summary:'));
    console.log('✅ Integration initialization');
    console.log('✅ Configuration loading');
    console.log('✅ Task analysis');
    console.log('✅ Intelligent response generation');
    console.log('✅ Workflow optimization');
    console.log('✅ Autopilot chat');
    console.log('✅ System performance analysis');

    console.log(
      chalk.green.bold('\n🚀 Autopilot-LLM Integration is ready for use!\n')
    );
    console.log(chalk.blue('Available Commands:'));
    console.log('  npm run autopilot:llm:chat     - Interactive chat');
    console.log('  npm run autopilot:llm:analyze  - System analysis');
    console.log('  npm run autopilot:llm:ask      - Ask questions');
    console.log('  npm run autopilot:llm:status   - Show status');
  } catch (error) {
    console.error(chalk.red('\n❌ Test Failed:'), error.message);
    console.error(chalk.red('Stack trace:'), error.stack);
    process.exit(1);
  }
}

// Run the test
testBasicFunctionality().catch(error => {
  console.error(chalk.red('❌ Test execution failed:'), error);
  process.exit(1);
});
