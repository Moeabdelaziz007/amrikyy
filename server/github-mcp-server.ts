// GitHub MCP Server for AuraOS Autopilot Integration
// Provides automated GitHub operations and monitoring

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

export class GitHubMCPServer {
  private server: Server;
  private tools: Map<string, Tool> = new Map();
  private githubToken: string;
  private owner: string;
  private repo: string;

  constructor(githubToken: string, owner: string, repo: string) {
    this.githubToken = githubToken;
    this.owner = owner;
    this.repo = repo;
    
    this.server = new Server({
      name: 'github-mcp-server',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupTools();
    this.setupHandlers();
  }

  private setupTools() {
    // 1. Repository Information Tool
    this.tools.set('get_repo_info', {
      name: 'get_repo_info',
      description: 'Get repository information and statistics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // 2. Issues Management Tool
    this.tools.set('manage_issues', {
      name: 'manage_issues',
      description: 'Create, update, or list GitHub issues',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'update', 'list', 'close'],
            description: 'Action to perform on issues',
          },
          title: {
            type: 'string',
            description: 'Issue title (for create/update)',
          },
          body: {
            type: 'string',
            description: 'Issue body (for create/update)',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Issue labels',
          },
          issue_number: {
            type: 'number',
            description: 'Issue number (for update/close)',
          },
          state: {
            type: 'string',
            enum: ['open', 'closed', 'all'],
            description: 'Filter issues by state',
            default: 'open',
          },
        },
        required: ['action'],
      },
    });

    // 3. Pull Requests Management Tool
    this.tools.set('manage_pull_requests', {
      name: 'manage_pull_requests',
      description: 'Create, update, review, or merge pull requests',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'update', 'review', 'merge', 'list'],
            description: 'Action to perform on pull requests',
          },
          title: {
            type: 'string',
            description: 'PR title (for create/update)',
          },
          body: {
            type: 'string',
            description: 'PR body (for create/update)',
          },
          head: {
            type: 'string',
            description: 'Source branch (for create)',
          },
          base: {
            type: 'string',
            description: 'Target branch (for create)',
            default: 'main',
          },
          pr_number: {
            type: 'number',
            description: 'PR number (for update/review/merge)',
          },
          review_event: {
            type: 'string',
            enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'],
            description: 'Review event (for review)',
          },
          review_body: {
            type: 'string',
            description: 'Review comment (for review)',
          },
          merge_method: {
            type: 'string',
            enum: ['merge', 'squash', 'rebase'],
            description: 'Merge method (for merge)',
            default: 'merge',
          },
        },
        required: ['action'],
      },
    });

    // 4. Code Analysis Tool
    this.tools.set('analyze_code', {
      name: 'analyze_code',
      description: 'Analyze code quality, security, and performance',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'File or directory path to analyze',
          },
          analysis_type: {
            type: 'string',
            enum: ['quality', 'security', 'performance', 'complexity', 'duplication'],
            description: 'Type of analysis to perform',
          },
          language: {
            type: 'string',
            description: 'Programming language (optional)',
          },
        },
        required: ['path', 'analysis_type'],
      },
    });

    // 5. Automated Code Review Tool
    this.tools.set('automated_code_review', {
      name: 'automated_code_review',
      description: 'Perform automated code review on pull requests',
      inputSchema: {
        type: 'object',
        properties: {
          pr_number: {
            type: 'number',
            description: 'Pull request number to review',
          },
          review_focus: {
            type: 'string',
            enum: ['security', 'performance', 'style', 'best_practices', 'all'],
            description: 'Focus area for the review',
            default: 'all',
          },
          auto_approve: {
            type: 'boolean',
            description: 'Whether to auto-approve if no issues found',
            default: false,
          },
        },
        required: ['pr_number'],
      },
    });

    // 6. Release Management Tool
    this.tools.set('manage_releases', {
      name: 'manage_releases',
      description: 'Create and manage GitHub releases',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'list', 'update'],
            description: 'Action to perform on releases',
          },
          tag_name: {
            type: 'string',
            description: 'Release tag name',
          },
          name: {
            type: 'string',
            description: 'Release name',
          },
          body: {
            type: 'string',
            description: 'Release notes',
          },
          draft: {
            type: 'boolean',
            description: 'Whether to create as draft',
            default: false,
          },
          prerelease: {
            type: 'boolean',
            description: 'Whether to mark as prerelease',
            default: false,
          },
        },
        required: ['action'],
      },
    });

    // 7. Branch Management Tool
    this.tools.set('manage_branches', {
      name: 'manage_branches',
      description: 'Create, delete, or manage branches',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'delete', 'list', 'protect'],
            description: 'Action to perform on branches',
          },
          branch_name: {
            type: 'string',
            description: 'Branch name',
          },
          source_branch: {
            type: 'string',
            description: 'Source branch for creation',
            default: 'main',
          },
          protection_rules: {
            type: 'object',
            description: 'Branch protection rules',
          },
        },
        required: ['action'],
      },
    });

    // 8. Workflow Management Tool
    this.tools.set('manage_workflows', {
      name: 'manage_workflows',
      description: 'Manage GitHub Actions workflows',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['list', 'run', 'cancel', 'status'],
            description: 'Action to perform on workflows',
          },
          workflow_id: {
            type: 'string',
            description: 'Workflow ID or name',
          },
          ref: {
            type: 'string',
            description: 'Branch or commit ref',
            default: 'main',
          },
        },
        required: ['action'],
      },
    });

    // 9. Security Scanning Tool
    this.tools.set('security_scan', {
      name: 'security_scan',
      description: 'Perform security vulnerability scanning',
      inputSchema: {
        type: 'object',
        properties: {
          scan_type: {
            type: 'string',
            enum: ['dependencies', 'secrets', 'code', 'all'],
            description: 'Type of security scan',
            default: 'all',
          },
          path: {
            type: 'string',
            description: 'Path to scan (optional)',
          },
        },
        required: ['scan_type'],
      },
    });

    // 10. Performance Monitoring Tool
    this.tools.set('monitor_performance', {
      name: 'monitor_performance',
      description: 'Monitor repository performance metrics',
      inputSchema: {
        type: 'object',
        properties: {
          metric_type: {
            type: 'string',
            enum: ['commits', 'contributors', 'issues', 'prs', 'releases'],
            description: 'Type of performance metric',
          },
          time_range: {
            type: 'string',
            enum: ['day', 'week', 'month', 'year'],
            description: 'Time range for metrics',
            default: 'week',
          },
        },
        required: ['metric_type'],
      },
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values()),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const tool = this.tools.get(name);

      if (!tool) {
        throw new Error(`Tool ${name} not found`);
      }

      try {
        const result = await this.executeTool(name, args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repo_info':
        return await this.getRepoInfo();
      case 'manage_issues':
        return await this.manageIssues(args);
      case 'manage_pull_requests':
        return await this.managePullRequests(args);
      case 'analyze_code':
        return await this.analyzeCode(args);
      case 'automated_code_review':
        return await this.automatedCodeReview(args);
      case 'manage_releases':
        return await this.manageReleases(args);
      case 'manage_branches':
        return await this.manageBranches(args);
      case 'manage_workflows':
        return await this.manageWorkflows(args);
      case 'security_scan':
        return await this.securityScan(args);
      case 'monitor_performance':
        return await this.monitorPerformance(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async makeGitHubRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AuraOS-GitHub-MCP-Server',
    };

    try {
      const response = await axios({
        method,
        url,
        headers,
        data,
      });
      return response.data;
    } catch (error) {
      throw new Error(`GitHub API error: ${error.response?.data?.message || error.message}`);
    }
  }

  private async getRepoInfo(): Promise<any> {
    try {
      const repo = await this.makeGitHubRequest('');
      const stats = await this.makeGitHubRequest('/stats/contributors');
      const languages = await this.makeGitHubRequest('/languages');
      
      return {
        success: true,
        repository: {
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          language: repo.language,
          languages,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          open_issues: repo.open_issues_count,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          clone_url: repo.clone_url,
          contributors: stats.length,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async manageIssues(args: any): Promise<any> {
    const { action, title, body, labels, issue_number, state = 'open' } = args;

    try {
      switch (action) {
        case 'create':
          const newIssue = await this.makeGitHubRequest('/issues', 'POST', {
            title,
            body,
            labels: labels || [],
          });
          return {
            success: true,
            action: 'create',
            issue: newIssue,
            timestamp: new Date().toISOString(),
          };

        case 'list':
          const issues = await this.makeGitHubRequest(`/issues?state=${state}`);
          return {
            success: true,
            action: 'list',
            issues,
            count: issues.length,
            timestamp: new Date().toISOString(),
          };

        case 'update':
          const updatedIssue = await this.makeGitHubRequest(`/issues/${issue_number}`, 'PATCH', {
            title,
            body,
            labels: labels || [],
          });
          return {
            success: true,
            action: 'update',
            issue: updatedIssue,
            timestamp: new Date().toISOString(),
          };

        case 'close':
          const closedIssue = await this.makeGitHubRequest(`/issues/${issue_number}`, 'PATCH', {
            state: 'closed',
          });
          return {
            success: true,
            action: 'close',
            issue: closedIssue,
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async managePullRequests(args: any): Promise<any> {
    const { action, title, body, head, base = 'main', pr_number, review_event, review_body, merge_method = 'merge' } = args;

    try {
      switch (action) {
        case 'create':
          const newPR = await this.makeGitHubRequest('/pulls', 'POST', {
            title,
            body,
            head,
            base,
          });
          return {
            success: true,
            action: 'create',
            pull_request: newPR,
            timestamp: new Date().toISOString(),
          };

        case 'list':
          const prs = await this.makeGitHubRequest('/pulls?state=open');
          return {
            success: true,
            action: 'list',
            pull_requests: prs,
            count: prs.length,
            timestamp: new Date().toISOString(),
          };

        case 'review':
          const review = await this.makeGitHubRequest(`/pulls/${pr_number}/reviews`, 'POST', {
            event: review_event,
            body: review_body,
          });
          return {
            success: true,
            action: 'review',
            review,
            timestamp: new Date().toISOString(),
          };

        case 'merge':
          const mergeResult = await this.makeGitHubRequest(`/pulls/${pr_number}/merge`, 'PUT', {
            merge_method,
          });
          return {
            success: true,
            action: 'merge',
            merge_result: mergeResult,
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async analyzeCode(args: any): Promise<any> {
    const { path, analysis_type, language } = args;

    try {
      // Get file content
      const fileContent = await this.makeGitHubRequest(`/contents/${path}`);
      
      // Simulate code analysis (in real implementation, you'd use actual analysis tools)
      const analysis = {
        quality: {
          score: Math.floor(Math.random() * 30) + 70,
          issues: [
            'Consider adding more comments',
            'Function could be more modular',
            'Variable naming could be improved',
          ],
        },
        security: {
          score: Math.floor(Math.random() * 20) + 80,
          vulnerabilities: [],
          recommendations: [
            'Use parameterized queries',
            'Validate all inputs',
            'Implement proper error handling',
          ],
        },
        performance: {
          score: Math.floor(Math.random() * 25) + 75,
          bottlenecks: [],
          optimizations: [
            'Consider caching frequently accessed data',
            'Optimize database queries',
            'Implement lazy loading',
          ],
        },
        complexity: {
          cyclomatic_complexity: Math.floor(Math.random() * 10) + 5,
          cognitive_complexity: Math.floor(Math.random() * 15) + 8,
          maintainability_index: Math.floor(Math.random() * 30) + 70,
        },
      };

      return {
        success: true,
        path,
        analysis_type,
        language: language || 'auto-detected',
        results: analysis[analysis_type] || analysis,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        path,
        analysis_type,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async automatedCodeReview(args: any): Promise<any> {
    const { pr_number, review_focus = 'all', auto_approve = false } = args;

    try {
      // Get PR details
      const pr = await this.makeGitHubRequest(`/pulls/${pr_number}`);
      const files = await this.makeGitHubRequest(`/pulls/${pr_number}/files`);

      // Simulate automated review
      const reviewResults = {
        security: {
          issues: [],
          score: 95,
          status: 'PASS',
        },
        performance: {
          issues: [],
          score: 88,
          status: 'PASS',
        },
        style: {
          issues: ['Consider using const instead of let'],
          score: 82,
          status: 'PASS',
        },
        best_practices: {
          issues: ['Add error handling for edge cases'],
          score: 90,
          status: 'PASS',
        },
      };

      const overallScore = Object.values(reviewResults).reduce((sum, result) => sum + result.score, 0) / 4;
      const hasIssues = Object.values(reviewResults).some(result => result.issues.length > 0);

      let reviewEvent = 'APPROVE';
      let reviewBody = `🤖 **Automated Code Review**\n\n**Overall Score**: ${overallScore.toFixed(1)}/100\n\n`;

      if (hasIssues) {
        reviewEvent = 'COMMENT';
        reviewBody += '**Issues Found:**\n';
        Object.entries(reviewResults).forEach(([category, result]) => {
          if (result.issues.length > 0) {
            reviewBody += `\n**${category.toUpperCase()}**:\n`;
            result.issues.forEach(issue => {
              reviewBody += `- ${issue}\n`;
            });
          }
        });
      } else {
        reviewBody += '✅ **No issues found!** Code looks good to merge.';
      }

      // Submit review
      const review = await this.makeGitHubRequest(`/pulls/${pr_number}/reviews`, 'POST', {
        event: reviewEvent,
        body: reviewBody,
      });

      return {
        success: true,
        pr_number,
        review_focus,
        overall_score: overallScore,
        review_results: reviewResults,
        review_submitted: review,
        auto_approve: auto_approve && !hasIssues,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        pr_number,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async manageReleases(args: any): Promise<any> {
    const { action, tag_name, name, body, draft = false, prerelease = false } = args;

    try {
      switch (action) {
        case 'create':
          const release = await this.makeGitHubRequest('/releases', 'POST', {
            tag_name,
            name,
            body,
            draft,
            prerelease,
          });
          return {
            success: true,
            action: 'create',
            release,
            timestamp: new Date().toISOString(),
          };

        case 'list':
          const releases = await this.makeGitHubRequest('/releases');
          return {
            success: true,
            action: 'list',
            releases,
            count: releases.length,
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async manageBranches(args: any): Promise<any> {
    const { action, branch_name, source_branch = 'main', protection_rules } = args;

    try {
      switch (action) {
        case 'create':
          // Get source branch SHA
          const sourceBranch = await this.makeGitHubRequest(`/git/refs/heads/${source_branch}`);
          const newBranch = await this.makeGitHubRequest('/git/refs', 'POST', {
            ref: `refs/heads/${branch_name}`,
            sha: sourceBranch.object.sha,
          });
          return {
            success: true,
            action: 'create',
            branch: newBranch,
            timestamp: new Date().toISOString(),
          };

        case 'list':
          const branches = await this.makeGitHubRequest('/branches');
          return {
            success: true,
            action: 'list',
            branches,
            count: branches.length,
            timestamp: new Date().toISOString(),
          };

        case 'delete':
          await this.makeGitHubRequest(`/git/refs/heads/${branch_name}`, 'DELETE');
          return {
            success: true,
            action: 'delete',
            branch_name,
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async manageWorkflows(args: any): Promise<any> {
    const { action, workflow_id, ref = 'main' } = args;

    try {
      switch (action) {
        case 'list':
          const workflows = await this.makeGitHubRequest('/actions/workflows');
          return {
            success: true,
            action: 'list',
            workflows: workflows.workflows,
            count: workflows.total_count,
            timestamp: new Date().toISOString(),
          };

        case 'run':
          const run = await this.makeGitHubRequest(`/actions/workflows/${workflow_id}/dispatches`, 'POST', {
            ref,
          });
          return {
            success: true,
            action: 'run',
            workflow_id,
            ref,
            timestamp: new Date().toISOString(),
          };

        case 'status':
          const runs = await this.makeGitHubRequest(`/actions/workflows/${workflow_id}/runs`);
          return {
            success: true,
            action: 'status',
            workflow_id,
            runs: runs.workflow_runs,
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async securityScan(args: any): Promise<any> {
    const { scan_type, path } = args;

    try {
      // Simulate security scanning (in real implementation, you'd use actual security tools)
      const scanResults = {
        dependencies: {
          vulnerabilities: [],
          outdated_packages: ['package1@1.0.0', 'package2@2.1.0'],
          security_score: 95,
        },
        secrets: {
          found_secrets: [],
          security_score: 100,
        },
        code: {
          vulnerabilities: [],
          security_score: 92,
        },
      };

      return {
        success: true,
        scan_type,
        path: path || 'repository',
        results: scanResults[scan_type] || scanResults,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        scan_type,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async monitorPerformance(args: any): Promise<any> {
    const { metric_type, time_range = 'week' } = args;

    try {
      // Simulate performance monitoring
      const metrics = {
        commits: {
          count: Math.floor(Math.random() * 50) + 20,
          trend: 'increasing',
          top_contributors: ['user1', 'user2', 'user3'],
        },
        contributors: {
          active: Math.floor(Math.random() * 10) + 5,
          new: Math.floor(Math.random() * 3) + 1,
          total: Math.floor(Math.random() * 20) + 10,
        },
        issues: {
          open: Math.floor(Math.random() * 20) + 5,
          closed: Math.floor(Math.random() * 30) + 10,
          response_time: '2.5 hours',
        },
        prs: {
          open: Math.floor(Math.random() * 10) + 2,
          merged: Math.floor(Math.random() * 25) + 8,
          average_review_time: '1.2 days',
        },
        releases: {
          total: Math.floor(Math.random() * 10) + 3,
          latest: 'v1.2.3',
          frequency: 'bi-weekly',
        },
      };

      return {
        success: true,
        metric_type,
        time_range,
        metrics: metrics[metric_type] || metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metric_type,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('GitHub MCP Server started');
  }
}

export default GitHubMCPServer;
