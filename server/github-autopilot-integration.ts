// GitHub Autopilot Integration Configuration
// Connects GitHub MCP Server with AuraOS Autopilot

import GitHubMCPServer from './github-mcp-server.js';
import { TelegramService } from './telegram.js';

export class GitHubAutopilotIntegration {
  private githubMCP: GitHubMCPServer;
  private telegramService: TelegramService;
  private owner: string;
  private repo: string;
  private isActive: boolean = false;

  constructor(githubToken: string, owner: string, repo: string, telegramService: TelegramService) {
    this.owner = owner;
    this.repo = repo;
    this.githubMCP = new GitHubMCPServer(githubToken, owner, repo);
    this.telegramService = telegramService;
  }

  async start(): Promise<void> {
    try {
      await this.githubMCP.start();
      this.isActive = true;
      
      console.log('🚀 GitHub Autopilot Integration started');
      await this.telegramService.sendMessage(
        `🚀 **GitHub Autopilot Integration Started**\n\n` +
        `Repository: ${this.owner}/${this.repo}\n` +
        `Status: Active\n` +
        `Timestamp: ${new Date().toISOString()}`
      );

      // Start monitoring tasks
      this.startMonitoringTasks();
    } catch (error) {
      console.error('❌ Failed to start GitHub Autopilot Integration:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    this.isActive = false;
    console.log('🛑 GitHub Autopilot Integration stopped');
    await this.telegramService.sendMessage(
      `🛑 **GitHub Autopilot Integration Stopped**\n\n` +
      `Repository: ${this.owner}/${this.repo}\n` +
      `Status: Inactive\n` +
      `Timestamp: ${new Date().toISOString()}`
    );
  }

  private startMonitoringTasks(): void {
    // Monitor new issues every 5 minutes
    setInterval(async () => {
      if (this.isActive) {
        await this.monitorNewIssues();
      }
    }, 5 * 60 * 1000);

    // Monitor pull requests every 3 minutes
    setInterval(async () => {
      if (this.isActive) {
        await this.monitorPullRequests();
      }
    }, 3 * 60 * 1000);

    // Monitor repository performance every 30 minutes
    setInterval(async () => {
      if (this.isActive) {
        await this.monitorRepositoryPerformance();
      }
    }, 30 * 60 * 1000);

    // Security scan every hour
    setInterval(async () => {
      if (this.isActive) {
        await this.performSecurityScan();
      }
    }, 60 * 60 * 1000);
  }

  private async monitorNewIssues(): Promise<void> {
    try {
      const issues = await this.githubMCP.executeTool('manage_issues', { action: 'list', state: 'open' });
      
      if (issues.success && issues.issues.length > 0) {
        const newIssues = issues.issues.filter(issue => {
          const createdAt = new Date(issue.created_at);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return createdAt > fiveMinutesAgo;
        });

        for (const issue of newIssues) {
          await this.telegramService.sendMessage(
            `🐛 **New Issue Detected**\n\n` +
            `**Title**: ${issue.title}\n` +
            `**Number**: #${issue.number}\n` +
            `**Author**: ${issue.user.login}\n` +
            `**Labels**: ${issue.labels.map(l => l.name).join(', ') || 'None'}\n` +
            `**URL**: ${issue.html_url}\n\n` +
            `**Description**:\n${issue.body?.substring(0, 200)}${issue.body?.length > 200 ? '...' : ''}`
          );

          // Auto-assign labels based on content
          await this.autoAssignLabels(issue);
        }
      }
    } catch (error) {
      console.error('❌ Error monitoring issues:', error);
    }
  }

  private async monitorPullRequests(): Promise<void> {
    try {
      const prs = await this.githubMCP.executeTool('manage_pull_requests', { action: 'list' });
      
      if (prs.success && prs.pull_requests.length > 0) {
        const newPRs = prs.pull_requests.filter(pr => {
          const createdAt = new Date(pr.created_at);
          const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
          return createdAt > threeMinutesAgo;
        });

        for (const pr of newPRs) {
          await this.telegramService.sendMessage(
            `🔀 **New Pull Request**\n\n` +
            `**Title**: ${pr.title}\n` +
            `**Number**: #${pr.number}\n` +
            `**Author**: ${pr.user.login}\n` +
            `**Branch**: ${pr.head.ref} → ${pr.base.ref}\n` +
            `**Status**: ${pr.state}\n` +
            `**URL**: ${pr.html_url}\n\n` +
            `**Description**:\n${pr.body?.substring(0, 200)}${pr.body?.length > 200 ? '...' : ''}`
          );

          // Auto-review if configured
          if (process.env.GITHUB_AUTO_REVIEW === 'true') {
            await this.performAutoReview(pr.number);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error monitoring pull requests:', error);
    }
  }

  private async monitorRepositoryPerformance(): Promise<void> {
    try {
      const metrics = await this.githubMCP.executeTool('monitor_performance', { 
        metric_type: 'commits', 
        time_range: 'week' 
      });

      if (metrics.success) {
        await this.telegramService.sendMessage(
          `📊 **Repository Performance Report**\n\n` +
          `**Commits This Week**: ${metrics.metrics.count}\n` +
          `**Trend**: ${metrics.metrics.trend}\n` +
          `**Top Contributors**: ${metrics.metrics.top_contributors.join(', ')}\n\n` +
          `**Repository**: ${this.owner}/${this.repo}\n` +
          `**Generated**: ${new Date().toISOString()}`
        );
      }
    } catch (error) {
      console.error('❌ Error monitoring performance:', error);
    }
  }

  private async performSecurityScan(): Promise<void> {
    try {
      const scanResults = await this.githubMCP.executeTool('security_scan', { 
        scan_type: 'all' 
      });

      if (scanResults.success) {
        const hasVulnerabilities = Object.values(scanResults.results).some(
          (result: any) => result.vulnerabilities?.length > 0 || result.found_secrets?.length > 0
        );

        if (hasVulnerabilities) {
          await this.telegramService.sendMessage(
            `🚨 **Security Alert**\n\n` +
            `**Repository**: ${this.owner}/${this.repo}\n` +
            `**Scan Results**:\n` +
            `- Dependencies: ${scanResults.results.dependencies.security_score}/100\n` +
            `- Secrets: ${scanResults.results.secrets.security_score}/100\n` +
            `- Code: ${scanResults.results.code.security_score}/100\n\n` +
            `**Action Required**: Please review security findings\n` +
            `**Timestamp**: ${new Date().toISOString()}`
          );
        }
      }
    } catch (error) {
      console.error('❌ Error performing security scan:', error);
    }
  }

  private async autoAssignLabels(issue: any): Promise<void> {
    try {
      const labels = [];
      
      // Auto-assign labels based on issue content
      const title = issue.title.toLowerCase();
      const body = issue.body?.toLowerCase() || '';

      if (title.includes('bug') || body.includes('bug')) {
        labels.push('bug');
      }
      if (title.includes('feature') || body.includes('feature')) {
        labels.push('enhancement');
      }
      if (title.includes('urgent') || body.includes('urgent')) {
        labels.push('urgent');
      }
      if (title.includes('documentation') || body.includes('documentation')) {
        labels.push('documentation');
      }

      if (labels.length > 0) {
        await this.githubMCP.executeTool('manage_issues', {
          action: 'update',
          issue_number: issue.number,
          labels: labels
        });

        await this.telegramService.sendMessage(
          `🏷️ **Auto-labeled Issue**\n\n` +
          `**Issue**: #${issue.number} - ${issue.title}\n` +
          `**Labels Added**: ${labels.join(', ')}\n` +
          `**Repository**: ${this.owner}/${this.repo}`
        );
      }
    } catch (error) {
      console.error('❌ Error auto-assigning labels:', error);
    }
  }

  private async performAutoReview(prNumber: number): Promise<void> {
    try {
      const reviewResults = await this.githubMCP.executeTool('automated_code_review', {
        pr_number: prNumber,
        review_focus: 'all',
        auto_approve: process.env.GITHUB_AUTO_APPROVE === 'true'
      });

      if (reviewResults.success) {
        await this.telegramService.sendMessage(
          `🤖 **Automated Code Review Completed**\n\n` +
          `**PR**: #${prNumber}\n` +
          `**Overall Score**: ${reviewResults.overall_score}/100\n` +
          `**Auto-approve**: ${reviewResults.auto_approve ? 'Yes' : 'No'}\n` +
          `**Repository**: ${this.owner}/${this.repo}\n\n` +
          `**Review Details**:\n` +
          `- Security: ${reviewResults.review_results.security.score}/100\n` +
          `- Performance: ${reviewResults.review_results.performance.score}/100\n` +
          `- Style: ${reviewResults.review_results.style.score}/100\n` +
          `- Best Practices: ${reviewResults.review_results.best_practices.score}/100`
        );
      }
    } catch (error) {
      console.error('❌ Error performing auto-review:', error);
    }
  }

  // Public methods for manual operations
  async createIssue(title: string, body: string, labels: string[] = []): Promise<any> {
    return await this.githubMCP.executeTool('manage_issues', {
      action: 'create',
      title,
      body,
      labels
    });
  }

  async createPullRequest(title: string, body: string, head: string, base: string = 'main'): Promise<any> {
    return await this.githubMCP.executeTool('manage_pull_requests', {
      action: 'create',
      title,
      body,
      head,
      base
    });
  }

  async analyzeCode(path: string, analysisType: string): Promise<any> {
    return await this.githubMCP.executeTool('analyze_code', {
      path,
      analysis_type: analysisType
    });
  }

  async createRelease(tagName: string, name: string, body: string): Promise<any> {
    return await this.githubMCP.executeTool('manage_releases', {
      action: 'create',
      tag_name: tagName,
      name,
      body
    });
  }

  async getRepositoryInfo(): Promise<any> {
    return await this.githubMCP.executeTool('get_repo_info', {});
  }

  getStatus(): { isActive: boolean; owner: string; repo: string } {
    return {
      isActive: this.isActive,
      owner: this.owner,
      repo: this.repo
    };
  }
}

export default GitHubAutopilotIntegration;
