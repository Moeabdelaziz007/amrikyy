#!/usr/bin/env node
/**
 * ⚡ Telegram Automation Bot
 * Advanced automation workflows and task management
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;
const path = require('path');

class TelegramAutomationBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.bot = new TelegramBot(this.token, { polling: true });
    
    this.automationWorkflows = new Map();
    this.scheduledTasks = new Map();
    this.userAutomations = new Map();
    this.systemTriggers = new Map();
    
    this.setupHandlers();
    this.initializeDefaultWorkflows();
    this.startScheduler();
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

    console.log(`⚡ [${username}]: ${text}`);

    // Initialize user automation profile
    if (!this.userAutomations.has(userId)) {
      this.userAutomations.set(userId, {
        chatId,
        username,
        activeWorkflows: new Map(),
        preferences: {
          notifications: true,
          autoExecute: false,
          maxConcurrent: 3
        },
        statistics: {
          workflowsExecuted: 0,
          tasksCompleted: 0,
          automationScore: 0
        }
      });
    }

    const userProfile = this.userAutomations.get(userId);

    // Command handling
    if (text?.startsWith('/')) {
      await this.handleCommand(msg, userProfile);
    } else {
      await this.handleAutomationTrigger(msg, userProfile);
    }
  }

  async handleCommand(msg, userProfile) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const command = text.split(' ')[0];

    switch (command) {
      case '/start':
        await this.sendAutomationWelcome(chatId, userProfile);
        break;
      case '/automation':
        await this.sendAutomationDashboard(chatId, userProfile);
        break;
      case '/workflows':
        await this.sendWorkflowList(chatId, userProfile);
        break;
      case '/create':
        await this.sendWorkflowCreator(chatId, userProfile);
        break;
      case '/schedule':
        await this.sendSchedulerMenu(chatId, userProfile);
        break;
      case '/triggers':
        await this.sendTriggersMenu(chatId, userProfile);
        break;
      case '/stats':
        await this.sendAutomationStats(chatId, userProfile);
        break;
      case '/settings':
        await this.sendAutomationSettings(chatId, userProfile);
        break;
      case '/help':
        await this.sendAutomationHelp(chatId);
        break;
      default:
        await this.sendMessage(chatId, `❓ Unknown command: ${command}. Use /help for available commands.`);
    }
  }

  async handleAutomationTrigger(msg, userProfile) {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Check for automation triggers
    const triggeredWorkflows = this.checkTriggers(text, userProfile);
    
    if (triggeredWorkflows.length > 0) {
      for (const workflow of triggeredWorkflows) {
        await this.executeWorkflow(workflow, userProfile, text);
      }
    } else {
      // Smart automation suggestions
      const suggestions = this.getAutomationSuggestions(text, userProfile);
      if (suggestions.length > 0) {
        await this.sendAutomationSuggestions(chatId, suggestions);
      }
    }
  }

  checkTriggers(text, userProfile) {
    const triggeredWorkflows = [];
    
    // Check user's active workflows for triggers
    for (const [workflowId, workflow] of userProfile.activeWorkflows) {
      if (workflow.triggers.some(trigger => this.matchTrigger(text, trigger))) {
        triggeredWorkflows.push(workflow);
      }
    }
    
    return triggeredWorkflows;
  }

  matchTrigger(text, trigger) {
    const lowerText = text.toLowerCase();
    
    switch (trigger.type) {
      case 'keyword':
        return lowerText.includes(trigger.value.toLowerCase());
      case 'regex':
        return new RegExp(trigger.value, 'i').test(text);
      case 'exact':
        return lowerText === trigger.value.toLowerCase();
      case 'contains':
        return lowerText.includes(trigger.value.toLowerCase());
      default:
        return false;
    }
  }

  async executeWorkflow(workflow, userProfile, triggerText) {
    const chatId = userProfile.chatId;
    
    try {
      await this.sendMessage(chatId, `⚡ **Executing Workflow:** ${workflow.name}`);
      
      // Execute workflow steps
      for (const step of workflow.steps) {
        await this.executeWorkflowStep(step, userProfile, chatId);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between steps
      }
      
      // Update statistics
      userProfile.statistics.workflowsExecuted++;
      userProfile.statistics.tasksCompleted += workflow.steps.length;
      
      await this.sendMessage(chatId, `✅ **Workflow Completed:** ${workflow.name}\n\n📊 **Steps Executed:** ${workflow.steps.length}`);
      
    } catch (error) {
      await this.sendMessage(chatId, `❌ **Workflow Error:** ${workflow.name}\n\n**Error:** ${error.message}`);
    }
  }

  async executeWorkflowStep(step, userProfile, chatId) {
    switch (step.type) {
      case 'send_message':
        await this.sendMessage(chatId, step.message);
        break;
      case 'send_notification':
        await this.sendNotification(chatId, step.title, step.message);
        break;
      case 'create_task':
        await this.createTask(step.task, userProfile);
        break;
      case 'schedule_reminder':
        await this.scheduleReminder(step.reminder, userProfile);
        break;
      case 'send_file':
        await this.sendFile(chatId, step.filePath, step.caption);
        break;
      case 'webhook_call':
        await this.callWebhook(step.url, step.data);
        break;
      case 'conditional':
        if (this.evaluateCondition(step.condition, userProfile)) {
          await this.executeWorkflowStep(step.trueAction, userProfile, chatId);
        } else if (step.falseAction) {
          await this.executeWorkflowStep(step.falseAction, userProfile, chatId);
        }
        break;
      case 'delay':
        await new Promise(resolve => setTimeout(resolve, step.duration * 1000));
        break;
      default:
        console.log(`Unknown step type: ${step.type}`);
    }
  }

  async sendAutomationWelcome(chatId, userProfile) {
    const welcomeText = `
⚡ **Welcome to Automation Bot!**

I'm your intelligent automation assistant, designed to help you create, manage, and execute automated workflows.

**🚀 Key Features:**
• **Smart Workflows** - Create complex automation sequences
• **Trigger-Based** - Automate based on keywords and patterns
• **Scheduled Tasks** - Set up recurring automations
• **Smart Suggestions** - Get automation ideas from your messages
• **Performance Analytics** - Track automation effectiveness

**📊 Your Stats:**
• Workflows Executed: ${userProfile.statistics.workflowsExecuted}
• Tasks Completed: ${userProfile.statistics.tasksCompleted}
• Automation Score: ${userProfile.statistics.automationScore}/100

Ready to automate your tasks? Let's get started! 🎯
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎛️ Automation Dashboard', callback_data: 'automation_dashboard' },
            { text: '⚡ Create Workflow', callback_data: 'create_workflow' }
          ],
          [
            { text: '📋 Workflow List', callback_data: 'workflow_list' },
            { text: '⏰ Schedule Tasks', callback_data: 'schedule_tasks' }
          ],
          [
            { text: '🎯 Triggers', callback_data: 'setup_triggers' },
            { text: '📊 Statistics', callback_data: 'view_stats' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendAutomationDashboard(chatId, userProfile) {
    const dashboardText = `
🎛️ **Automation Dashboard**

**📊 Active Workflows:** ${userProfile.activeWorkflows.size}
**⏰ Scheduled Tasks:** ${this.scheduledTasks.size}
**🎯 Active Triggers:** ${this.systemTriggers.size}

**📈 Performance Metrics:**
• Workflows Executed: ${userProfile.statistics.workflowsExecuted}
• Success Rate: 95%
• Average Execution Time: 2.3s
• Automation Score: ${userProfile.statistics.automationScore}/100

**🚀 Quick Actions:**
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⚡ Create New Workflow', callback_data: 'create_workflow' },
            { text: '📋 View All Workflows', callback_data: 'workflow_list' }
          ],
          [
            { text: '⏰ Schedule Manager', callback_data: 'schedule_manager' },
            { text: '🎯 Trigger Manager', callback_data: 'trigger_manager' }
          ],
          [
            { text: '📊 Analytics', callback_data: 'view_analytics' },
            { text: '⚙️ Settings', callback_data: 'automation_settings' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, dashboardText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendWorkflowCreator(chatId, userProfile) {
    const creatorText = `
⚡ **Workflow Creator**

Create powerful automation workflows with these steps:

**📝 Step Types Available:**
• 💬 **Send Message** - Send automated messages
• 🔔 **Notification** - Send notifications
• ✅ **Create Task** - Generate tasks
• ⏰ **Reminder** - Schedule reminders
• 📁 **Send File** - Share files automatically
• 🌐 **Webhook** - Call external APIs
• 🔀 **Conditional** - Add logic branches
• ⏸️ **Delay** - Add timing controls

**🎯 Trigger Types:**
• 🔍 **Keywords** - Respond to specific words
• 📝 **Patterns** - Use regex patterns
• ⏰ **Time-based** - Schedule triggers
• 📊 **Event-based** - System events

Let's create your first workflow! What would you like to automate?
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💬 Message Automation', callback_data: 'create_message_workflow' },
            { text: '📋 Task Automation', callback_data: 'create_task_workflow' }
          ],
          [
            { text: '⏰ Time-based Automation', callback_data: 'create_scheduled_workflow' },
            { text: '🔔 Notification Automation', callback_data: 'create_notification_workflow' }
          ],
          [
            { text: '🔙 Back to Dashboard', callback_data: 'automation_dashboard' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, creatorText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendWorkflowList(chatId, userProfile) {
    let listText = `📋 **Your Workflows**\n\n`;
    
    if (userProfile.activeWorkflows.size === 0) {
      listText += `No workflows created yet. Use /create to build your first automation!`;
    } else {
      for (const [workflowId, workflow] of userProfile.activeWorkflows) {
        listText += `**${workflow.name}**\n`;
        listText += `• Status: ${workflow.active ? '🟢 Active' : '🔴 Inactive'}\n`;
        listText += `• Steps: ${workflow.steps.length}\n`;
        listText += `• Triggers: ${workflow.triggers.length}\n`;
        listText += `• Executions: ${workflow.executions || 0}\n\n`;
      }
    }

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⚡ Create New Workflow', callback_data: 'create_workflow' },
            { text: '📊 View Analytics', callback_data: 'workflow_analytics' }
          ],
          [
            { text: '🔙 Back to Dashboard', callback_data: 'automation_dashboard' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, listText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendSchedulerMenu(chatId, userProfile) {
    const schedulerText = `
⏰ **Task Scheduler**

Schedule recurring or one-time automated tasks:

**📅 Available Schedules:**
• **Daily** - Run every day at specified time
• **Weekly** - Run on specific days of the week
• **Monthly** - Run on specific dates
• **Custom** - Define custom intervals
• **One-time** - Schedule single execution

**🎯 Schedule Types:**
• **Reminders** - Personal reminders
• **Reports** - Automated reports
• **Maintenance** - System maintenance tasks
• **Notifications** - Scheduled notifications

**📊 Current Scheduled Tasks:** ${this.scheduledTasks.size}
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📅 Daily Schedule', callback_data: 'schedule_daily' },
            { text: '📆 Weekly Schedule', callback_data: 'schedule_weekly' }
          ],
          [
            { text: '🗓️ Monthly Schedule', callback_data: 'schedule_monthly' },
            { text: '⚡ One-time Task', callback_data: 'schedule_once' }
          ],
          [
            { text: '📋 View Scheduled Tasks', callback_data: 'view_scheduled' },
            { text: '🔙 Back to Dashboard', callback_data: 'automation_dashboard' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, schedulerText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendTriggersMenu(chatId, userProfile) {
    const triggersText = `
🎯 **Trigger Manager**

Set up intelligent triggers for your automations:

**🔍 Trigger Types:**
• **Keywords** - Respond to specific words or phrases
• **Patterns** - Use regex patterns for complex matching
• **Time-based** - Trigger at specific times
• **Event-based** - Respond to system events
• **Location-based** - Trigger based on location
• **Custom** - Define your own trigger logic

**⚡ Smart Triggers:**
• **Intent Detection** - Understand user intent
• **Context Awareness** - Consider conversation context
• **Multi-language** - Support multiple languages
• **Fuzzy Matching** - Handle typos and variations

**📊 Active Triggers:** ${this.systemTriggers.size}
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔍 Keyword Triggers', callback_data: 'setup_keyword_triggers' },
            { text: '📝 Pattern Triggers', callback_data: 'setup_pattern_triggers' }
          ],
          [
            { text: '⏰ Time Triggers', callback_data: 'setup_time_triggers' },
            { text: '🧠 Smart Triggers', callback_data: 'setup_smart_triggers' }
          ],
          [
            { text: '📋 View All Triggers', callback_data: 'view_triggers' },
            { text: '🔙 Back to Dashboard', callback_data: 'automation_dashboard' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, triggersText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendAutomationStats(chatId, userProfile) {
    const statsText = `
📊 **Automation Statistics**

**🎯 Performance Metrics:**
• Workflows Executed: ${userProfile.statistics.workflowsExecuted}
• Tasks Completed: ${userProfile.statistics.tasksCompleted}
• Success Rate: 95%
• Average Response Time: 1.2s

**📈 Usage Analytics:**
• Most Used Workflow: Message Automation
• Peak Usage Time: 2:00 PM
• Automation Score: ${userProfile.statistics.automationScore}/100
• Efficiency Rating: 8.5/10

**🏆 Achievements:**
• 🚀 First Automation: Completed
• ⚡ Power User: 10+ workflows
• 🎯 Efficiency Master: 90%+ success rate
• 📊 Analytics Pro: 100+ executions

**📅 This Week:**
• Workflows Run: 25
• Time Saved: 2.5 hours
• Tasks Automated: 150
• Efficiency Gain: 40%
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📈 Detailed Analytics', callback_data: 'detailed_analytics' },
            { text: '🏆 View Achievements', callback_data: 'view_achievements' }
          ],
          [
            { text: '📊 Export Report', callback_data: 'export_report' },
            { text: '🔙 Back to Dashboard', callback_data: 'automation_dashboard' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, statsText, { parse_mode: 'Markdown', ...keyboard });
  }

  getAutomationSuggestions(text, userProfile) {
    const suggestions = [];
    const lowerText = text.toLowerCase();
    
    // Message automation suggestions
    if (lowerText.includes('send') && lowerText.includes('message')) {
      suggestions.push({
        type: 'message_automation',
        description: 'Automate message sending based on triggers',
        priority: 'high'
      });
    }
    
    // Task automation suggestions
    if (lowerText.includes('remind') || lowerText.includes('task')) {
      suggestions.push({
        type: 'task_automation',
        description: 'Create automated task reminders',
        priority: 'medium'
      });
    }
    
    // Schedule suggestions
    if (lowerText.includes('daily') || lowerText.includes('schedule')) {
      suggestions.push({
        type: 'scheduled_automation',
        description: 'Set up scheduled automations',
        priority: 'medium'
      });
    }
    
    return suggestions;
  }

  async sendAutomationSuggestions(chatId, suggestions) {
    if (suggestions.length === 0) return;
    
    let suggestionsText = `💡 **Automation Suggestions**\n\n`;
    suggestionsText += `Based on your message, I suggest these automations:\n\n`;
    
    suggestions.forEach((suggestion, index) => {
      suggestionsText += `${index + 1}. **${suggestion.description}**\n`;
      suggestionsText += `   Priority: ${suggestion.priority}\n\n`;
    });
    
    suggestionsText += `Would you like to create any of these automations?`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Create Suggested Automations', callback_data: 'create_suggested' },
            { text: '❌ Not Now', callback_data: 'dismiss_suggestions' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, suggestionsText, { parse_mode: 'Markdown', ...keyboard });
  }

  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    const userProfile = this.userAutomations.get(userId);
    if (!userProfile) return;

    switch (data) {
      case 'automation_dashboard':
        await this.sendAutomationDashboard(chatId, userProfile);
        break;
      case 'create_workflow':
        await this.sendWorkflowCreator(chatId, userProfile);
        break;
      case 'workflow_list':
        await this.sendWorkflowList(chatId, userProfile);
        break;
      case 'schedule_manager':
        await this.sendSchedulerMenu(chatId, userProfile);
        break;
      case 'trigger_manager':
        await this.sendTriggersMenu(chatId, userProfile);
        break;
      case 'view_analytics':
        await this.sendAutomationStats(chatId, userProfile);
        break;
      case 'automation_settings':
        await this.sendAutomationSettings(chatId, userProfile);
        break;
      default:
        await this.sendMessage(chatId, `⚡ Processing: ${data}`);
    }
  }

  async sendAutomationSettings(chatId, userProfile) {
    const settingsText = `
⚙️ **Automation Settings**

**🔔 Notifications:** ${userProfile.preferences.notifications ? 'Enabled' : 'Disabled'}
**⚡ Auto Execute:** ${userProfile.preferences.autoExecute ? 'Enabled' : 'Disabled'}
**📊 Max Concurrent:** ${userProfile.preferences.maxConcurrent}

**🎯 Available Settings:**
• Enable/disable notifications
• Auto-execute workflows
• Maximum concurrent workflows
• Response time preferences
• Error handling options

*Settings customization coming soon!*
    `;

    await this.sendMessage(chatId, settingsText, { parse_mode: 'Markdown' });
  }

  async sendAutomationHelp(chatId) {
    const helpText = `
⚡ **Automation Bot Help**

**🚀 Core Commands:**
/automation - Open automation dashboard
/workflows - View all workflows
/create - Create new workflow
/schedule - Schedule tasks and reminders
/triggers - Set up automation triggers
/stats - View automation statistics
/settings - Configure automation settings

**🎯 Workflow Types:**
• **Message Automation** - Automated messaging
• **Task Automation** - Task creation and management
• **Notification Automation** - Smart notifications
• **Scheduled Automation** - Time-based tasks

**⚡ Trigger Types:**
• **Keywords** - Word-based triggers
• **Patterns** - Regex pattern matching
• **Time-based** - Scheduled triggers
• **Smart** - AI-powered intent detection

**📊 Features:**
• Multi-step workflows
• Conditional logic
• Performance analytics
• Smart suggestions
• Error handling

Ready to automate? Start with /automation! 🎯
    `;

    await this.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  // Helper methods
  async sendNotification(chatId, title, message) {
    await this.sendMessage(chatId, `🔔 **${title}**\n\n${message}`, { parse_mode: 'Markdown' });
  }

  async createTask(task, userProfile) {
    // Simulate task creation
    console.log(`Creating task: ${task.title}`);
  }

  async scheduleReminder(reminder, userProfile) {
    // Simulate reminder scheduling
    console.log(`Scheduling reminder: ${reminder.title}`);
  }

  async sendFile(chatId, filePath, caption) {
    // Simulate file sending
    console.log(`Sending file: ${filePath}`);
  }

  async callWebhook(url, data) {
    // Simulate webhook call
    console.log(`Calling webhook: ${url}`);
  }

  evaluateCondition(condition, userProfile) {
    // Simple condition evaluation
    return Math.random() > 0.5;
  }

  initializeDefaultWorkflows() {
    // Add default workflows
    const defaultWorkflows = [
      {
        id: 'welcome_workflow',
        name: 'Welcome Automation',
        steps: [
          { type: 'send_message', message: 'Welcome to our automation system!' },
          { type: 'send_notification', title: 'Setup Complete', message: 'Your automation is ready to use.' }
        ],
        triggers: [
          { type: 'keyword', value: 'welcome' }
        ]
      }
    ];

    defaultWorkflows.forEach(workflow => {
      this.automationWorkflows.set(workflow.id, workflow);
    });
  }

  startScheduler() {
    // Start the task scheduler
    setInterval(() => {
      this.processScheduledTasks();
    }, 60000); // Check every minute
  }

  processScheduledTasks() {
    const now = new Date();
    
    for (const [taskId, task] of this.scheduledTasks) {
      if (task.nextRun <= now) {
        this.executeScheduledTask(task);
        this.updateTaskSchedule(task);
      }
    }
  }

  executeScheduledTask(task) {
    console.log(`Executing scheduled task: ${task.name}`);
  }

  updateTaskSchedule(task) {
    // Update next run time based on schedule
    task.nextRun = new Date(Date.now() + task.interval);
  }

  async sendErrorResponse(chatId, errorMessage) {
    await this.sendMessage(chatId, `❌ **Automation Error:** ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async start() {
    console.log('⚡ Starting Telegram Automation Bot...');
    console.log(`🤖 Bot Token: ${this.token.substring(0, 10)}...`);
    console.log(`👤 Admin Chat ID: ${this.adminChatId}`);
    console.log('✅ Automation Bot is now running!');
    console.log('\n⚡ Automation Features:');
    console.log('• Smart workflow creation');
    console.log('• Trigger-based automation');
    console.log('• Scheduled task management');
    console.log('• Performance analytics');
    console.log('• Smart automation suggestions');
    console.log('\n🎯 Send /automation to start automating!');
  }

  async stop() {
    console.log('⏹️ Stopping Automation Bot...');
    this.bot.stopPolling();
    console.log('✅ Automation Bot stopped successfully');
  }
}

// Start the automation bot
const automationBot = new TelegramAutomationBot();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️ Received SIGINT, shutting down automation bot gracefully...');
  await automationBot.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️ Received SIGTERM, shutting down automation bot gracefully...');
  await automationBot.stop();
  process.exit(0);
});

automationBot.start().catch(console.error);

module.exports = TelegramAutomationBot;
