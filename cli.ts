#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

interface AuraOSStatus {
  system: {
    status: string;
    uptime: number;
    version: string;
  };
  autopilot: {
    active: boolean;
    rules: number;
    workflows: number;
    lastExecution: string;
  };
  ai: {
    agents: number;
    activeAgents: number;
    totalTasks: number;
  };
  performance: {
    memory: number;
    cpu: number;
    responseTime: number;
  };
}

class AuraOSCLI {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;

  constructor() {
    this.baseUrl = process.env.AURAOS_API_URL || 'http://localhost:5000';
  }

  /**
   * Display system status information
   */
  async status() {
    try {
      console.log(chalk.blue.bold('\n🚀 AuraOS System Status\n'));
      
      const response = await axios.get(`${this.baseUrl}/api/system/status`);
      const status: AuraOSStatus = response.data;

      // System Status
      console.log(chalk.green('📊 System Information:'));
      console.log(`   Status: ${chalk.green(status.system.status)}`);
      console.log(`   Version: ${chalk.blue(status.system.version)}`);
      console.log(`   Uptime: ${chalk.yellow(this.formatUptime(status.system.uptime))}\n`);

      // Autopilot Status
      console.log(chalk.green('🤖 Autopilot System:'));
      console.log(`   Active: ${status.autopilot.active ? chalk.green('✅ Yes') : chalk.red('❌ No')}`);
      console.log(`   Active Rules: ${chalk.blue(status.autopilot.rules)}`);
      console.log(`   Active Workflows: ${chalk.blue(status.autopilot.workflows)}`);
      console.log(`   Last Execution: ${chalk.yellow(status.autopilot.lastExecution)}\n`);

      // AI Agents
      console.log(chalk.green('🧠 AI Agents:'));
      console.log(`   Total Agents: ${chalk.blue(status.ai.agents)}`);
      console.log(`   Active Agents: ${chalk.blue(status.ai.activeAgents)}`);
      console.log(`   Total Tasks: ${chalk.blue(status.ai.totalTasks)}\n`);

      // Performance
      console.log(chalk.green('⚡ Performance:'));
      console.log(`   Memory Usage: ${chalk.blue(status.performance.memory + '%')}`);
      console.log(`   CPU Usage: ${chalk.blue(status.performance.cpu + '%')}`);
      console.log(`   Response Time: ${chalk.blue(status.performance.responseTime + 'ms')}\n`);

    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch system status:'), error.message);
    }
  }

  /**
   * Start interactive chat session with AI agents
   */
  async interactive() {
    console.log(chalk.blue.bold('\n🤖 AuraOS Interactive Chat\n'));
    console.log(chalk.gray('Type "exit" to quit, "help" for commands, "status" for system info\n'));

    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('You:'),
          validate: (input) => input.trim().length > 0 || 'Please enter a message'
        }
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\n👋 Goodbye!'));
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
        console.log(chalk.blue('🤖 AuraOS:'), 'Processing...');
        
        const response = await axios.post(`${this.baseUrl}/api/ai/chat`, {
          message: message,
          context: 'cli_interaction'
        });

