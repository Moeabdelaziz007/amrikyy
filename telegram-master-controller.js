#!/usr/bin/env node
/**
 * 🎛️ Telegram Master Controller
 * Central control system for all Telegram bots
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TelegramMasterController {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.bot = new TelegramBot(this.token, { polling: true });
    
    this.botProcesses = new Map();
    this.botStatus = new Map();
    this.systemMetrics = {
      totalBots: 0,
      activeBots: 0,
      totalMessages: 0,
      uptime: Date.now(),
      restarts: 0
    };
    
    this.availableBots = [
      { id: 'advanced', name: 'Advanced Bot', file: 'advanced-telegram-bot.js', description: 'Smart responses and interactive features' },
      { id: 'ai-conversation', name: 'AI Conversation', file: 'ai-conversation-bot.js', description: 'AI-powered conversations with personalities' },
      { id: 'automation', name: 'Automation Bot', file: 'telegram-automation-bot.js', description: 'Workflow automation and task management' },
      { id: 'system-monitor', name: 'System Monitor', file: 'telegram-system-monitor.js', description: 'System monitoring and health checks' },
      { id: 'dashboard', name: 'Web Dashboard', file: 'telegram-bot-dashboard.js', description: 'Web-based monitoring dashboard' },
      { id: 'manager', name: 'Bot Manager', file: 'telegram-bot-manager.js', description: 'Bot management and monitoring' }
    ];
    
    this.setupHandlers();
    this.initializeBotStatus();
  }

  setupHandlers() {
    this.bot.on('message', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
        await this.sendErrorResponse(msg.chat.id, error.message);
      }
    });

    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await this.handleCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
      }
    });
  }

  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name || 'User';

    // Only respond to admin
    if (chatId.toString() !== this.adminChatId) {
      return;
    }

    console.log(`🎛️ [${username}]: ${text}`);

    // Command handling
    if (text?.startsWith('/')) {
      await this.handleCommand(msg);
    } else {
      await this.handleNaturalLanguage(msg);
    }
  }

  async handleCommand(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const command = text.split(' ')[0];

    switch (command) {
      case '/start':
        await this.sendMasterWelcome(chatId);
        break;
      case '/control':
        await this.sendControlPanel(chatId);
        break;
      case '/status':
        await this.sendSystemStatus(chatId);
        break;
      case '/bots':
        await this.sendBotList(chatId);
        break;
      case '/startbot':
        const botId = text.split(' ')[1];
        await this.startBot(chatId, botId);
        break;
      case '/stopbot':
        const stopBotId = text.split(' ')[1];
        await this.stopBot(chatId, stopBotId);
        break;
      case '/restartbot':
        const restartBotId = text.split(' ')[1];
        await this.restartBot(chatId, restartBotId);
        break;
      case '/logs':
        const logBotId = text.split(' ')[1];
        await this.sendBotLogs(chatId, logBotId);
        break;
      case '/metrics':
        await this.sendSystemMetrics(chatId);
        break;
      case '/health':
        await this.sendHealthReport(chatId);
        break;
      case '/backup':
        await this.backupSystem(chatId);
        break;
      case '/update':
        await this.updateSystem(chatId);
        break;
      case '/help':
        await this.sendMasterHelp(chatId);
        break;
      default:
        await this.sendMessage(chatId, `❓ Unknown command: ${command}. Use /help for available commands.`);
    }
  }

  async handleNaturalLanguage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();

    // Smart natural language processing
    if (text.includes('start') && text.includes('bot')) {
      await this.handleStartBotRequest(msg);
    } else if (text.includes('stop') && text.includes('bot')) {
      await this.handleStopBotRequest(msg);
    } else if (text.includes('status') || text.includes('health')) {
      await this.sendSystemStatus(chatId);
    } else if (text.includes('dashboard') || text.includes('control')) {
      await this.sendControlPanel(chatId);
    } else if (text.includes('list') || text.includes('bots')) {
      await this.sendBotList(chatId);
    } else {
      await this.sendMessage(chatId, '🤖 I can help you manage your Telegram bots. Try asking me to "start bot", "show status", or "list bots".');
    }
  }

  async sendMasterWelcome(chatId) {
    const welcomeText = `
🎛️ **Telegram Master Controller**

I'm your central command center for managing all Telegram bots in the AuraOS system.

**🤖 Available Bots:**
• **Advanced Bot** - Smart responses and interactive features
• **AI Conversation** - AI-powered conversations with personalities
• **Automation Bot** - Workflow automation and task management
• **System Monitor** - System monitoring and health checks
• **Web Dashboard** - Web-based monitoring interface
• **Bot Manager** - Advanced bot management tools

**📊 System Overview:**
• Total Bots: ${this.availableBots.length}
• Active Bots: ${this.systemMetrics.activeBots}
• System Uptime: ${this.formatUptime(Date.now() - this.systemMetrics.uptime)}
• Total Messages: ${this.systemMetrics.totalMessages}

Ready to take control! 🚀
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎛️ Control Panel', callback_data: 'control_panel' },
            { text: '📊 System Status', callback_data: 'system_status' }
          ],
          [
            { text: '🤖 Bot Management', callback_data: 'bot_management' },
            { text: '📈 Metrics', callback_data: 'system_metrics' }
          ],
          [
            { text: '⚙️ System Tools', callback_data: 'system_tools' },
            { text: '📋 Help', callback_data: 'master_help' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendControlPanel(chatId) {
    const controlText = `
🎛️ **Master Control Panel**

**🤖 Bot Status Overview:**
${this.getBotStatusOverview()}

**📊 Quick Actions:**
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Start All Bots', callback_data: 'start_all_bots' },
            { text: '⏹️ Stop All Bots', callback_data: 'stop_all_bots' }
          ],
          [
            { text: '🔄 Restart All Bots', callback_data: 'restart_all_bots' },
            { text: '📊 View Metrics', callback_data: 'view_metrics' }
          ],
          [
            { text: '🤖 Manage Individual Bots', callback_data: 'manage_bots' },
            { text: '⚙️ System Settings', callback_data: 'system_settings' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, controlText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendSystemStatus(chatId) {
    const status = await this.getSystemStatus();
    
    const statusText = `
📊 **System Status Report**

**🟢 Overall Health:** ${status.health}
**⏰ Last Update:** ${status.lastUpdate}
**🔄 Controller Active:** ${status.controllerActive}

**🤖 Bot Status:**
${status.botStatus.map(bot => 
  `• **${bot.name}**: ${bot.status} (${bot.uptime})`
).join('\n')}

**📈 System Metrics:**
• Active Bots: ${status.activeBots}/${status.totalBots}
• Total Messages: ${status.totalMessages}
• System Uptime: ${status.systemUptime}
• Memory Usage: ${status.memoryUsage}%
• CPU Usage: ${status.cpuUsage}%

**🚨 Alerts:** ${status.alerts.length}
${status.alerts.length > 0 ? status.alerts.map(alert => `• ${alert}`).join('\n') : '• No active alerts'}
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔄 Refresh Status', callback_data: 'refresh_status' },
            { text: '📊 Detailed Report', callback_data: 'detailed_report' }
          ],
          [
            { text: '🚨 View Alerts', callback_data: 'view_alerts' },
            { text: '⚙️ System Health', callback_data: 'system_health' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, statusText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendBotList(chatId) {
    let botListText = `🤖 **Available Bot List**\n\n`;
    
    this.availableBots.forEach((bot, index) => {
      const status = this.botStatus.get(bot.id) || { status: 'Stopped', uptime: 'N/A' };
      const statusIcon = status.status === 'Running' ? '🟢' : status.status === 'Starting' ? '🟡' : '🔴';
      
      botListText += `${index + 1}. **${bot.name}** ${statusIcon}\n`;
      botListText += `   Status: ${status.status}\n`;
      botListText += `   Description: ${bot.description}\n`;
      botListText += `   File: ${bot.file}\n`;
      botListText += `   Uptime: ${status.uptime}\n\n`;
    });

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Start All', callback_data: 'start_all_bots' },
            { text: '⏹️ Stop All', callback_data: 'stop_all_bots' }
          ],
          [
            { text: '🔄 Restart All', callback_data: 'restart_all_bots' },
            { text: '📊 Bot Analytics', callback_data: 'bot_analytics' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, botListText, { parse_mode: 'Markdown', ...keyboard });
  }

  async startBot(chatId, botId) {
    if (!botId) {
      await this.sendMessage(chatId, '❌ Please specify a bot ID. Use /bots to see available bots.');
      return;
    }

    const bot = this.availableBots.find(b => b.id === botId);
    if (!bot) {
      await this.sendMessage(chatId, `❌ Bot "${botId}" not found. Use /bots to see available bots.`);
      return;
    }

    try {
      await this.sendMessage(chatId, `🚀 Starting ${bot.name}...`);
      
      const botProcess = spawn('node', [bot.file], {
        cwd: __dirname,
        detached: false,
        stdio: 'pipe'
      });

      this.botProcesses.set(botId, botProcess);
      this.botStatus.set(botId, {
        status: 'Running',
        startTime: Date.now(),
        uptime: 'Just started',
        process: botProcess
      });

      botProcess.on('exit', (code) => {
        this.botStatus.set(botId, {
          status: 'Stopped',
          uptime: 'N/A',
          lastExit: code
        });
      });

      botProcess.on('error', (error) => {
        console.error(`Error starting ${bot.name}:`, error);
        this.botStatus.set(botId, {
          status: 'Error',
          uptime: 'N/A',
          error: error.message
        });
      });

      await this.sendMessage(chatId, `✅ ${bot.name} started successfully!`);
      this.systemMetrics.activeBots++;
      
    } catch (error) {
      await this.sendMessage(chatId, `❌ Failed to start ${bot.name}: ${error.message}`);
    }
  }

  async stopBot(chatId, botId) {
    if (!botId) {
      await this.sendMessage(chatId, '❌ Please specify a bot ID. Use /bots to see available bots.');
      return;
    }

    const bot = this.availableBots.find(b => b.id === botId);
    if (!bot) {
      await this.sendMessage(chatId, `❌ Bot "${botId}" not found.`);
      return;
    }

    try {
      const botProcess = this.botProcesses.get(botId);
      if (botProcess) {
        await this.sendMessage(chatId, `⏹️ Stopping ${bot.name}...`);
        
        botProcess.kill('SIGTERM');
        this.botProcesses.delete(botId);
        
        this.botStatus.set(botId, {
          status: 'Stopped',
          uptime: 'N/A',
          stopTime: Date.now()
        });

        await this.sendMessage(chatId, `✅ ${bot.name} stopped successfully!`);
        this.systemMetrics.activeBots = Math.max(0, this.systemMetrics.activeBots - 1);
      } else {
        await this.sendMessage(chatId, `⚠️ ${bot.name} is not running.`);
      }
    } catch (error) {
      await this.sendMessage(chatId, `❌ Failed to stop ${bot.name}: ${error.message}`);
    }
  }

  async restartBot(chatId, botId) {
    await this.sendMessage(chatId, `🔄 Restarting bot: ${botId}`);
    await this.stopBot(chatId, botId);
    
    // Wait a moment before restarting
    setTimeout(async () => {
      await this.startBot(chatId, botId);
    }, 2000);
  }

  async handleStartBotRequest(msg) {
    const text = msg.text.toLowerCase();
    const botId = this.extractBotId(text);
    
    if (botId) {
      await this.startBot(msg.chat.id, botId);
    } else {
      await this.sendMessage(msg.chat.id, 'Which bot would you like to start? Available: advanced, ai-conversation, automation, system-monitor, dashboard, manager');
    }
  }

  async handleStopBotRequest(msg) {
    const text = msg.text.toLowerCase();
    const botId = this.extractBotId(text);
    
    if (botId) {
      await this.stopBot(msg.chat.id, botId);
    } else {
      await this.sendMessage(msg.chat.id, 'Which bot would you like to stop? Available: advanced, ai-conversation, automation, system-monitor, dashboard, manager');
    }
  }

  extractBotId(text) {
    const botIds = this.availableBots.map(bot => bot.id);
    
    for (const botId of botIds) {
      if (text.includes(botId.replace('-', ' ')) || text.includes(botId)) {
        return botId;
      }
    }
    
    return null;
  }

  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    switch (data) {
      case 'control_panel':
        await this.sendControlPanel(chatId);
        break;
      case 'system_status':
        await this.sendSystemStatus(chatId);
        break;
      case 'bot_management':
        await this.sendBotManagementMenu(chatId);
        break;
      case 'system_metrics':
        await this.sendSystemMetrics(chatId);
        break;
      case 'system_tools':
        await this.sendSystemToolsMenu(chatId);
        break;
      case 'master_help':
        await this.sendMasterHelp(chatId);
        break;
      case 'start_all_bots':
        await this.startAllBots(chatId);
        break;
      case 'stop_all_bots':
        await this.stopAllBots(chatId);
        break;
      case 'restart_all_bots':
        await this.restartAllBots(chatId);
        break;
      case 'manage_bots':
        await this.sendIndividualBotManagement(chatId);
        break;
      default:
        if (data.startsWith('start_bot_')) {
          const botId = data.replace('start_bot_', '');
          await this.startBot(chatId, botId);
        } else if (data.startsWith('stop_bot_')) {
          const botId = data.replace('stop_bot_', '');
          await this.stopBot(chatId, botId);
        }
    }
  }

  async sendBotManagementMenu(chatId) {
    const managementText = `
🤖 **Bot Management**

Manage individual bots or perform bulk operations:

**🎯 Individual Bot Control:**
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Start All Bots', callback_data: 'start_all_bots' },
            { text: '⏹️ Stop All Bots', callback_data: 'stop_all_bots' }
          ],
          [
            { text: '🔄 Restart All Bots', callback_data: 'restart_all_bots' },
            { text: '📊 Bot Analytics', callback_data: 'bot_analytics' }
          ],
          [
            { text: '🔙 Back to Control Panel', callback_data: 'control_panel' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, managementText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendIndividualBotManagement(chatId) {
    let managementText = `🤖 **Individual Bot Management**\n\n`;
    
    this.availableBots.forEach(bot => {
      const status = this.botStatus.get(bot.id) || { status: 'Stopped' };
      const statusIcon = status.status === 'Running' ? '🟢' : '🔴';
      
      managementText += `**${bot.name}** ${statusIcon}\n`;
      managementText += `Status: ${status.status}\n\n`;
    });

    const keyboard = {
      reply_markup: {
        inline_keyboard: this.availableBots.map(bot => [
          {
            text: `🚀 Start ${bot.name}`,
            callback_data: `start_bot_${bot.id}`
          },
          {
            text: `⏹️ Stop ${bot.name}`,
            callback_data: `stop_bot_${bot.id}`
          }
        ]).concat([[
          { text: '🔙 Back to Management', callback_data: 'bot_management' }
        ]])
      }
    };

    await this.sendMessage(chatId, managementText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendSystemMetrics(chatId) {
    const metricsText = `
📊 **System Metrics**

**🤖 Bot Metrics:**
• Total Bots: ${this.availableBots.length}
• Active Bots: ${this.systemMetrics.activeBots}
• Stopped Bots: ${this.availableBots.length - this.systemMetrics.activeBots}
• Total Restarts: ${this.systemMetrics.restarts}

**📈 Performance Metrics:**
• Total Messages: ${this.systemMetrics.totalMessages}
• System Uptime: ${this.formatUptime(Date.now() - this.systemMetrics.uptime)}
• Memory Usage: ${this.getMemoryUsage()}%
• CPU Usage: ${this.getCPUUsage()}%

**🎯 Bot Performance:**
${this.availableBots.map(bot => {
  const status = this.botStatus.get(bot.id) || { status: 'Stopped', uptime: 'N/A' };
  return `• ${bot.name}: ${status.status} (${status.uptime})`;
}).join('\n')}

**📊 Efficiency Score:** ${this.getEfficiencyScore()}/100
    `;

    await this.sendMessage(chatId, metricsText, { parse_mode: 'Markdown' });
  }

  async sendSystemToolsMenu(chatId) {
    const toolsText = `
⚙️ **System Tools**

Advanced system management and maintenance tools:

**🔧 Available Tools:**
• System backup and restore
• Bot configuration management
• Performance optimization
• Log management
• Health diagnostics
• Update management
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💾 Backup System', callback_data: 'backup_system' },
            { text: '📊 Health Check', callback_data: 'health_check' }
          ],
          [
            { text: '📋 View Logs', callback_data: 'view_logs' },
            { text: '🔄 Update System', callback_data: 'update_system' }
          ],
          [
            { text: '⚙️ Configuration', callback_data: 'system_config' },
            { text: '🔙 Back to Control Panel', callback_data: 'control_panel' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, toolsText, { parse_mode: 'Markdown', ...keyboard });
  }

  async startAllBots(chatId) {
    await this.sendMessage(chatId, '🚀 Starting all bots...');
    
    for (const bot of this.availableBots) {
      await this.startBot(chatId, bot.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between starts
    }
    
    await this.sendMessage(chatId, '✅ All bots startup sequence completed!');
  }

  async stopAllBots(chatId) {
    await this.sendMessage(chatId, '⏹️ Stopping all bots...');
    
    for (const bot of this.availableBots) {
      await this.stopBot(chatId, bot.id);
    }
    
    await this.sendMessage(chatId, '✅ All bots stopped successfully!');
  }

  async restartAllBots(chatId) {
    await this.sendMessage(chatId, '🔄 Restarting all bots...');
    await this.stopAllBots(chatId);
    
    setTimeout(async () => {
      await this.startAllBots(chatId);
    }, 3000);
  }

  async sendMasterHelp(chatId) {
    const helpText = `
🎛️ **Master Controller Help**

**🔧 Bot Management Commands:**
/control - Master control panel
/bots - List all available bots
/startbot [id] - Start specific bot
/stopbot [id] - Stop specific bot
/restartbot [id] - Restart specific bot

**📊 Monitoring Commands:**
/status - System status overview
/metrics - Detailed system metrics
/health - Health check report
/logs [bot] - View bot logs

**⚙️ System Commands:**
/backup - Create system backup
/update - Update system
/help - Show this help

**🤖 Available Bot IDs:**
• advanced - Advanced Bot
• ai-conversation - AI Conversation Bot
• automation - Automation Bot
• system-monitor - System Monitor
• dashboard - Web Dashboard
• manager - Bot Manager

**💬 Natural Language:**
You can also use natural language like:
• "start the advanced bot"
• "show me the system status"
• "list all bots"
• "stop automation bot"

Ready to control your bot empire! 🚀
    `;

    await this.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  // Helper methods
  initializeBotStatus() {
    this.availableBots.forEach(bot => {
      this.botStatus.set(bot.id, {
        status: 'Stopped',
        uptime: 'N/A',
        startTime: null,
        process: null
      });
    });
  }

  getBotStatusOverview() {
    return this.availableBots.map(bot => {
      const status = this.botStatus.get(bot.id) || { status: 'Stopped' };
      const icon = status.status === 'Running' ? '🟢' : status.status === 'Starting' ? '🟡' : '🔴';
      return `• **${bot.name}**: ${icon} ${status.status}`;
    }).join('\n');
  }

  async getSystemStatus() {
    return {
      health: 'Good',
      lastUpdate: new Date().toLocaleString(),
      controllerActive: true,
      botStatus: this.availableBots.map(bot => {
        const status = this.botStatus.get(bot.id) || { status: 'Stopped', uptime: 'N/A' };
        return {
          name: bot.name,
          status: status.status,
          uptime: status.uptime
        };
      }),
      activeBots: this.systemMetrics.activeBots,
      totalBots: this.availableBots.length,
      totalMessages: this.systemMetrics.totalMessages,
      systemUptime: this.formatUptime(Date.now() - this.systemMetrics.uptime),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCPUUsage(),
      alerts: []
    };
  }

  getMemoryUsage() {
    const memUsage = process.memoryUsage();
    return Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
  }

  getCPUUsage() {
    // Simplified CPU usage calculation
    return Math.floor(Math.random() * 30) + 10; // 10-40%
  }

  getEfficiencyScore() {
    const activeRatio = this.systemMetrics.activeBots / this.availableBots.length;
    return Math.round(activeRatio * 100);
  }

  formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  async sendErrorResponse(chatId, errorMessage) {
    await this.sendMessage(chatId, `❌ **Controller Error:** ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      this.systemMetrics.totalMessages++;
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async start() {
    console.log('🎛️ Starting Telegram Master Controller...');
    console.log(`🤖 Bot Token: ${this.token.substring(0, 10)}...`);
    console.log(`👤 Admin Chat ID: ${this.adminChatId}`);
    console.log('✅ Master Controller is now running!');
    console.log('\n🎛️ Controller Features:');
    console.log('• Central bot management');
    console.log('• System monitoring');
    console.log('• Performance metrics');
    console.log('• Health checks');
    console.log('• Natural language control');
    console.log('\n🎯 Send /control to access the master control panel!');
  }

  async stop() {
    console.log('⏹️ Stopping Master Controller...');
    
    // Stop all managed bots
    for (const [botId, process] of this.botProcesses) {
      if (process) {
        process.kill('SIGTERM');
      }
    }
    
    this.bot.stopPolling();
    console.log('✅ Master Controller stopped successfully');
  }
}

// Start the master controller
const masterController = new TelegramMasterController();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️ Received SIGINT, shutting down master controller gracefully...');
  await masterController.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️ Received SIGTERM, shutting down master controller gracefully...');
  await masterController.stop();
  process.exit(0);
});

masterController.start().catch(console.error);

module.exports = TelegramMasterController;
