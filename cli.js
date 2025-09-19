#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const inquirer_1 = require("inquirer");
const axios_1 = require("axios");
const ws_1 = require("ws");
const dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config();
class AuraOSCLI {
    baseUrl;
    wsConnection = null;
    constructor() {
        this.baseUrl = process.env.AURAOS_API_URL || 'http://localhost:5000';
    }
    /**
     * Display system status information
     */
    async status() {
        try {
            console.log(chalk_1.default.blue.bold('\n🚀 AuraOS System Status\n'));
            const response = await axios_1.default.get(`${this.baseUrl}/api/system/status`);
            const status = response.data;
            // System Status
            console.log(chalk_1.default.green('📊 System Information:'));
            console.log(`   Status: ${chalk_1.default.green(status.system.status)}`);
            console.log(`   Version: ${chalk_1.default.blue(status.system.version)}`);
            console.log(`   Uptime: ${chalk_1.default.yellow(this.formatUptime(status.system.uptime))}\n`);
            // Autopilot Status
            console.log(chalk_1.default.green('🤖 Autopilot System:'));
            console.log(`   Active: ${status.autopilot.active ? chalk_1.default.green('✅ Yes') : chalk_1.default.red('❌ No')}`);
            console.log(`   Active Rules: ${chalk_1.default.blue(status.autopilot.rules)}`);
            console.log(`   Active Workflows: ${chalk_1.default.blue(status.autopilot.workflows)}`);
            console.log(`   Last Execution: ${chalk_1.default.yellow(status.autopilot.lastExecution)}\n`);
            // AI Agents
            console.log(chalk_1.default.green('🧠 AI Agents:'));
            console.log(`   Total Agents: ${chalk_1.default.blue(status.ai.agents)}`);
            console.log(`   Active Agents: ${chalk_1.default.blue(status.ai.activeAgents)}`);
            console.log(`   Total Tasks: ${chalk_1.default.blue(status.ai.totalTasks)}\n`);
            // Performance
            console.log(chalk_1.default.green('⚡ Performance:'));
            console.log(`   Memory Usage: ${chalk_1.default.blue(status.performance.memory + '%')}`);
            console.log(`   CPU Usage: ${chalk_1.default.blue(status.performance.cpu + '%')}`);
            console.log(`   Response Time: ${chalk_1.default.blue(status.performance.responseTime + 'ms')}\n`);
        }
        catch (error) {
            console.error(chalk_1.default.red('❌ Failed to fetch system status:'), error.message);
        }
    }
    /**
     * Start interactive chat session with AI agents
     */
    async interactive() {
        console.log(chalk_1.default.blue.bold('\n🤖 AuraOS Interactive Chat\n'));
        console.log(chalk_1.default.gray('Type "exit" to quit, "help" for commands, "status" for system info\n'));
        while (true) {
            const { message } = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'message',
                    message: chalk_1.default.cyan('You:'),
                    validate: (input) => input.trim().length > 0 || 'Please enter a message'
                }
            ]);
            if (message.toLowerCase() === 'exit') {
                console.log(chalk_1.default.yellow('\n👋 Goodbye!'));
                break;
            }
            if (message.toLowerCase() === 'help') {
                this.showHelp();
                continue;
            }
            if (message.toLowerCase() === 'status') {
                await this.status();
                continue;
            }
            try {
                console.log(chalk_1.default.blue('🤖 AuraOS:'), 'Processing...');
                const response = await axios_1.default.post(`${this.baseUrl}/api/ai/chat`, {
                    message: message,
                    context: 'cli_interaction'
                });
                console.log(chalk_1.default.green('🤖 AuraOS:'), response.data.response);
                console.log(''); // Empty line for readability
            }
            catch (error) {
                console.error(chalk_1.default.red('❌ Error:'), error.response?.data?.message || error.message);
            }
        }
    }
    /**
     * Run predefined demo interactions
     */
    async demo() {
        console.log(chalk_1.default.blue.bold('\n🎭 AuraOS Demo Mode\n'));
        const demos = [
            {
                name: 'System Health Check',
                action: async () => {
                    console.log(chalk_1.default.yellow('🔍 Running system health check...'));
                    await this.status();
                }
            },
            {
                name: 'AI Agent Interaction',
                action: async () => {
                    console.log(chalk_1.default.yellow('🤖 Testing AI agent interaction...'));
                    try {
                        const response = await axios_1.default.post(`${this.baseUrl}/api/ai/chat`, {
                            message: 'Hello! Can you help me understand what AuraOS can do?',
                            context: 'demo'
                        });
                        console.log(chalk_1.default.green('🤖 AI Response:'), response.data.response);
                    }
                    catch (error) {
                        console.error(chalk_1.default.red('❌ Error:'), error.message);
                    }
                }
            },
            {
                name: 'Autopilot Status',
                action: async () => {
                    console.log(chalk_1.default.yellow('🚀 Checking autopilot status...'));
                    try {
                        const response = await axios_1.default.get(`${this.baseUrl}/api/autopilot/status`);
                        console.log(chalk_1.default.green('📊 Autopilot:'), JSON.stringify(response.data, null, 2));
                    }
                    catch (error) {
                        console.error(chalk_1.default.red('❌ Error:'), error.message);
                    }
                }
            },
            {
                name: 'Workflow Templates',
                action: async () => {
                    console.log(chalk_1.default.yellow('📋 Fetching workflow templates...'));
                    try {
                        const response = await axios_1.default.get(`${this.baseUrl}/api/workflows/templates`);
                        console.log(chalk_1.default.green('📋 Templates:'), response.data.length + ' templates available');
                    }
                    catch (error) {
                        console.error(chalk_1.default.red('❌ Error:'), error.message);
                    }
                }
            }
        ];
        for (const demo of demos) {
            console.log(chalk_1.default.cyan(`\n▶️  ${demo.name}`));
            await demo.action();
            console.log(chalk_1.default.gray('─────────────────────────────────────────'));
            // Wait a moment between demos
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(chalk_1.default.green.bold('\n✅ Demo completed successfully!'));
    }
    /**
     * Monitor real-time system events
     */
    async monitor() {
        console.log(chalk_1.default.blue.bold('\n📡 AuraOS Real-time Monitor\n'));
        console.log(chalk_1.default.gray('Press Ctrl+C to exit monitor mode\n'));
        try {
            this.wsConnection = new ws_1.default(`${this.baseUrl.replace('http', 'ws')}/ws`);
            this.wsConnection.on('open', () => {
                console.log(chalk_1.default.green('✅ Connected to AuraOS real-time stream'));
            });
            this.wsConnection.on('message', (data) => {
                try {
                    const event = JSON.parse(data.toString());
                    const timestamp = new Date(event.timestamp).toLocaleTimeString();
                    if (event.type === 'log') {
                        console.log(chalk_1.default.gray(`[${timestamp}]`), event.message);
                    }
                    else if (event.type === 'autopilot') {
                        console.log(chalk_1.default.blue(`[${timestamp}]`), `🤖 Autopilot: ${event.message}`);
                    }
                    else if (event.type === 'ai') {
                        console.log(chalk_1.default.green(`[${timestamp}]`), `🧠 AI: ${event.message}`);
                    }
                    else {
                        console.log(chalk_1.default.yellow(`[${timestamp}]`), `📊 ${event.type}: ${event.message}`);
                    }
                }
                catch (error) {
                    console.log(chalk_1.default.red('❌ Failed to parse event:'), data.toString());
                }
            });
            this.wsConnection.on('close', () => {
                console.log(chalk_1.default.yellow('\n📡 Connection closed'));
            });
            this.wsConnection.on('error', (error) => {
                console.error(chalk_1.default.red('❌ WebSocket error:'), error.message);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('❌ Failed to connect to real-time stream:'), error.message);
        }
    }
    /**
     * Show help information
     */
    showHelp() {
        console.log(chalk_1.default.blue.bold('\n📚 AuraOS CLI Help\n'));
        console.log(chalk_1.default.green('Available Commands:'));
        console.log('  help     - Show this help message');
        console.log('  status   - Display system status');
        console.log('  exit     - Exit the interactive session');
        console.log('\n' + chalk_1.default.green('CLI Commands:'));
        console.log('  auraos status     - Show system status');
        console.log('  auraos interactive - Start interactive chat');
        console.log('  auraos demo       - Run demo interactions');
        console.log('  auraos monitor    - Monitor real-time events');
        console.log('');
    }
    /**
     * Format uptime in human readable format
     */
    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (days > 0)
            return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0)
            return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.wsConnection) {
            this.wsConnection.close();
        }
    }
}
// CLI Setup
const program = new commander_1.Command();
const cli = new AuraOSCLI();
program
    .name('auraos')
    .description('AuraOS Command Line Interface')
    .version('1.0.0');
program
    .command('status')
    .description('Display system status information')
    .action(async () => {
    await cli.status();
    process.exit(0);
});
program
    .command('interactive')
    .description('Start interactive chat session')
    .action(async () => {
    await cli.interactive();
    process.exit(0);
});
program
    .command('demo')
    .description('Run predefined demo interactions')
    .action(async () => {
    await cli.demo();
    process.exit(0);
});
program
    .command('monitor')
    .description('Monitor real-time system events')
    .action(async () => {
    await cli.monitor();
    // Keep process alive for WebSocket connection
    process.on('SIGINT', () => {
        cli.cleanup();
        console.log(chalk_1.default.yellow('\n👋 Monitor stopped'));
        process.exit(0);
    });
});
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error(chalk_1.default.red('❌ Uncaught Exception:'), error.message);
    cli.cleanup();
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error(chalk_1.default.red('❌ Unhandled Rejection:'), reason);
    cli.cleanup();
    process.exit(1);
});
// Parse command line arguments
program.parse();
// If no command provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
