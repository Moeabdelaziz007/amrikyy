#!/usr/bin/env node

/**
 * AuraOS System Audit & Analysis Tool
 * مهمة فحص شامل للنظام والكود مع اقتراحات للخطوات التالية
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

interface AuditResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: any;
  suggestions?: string[];
}

interface SystemReport {
  timestamp: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  results: AuditResult[];
  recommendations: string[];
  nextSteps: string[];
}

class AuraOSSystemAuditor {
  private baseUrl: string;
  private report: SystemReport;

  constructor() {
    this.baseUrl = process.env.AURAOS_API_URL || 'http://localhost:5000';
    this.report = {
      timestamp: new Date().toISOString(),
      overallHealth: 'fair',
      score: 0,
      results: [],
      recommendations: [],
      nextSteps: [],
    };
  }

  /**
   * Run comprehensive system audit
   */
  async runFullAudit(): Promise<SystemReport> {
    console.log(chalk.blue.bold('\n🔍 AuraOS System Audit & Analysis\n'));
    console.log(chalk.gray('='.repeat(60)));

    // Run all audit categories
    await this.auditEnvironmentVariables();
    await this.auditDependencies();
    await this.auditFileStructure();
    await this.auditCodeQuality();
    await this.auditAPIConnectivity();
    await this.auditDatabase();
    await this.auditTelegramIntegration();
    await this.auditSecurity();
    await this.auditPerformance();
    await this.auditDocumentation();

    // Calculate overall health
    this.calculateOverallHealth();
    this.generateRecommendations();
    this.generateNextSteps();

    return this.report;
  }

  /**
   * Audit environment variables
   */
  private async auditEnvironmentVariables() {
    console.log(chalk.yellow('📋 Checking environment variables...'));

    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'TELEGRAM_BOT_TOKEN',
      'TELEGRAM_ADMIN_CHAT_ID',
      'GOOGLE_AI_API_KEY',
    ];

    const missingVars = requiredVars.filter(
      varName =>
        !process.env[varName] ||
        process.env[varName]?.includes('your_') ||
        process.env[varName]?.includes('YOUR_')
    );

    if (missingVars.length === 0) {
      this.addResult(
        'Environment Variables',
        'pass',
        'All required environment variables are configured'
      );
    } else {
      this.addResult(
        'Environment Variables',
        'fail',
        `Missing or incomplete environment variables: ${missingVars.join(', ')}`,
        { missing: missingVars },
        [
          'Update .env file with actual values',
          'Run setup scripts to configure missing variables',
        ]
      );
    }
  }

  /**
   * Audit dependencies
   */
  private async auditDependencies() {
    console.log(chalk.yellow('📦 Checking dependencies...'));

    try {
      const packageJson = JSON.parse(
        await fs.readFile('package.json', 'utf-8')
      );
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});

      // Check for critical dependencies
      const criticalDeps = [
        'express',
        'axios',
        'chalk',
        'commander',
        'inquirer',
      ];
      const missingCritical = criticalDeps.filter(
        dep => !dependencies.includes(dep)
      );

      if (missingCritical.length === 0) {
        this.addResult(
          'Dependencies',
          'pass',
          `All critical dependencies present (${dependencies.length} total)`
        );
      } else {
        this.addResult(
          'Dependencies',
          'warning',
          `Missing critical dependencies: ${missingCritical.join(', ')}`,
          { missing: missingCritical },
          ['Run npm install to install missing dependencies']
        );
      }
    } catch (error) {
      this.addResult('Dependencies', 'fail', 'Failed to read package.json', {
        error: error.message,
      });
    }
  }

  /**
   * Audit file structure
   */
  private async auditFileStructure() {
    console.log(chalk.yellow('📁 Checking file structure...'));

    const criticalFiles = [
      'package.json',
      'cli.ts',
      'cli.js',
      '.env',
      'README.md',
    ];

    const missingFiles = [];
    for (const file of criticalFiles) {
      try {
        await fs.access(file);
      } catch {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length === 0) {
      this.addResult('File Structure', 'pass', 'All critical files present');
    } else {
      this.addResult(
        'File Structure',
        'warning',
        `Missing critical files: ${missingFiles.join(', ')}`,
        { missing: missingFiles },
        ['Create missing files', 'Check if files are in correct location']
      );
    }
  }

  /**
   * Audit code quality
   */
  private async auditCodeQuality() {
    console.log(chalk.yellow('🔍 Checking code quality...'));

    try {
      // Check TypeScript compilation
      const { stdout, stderr } = await execAsync('npm run check');

      if (stderr && stderr.includes('error')) {
        const errorCount = (stderr.match(/error TS/g) || []).length;
        this.addResult(
          'Code Quality',
          'warning',
          `TypeScript compilation has ${errorCount} errors`,
          { errors: stderr },
          ['Fix TypeScript errors', 'Run npm run check to see details']
        );
      } else {
        this.addResult(
          'Code Quality',
          'pass',
          'TypeScript compilation successful'
        );
      }
    } catch (error: any) {
      this.addResult(
        'Code Quality',
        'fail',
        'TypeScript compilation failed',
        { error: error.message },
        ['Fix compilation errors', 'Check TypeScript configuration']
      );
    }
  }

  /**
   * Audit API connectivity
   */
  private async auditAPIConnectivity() {
    console.log(chalk.yellow('🌐 Checking API connectivity...'));

    try {
      const response = await axios.get(`${this.baseUrl}/api/system/status`, {
        timeout: 5000,
      });
      this.addResult(
        'API Connectivity',
        'pass',
        'API server is responding correctly',
        { status: response.status, data: response.data }
      );
    } catch (error: any) {
      this.addResult(
        'API Connectivity',
        'fail',
        'API server is not responding',
        { error: error.message },
        [
          'Start the server with npm run dev',
          'Check if server is running on correct port',
        ]
      );
    }
  }

  /**
   * Audit database
   */
  private async auditDatabase() {
    console.log(chalk.yellow('🗄️ Checking database...'));

    try {
      // Check if database files exist
      const dbFiles = ['database.sqlite', 'data.db'];
      const existingDbFiles = [];

      for (const file of dbFiles) {
        try {
          await fs.access(file);
          existingDbFiles.push(file);
        } catch {}
      }

      if (existingDbFiles.length > 0) {
        this.addResult(
          'Database',
          'pass',
          `Database files found: ${existingDbFiles.join(', ')}`
        );
      } else {
        this.addResult(
          'Database',
          'warning',
          'No local database files found',
          {},
          ['Initialize database', 'Run database migration scripts']
        );
      }
    } catch (error: any) {
      this.addResult('Database', 'fail', 'Database check failed', {
        error: error.message,
      });
    }
  }

  /**
   * Audit Telegram integration
   */
  private async auditTelegramIntegration() {
    console.log(chalk.yellow('📱 Checking Telegram integration...'));

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || botToken.includes('your_')) {
      this.addResult(
        'Telegram Integration',
        'fail',
        'Telegram bot token not configured',
        {},
        ['Set TELEGRAM_BOT_TOKEN in .env', 'Get token from @BotFather']
      );
      return;
    }

    if (!chatId || chatId.includes('your_')) {
      this.addResult(
        'Telegram Integration',
        'fail',
        'Telegram chat ID not configured',
        {},
        ['Set TELEGRAM_ADMIN_CHAT_ID in .env', 'Get chat ID from @RawDataBot']
      );
      return;
    }

    try {
      // Test Telegram API
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getMe`
      );
      this.addResult(
        'Telegram Integration',
        'pass',
        'Telegram bot is configured and accessible',
        { botInfo: response.data.result }
      );
    } catch (error: any) {
      this.addResult(
        'Telegram Integration',
        'fail',
        'Telegram bot token is invalid',
        { error: error.message },
        ['Verify bot token with @BotFather', 'Check token format']
      );
    }
  }

  /**
   * Audit security
   */
  private async auditSecurity() {
    console.log(chalk.yellow('🔒 Checking security...'));

    const securityIssues = [];

    // Check for exposed secrets
    try {
      const envContent = await fs.readFile('.env', 'utf-8');
      if (envContent.includes('your_') || envContent.includes('YOUR_')) {
        securityIssues.push('Template values in .env file');
      }
    } catch {}

    // Check for common security files
    const securityFiles = ['.gitignore', 'security.md'];
    for (const file of securityFiles) {
      try {
        await fs.access(file);
      } catch {
        securityIssues.push(`Missing ${file}`);
      }
    }

    if (securityIssues.length === 0) {
      this.addResult('Security', 'pass', 'No obvious security issues found');
    } else {
      this.addResult(
        'Security',
        'warning',
        `Security issues found: ${securityIssues.join(', ')}`,
        { issues: securityIssues },
        [
          'Update .env with actual values',
          'Add .gitignore for sensitive files',
          'Review security practices',
        ]
      );
    }
  }

  /**
   * Audit performance
   */
  private async auditPerformance() {
    console.log(chalk.yellow('⚡ Checking performance...'));

    try {
      // Check package.json scripts
      const packageJson = JSON.parse(
        await fs.readFile('package.json', 'utf-8')
      );
      const scripts = Object.keys(packageJson.scripts || {});

      const performanceScripts = ['build', 'start', 'dev'];
      const missingScripts = performanceScripts.filter(
        script => !scripts.includes(script)
      );

      if (missingScripts.length === 0) {
        this.addResult(
          'Performance',
          'pass',
          'All performance-related scripts are configured'
        );
      } else {
        this.addResult(
          'Performance',
          'warning',
          `Missing performance scripts: ${missingScripts.join(', ')}`,
          { missing: missingScripts },
          ['Add missing npm scripts', 'Configure build and start commands']
        );
      }
    } catch (error: any) {
      this.addResult(
        'Performance',
        'fail',
        'Failed to check performance configuration',
        { error: error.message }
      );
    }
  }

  /**
   * Audit documentation
   */
  private async auditDocumentation() {
    console.log(chalk.yellow('📚 Checking documentation...'));

    const docFiles = [
      'README.md',
      'README-AUTOPILOT-CLI.md',
      'AURAOS_SETUP_GUIDE.md',
      'AUTOPILOT_SYSTEM_GUIDE.md',
    ];

    const existingDocs = [];
    for (const file of docFiles) {
      try {
        await fs.access(file);
        existingDocs.push(file);
      } catch {}
    }

    if (existingDocs.length >= 2) {
      this.addResult(
        'Documentation',
        'pass',
        `Good documentation coverage (${existingDocs.length} files)`
      );
    } else {
      this.addResult(
        'Documentation',
        'warning',
        `Limited documentation (${existingDocs.length} files)`,
        { existing: existingDocs },
        ['Add more documentation', 'Update existing docs', 'Create user guides']
      );
    }
  }

  /**
   * Add audit result
   */
  private addResult(
    category: string,
    status: 'pass' | 'warning' | 'fail',
    message: string,
    details?: any,
    suggestions?: string[]
  ) {
    this.report.results.push({
      category,
      status,
      message,
      details,
      suggestions,
    });
  }

  /**
   * Calculate overall health
   */
  private calculateOverallHealth() {
    const totalResults = this.report.results.length;
    const passCount = this.report.results.filter(
      r => r.status === 'pass'
    ).length;
    const warningCount = this.report.results.filter(
      r => r.status === 'warning'
    ).length;
    const failCount = this.report.results.filter(
      r => r.status === 'fail'
    ).length;

    this.report.score = Math.round((passCount / totalResults) * 100);

    if (this.report.score >= 90) {
      this.report.overallHealth = 'excellent';
    } else if (this.report.score >= 75) {
      this.report.overallHealth = 'good';
    } else if (this.report.score >= 50) {
      this.report.overallHealth = 'fair';
    } else {
      this.report.overallHealth = 'poor';
    }
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations() {
    const recommendations = [];

    // Collect all suggestions from failed/warning results
    this.report.results.forEach(result => {
      if (result.suggestions) {
        recommendations.push(...result.suggestions);
      }
    });

    // Add general recommendations based on overall health
    if (this.report.overallHealth === 'poor') {
      recommendations.push('Priority: Fix critical issues first');
      recommendations.push('Review environment configuration');
      recommendations.push('Check system dependencies');
    } else if (this.report.overallHealth === 'fair') {
      recommendations.push('Address warning issues');
      recommendations.push('Improve documentation');
      recommendations.push('Enhance security measures');
    } else {
      recommendations.push('System is in good condition');
      recommendations.push('Consider performance optimizations');
      recommendations.push('Plan for scaling');
    }

    this.report.recommendations = [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Generate next steps
   */
  private generateNextSteps() {
    const nextSteps = [];

    // Critical issues first
    const criticalIssues = this.report.results.filter(r => r.status === 'fail');
    if (criticalIssues.length > 0) {
      nextSteps.push('1. Fix critical issues (marked as FAIL)');
    }

    // Environment setup
    const envIssues = this.report.results.find(
      r => r.category === 'Environment Variables'
    );
    if (envIssues && envIssues.status !== 'pass') {
      nextSteps.push('2. Configure environment variables');
    }

    // Dependencies
    const depIssues = this.report.results.find(
      r => r.category === 'Dependencies'
    );
    if (depIssues && depIssues.status !== 'pass') {
      nextSteps.push('3. Install missing dependencies');
    }

    // API connectivity
    const apiIssues = this.report.results.find(
      r => r.category === 'API Connectivity'
    );
    if (apiIssues && apiIssues.status !== 'pass') {
      nextSteps.push('4. Start the API server');
    }

    // Telegram setup
    const telegramIssues = this.report.results.find(
      r => r.category === 'Telegram Integration'
    );
    if (telegramIssues && telegramIssues.status !== 'pass') {
      nextSteps.push('5. Configure Telegram integration');
    }

    // General next steps
    nextSteps.push('6. Run tests to verify fixes');
    nextSteps.push('7. Start using the CLI commands');
    nextSteps.push('8. Set up monitoring and alerts');

    this.report.nextSteps = nextSteps;
  }

  /**
   * Display audit report
   */
  displayReport() {
    console.log(chalk.blue.bold('\n📊 AuraOS System Audit Report\n'));
    console.log(chalk.gray('='.repeat(60)));

    // Overall health
    const healthColor =
      this.report.overallHealth === 'excellent'
        ? chalk.green
        : this.report.overallHealth === 'good'
          ? chalk.blue
          : this.report.overallHealth === 'fair'
            ? chalk.yellow
            : chalk.red;

    console.log(
      chalk.green('📈 Overall Health:'),
      healthColor(this.report.overallHealth.toUpperCase())
    );
    console.log(
      chalk.green('📊 Score:'),
      chalk.blue(`${this.report.score}/100`)
    );
    console.log(
      chalk.green('🕐 Timestamp:'),
      chalk.gray(this.report.timestamp)
    );
    console.log('');

    // Detailed results
    console.log(chalk.blue.bold('📋 Detailed Results:\n'));

    this.report.results.forEach((result, index) => {
      const statusIcon =
        result.status === 'pass'
          ? '✅'
          : result.status === 'warning'
            ? '⚠️'
            : '❌';
      const statusColor =
        result.status === 'pass'
          ? chalk.green
          : result.status === 'warning'
            ? chalk.yellow
            : chalk.red;

      console.log(`${index + 1}. ${statusIcon} ${chalk.bold(result.category)}`);
      console.log(`   Status: ${statusColor(result.status.toUpperCase())}`);
      console.log(`   Message: ${result.message}`);

      if (result.suggestions && result.suggestions.length > 0) {
        console.log(`   Suggestions:`);
        result.suggestions.forEach(suggestion => {
          console.log(`     • ${suggestion}`);
        });
      }
      console.log('');
    });

    // Recommendations
    console.log(chalk.blue.bold('💡 Recommendations:\n'));
    this.report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');

    // Next steps
    console.log(chalk.blue.bold('🚀 Next Steps:\n'));
    this.report.nextSteps.forEach(step => {
      console.log(step);
    });
    console.log('');

    // Summary
    console.log(chalk.gray('='.repeat(60)));
    console.log(chalk.green.bold('✅ Audit completed successfully!'));
    console.log(
      chalk.gray(`Report generated at: ${new Date().toLocaleString()}`)
    );
  }

  /**
   * Save report to file
   */
  async saveReport(filename?: string) {
    const reportFile = filename || `auraos-audit-report-${Date.now()}.json`;

    try {
      await fs.writeFile(reportFile, JSON.stringify(this.report, null, 2));
      console.log(chalk.green(`📁 Report saved to: ${reportFile}`));
    } catch (error: any) {
      console.error(chalk.red('❌ Failed to save report:'), error.message);
    }
  }
}

// CLI Setup
const program = new Command();

program
  .name('auraos-audit')
  .description('AuraOS System Audit & Analysis Tool')
  .version('1.0.0');

program
  .command('run')
  .description('Run comprehensive system audit')
  .option('-s, --save <filename>', 'Save report to file')
  .action(async options => {
    const auditor = new AuraOSSystemAuditor();

    try {
      const report = await auditor.runFullAudit();
      auditor.displayReport();

      if (options.save) {
        await auditor.saveReport(options.save);
      }

      // Exit with appropriate code
      process.exit(report.overallHealth === 'poor' ? 1 : 0);
    } catch (error: any) {
      console.error(chalk.red('❌ Audit failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('quick')
  .description('Run quick system check')
  .action(async () => {
    console.log(chalk.blue.bold('\n⚡ Quick System Check\n'));

    const checks = [
      {
        name: 'Environment',
        check: () => (process.env.FIREBASE_PROJECT_ID ? '✅' : '❌'),
      },
      {
        name: 'Package.json',
        check: async () => {
          try {
            await fs.access('package.json');
            return '✅';
          } catch {
            return '❌';
          }
        },
      },
      {
        name: 'CLI Files',
        check: async () => {
          try {
            await fs.access('cli.ts');
            await fs.access('cli.js');
            return '✅';
          } catch {
            return '❌';
          }
        },
      },
      {
        name: 'Dependencies',
        check: async () => {
          try {
            const { stdout } = await execAsync('npm list --depth=0');
            return stdout.includes('express') ? '✅' : '❌';
          } catch {
            return '❌';
          }
        },
      },
    ];

    for (const check of checks) {
      const result = await check.check();
      console.log(`${result} ${check.name}`);
    }

    console.log(chalk.green('\n✅ Quick check completed!'));
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

export { AuraOSSystemAuditor, SystemReport, AuditResult };