        console.log(chalk.green('🤖 AuraOS:'), response.data.response);
        console.log(''); // Empty line for readability

      } catch (error) {
        console.error(chalk.red('❌ Error:'), error.response?.data?.message || error.message);
      }
    }
  }

  /**
   * Run predefined demo interactions
   */
  async demo() {
    console.log(chalk.blue.bold('\n🎭 AuraOS Demo Mode\n'));
    
    const demos = [
      {
        name: 'System Health Check',
        action: async () => {
          console.log(chalk.yellow('🔍 Running system health check...'));
          await this.status();
        }
      },
      {
        name: 'AI Agent Interaction',
        action: async () => {
          console.log(chalk.yellow('🤖 Testing AI agent interaction...'));
          try {
            const response = await axios.post(`${this.baseUrl}/api/ai/chat`, {
              message: 'Hello! Can you help me understand what AuraOS can do?',
              context: 'demo'
            });
            console.log(chalk.green('🤖 AI Response:'), response.data.response);
          } catch (error) {
            console.error(chalk.red('❌ Error:'), error.message);
          }
        }
      },
      {
        name: 'Autopilot Status',
        action: async () => {
          console.log(chalk.yellow('🚀 Checking autopilot status...'));
          try {
            const response = await axios.get(`${this.baseUrl}/api/autopilot/status`);
            console.log(chalk.green('📊 Autopilot:'), JSON.stringify(response.data, null, 2));
          } catch (error) {
            console.error(chalk.red('❌ Error:'), error.message);
          }
        }
      },
      {
        name: 'Workflow Templates',
        action: async () => {
          console.log(chalk.yellow('📋 Fetching workflow templates...'));
          try {
            const response = await axios.get(`${this.baseUrl}/api/workflows/templates`);
            console.log(chalk.green('📋 Templates:'), response.data.length + ' templates available');
          } catch (error) {
            console.error(chalk.red('❌ Error:'), error.message);
          }
        }
      }
    ];

    for (const demo of demos) {
      console.log(chalk.cyan(`\n▶️  ${demo.name}`));
      await demo.action();
      console.log(chalk.gray('─────────────────────────────────────────'));
      
      // Wait a moment between demos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(chalk.green.bold('\n✅ Demo completed successfully!'));
  }

  /**
   * Monitor real-time system events
   */
  async monitor() {
    console.log(chalk.blue.bold('\n📡 AuraOS Real-time Monitor\n'));
    console.log(chalk.gray('Press Ctrl+C to exit monitor mode\n'));

    try {
      this.wsConnection = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/ws`);

      this.wsConnection.on('open', () => {
        console.log(chalk.green('✅ Connected to AuraOS real-time stream'));
      });

      this.wsConnection.on('message', (data) => {
        try {
          const event = JSON.parse(data.toString());
          const timestamp = new Date(event.timestamp).toLocaleTimeString();

          if (event.type === 'log') {
            console.log(chalk.gray(`[${timestamp}]`), event.message);
          } else if (event.type === 'autopilot') {
            console.log(chalk.blue(`[${timestamp}]`), `🤖 Autopilot: ${event.message}`);
          } else if (event.type === 'ai') {
            console.log(chalk.green(`[${timestamp}]`), `🧠 AI: ${event.message}`);
          } else {
            console.log(chalk.yellow(`[${timestamp}]`), `📊 ${event.type}: ${event.message}`);
          }
        } catch (error) {
          console.log(chalk.red('❌ Failed to parse event:'), data.toString());
        }
      });

      this.wsConnection.on('close', () => {
        console.log(chalk.yellow('\n📡 Connection closed'));
      });

      this.wsConnection.on('error', (error) => {
        console.error(chalk.red('❌ WebSocket error:'), error.message);
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to connect to real-time stream:'), error.message);
    }
  }

  /**
   * Start autopilot system
   */
  async autopilotStart() {
    console.log(chalk.blue.bold('\n🚀 Starting AuraOS Autopilot System...\n'));
    try {
      const response = await axios.post(`${this.baseUrl}/api/autopilot/start`);
      console.log(chalk.green('✅ Autopilot system started successfully!'));
      console.log(chalk.blue('📊 Response:'), response.data);
    } catch (error) {
      console.error(chalk.red('❌ Failed to start autopilot:'), error.response?.data?.message || error.message);
    }
  }

  /**
   * Stop autopilot system
   */
  async autopilotStop() {
    console.log(chalk.yellow.bold('\n🛑 Stopping AuraOS Autopilot System...\n'));
    try {
      const response = await axios.post(`${this.baseUrl}/api/autopilot/stop`);
      console.log(chalk.green('✅ Autopilot system stopped successfully!'));
      console.log(chalk.blue('📊 Response:'), response.data);
    } catch (error) {
      console.error(chalk.red('❌ Failed to stop autopilot:'), error.response?.data?.message || error.message);
    }
  }

  /**
   * Get autopilot status
   */
  async autopilotStatus() {
    console.log(chalk.blue.bold('\n🤖 AuraOS Autopilot Status\n'));
    try {
      const response = await axios.get(`${this.baseUrl}/api/autopilot/status`);
      const status = response.data;
      console.log(chalk.green('📊 Autopilot Information:'));
      console.log(`   Status: ${status.active ? chalk.green('✅ Active') : chalk.red('❌ Inactive')}`);
      console.log(`   Active Rules: ${chalk.blue(status.rules || 0)}`);
      console.log(`   Active Workflows: ${chalk.blue(status.workflows || 0)}`);
      console.log(`   Last Execution: ${chalk.yellow(status.lastExecution || 'N/A')}`);
      console.log(`   System Health: ${chalk.blue(status.health || 'Unknown')}\n`);
    } catch (error) {
      console.error(chalk.red('❌ Failed to get autopilot status:'), error.response?.data?.message || error.message);
    }
  }

  /**
   * Monitor autopilot in real-time
   */
  async autopilotMonitor() {
    console.log(chalk.blue.bold('\n📡 AuraOS Autopilot Monitor\n'));
    console.log(chalk.gray('Press Ctrl+C to exit autopilot monitor\n'));
    try {
      this.wsConnection = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/ws/autopilot`);

      this.wsConnection.on('open', () => {
        console.log(chalk.green('✅ Connected to AuraOS autopilot stream'));
      });

      this.wsConnection.on('message', (data) => {
        try {
          const event = JSON.parse(data.toString());
          const timestamp = new Date(event.timestamp).toLocaleTimeString();
          console.log(chalk.blue(`[${timestamp}]`), `🤖 ${event.type}: ${event.message}`);
          if (event.data) {
            console.log(chalk.gray('   Data:'), JSON.stringify(event.data, null, 2));
          }
        } catch (error) {
          console.log(chalk.red('❌ Failed to parse autopilot event:'), data.toString());
        }
      });

      this.wsConnection.on('close', () => {
        console.log(chalk.yellow('\n📡 Autopilot connection closed'));
      });

      this.wsConnection.on('error', (error) => {
        console.error(chalk.red('❌ Autopilot WebSocket error:'), error.message);
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to connect to autopilot stream:'), error.message);
    }
  }

  /**
   * Show autopilot logs
   */
  async autopilotLogs() {
    console.log(chalk.blue.bold('\n📋 AuraOS Autopilot Logs\n'));
    try {
      const response = await axios.get(`${this.baseUrl}/api/autopilot/logs?limit=20`);
      const logs = response.data;
      if (logs.length === 0) {
        console.log(chalk.yellow('📝 No recent logs found'));
        return;
      }
      logs.forEach((log, index) => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const level = log.level.toUpperCase();
        const color = level === 'ERROR' ? chalk.red :
                     level === 'WARN' ? chalk.yellow :
                     level === 'INFO' ? chalk.green : chalk.blue;
        console.log(color(`[${timestamp}] [${level}] ${log.message}`));
        if (log.data) {
          console.log(chalk.gray('   Data:'), JSON.stringify(log.data, null, 2));
        }
      });
    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch autopilot logs:'), error.response?.data?.message || error.message);
    }
  }

  /**
   * AI Chat for autopilot assistance
   */
  async autopilotAIChat() {
    console.log(chalk.blue.bold('\n🤖 AuraOS AI Assistant\n'));
    console.log(chalk.gray('Type "exit" to quit, "help" for commands\n'));
    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('You:'),
          validate: (input) => input.trim().length > 0 || 'Please enter a message'
        }
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\n👋 Goodbye!'));
        break;
      }

      if (message.toLowerCase() === 'help') {
        console.log(chalk.green('Available commands:'));
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
        console.log(chalk.blue('🤖 AI:'), 'Thinking...');

        const response = await axios.post(`${this.baseUrl}/api/ai/autopilot-chat`, {
          message: message,
          context: 'autopilot_assistance'
        });

        console.log(chalk.green('🤖 AI:'), response.data.response);
      } catch (error) {
        console.error(chalk.red('❌ AI Error:'), error.response?.data?.message || error.message);
      }
    }
  }

  /**
   * AI Analysis of autopilot performance
   */
  async autopilotAIAnalyze() {
    console.log(chalk.blue.bold('\n🧠 AI Performance Analysis\n'));
    try {
      console.log(chalk.yellow('🔍 Analyzing autopilot performance...'));
      const response = await axios.post(`${this.baseUrl}/api/ai/autopilot-analyze`);
      const analysis = response.data;
      console.log(chalk.green('📊 Analysis Results:'));
      console.log(`   Overall Health: ${chalk.blue(analysis.health)}`);
      console.log(`   Performance Score: ${chalk.blue(analysis.score + '/100')}`);
      console.log(`   Recommendations: ${chalk.yellow(analysis.recommendations.length)} found`);
      analysis.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${chalk.cyan(rec)}`);
      });
    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'), error.response?.data?.message || error.message);
    }
  }

  /**
   * Interactive LLM chat for autopilot
   */
  async autopilotLLMChat() {
    console.log(chalk.blue.bold('\n🤖 Autopilot LLM Assistant\n'));
    console.log(chalk.gray('Type "exit" to quit, "help" for commands, "analyze" for system analysis\n'));

    // Import the AutopilotLLMIntegration
    const { AutopilotLLMIntegration } = await import('./autopilot-llm-integration.js');
    const autopilotLLM = new AutopilotLLMIntegration();

    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('You:'),
          validate: (input) => input.trim().length > 0 || 'Please enter a message'
        }
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\n👋 Goodbye!'));
        break;
      }

      if (message.toLowerCase() === 'help') {
        console.log(chalk.green('Available commands:'));
        console.log('  help - Show this help');
        console.log('  exit - Exit chat');
        console.log('  analyze - Analyze system performance');
        console.log('  status - Show autopilot status');
        continue;
      }

      if (message.toLowerCase() === 'analyze') {
        await this.autopilotLLMAnalyze();
        continue;
      }

      if (message.toLowerCase() === 'status') {
        await this.autopilotLLMStatus();
        continue;
      }

      try {
        console.log(chalk.blue('🤖 Autopilot LLM:'), 'Thinking...');

        const response = await autopilotLLM.autopilotChat(message);
        console.log(chalk.green('🤖 Autopilot LLM:'), response);
        console.log(''); // Empty line for readability

      } catch (error: any) {
        console.error(chalk.red('❌ Error:'), error.message);
      }
    }
  }

  /**
   * LLM-based system analysis
   */
  async autopilotLLMAnalyze() {
    console.log(chalk.blue.bold('\n📊 LLM System Analysis\n'));

    try {
      // Import the AutopilotLLMIntegration
      const { AutopilotLLMIntegration } = await import('./autopilot-llm-integration.js');
      const autopilotLLM = new AutopilotLLMIntegration();

      console.log(chalk.yellow('🔍 Analyzing system performance with LLM...'));
      const analysis = await autopilotLLM.analyzeSystemPerformance();

      console.log(chalk.green('📊 Analysis Results:\n'));
      console.log(`Overall Health: ${chalk.blue(analysis.overall_health)}`);
      console.log(`Performance Score: ${chalk.blue(analysis.performance_score + '/100')}`);

      if (analysis.key_metrics) {
        console.log(`Efficiency: ${chalk.blue(analysis.key_metrics.efficiency)}`);
        console.log(`Reliability: ${chalk.blue(analysis.key_metrics.reliability)}`);
        console.log(`Scalability: ${chalk.blue(analysis.key_metrics.scalability)}`);
      }

      if (analysis.bottlenecks.length > 0) {
        console.log(chalk.yellow('\n🚧 Bottlenecks:'));
        analysis.bottlenecks.forEach((bottleneck, index) => {
          console.log(`  ${index + 1}. ${bottleneck}`);
        });
      }

      if (analysis.recommendations.length > 0) {
        console.log(chalk.green('\n💡 Recommendations:'));
        analysis.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }

    } catch (error: any) {
      console.error(chalk.red('❌ Analysis failed:'), error.message);
    }
  }

  /**
   * Ask LLM a specific question
   */
  async autopilotLLMAsk(question: string) {
    try {
      console.log(chalk.blue('🤔 Asking LLM:'), question);

      // Import the AutopilotLLMIntegration
      const { AutopilotLLMIntegration } = await import('./autopilot-llm-integration.js');
      const autopilotLLM = new AutopilotLLMIntegration();

      const response = await autopilotLLM.autopilotChat(question);
      console.log(chalk.green('\n🤖 Autopilot LLM Response:\n'));
      console.log(response);

    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  }

  /**
   * Show autopilot LLM status
   */
  async autopilotLLMStatus() {
    console.log(chalk.blue.bold('\n🤖 Autopilot LLM Status\n'));

    try {
      // Import the AutopilotLLMIntegration
      const { AutopilotLLMIntegration } = await import('./autopilot-llm-integration.js');
      const autopilotLLM = new AutopilotLLMIntegration();

      const config = autopilotLLM.getConfig();

      console.log(chalk.green('📊 LLM Configuration:'));
      console.log(`   Enabled: ${config.enabled ? chalk.green('✅ Yes') : chalk.red('❌ No')}`);
      console.log(`   Provider: ${chalk.blue(config.defaultProvider)}`);
      console.log(`   Max Tokens: ${chalk.blue(config.limits.maxTokens)}`);
      console.log(`   Timeout: ${chalk.blue(config.limits.timeout + 'ms')}`);
      console.log(`   Retries: ${chalk.blue(config.limits.retries)}`);

      // Test LLM connectivity
      console.log(chalk.yellow('\n🔍 Testing LLM connectivity...'));
      try {
        const response = await autopilotLLM.generateIntelligentResponse('Hello, are you working?', { test: true });
        console.log(chalk.green('✅ LLM is responding'));
        console.log(chalk.gray('Response:'), response.substring(0, 100) + '...');
      } catch (error) {
        console.log(chalk.red('❌ LLM connection failed'));
        console.log(chalk.yellow('💡 Check your environment variables and API keys'));
      }

    } catch (error: any) {
      console.error(chalk.red('❌ Status check failed:'), error.message);
    }
  }

  /**
   * Run comprehensive system audit
   */
  async systemAudit() {
    console.log(chalk.blue.bold('\n🔍 AuraOS System Audit\n'));
    console.log(chalk.gray('Running comprehensive system analysis...\n'));

    try {
      // Import and run the audit tool
      const { AuraOSSystemAuditor } = await import('./auraos-system-audit.js');
      const auditor = new AuraOSSystemAuditor();
      
      const report = await auditor.runFullAudit();
      auditor.displayReport();
      
      // Save report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await auditor.saveReport(`auraos-audit-${timestamp}.json`);
      
      console.log(chalk.green.bold('\n✅ System audit completed successfully!'));
      
    } catch (error: any) {
      console.error(chalk.red('❌ Audit failed:'), error.message);
      
      // Fallback to basic checks
      console.log(chalk.yellow('\n🔄 Running basic system checks...'));
      await this.basicSystemCheck();
    }
  }

  /**
   * Basic system check fallback
   */
  private async basicSystemCheck() {
    const checks = [
      {
        name: 'Environment Variables',
        check: () => {
          const required = ['FIREBASE_PROJECT_ID', 'TELEGRAM_BOT_TOKEN', 'GOOGLE_AI_API_KEY'];
          const missing = required.filter(key => !process.env[key] || process.env[key]?.includes('your_'));
          return missing.length === 0 ? '✅ All configured' : `❌ Missing: ${missing.join(', ')}`;
        }
      },
      {
        name: 'Package.json',
        check: async () => {
          try {
            await fs.access('package.json');
            return '✅ Present';
          } catch {
            return '❌ Missing';
          }
        }
      },
      {
        name: 'CLI Files',
        check: async () => {
          try {
            await fs.access('cli.ts');
            await fs.access('cli.js');
            return '✅ Present';
          } catch {
            return '❌ Missing';
          }
        }
      },
      {
        name: 'API Server',
        check: async () => {
          try {
            await axios.get(`${this.baseUrl}/api/system/status`, { timeout: 3000 });
            return '✅ Running';
          } catch {
            return '❌ Not responding';
          }
        }
      }
    ];

    console.log(chalk.blue('📋 Basic System Check Results:\n'));
    
    for (const check of checks) {
      const result = await check.check();
      console.log(`${result} ${check.name}`);
    }
    
    console.log(chalk.yellow('\n💡 Suggestions:'));
    console.log('1. Configure missing environment variables');
    console.log('2. Install dependencies: npm install');
    console.log('3. Start server: npm run dev');
    console.log('4. Test CLI: npm run cli:status');
  }

  /**
   * Show help information
   */
  private showHelp() {
    console.log(chalk.blue.bold('\n📚 AuraOS CLI Help\n'));
    console.log(chalk.green('Available Commands:'));
    console.log('  help     - Show this help message');
    console.log('  status   - Display system status');
    console.log('  exit     - Exit the interactive session');
    console.log('\n' + chalk.green('CLI Commands:'));
    console.log('  auraos status     - Show system status');
    console.log('  auraos interactive - Start interactive chat');
    console.log('  auraos demo       - Run demo interactions');
    console.log('  auraos monitor    - Monitor real-time events');
    console.log('\n' + chalk.green('Autopilot Commands:'));
    console.log('  auraos autopilot start    - Start autopilot system');
    console.log('  auraos autopilot stop     - Stop autopilot system');
    console.log('  auraos autopilot status   - Show autopilot status');
    console.log('  auraos autopilot monitor  - Monitor autopilot in real-time');
    console.log('  auraos autopilot logs     - Show autopilot logs');
    console.log('  auraos autopilot ai chat  - Chat with AI assistant');
    console.log('  auraos autopilot ai analyze - AI performance analysis');
    console.log('\n' + chalk.green('System Commands:'));
    console.log('  auraos audit              - Run comprehensive system audit');
    console.log('  auraos audit quick        - Run quick system check');
    console.log('');
  }

  /**
   * Format uptime in human readable format
   */
  private formatUptime(seconds: number): string {
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

  /**
   * Stock: check AAPL once and optionally notify
   */
  async stocksCheckOnce() {
    const { checkOnce } = await import('./stock-monitor.js');
    await checkOnce('AAPL', true);
  }

  /**
   * Stock: watch AAPL with Telegram alerts
   */
  async stocksWatch(intervalSec?: number, thresholdPct?: number) {
    const { watchSymbol } = await import('./stock-monitor.js');
    const stop = await watchSymbol('AAPL', {
      intervalMs: (intervalSec ? intervalSec * 1000 : undefined),
      telegram: true,
      thresholdPercent: thresholdPct ?? 0
    });

    process.on('SIGINT', () => {
      stop();
      console.log(chalk.yellow('\n🛑 Stopped AAPL monitor'));
      process.exit(0);
    });
  }

  /**
   * GitHub: Get repository information
   */
  async githubRepoInfo() {
    console.log(chalk.blue.bold('\n📊 GitHub Repository Information\n'));
    try {
      const { GitHubAutopilotIntegration } = await import('./server/github-autopilot-integration.js');
      const githubIntegration = new GitHubAutopilotIntegration(
        process.env.GITHUB_TOKEN || '',
        process.env.GITHUB_OWNER || '',
        process.env.GITHUB_REPO || '',
        {} as any // Telegram service placeholder
      );
      
      const info = await githubIntegration.getRepositoryInfo();
      if (info.success) {
        console.log(chalk.green('📊 Repository Details:'));
        console.log(`   Name: ${chalk.blue(info.repository.name)}`);
        console.log(`   Full Name: ${chalk.blue(info.repository.full_name)}`);
        console.log(`   Description: ${chalk.yellow(info.repository.description || 'No description')}`);
        console.log(`   Language: ${chalk.blue(info.repository.language || 'Mixed')}`);
        console.log(`   Stars: ${chalk.green(info.repository.stars)}`);
        console.log(`   Forks: ${chalk.green(info.repository.forks)}`);
        console.log(`   Watchers: ${chalk.green(info.repository.watchers)}`);
        console.log(`   Open Issues: ${chalk.yellow(info.repository.open_issues)}`);
        console.log(`   Contributors: ${chalk.blue(info.repository.contributors)}`);
        console.log(`   Created: ${chalk.gray(info.repository.created_at)}`);
        console.log(`   Updated: ${chalk.gray(info.repository.updated_at)}\n`);
      } else {
        console.error(chalk.red('❌ Failed to get repository info:'), info.error);
      }
    } catch (error: any) {
      console.error(chalk.red('❌ GitHub integration error:'), error.message);
      console.log(chalk.yellow('💡 Make sure GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are set in .env'));
    }
  }

  /**
   * GitHub: List issues
   */
  async githubIssues(state: string = 'open') {
    console.log(chalk.blue.bold(`\n🐛 GitHub Issues (${state})\n`));
    try {
      const { GitHubAutopilotIntegration } = await import('./server/github-autopilot-integration.js');
      const githubIntegration = new GitHubAutopilotIntegration(
        process.env.GITHUB_TOKEN || '',
        process.env.GITHUB_OWNER || '',
        process.env.GITHUB_REPO || '',
        {} as any
      );
      
      const issues = await githubIntegration.createIssue('', '', []); // This will use the MCP tool
      if (issues.success) {
        console.log(chalk.green(`📋 Found ${issues.count} ${state} issues:`));
        issues.issues.slice(0, 10).forEach((issue: any, index: number) => {
          console.log(`   ${index + 1}. ${chalk.blue(`#${issue.number}`)} ${issue.title}`);
          console.log(`      Author: ${chalk.gray(issue.user.login)}`);
          console.log(`      Labels: ${issue.labels.map((l: any) => l.name).join(', ') || 'None'}`);
          console.log(`      URL: ${chalk.gray(issue.html_url)}\n`);
        });
      } else {
        console.error(chalk.red('❌ Failed to list issues:'), issues.error);
      }
    } catch (error: any) {
      console.error(chalk.red('❌ GitHub integration error:'), error.message);
    }
  }

  /**
   * GitHub: List pull requests
   */
  async githubPullRequests() {
    console.log(chalk.blue.bold('\n🔀 GitHub Pull Requests\n'));
    try {
      const { GitHubAutopilotIntegration } = await import('./server/github-autopilot-integration.js');
      const githubIntegration = new GitHubAutopilotIntegration(
        process.env.GITHUB_TOKEN || '',
        process.env.GITHUB_OWNER || '',
        process.env.GITHUB_REPO || '',
        {} as any
      );
      
      const prs = await githubIntegration.createPullRequest('', '', '', ''); // This will use the MCP tool
      if (prs.success) {
        console.log(chalk.green(`📋 Found ${prs.count} open pull requests:`));
        prs.pull_requests.slice(0, 10).forEach((pr: any, index: number) => {
          console.log(`   ${index + 1}. ${chalk.blue(`#${pr.number}`)} ${pr.title}`);
          console.log(`      Author: ${chalk.gray(pr.user.login)}`);
          console.log(`      Branch: ${chalk.yellow(pr.head.ref)} → ${chalk.yellow(pr.base.ref)}`);
          console.log(`      Status: ${chalk.green(pr.state)}`);
          console.log(`      URL: ${chalk.gray(pr.html_url)}\n`);
        });
      } else {
        console.error(chalk.red('❌ Failed to list pull requests:'), prs.error);
      }
    } catch (error: any) {
      console.error(chalk.red('❌ GitHub integration error:'), error.message);
    }
  }

  /**
   * GitHub: Analyze code
   */
  async githubAnalyzeCode(path: string, analysisType: string = 'quality') {
    console.log(chalk.blue.bold(`\n🔍 GitHub Code Analysis: ${path}\n`));
    try {
      const { GitHubAutopilotIntegration } = await import('./server/github-autopilot-integration.js');
      const githubIntegration = new GitHubAutopilotIntegration(
        process.env.GITHUB_TOKEN || '',
        process.env.GITHUB_OWNER || '',
        process.env.GITHUB_REPO || '',
        {} as any
      );
      
      const analysis = await githubIntegration.analyzeCode(path, analysisType);
      if (analysis.success) {
        console.log(chalk.green('📊 Analysis Results:'));
        console.log(`   Path: ${chalk.blue(analysis.path)}`);
        console.log(`   Type: ${chalk.blue(analysis.analysis_type)}`);
        console.log(`   Language: ${chalk.blue(analysis.language)}`);
        
        if (analysis.results.score) {
          console.log(`   Score: ${chalk.green(analysis.results.score)}/100`);
        }
        
        if (analysis.results.issues && analysis.results.issues.length > 0) {
          console.log(chalk.yellow('\n⚠️ Issues Found:'));
          analysis.results.issues.forEach((issue: string, index: number) => {
            console.log(`   ${index + 1}. ${issue}`);
          });
        }
        
        if (analysis.results.recommendations && analysis.results.recommendations.length > 0) {
          console.log(chalk.green('\n💡 Recommendations:'));
          analysis.results.recommendations.forEach((rec: string, index: number) => {
            console.log(`   ${index + 1}. ${rec}`);
          });
        }
      } else {
        console.error(chalk.red('❌ Failed to analyze code:'), analysis.error);
      }
    } catch (error: any) {
      console.error(chalk.red('❌ GitHub integration error:'), error.message);
    }
  }

  /**
   * GitHub: Start autopilot integration
   */
  async githubStartAutopilot() {
    console.log(chalk.blue.bold('\n🚀 Starting GitHub Autopilot Integration\n'));
    try {
      const { GitHubAutopilotIntegration } = await import('./server/github-autopilot-integration.js');
      const { TelegramService } = await import('./server/telegram.js');
      
      const telegramService = new TelegramService();
      const githubIntegration = new GitHubAutopilotIntegration(
        process.env.GITHUB_TOKEN || '',
        process.env.GITHUB_OWNER || '',
        process.env.GITHUB_REPO || '',
        telegramService
      );
      
      await githubIntegration.start();
      console.log(chalk.green('✅ GitHub Autopilot Integration started successfully!'));
      console.log(chalk.blue('📊 Monitoring:'));
      console.log('   - New issues every 5 minutes');
      console.log('   - Pull requests every 3 minutes');
      console.log('   - Repository performance every 30 minutes');
      console.log('   - Security scans every hour');
      
      // Keep process alive
      process.on('SIGINT', async () => {
        await githubIntegration.stop();
        console.log(chalk.yellow('\n🛑 GitHub Autopilot Integration stopped'));
        process.exit(0);
      });
      
    } catch (error: any) {
      console.error(chalk.red('❌ Failed to start GitHub integration:'), error.message);
      console.log(chalk.yellow('💡 Make sure GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are set in .env'));
    }
  }
}

// CLI Setup
const program = new Command();
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
      console.log(chalk.yellow('\n👋 Monitor stopped'));
      process.exit(0);
    });
  });

// Autopilot Commands
program
  .command('autopilot')
  .description('Autopilot system management')
  .addCommand(new Command('start')
    .description('Start autopilot system')
    .action(async () => {
      await cli.autopilotStart();
      process.exit(0);
    }))
  .addCommand(new Command('stop')
    .description('Stop autopilot system')
    .action(async () => {
      await cli.autopilotStop();
      process.exit(0);
    }))
  .addCommand(new Command('status')
    .description('Show autopilot status')
    .action(async () => {
      await cli.autopilotStatus();
      process.exit(0);
    }))
  .addCommand(new Command('monitor')
    .description('Monitor autopilot in real-time')
    .action(async () => {
      await cli.autopilotMonitor();
      // Keep process alive for WebSocket connection
      process.on('SIGINT', () => {
        cli.cleanup();
        console.log(chalk.yellow('\n👋 Autopilot monitor stopped'));
        process.exit(0);
      });
    }))
  .addCommand(new Command('logs')
    .description('Show autopilot logs')
    .action(async () => {
      await cli.autopilotLogs();
      process.exit(0);
    }))
  .addCommand(new Command('ai')
    .description('AI assistance for autopilot')
    .addCommand(new Command('chat')
      .description('Chat with AI assistant')
      .action(async () => {
        await cli.autopilotAIChat();
        process.exit(0);
      }))
    .addCommand(new Command('analyze')
      .description('AI performance analysis')
      .action(async () => {
        await cli.autopilotAIAnalyze();
        process.exit(0);
      }))
    .addCommand(new Command('llm')
      .description('LLM integration for autopilot')
      .addCommand(new Command('chat')
        .description('Interactive chat with autopilot LLM')
        .action(async () => {
          await cli.autopilotLLMChat();
          process.exit(0);
        }))
      .addCommand(new Command('analyze')
        .description('Analyze system performance with LLM')
        .action(async () => {
          await cli.autopilotLLMAnalyze();
          process.exit(0);
        }))
      .addCommand(new Command('ask')
        .description('Ask a question to the autopilot LLM')
        .argument('<question>', 'Question to ask')
        .action(async (question) => {
          await cli.autopilotLLMAsk(question);
          process.exit(0);
        }))
      .addCommand(new Command('status')
        .description('Show autopilot LLM status')
        .action(async () => {
          await cli.autopilotLLMStatus();
          process.exit(0);
        })));

// System Commands
program
  .command('audit')
  .description('System audit and analysis')
  .addCommand(new Command('run')
    .description('Run comprehensive system audit')
    .option('-s, --save <filename>', 'Save report to file')
    .action(async (options) => {
      await cli.systemAudit();
      process.exit(0);
    }))
  .addCommand(new Command('quick')
    .description('Run quick system check')
    .action(async () => {
      await cli.basicSystemCheck();
      process.exit(0);
    }));

// GitHub Commands
program
  .command('github')
  .description('GitHub integration and management')
  .addCommand(new Command('info')
    .description('Get repository information')
    .action(async () => {
      await cli.githubRepoInfo();
      process.exit(0);
    }))
  .addCommand(new Command('issues')
    .description('List GitHub issues')
    .option('-s, --state <state>', 'Filter by state (open, closed, all)', 'open')
    .action(async (options) => {
      await cli.githubIssues(options.state);
      process.exit(0);
    }))
  .addCommand(new Command('prs')
    .description('List pull requests')
    .action(async () => {
      await cli.githubPullRequests();
      process.exit(0);
    }))
  .addCommand(new Command('analyze')
    .description('Analyze code quality')
    .argument('<path>', 'File or directory path to analyze')
    .option('-t, --type <type>', 'Analysis type (quality, security, performance)', 'quality')
    .action(async (path, options) => {
      await cli.githubAnalyzeCode(path, options.type);
      process.exit(0);
    }))
  .addCommand(new Command('autopilot')
    .description('Start GitHub autopilot integration')
    .action(async () => {
      await cli.githubStartAutopilot();
      // Keep process alive for monitoring
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n🛑 GitHub Autopilot Integration stopped'));
        process.exit(0);
      });
    }));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error.message);
  cli.cleanup();
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('❌ Unhandled Rejection:'), reason);
  cli.cleanup();
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
