#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// AuraOS MCP Server for Cursor IDE
class AuraOSMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'auraos-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'auraos_workflow_list',
            description: 'List all AuraOS workflows',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'auraos_service_restart',
            description: 'Restart an AuraOS service',
            inputSchema: {
              type: 'object',
              properties: {
                service: {
                  type: 'string',
                  description: 'Name of the service to restart',
                },
              },
              required: ['service'],
            },
          },
          {
            name: 'auraos_get_metrics',
            description: 'Get AuraOS system metrics',
            inputSchema: {
              type: 'object',
              properties: {
                metric_type: {
                  type: 'string',
                  description: 'Type of metrics to retrieve',
                  enum: ['system', 'workflow', 'performance'],
                },
              },
            },
          },
          {
            name: 'auraos_get_logs',
            description: 'Get AuraOS system logs',
            inputSchema: {
              type: 'object',
              properties: {
                level: {
                  type: 'string',
                  description: 'Log level filter',
                  enum: ['debug', 'info', 'warn', 'error'],
                },
                lines: {
                  type: 'number',
                  description: 'Number of log lines to retrieve',
                  default: 100,
                },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'auraos_workflow_list':
            return await this.listWorkflows();
          
          case 'auraos_service_restart':
            return await this.restartService(args.service);
          
          case 'auraos_get_metrics':
            return await this.getMetrics(args.metric_type || 'system');
          
          case 'auraos_get_logs':
            return await this.getLogs(args.level || 'info', args.lines || 100);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async listWorkflows() {
    // Mock implementation - replace with actual API call
    const workflows = [
      { id: 'wf-001', name: 'Data Processing Pipeline', status: 'active' },
      { id: 'wf-002', name: 'User Authentication Flow', status: 'active' },
      { id: 'wf-003', name: 'Report Generation', status: 'paused' },
    ];

    return {
      content: [
        {
          type: 'text',
          text: `AuraOS Workflows:\n${workflows.map(w => `- ${w.name} (${w.id}) - ${w.status}`).join('\n')}`,
        },
      ],
    };
  }

  private async restartService(service: string) {
    // Mock implementation - replace with actual API call
    return {
      content: [
        {
          type: 'text',
          text: `Service '${service}' restart initiated successfully.`,
        },
      ],
    };
  }

  private async getMetrics(metricType: string) {
    // Mock implementation - replace with actual API call
    const metrics = {
      system: { cpu: '45%', memory: '2.1GB', disk: '78%' },
      workflow: { active: 3, completed: 156, failed: 2 },
      performance: { avg_response: '120ms', throughput: '45 req/s' },
    };

    return {
      content: [
        {
          type: 'text',
          text: `${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Metrics:\n${JSON.stringify(metrics[metricType as keyof typeof metrics], null, 2)}`,
        },
      ],
    };
  }

  private async getLogs(level: string, lines: number) {
    // Mock implementation - replace with actual API call
    const logs = [
      `[${new Date().toISOString()}] [${level.toUpperCase()}] AuraOS service started`,
      `[${new Date().toISOString()}] [INFO] Workflow 'Data Processing' completed`,
      `[${new Date().toISOString()}] [${level.toUpperCase()}] System health check passed`,
    ];

    return {
      content: [
        {
          type: 'text',
          text: `Recent Logs (${level} level, ${lines} lines):\n${logs.join('\n')}`,
        },
      ],
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AuraOS MCP Server running on stdio');
  }
}

// Start the server
const server = new AuraOSMCPServer();
server.run().catch(console.error);
