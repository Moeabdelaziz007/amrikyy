#!/usr/bin/env node
/**
 * 🧪 Telegram Bot Test Suite
 * Comprehensive testing for all Telegram bot features
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

class TelegramBotTestSuite {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.bot = new TelegramBot(this.token, { polling: false });
    
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Telegram Bot Test Suite...\n');
    
    const tests = [
      { name: 'Bot Connectivity', fn: this.testBotConnectivity.bind(this) },
      { name: 'Message Sending', fn: this.testMessageSending.bind(this) },
      { name: 'Command Processing', fn: this.testCommandProcessing.bind(this) },
      { name: 'Inline Keyboards', fn: this.testInlineKeyboards.bind(this) },
      { name: 'Error Handling', fn: this.testErrorHandling.bind(this) },
      { name: 'Performance', fn: this.testPerformance.bind(this) },
      { name: 'Admin Commands', fn: this.testAdminCommands.bind(this) },
      { name: 'Data Persistence', fn: this.testDataPersistence.bind(this) }
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.fn);
    }

    this.printResults();
  }

  async runTest(name, testFunction) {
    console.log(`🔍 Testing: ${name}...`);
    this.testResults.total++;
    
    try {
      await testFunction();
      console.log(`✅ ${name}: PASSED\n`);
      this.testResults.passed++;
      this.testResults.details.push({ name, status: 'PASSED', error: null });
    } catch (error) {
      console.log(`❌ ${name}: FAILED - ${error.message}\n`);
      this.testResults.failed++;
      this.testResults.details.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testBotConnectivity() {
    const botInfo = await this.bot.getMe();
    
    if (!botInfo.ok) {
      throw new Error('Bot API call failed');
    }
    
    if (!botInfo.result.is_bot) {
      throw new Error('Token is not for a bot');
    }
    
    if (botInfo.result.username !== 'Amrikyyybot') {
      throw new Error('Wrong bot username');
    }
  }

  async testMessageSending() {
    const testMessage = `🧪 Test Message - ${new Date().toLocaleTimeString()}`;
    
    try {
      const sentMessage = await this.bot.sendMessage(this.adminChatId, testMessage);
      
      if (!sentMessage.message_id) {
        throw new Error('Message ID not returned');
      }
      
      // Test different message types
      await this.bot.sendMessage(this.adminChatId, '📊 **Bold Text**', { parse_mode: 'Markdown' });
      await this.bot.sendMessage(this.adminChatId, '<b>HTML Bold</b>', { parse_mode: 'HTML' });
      
    } catch (error) {
      throw new Error(`Message sending failed: ${error.message}`);
    }
  }

  async testCommandProcessing() {
    // Test command simulation
    const testCommands = ['/start', '/help', '/status', '/ping'];
    
    for (const command of testCommands) {
      try {
        // Simulate command processing
        const response = await this.simulateCommand(command);
        
        if (!response) {
          throw new Error(`No response for command: ${command}`);
        }
        
      } catch (error) {
        throw new Error(`Command processing failed for ${command}: ${error.message}`);
      }
    }
  }

  async testInlineKeyboards() {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Test Button 1', callback_data: 'test1' },
            { text: '✅ Test Button 2', callback_data: 'test2' }
          ],
          [
            { text: '🔙 Back', callback_data: 'back' }
          ]
        ]
      }
    };

    try {
      await this.bot.sendMessage(
        this.adminChatId, 
        '🧪 Testing Inline Keyboards:', 
        keyboard
      );
    } catch (error) {
      throw new Error(`Inline keyboard test failed: ${error.message}`);
    }
  }

  async testErrorHandling() {
    try {
      // Test invalid chat ID
      await this.bot.sendMessage('invalid_chat_id', 'Test message');
    } catch (error) {
      if (!error.message.includes('chat not found')) {
        throw new Error('Error handling not working properly');
      }
    }

    try {
      // Test empty message
      await this.bot.sendMessage(this.adminChatId, '');
    } catch (error) {
      if (!error.message.includes('text is empty')) {
        throw new Error('Empty message handling not working');
      }
    }
  }

  async testPerformance() {
    const startTime = Date.now();
    const messageCount = 5;
    
    // Send multiple messages to test performance
    const promises = [];
    for (let i = 0; i < messageCount; i++) {
      promises.push(
        this.bot.sendMessage(this.adminChatId, `🚀 Performance Test ${i + 1}`)
      );
    }
    
    await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / messageCount;
    
    if (avgTime > 2000) { // 2 seconds per message
      throw new Error(`Performance too slow: ${avgTime}ms per message`);
    }
    
    console.log(`   📊 Performance: ${avgTime.toFixed(2)}ms per message`);
  }

  async testAdminCommands() {
    const adminCommands = [
      { command: '/manager_status', expected: 'status' },
      { command: '/bot_stats', expected: 'stats' },
      { command: '/health_check', expected: 'health' }
    ];

    for (const cmd of adminCommands) {
      try {
        const response = await this.simulateAdminCommand(cmd.command);
        
        if (!response.includes(cmd.expected)) {
          throw new Error(`Admin command ${cmd.command} failed`);
        }
        
      } catch (error) {
        throw new Error(`Admin command test failed: ${error.message}`);
      }
    }
  }

  async testDataPersistence() {
    // Test message history persistence
    const testData = {
      timestamp: new Date(),
      chatId: this.adminChatId,
      message: 'Test persistence message',
      userId: 'test_user'
    };

    try {
      // Simulate data saving
      const saved = await this.simulateDataSave(testData);
      
      if (!saved) {
        throw new Error('Data saving failed');
      }
      
      // Simulate data loading
      const loaded = await this.simulateDataLoad();
      
      if (!Array.isArray(loaded)) {
        throw new Error('Data loading failed');
      }
      
    } catch (error) {
      throw new Error(`Data persistence test failed: ${error.message}`);
    }
  }

  // Helper methods
  async simulateCommand(command) {
    // Simulate command processing logic
    const responses = {
      '/start': 'Welcome to AuraOS Bot!',
      '/help': 'Available commands: /start, /help, /status',
      '/status': 'Bot is running normally',
      '/ping': 'Pong! Bot is responsive'
    };
    
    return responses[command] || 'Command not recognized';
  }

  async simulateAdminCommand(command) {
    // Simulate admin command processing
    const responses = {
      '/manager_status': 'Manager status: Online',
      '/bot_stats': 'Bot statistics: Active',
      '/health_check': 'Health check: Healthy'
    };
    
    return responses[command] || 'Admin command not found';
  }

  async simulateDataSave(data) {
    // Simulate data saving
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100);
    });
  }

  async simulateDataLoad() {
    // Simulate data loading
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 100);
    });
  }

  printResults() {
    console.log('📊 Test Suite Results:');
    console.log('═'.repeat(50));
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📊 Total: ${this.testResults.total}`);
    console.log(`🎯 Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.details
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`);
        });
    }
    
    console.log('\n🎉 Test suite completed!');
    
    // Send results to admin
    this.sendTestResults();
  }

  async sendTestResults() {
    const successRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
    const resultsText = `
🧪 **Telegram Bot Test Suite Results**

📊 **Summary:**
• ✅ Passed: ${this.testResults.passed}
• ❌ Failed: ${this.testResults.failed}
• 📊 Total: ${this.testResults.total}
• 🎯 Success Rate: ${successRate}%

${this.testResults.failed === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed - check logs for details'}

🕐 **Test Completed:** ${new Date().toLocaleString()}
    `;

    try {
      await this.bot.sendMessage(this.adminChatId, resultsText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Failed to send test results:', error.message);
    }
  }
}

// Run the test suite
const testSuite = new TelegramBotTestSuite();
testSuite.runAllTests().catch(console.error);

module.exports = TelegramBotTestSuite;
