#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const commander_1 = require('commander');
const chalk_1 = require('chalk');
const inquirer_1 = require('inquirer');
const axios_1 = require('axios');
const ws_1 = require('ws');
const dotenv_1 = require('dotenv');
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
      const response = await axios_1.default.get(
        `${this.baseUrl}/api/system/status`
      );
      const status = response.data;
      // System Status
      console.log(chalk_1.default.green('📊 System Information:'));
      console.log(`   Status: ${chalk_1.default.green(status.system.status)}`);
      console.log(`   Version: ${chalk_1.default.blue(status.system.version)}`);
      console.log(
        `   Uptime: ${chalk_1.default.yellow(this.formatUptime(status.system.uptime))}\n`
      );
      // Autopilot Status
      console.log(chalk_1.default.green('🤖 Autopilot System:'));
      console.log(
        `   Active: ${status.autopilot.active ? chalk_1.default.green('✅ Yes') : chalk_1.default.red('❌ No')}`
      );
      console.log(
        `   Active Rules: ${chalk_1.default.blue(status.autopilot.rules)}`
      );
      console.log(
        `   Active Workflows: ${chalk_1.default.blue(status.autopilot.workflows)}`
      );
      console.log(
        `   Last Execution: ${chalk_1.default.yellow(status.autopilot.lastExecution)}\n`
      );
      // AI Agents
      console.log(chalk_1.default.green('🧠 AI Agents:'));
      console.log(`   Total Agents: ${chalk_1.default.blue(status.ai.agents)}`);
      console.log(
        `   Active Agents: ${chalk_1.default.blue(status.ai.activeAgents)}`
      );
      console.log(
        `   Total Tasks: ${chalk_1.default.blue(status.ai.totalTasks)}\n`
      );
      // Performance
      console.log(chalk_1.default.green('⚡ Performance:'));
      console.log(
        `   Memory Usage: ${chalk_1.default.blue(status.performance.memory + '%')}`
      );
      console.log(
        `   CPU Usage: ${chalk_1.default.blue(status.performance.cpu + '%')}`
      );
      console.log(
        `   Response Time: ${chalk_1.default.blue(status.performance.responseTime + 'ms')}\n`
      );
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to fetch system status:'),
        error.message
      );
    }
  }
  /**
   * Start interactive chat session with AI agents
   */
  async interactive() {
    console.log(chalk_1.default.blue.bold('\n🤖 AuraOS Interactive Chat\n'));
    console.log(
      chalk_1.default.gray(
        'Type "exit" to quit, "help" for commands, "status" for system info\n'
      )
    );
    while (true) {
      const { message } = await inquirer_1.default.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk_1.default.cyan('You:'),
          validate: input =>
            input.trim().length > 0 || 'Please enter a message',
        },
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
        const response = await axios_1.default.post(
          `${this.baseUrl}/api/ai/chat`,
          {
            message: message,
            context: 'cli_interaction',
          }
        );
        console.log(
          chalk_1.default.green('🤖 AuraOS:'),
          response.data.response
        );
        console.log(''); // Empty line for readability
      } catch (error) {
        console.error(
          chalk_1.default.red('❌ Error:'),
          error.response?.data?.message || error.message
        );
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
          console.log(
            chalk_1.default.yellow('🔍 Running system health check...')
          );
          await this.status();
        },
      },
      {
        name: 'AI Agent Interaction',
        action: async () => {
          console.log(
            chalk_1.default.yellow('🤖 Testing AI agent interaction...')
          );
          try {
            const response = await axios_1.default.post(
              `${this.baseUrl}/api/ai/chat`,
              {
                message:
                  'Hello! Can you help me understand what AuraOS can do?',
                context: 'demo',
              }
            );
            console.log(
              chalk_1.default.green('🤖 AI Response:'),
              response.data.response
            );
          } catch (error) {
            console.error(chalk_1.default.red('❌ Error:'), error.message);
          }
        },
      },
      {
        name: 'Autopilot Status',
        action: async () => {
          console.log(
            chalk_1.default.yellow('🚀 Checking autopilot status...')
          );
          try {
            const response = await axios_1.default.get(
              `${this.baseUrl}/api/autopilot/status`
            );
            console.log(
              chalk_1.default.green('📊 Autopilot:'),
              JSON.stringify(response.data, null, 2)
            );
          } catch (error) {
            console.error(chalk_1.default.red('❌ Error:'), error.message);
          }
        },
      },
      {
        name: 'Workflow Templates',
        action: async () => {
          console.log(
            chalk_1.default.yellow('📋 Fetching workflow templates...')
          );
          try {
            const response = await axios_1.default.get(
              `${this.baseUrl}/api/workflows/templates`
            );
            console.log(
              chalk_1.default.green('📋 Templates:'),
              response.data.length + ' templates available'
            );
          } catch (error) {
            console.error(chalk_1.default.red('❌ Error:'), error.message);
          }
        },
      },
    ];
    for (const demo of demos) {
      console.log(chalk_1.default.cyan(`\n▶️  ${demo.name}`));
      await demo.action();
      console.log(
        chalk_1.default.gray('─────────────────────────────────────────')
      );
      // Wait a moment between demos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(
      chalk_1.default.green.bold('\n✅ Demo completed successfully!')
    );
  }
  /**
   * Monitor real-time system events
   */
  async monitor() {
    console.log(chalk_1.default.blue.bold('\n📡 AuraOS Real-time Monitor\n'));
    console.log(chalk_1.default.gray('Press Ctrl+C to exit monitor mode\n'));
    try {
      this.wsConnection = new ws_1.default(
        `${this.baseUrl.replace('http', 'ws')}/ws`
      );
      this.wsConnection.on('open', () => {
        console.log(
          chalk_1.default.green('✅ Connected to AuraOS real-time stream')
        );
      });
      this.wsConnection.on('message', data => {
        try {
          const event = JSON.parse(data.toString());
          const timestamp = new Date(event.timestamp).toLocaleTimeString();
          if (event.type === 'log') {
            console.log(chalk_1.default.gray(`[${timestamp}]`), event.message);
          } else if (event.type === 'autopilot') {
            console.log(
              chalk_1.default.blue(`[${timestamp}]`),
              `🤖 Autopilot: ${event.message}`
            );
          } else if (event.type === 'ai') {
            console.log(
              chalk_1.default.green(`[${timestamp}]`),
              `🧠 AI: ${event.message}`
            );
          } else {
            console.log(
              chalk_1.default.yellow(`[${timestamp}]`),
              `📊 ${event.type}: ${event.message}`
            );
          }
        } catch (error) {
          console.log(
            chalk_1.default.red('❌ Failed to parse event:'),
            data.toString()
          );
        }
      });
      this.wsConnection.on('close', () => {
        console.log(chalk_1.default.yellow('\n📡 Connection closed'));
      });
      this.wsConnection.on('error', error => {
        console.error(
          chalk_1.default.red('❌ WebSocket error:'),
          error.message
        );
      });
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to connect to real-time stream:'),
        error.message
      );
    }
  }

  /**
   * Start autopilot system
   */
  async autopilotStart() {
    console.log(
      chalk_1.default.blue.bold('\n🚀 Starting AuraOS Autopilot System...\n')
    );
    try {
      const response = await axios_1.default.post(
        `${this.baseUrl}/api/autopilot/start`
      );
      console.log(
        chalk_1.default.green('✅ Autopilot system started successfully!')
      );
      console.log(chalk_1.default.blue('📊 Response:'), response.data);
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to start autopilot:'),
        error.response?.data?.message || error.message
      );
    }
  }

  /**
   * Stop autopilot system
   */
  async autopilotStop() {
    console.log(
      chalk_1.default.yellow.bold('\n🛑 Stopping AuraOS Autopilot System...\n')
    );
    try {
      const response = await axios_1.default.post(
        `${this.baseUrl}/api/autopilot/stop`
      );
      console.log(
        chalk_1.default.green('✅ Autopilot system stopped successfully!')
      );
      console.log(chalk_1.default.blue('📊 Response:'), response.data);
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to stop autopilot:'),
        error.response?.data?.message || error.message
      );
    }
  }

  /**
   * Get autopilot status
   */
  async autopilotStatus() {
    console.log(chalk_1.default.blue.bold('\n🤖 AuraOS Autopilot Status\n'));
    try {
      const response = await axios_1.default.get(
        `${this.baseUrl}/api/autopilot/status`
      );
      const status = response.data;
      console.log(chalk_1.default.green('📊 Autopilot Information:'));
      console.log(
        `   Status: ${status.active ? chalk_1.default.green('✅ Active') : chalk_1.default.red('❌ Inactive')}`
      );
      console.log(
        `   Active Rules: ${chalk_1.default.blue(status.rules || 0)}`
      );
      console.log(
        `   Active Workflows: ${chalk_1.default.blue(status.workflows || 0)}`
      );
      console.log(
        `   Last Execution: ${chalk_1.default.yellow(status.lastExecution || 'N/A')}`
      );
      console.log(
        `   System Health: ${chalk_1.default.blue(status.health || 'Unknown')}\n`
      );
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to get autopilot status:'),
        error.response?.data?.message || error.message
      );
    }
  }

  /**
   * Monitor autopilot in real-time
   */
  async autopilotMonitor() {
    console.log(chalk_1.default.blue.bold('\n📡 AuraOS Autopilot Monitor\n'));
    console.log(
      chalk_1.default.gray('Press Ctrl+C to exit autopilot monitor\n')
    );
    try {
      this.wsConnection = new ws_1.default(
        `${this.baseUrl.replace('http', 'ws')}/ws/autopilot`
      );
      this.wsConnection.on('open', () => {
        console.log(
          chalk_1.default.green('✅ Connected to AuraOS autopilot stream')
        );
      });
      this.wsConnection.on('message', data => {
        try {
          const event = JSON.parse(data.toString());
          const timestamp = new Date(event.timestamp).toLocaleTimeString();
          console.log(
            chalk_1.default.blue(`[${timestamp}]`),
            `🤖 ${event.type}: ${event.message}`
          );
          if (event.data) {
            console.log(
              chalk_1.default.gray('   Data:'),
              JSON.stringify(event.data, null, 2)
            );
          }
        } catch (error) {
          console.log(
            chalk_1.default.red('❌ Failed to parse autopilot event:'),
            data.toString()
          );
        }
      });
      this.wsConnection.on('close', () => {
        console.log(chalk_1.default.yellow('\n📡 Autopilot connection closed'));
      });
      this.wsConnection.on('error', error => {
        console.error(
          chalk_1.default.red('❌ Autopilot WebSocket error:'),
          error.message
        );
      });
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to connect to autopilot stream:'),
        error.message
      );
    }
  }

  /**
   * Show autopilot logs
   */
  async autopilotLogs() {
    console.log(chalk_1.default.blue.bold('\n📋 AuraOS Autopilot Logs\n'));
    try {
      const response = await axios_1.default.get(
        `${this.baseUrl}/api/autopilot/logs?limit=20`
      );
      const logs = response.data;
      if (logs.length === 0) {
        console.log(chalk_1.default.yellow('📝 No recent logs found'));
        return;
      }
      logs.forEach((log, index) => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const level = log.level.toUpperCase();
        const color =
          level === 'ERROR'
            ? chalk_1.default.red
            : level === 'WARN'
              ? chalk_1.default.yellow
              : level === 'INFO'
                ? chalk_1.default.green
                : chalk_1.default.blue;
        console.log(color(`[${timestamp}] [${level}] ${log.message}`));
        if (log.data) {
          console.log(
            chalk_1.default.gray('   Data:'),
            JSON.stringify(log.data, null, 2)
          );
        }
      });
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Failed to fetch autopilot logs:'),
        error.response?.data?.message || error.message
      );
    }
  }

  /**
   * AI Chat for autopilot assistance
   */
  async autopilotAIChat() {
    console.log(chalk_1.default.blue.bold('\n🤖 AuraOS AI Assistant\n'));
    console.log(
      chalk_1.default.gray('Type "exit" to quit, "help" for commands\n')
    );
    while (true) {
      const { message } = await inquirer_1.default.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk_1.default.cyan('You:'),
          validate: input =>
            input.trim().length > 0 || 'Please enter a message',
        },
      ]);
      if (message.toLowerCase() === 'exit') {
        console.log(chalk_1.default.yellow('\n👋 Goodbye!'));
        break;
      }
      if (message.toLowerCase() === 'help') {
        console.log(chalk_1.default.green('Available commands:'));
        console.log('  help - Show this help');
        console.log('  exit - Exit chat');
        console.log('  status - Show system status');
        console.log('  analyze - Analyze system performance');
        continue;
      }
      if (message.toLowerCase() === 'status') {
        await this.autopilotStatus();
        continue;
      }
      if (message.toLowerCase() === 'analyze') {
        await this.autopilotAIAnalyze();
        continue;
      }
      try {
        console.log(chalk_1.default.blue('🤖 AI:'), 'Thinking...');
        const response = await axios_1.default.post(
          `${this.baseUrl}/api/ai/autopilot-chat`,
          {
            message: message,
            context: 'autopilot_assistance',
          }
        );
        console.log(chalk_1.default.green('🤖 AI:'), response.data.response);
      } catch (error) {
        console.error(
          chalk_1.default.red('❌ AI Error:'),
          error.response?.data?.message || error.message
        );
      }
    }
  }

  /**
   * AI Analysis of autopilot performance
   */
  async autopilotAIAnalyze() {
    console.log(chalk_1.default.blue.bold('\n🧠 AI Performance Analysis\n'));
    try {
      console.log(
        chalk_1.default.yellow('🔍 Analyzing autopilot performance...')
      );
      const response = await axios_1.default.post(
        `${this.baseUrl}/api/ai/autopilot-analyze`
      );
      const analysis = response.data;
      console.log(chalk_1.default.green('📊 Analysis Results:'));
      console.log(
        `   Overall Health: ${chalk_1.default.blue(analysis.health)}`
      );
      console.log(
        `   Performance Score: ${chalk_1.default.blue(analysis.score + '/100')}`
      );
      console.log(
        `   Recommendations: ${chalk_1.default.yellow(analysis.recommendations.length)} found`
      );
      analysis.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${chalk_1.default.cyan(rec)}`);
      });
    } catch (error) {
      console.error(
        chalk_1.default.red('❌ Analysis failed:'),
        error.response?.data?.message || error.message
      );
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
    console.log('\n' + chalk_1.default.green('Autopilot Commands:'));
    console.log('  auraos autopilot start    - Start autopilot system');
    console.log('  auraos autopilot stop     - Stop autopilot system');
    console.log('  auraos autopilot status   - Show autopilot status');
    console.log('  auraos autopilot monitor  - Monitor autopilot in real-time');
    console.log('  auraos autopilot logs     - Show autopilot logs');
    console.log('  auraos autopilot ai chat  - Chat with AI assistant');
    console.log('  auraos autopilot ai analyze - AI performance analysis');
    console.log('');
  }
  /**
   * Format uptime in human readable format
   */
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
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

// Autopilot Commands
program
  .command('autopilot')
  .description('Autopilot system management')
  .addCommand(
    new commander_1.Command('start')
      .description('Start autopilot system')
      .action(async () => {
        await cli.autopilotStart();
        process.exit(0);
      })
  )
  .addCommand(
    new commander_1.Command('stop')
      .description('Stop autopilot system')
      .action(async () => {
        await cli.autopilotStop();
        process.exit(0);
      })
  )
  .addCommand(
    new commander_1.Command('status')
      .description('Show autopilot status')
      .action(async () => {
        await cli.autopilotStatus();
        process.exit(0);
      })
  )
  .addCommand(
    new commander_1.Command('monitor')
      .description('Monitor autopilot in real-time')
      .action(async () => {
        await cli.autopilotMonitor();
        // Keep process alive for WebSocket connection
        process.on('SIGINT', () => {
          cli.cleanup();
          console.log(chalk_1.default.yellow('\n👋 Autopilot monitor stopped'));
          process.exit(0);
        });
      })
  )
  .addCommand(
    new commander_1.Command('logs')
      .description('Show autopilot logs')
      .action(async () => {
        await cli.autopilotLogs();
        process.exit(0);
      })
  )
  .addCommand(
    new commander_1.Command('ai')
      .description('AI assistance for autopilot')
      .addCommand(
        new commander_1.Command('chat')
          .description('Chat with AI assistant')
          .action(async () => {
            await cli.autopilotAIChat();
            process.exit(0);
          })
      )
      .addCommand(
        new commander_1.Command('analyze')
          .description('AI performance analysis')
          .action(async () => {
            await cli.autopilotAIAnalyze();
            process.exit(0);
          })
      )
  );
// Handle uncaught errors
process.on('uncaughtException', error => {
  console.error(chalk_1.default.red('❌ Uncaught Exception:'), error.message);
  cli.cleanup();
  process.exit(1);
});
process.on('unhandledRejection', reason => {
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
