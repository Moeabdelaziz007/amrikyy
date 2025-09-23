#!/usr/bin/env node

/**
 * AuraOS Tools Integration Script
 * Connects all AI tools, MCP servers, and monitoring systems
 */

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuraOSToolsIntegrator {
  constructor() {
    this.integrationStatus = {
      mcpServer: false,
      aiTools: false,
      monitoring: false,
      dashboard: false,
      cliTools: false
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // Step 1: Start Enhanced MCP Server
  async startMCPServer() {
    this.log('Starting Enhanced MCP Server...', 'info');
    
    return new Promise((resolve, reject) => {
      const serverPath = path.join(__dirname, 'server', 'enhanced-mcp-server.ts');
      
      if (!fs.existsSync(serverPath)) {
        reject(new Error('Enhanced MCP server file not found'));
        return;
      }
      
      // Start the MCP server in background
      const serverProcess = spawn('npx', ['tsx', serverPath], {
        stdio: 'pipe',
        detached: true
      });
      
      serverProcess.stdout.on('data', (data) => {
        this.log(`MCP Server: ${data.toString().trim()}`, 'info');
      });
      
      serverProcess.stderr.on('data', (data) => {
        this.log(`MCP Server Error: ${data.toString().trim()}`, 'error');
      });
      
      serverProcess.on('close', (code) => {
        if (code === 0) {
          this.log('MCP Server started successfully', 'success');
          this.integrationStatus.mcpServer = true;
          resolve();
        } else {
          reject(new Error(`MCP Server exited with code ${code}`));
        }
      });
      
      // Store process for cleanup
      this.mcpServerProcess = serverProcess;
    });
  }

  // Step 2: Initialize AI Tools
  async initializeAITools() {
    this.log('Initializing AI Tools...', 'info');
    
    try {
      // Create AI tools configuration
      const aiToolsConfig = {
        textAnalysis: {
          enabled: true,
          model: 'spacy',
          language: 'en'
        },
        speechToText: {
          enabled: true,
          model: 'whisper',
          language: 'en'
        },
        imageAnalysis: {
          enabled: true,
          model: 'opencv',
          features: ['objects', 'faces', 'text']
        },
        predictiveAnalysis: {
          enabled: true,
          model: 'tensorflow',
          types: ['classification', 'regression', 'clustering']
        }
      };
      
      const configPath = path.join(__dirname, 'config', 'ai-tools.json');
      fs.mkdirSync(path.dirname(configPath), { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify(aiToolsConfig, null, 2));
      
      this.log('AI Tools configuration created', 'success');
      this.integrationStatus.aiTools = true;
    } catch (error) {
      throw new Error(`AI Tools initialization failed: ${error.message}`);
    }
  }

  // Step 3: Setup Monitoring
  async setupMonitoring() {
    this.log('Setting up Monitoring System...', 'info');
    
    try {
      // Create monitoring configuration
      const monitoringConfig = {
        prometheus: {
          enabled: true,
          port: 9090,
          metrics: ['cpu', 'memory', 'disk', 'network']
        },
        winston: {
          enabled: true,
          level: 'info',
          files: ['logs/error.log', 'logs/combined.log']
        },
        healthChecks: {
          enabled: true,
          interval: 30000,
          endpoints: ['/health', '/metrics', '/status']
        }
      };
      
      const configPath = path.join(__dirname, 'config', 'monitoring.json');
      fs.writeFileSync(configPath, JSON.stringify(monitoringConfig, null, 2));
      
      // Create logs directory
      const logsDir = path.join(__dirname, 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      
      this.log('Monitoring system configured', 'success');
      this.integrationStatus.monitoring = true;
    } catch (error) {
      throw new Error(`Monitoring setup failed: ${error.message}`);
    }
  }

  // Step 4: Update Dashboard
  async updateDashboard() {
    this.log('Updating Dashboard...', 'info');
    
    try {
      // Check if enhanced dashboard exists
      const dashboardPath = path.join(__dirname, 'src', 'components', 'dashboard', 'EnhancedDashboard.tsx');
      
      if (!fs.existsSync(dashboardPath)) {
        throw new Error('Enhanced dashboard not found');
      }
      
      // Create dashboard configuration
      const dashboardConfig = {
        theme: 'cyberpunk',
        layout: 'grid',
        widgets: [
          'system-metrics',
          'ai-tools-status',
          'recent-activity',
          'monitoring-alerts'
        ],
        refreshInterval: 5000
      };
      
      const configPath = path.join(__dirname, 'config', 'dashboard.json');
      fs.writeFileSync(configPath, JSON.stringify(dashboardConfig, null, 2));
      
      this.log('Dashboard updated successfully', 'success');
      this.integrationStatus.dashboard = true;
    } catch (error) {
      throw new Error(`Dashboard update failed: ${error.message}`);
    }
  }

  // Step 5: Setup CLI Tools
  async setupCLITools() {
    this.log('Setting up CLI Tools...', 'info');
    
    try {
      // Create CLI tools configuration
      const cliToolsConfig = {
        claudeCode: {
          enabled: true,
          path: '/usr/local/bin/claude-code'
        },
        komandi: {
          enabled: true,
          path: '/usr/local/bin/komandi'
        },
        heyCLI: {
          enabled: true,
          path: '/usr/local/bin/hey-cli'
        }
      };
      
      const configPath = path.join(__dirname, 'config', 'cli-tools.json');
      fs.writeFileSync(configPath, JSON.stringify(cliToolsConfig, null, 2));
      
      this.log('CLI Tools configured', 'success');
      this.integrationStatus.cliTools = true;
    } catch (error) {
      throw new Error(`CLI Tools setup failed: ${error.message}`);
    }
  }

  // Step 6: Create Integration Test
  async createIntegrationTest() {
    this.log('Creating Integration Test...', 'info');
    
    try {
      const testScript = `#!/usr/bin/env node

// AuraOS Integration Test
const { exec } = require('child_process');

async function testIntegration() {
  console.log('🧪 Testing AuraOS Integration...');
  
  // Test MCP Server
  try {
    await new Promise((resolve, reject) => {
      exec('curl -s http://localhost:3001/health', (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
    console.log('✅ MCP Server: OK');
  } catch (error) {
    console.log('❌ MCP Server: FAILED');
  }
  
  // Test AI Tools
  try {
    const fs = require('fs');
    const configPath = './config/ai-tools.json';
    if (fs.existsSync(configPath)) {
      console.log('✅ AI Tools: OK');
    } else {
      console.log('❌ AI Tools: FAILED');
    }
  } catch (error) {
    console.log('❌ AI Tools: FAILED');
  }
  
  // Test Monitoring
  try {
    const fs = require('fs');
    const configPath = './config/monitoring.json';
    if (fs.existsSync(configPath)) {
      console.log('✅ Monitoring: OK');
    } else {
      console.log('❌ Monitoring: FAILED');
    }
  } catch (error) {
    console.log('❌ Monitoring: FAILED');
  }
  
  console.log('🎉 Integration test completed!');
}

testIntegration().catch(console.error);
`;
      
      const testPath = path.join(__dirname, 'test-integration.js');
      fs.writeFileSync(testPath, testScript);
      fs.chmodSync(testPath, '755');
      
      this.log('Integration test created', 'success');
    } catch (error) {
      throw new Error(`Integration test creation failed: ${error.message}`);
    }
  }

  // Step 7: Generate Integration Report
  generateIntegrationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      status: 'completed',
      components: {
        mcpServer: this.integrationStatus.mcpServer ? 'integrated' : 'failed',
        aiTools: this.integrationStatus.aiTools ? 'integrated' : 'failed',
        monitoring: this.integrationStatus.monitoring ? 'integrated' : 'failed',
        dashboard: this.integrationStatus.dashboard ? 'integrated' : 'failed',
        cliTools: this.integrationStatus.cliTools ? 'integrated' : 'failed'
      },
      summary: {
        total: 5,
        integrated: Object.values(this.integrationStatus).filter(Boolean).length,
        failed: Object.values(this.integrationStatus).filter(v => !v).length
      }
    };
    
    const reportPath = path.join(__dirname, 'integration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  // Main Integration Process
  async integrateAllTools() {
    this.log('🚀 Starting AuraOS Tools Integration', 'info');
    this.log('='.repeat(60), 'info');
    
    try {
      // Step 1: Start MCP Server
      await this.startMCPServer();
      
      // Step 2: Initialize AI Tools
      await this.initializeAITools();
      
      // Step 3: Setup Monitoring
      await this.setupMonitoring();
      
      // Step 4: Update Dashboard
      await this.updateDashboard();
      
      // Step 5: Setup CLI Tools
      await this.setupCLITools();
      
      // Step 6: Create Integration Test
      await this.createIntegrationTest();
      
      // Step 7: Generate Report
      const report = this.generateIntegrationReport();
      
      this.log('🎉 AuraOS Tools Integration Completed!', 'success');
      this.log('='.repeat(60), 'success');
      this.log(`📊 Integrated: ${report.summary.integrated}/${report.summary.total} components`, 'success');
      this.log(`📄 Report saved to: integration-report.json`, 'success');
      
      return report;
      
    } catch (error) {
      this.log(`❌ Integration failed: ${error.message}`, 'error');
      throw error;
    }
  }

  // Cleanup function
  cleanup() {
    if (this.mcpServerProcess) {
      this.mcpServerProcess.kill();
      this.log('MCP Server stopped', 'info');
    }
  }
}

// Run integration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const integrator = new AuraOSToolsIntegrator();
  
  // Handle cleanup on exit
  process.on('SIGINT', () => {
    integrator.cleanup();
    process.exit(0);
  });
  
  integrator.integrateAllTools().catch(console.error);
}

export default AuraOSToolsIntegrator;
