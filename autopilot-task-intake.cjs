#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AutopilotTaskIntake {
    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        
        this.taskQueue = [];
        this.activeTasks = new Map();
        this.taskHistory = [];
        
        this.setupTaskHandlers();
        console.log('🧩 Autopilot Task Intake System initialized');
    }

    setupTaskHandlers() {
        // Handle all text messages as potential tasks
        this.bot.on('message', async (msg) => {
            if (msg.text && !msg.text.startsWith('/')) {
                await this.processIncomingTask(msg);
            }
        });

        // Handle specific commands
        this.bot.onText(/\/task/, async (msg) => {
            await this.processTaskCommand(msg);
        });

        this.bot.onText(/\/status/, async (msg) => {
            await this.sendTaskStatus(msg);
        });

        this.bot.onText(/\/queue/, async (msg) => {
            await this.sendTaskQueue(msg);
        });

        this.bot.onText(/\/help/, async (msg) => {
            await this.sendHelp(msg);
        });
    }

    async processIncomingTask(msg) {
        try {
            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: 'user_message',
                content: msg.text,
                user: {
                    id: msg.from.id,
                    username: msg.from.username,
                    firstName: msg.from.first_name
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: this.determinePriority(msg.text)
            };

            // Analyze task with Gemini AI
            const analysis = await this.analyzeTask(task);
            task.analysis = analysis;
            task.assignedAgent = this.determineAgent(analysis);

            // Add to queue
            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            // Send confirmation
            await this.bot.sendMessage(msg.chat.id, 
                `🧩 **Task Received**\n\n` +
                `**ID**: \`${taskId}\`\n` +
                `**Type**: ${task.type}\n` +
                `**Priority**: ${task.priority}\n` +
                `**Agent**: ${task.assignedAgent}\n` +
                `**Status**: ${task.status}\n\n` +
                `⏳ Processing...`,
                { parse_mode: 'Markdown' }
            );

            // Process task
            await this.dispatchTask(task);

        } catch (error) {
            console.error('❌ Task processing failed:', error);
            await this.bot.sendMessage(msg.chat.id, 
                `❌ **Task Processing Failed**\n\nError: ${error.message}`
            );
        }
    }

    async processTaskCommand(msg) {
        const args = msg.text.split(' ').slice(1);
        const taskType = args[0] || 'general';
        const taskContent = args.slice(1).join(' ') || 'No content provided';

        const taskId = this.generateTaskId();
        const task = {
            id: taskId,
            type: taskType,
            content: taskContent,
            user: {
                id: msg.from.id,
                username: msg.from.username,
                firstName: msg.from.first_name
            },
            chatId: msg.chat.id,
            timestamp: new Date().toISOString(),
            status: 'pending',
            priority: 'high'
        };

        // Analyze and dispatch
        const analysis = await this.analyzeTask(task);
        task.analysis = analysis;
        task.assignedAgent = this.determineAgent(analysis);

        this.taskQueue.push(task);
        this.activeTasks.set(taskId, task);

        await this.bot.sendMessage(msg.chat.id,
            `🎯 **Task Created**\n\n` +
            `**ID**: \`${taskId}\`\n` +
            `**Type**: ${taskType}\n` +
            `**Agent**: ${task.assignedAgent}\n` +
            `**Priority**: ${task.priority}\n\n` +
            `🚀 Dispatching...`,
            { parse_mode: 'Markdown' }
        );

        await this.dispatchTask(task);
    }

    async analyzeTask(task) {
        try {
            const prompt = `
            Analyze this task and provide structured information:

            Task: "${task.content}"
            Type: ${task.type}
            User: ${task.user.firstName}

            Provide analysis in JSON format:
            {
                "intent": "what the user wants to accomplish",
                "category": "data_analysis|web_scraping|automation|ai_task|general",
                "complexity": "low|medium|high",
                "required_agents": ["agent1", "agent2"],
                "estimated_duration": "seconds|minutes|hours",
                "resources_needed": ["resource1", "resource2"]
            }
            `;

            const result = await this.model.generateContent(prompt);
            const analysis = result.response.text();
            
            try {
                return JSON.parse(analysis);
            } catch (e) {
                return {
                    intent: "general task",
                    category: "general",
                    complexity: "medium",
                    required_agents: ["gemini_ai"],
                    estimated_duration: "minutes",
                    resources_needed: []
                };
            }
        } catch (error) {
            console.error('❌ Task analysis failed:', error);
            return {
                intent: "general task",
                category: "general",
                complexity: "medium",
                required_agents: ["gemini_ai"],
                estimated_duration: "minutes",
                resources_needed: []
            };
        }
    }

    determineAgent(analysis) {
        const category = analysis.category || 'general';
        const agents = {
            'data_analysis': 'gemini_ai',
            'web_scraping': 'httpie_agent',
            'automation': 'automation_agent',
            'ai_task': 'gemini_ai',
            'general': 'gemini_ai'
        };
        return agents[category] || 'gemini_ai';
    }

    determinePriority(content) {
        const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'important'];
        const lowKeywords = ['later', 'when possible', 'low priority'];
        
        const lowerContent = content.toLowerCase();
        
        if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) {
            return 'urgent';
        } else if (lowKeywords.some(keyword => lowerContent.includes(keyword))) {
            return 'low';
        } else {
            return 'medium';
        }
    }

    async dispatchTask(task) {
        try {
            console.log(`🚀 Dispatching task ${task.id} to ${task.assignedAgent}`);
            
            // Update task status
            task.status = 'processing';
            task.startTime = new Date().toISOString();

            // Send to appropriate agent
            const result = await this.sendToAgent(task);
            
            // Update task with result
            task.status = result.success ? 'completed' : 'failed';
            task.endTime = new Date().toISOString();
            task.result = result;

            // Move to history
            this.taskHistory.push(task);
            this.activeTasks.delete(task.id);

            // Send result to user
            await this.sendTaskResult(task);

        } catch (error) {
            console.error('❌ Task dispatch failed:', error);
            task.status = 'failed';
            task.error = error.message;
            await this.bot.sendMessage(task.chatId, 
                `❌ **Task Failed**\n\nTask ID: \`${task.id}\`\nError: ${error.message}`
            );
        }
    }

    async sendToAgent(task) {
        // This will be implemented by the Task Dispatcher
        // For now, simulate agent response
        return {
            success: true,
            message: `Task ${task.id} processed successfully`,
            data: { result: 'Task completed' },
            agent: task.assignedAgent,
            duration: '2 seconds'
        };
    }

    async sendTaskResult(task) {
        const statusEmoji = task.status === 'completed' ? '✅' : '❌';
        
        await this.bot.sendMessage(task.chatId,
            `${statusEmoji} **Task ${task.status.toUpperCase()}**\n\n` +
            `**ID**: \`${task.id}\`\n` +
            `**Agent**: ${task.assignedAgent}\n` +
            `**Duration**: ${this.calculateDuration(task.startTime, task.endTime)}\n` +
            `**Result**: ${task.result.message}\n\n` +
            `📊 Task completed at ${new Date().toLocaleString()}`,
            { parse_mode: 'Markdown' }
        );
    }

    async sendTaskStatus(msg) {
        const activeCount = this.activeTasks.size;
        const queueCount = this.taskQueue.length;
        const historyCount = this.taskHistory.length;

        await this.bot.sendMessage(msg.chat.id,
            `📊 **Autopilot Status**\n\n` +
            `🔄 **Active Tasks**: ${activeCount}\n` +
            `⏳ **Queue**: ${queueCount}\n` +
            `✅ **Completed**: ${historyCount}\n` +
            `🤖 **Agents**: Online\n\n` +
            `🕐 Last Update: ${new Date().toLocaleString()}`,
            { parse_mode: 'Markdown' }
        );
    }

    async sendTaskQueue(msg) {
        if (this.taskQueue.length === 0) {
            await this.bot.sendMessage(msg.chat.id, '📋 **Task Queue is empty**');
            return;
        }

        let queueText = '📋 **Task Queue**\n\n';
        this.taskQueue.slice(0, 10).forEach((task, index) => {
            queueText += `${index + 1}. **${task.id}** - ${task.type}\n`;
            queueText += `   Priority: ${task.priority}\n`;
            queueText += `   Agent: ${task.assignedAgent}\n\n`;
        });

        await this.bot.sendMessage(msg.chat.id, queueText, { parse_mode: 'Markdown' });
    }

    async sendHelp(msg) {
        const helpText = `
🤖 **Autopilot Commands**

**Basic Commands:**
• Send any message → Auto-process as task
• \`/task [type] [content]\` → Create specific task
• \`/status\` → Show system status
• \`/queue\` → Show task queue
• \`/help\` → Show this help

**Task Types:**
• \`data_analysis\` → Data analysis tasks
• \`web_scraping\` → Web scraping tasks
• \`automation\` → Automation tasks
• \`ai_task\` → AI-powered tasks

**Examples:**
• \`/task data_analysis analyze sales data\`
• \`/task web_scraping scrape website\`
• \`Hello, can you help me with...\`

🎯 **The system will automatically:**
• Analyze your request
• Assign the right agent
• Process the task
• Send results back
        `;

        await this.bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
    }

    generateTaskId() {
        return 'TASK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    calculateDuration(start, end) {
        if (!start || !end) return 'N/A';
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffMs = endTime - startTime;
        const diffSec = Math.floor(diffMs / 1000);
        
        if (diffSec < 60) return `${diffSec}s`;
        const diffMin = Math.floor(diffSec / 60);
        return `${diffMin}m ${diffSec % 60}s`;
    }

    getTaskStats() {
        return {
            active: this.activeTasks.size,
            queued: this.taskQueue.length,
            completed: this.taskHistory.length,
            total: this.taskHistory.length + this.activeTasks.size
        };
    }
}

module.exports = AutopilotTaskIntake;
