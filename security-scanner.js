#!/usr/bin/env node

// =============================================================================
// 🔐 AuraOS Security Scanner - Comprehensive Security Audit Tool
// =============================================================================
//
// This tool scans the AuraOS codebase for security vulnerabilities
// and provides detailed recommendations for fixes
//
// =============================================================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuraOSSecurityScanner {
  constructor() {
    this.scanResults = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: [],
    };
    this.scannedFiles = 0;
    this.totalIssues = 0;
  }

  // =============================================================================
  // 🔍 Main Scan Method
  // =============================================================================

  async scanCodebase(rootPath = '.') {
    console.log('🔐 Starting AuraOS Security Scan...\n');
    console.log('='.repeat(60));

    const startTime = Date.now();

    try {
      await this.scanDirectory(rootPath);
      await this.validateEnvironmentVariables();
      await this.checkDependencies();

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      this.generateReport(duration);
    } catch (error) {
      console.error('❌ Security scan failed:', error.message);
      process.exit(1);
    }
  }

  // =============================================================================
  // 📁 Directory Scanning
  // =============================================================================

  async scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      // Skip node_modules, .git, dist, build directories
      if (this.shouldSkipDirectory(item)) {
        continue;
      }

      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.shouldScanFile(item)) {
        await this.scanFile(fullPath);
      }
    }
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.cache',
      'logs',
      'temp',
      'tmp',
    ];
    return skipDirs.includes(dirName);
  }

  shouldScanFile(fileName) {
    const extensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.md'];
    return extensions.some(ext => fileName.endsWith(ext));
  }

  // =============================================================================
  // 📄 File Scanning
  // =============================================================================

  async scanFile(filePath) {
    this.scannedFiles++;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);

      // Check for hardcoded secrets
      this.checkHardcodedSecrets(content, relativePath);

      // Check for security anti-patterns
      this.checkSecurityAntiPatterns(content, relativePath);

      // Check for vulnerable code patterns
      this.checkVulnerablePatterns(content, relativePath);

      // Check for console statements in production code
      this.checkConsoleStatements(content, relativePath);
    } catch (error) {
      console.warn(`⚠️ Could not scan file ${filePath}: ${error.message}`);
    }
  }

  // =============================================================================
  // 🔑 Hardcoded Secrets Detection
  // =============================================================================

  checkHardcodedSecrets(content, filePath) {
    const secretPatterns = [
      // API Keys
      {
        pattern: /(api[_-]?key|apikey)\s*[:=]\s*['"]([^'"]{20,})['"]/gi,
        severity: 'critical',
        type: 'API Key',
        description: 'Hardcoded API key detected',
      },
      // JWT Secrets
      {
        pattern: /(jwt[_-]?secret|secret)\s*[:=]\s*['"]([^'"]{10,})['"]/gi,
        severity: 'critical',
        type: 'JWT Secret',
        description: 'Hardcoded JWT secret detected',
      },
      // Database URLs
      {
        pattern:
          /(database[_-]?url|db[_-]?url)\s*[:=]\s*['"]([^'"]*:\/\/[^'"]*)['"]/gi,
        severity: 'high',
        type: 'Database URL',
        description: 'Hardcoded database URL detected',
      },
      // Passwords
      {
        pattern: /(password|passwd|pwd)\s*[:=]\s*['"]([^'"]{8,})['"]/gi,
        severity: 'critical',
        type: 'Password',
        description: 'Hardcoded password detected',
      },
      // Tokens
      {
        pattern: /(token|access[_-]?token)\s*[:=]\s*['"]([^'"]{20,})['"]/gi,
        severity: 'critical',
        type: 'Token',
        description: 'Hardcoded token detected',
      },
      // Private Keys
      {
        pattern:
          /(private[_-]?key|privkey)\s*[:=]\s*['"](-----BEGIN[^'"]*-----END[^'"]*)['"]/gi,
        severity: 'critical',
        type: 'Private Key',
        description: 'Hardcoded private key detected',
      },
    ];

    secretPatterns.forEach(({ pattern, severity, type, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          this.addIssue(severity, {
            file: filePath,
            type: type,
            description: description,
            line: this.getLineNumber(content, match),
            match: match.substring(0, 50) + '...',
            recommendation: `Move ${type.toLowerCase()} to environment variables`,
          });
        });
      }
    });
  }

  // =============================================================================
  // 🚨 Security Anti-Patterns Detection
  // =============================================================================

  checkSecurityAntiPatterns(content, filePath) {
    const antiPatterns = [
      // SQL Injection
      {
        pattern: /(query|sql)\s*[:=]\s*['"][^'"]*\$[^'"]*['"]/gi,
        severity: 'high',
        type: 'SQL Injection Risk',
        description: 'Potential SQL injection vulnerability',
      },
      // XSS Vulnerabilities
      {
        pattern: /innerHTML\s*=\s*[^;]*\+/gi,
        severity: 'high',
        type: 'XSS Risk',
        description: 'Potential XSS vulnerability with innerHTML',
      },
      // Unsafe eval usage
      {
        pattern: /eval\s*\(/gi,
        severity: 'critical',
        type: 'Code Injection',
        description: 'Unsafe eval() usage detected',
      },
      // Unsafe require
      {
        pattern: /require\s*\(\s*[^)]*\+/gi,
        severity: 'high',
        type: 'Path Injection',
        description: 'Dynamic require() usage detected',
      },
    ];

    antiPatterns.forEach(({ pattern, severity, type, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          this.addIssue(severity, {
            file: filePath,
            type: type,
            description: description,
            line: this.getLineNumber(content, match),
            match: match.substring(0, 100),
            recommendation: 'Review and sanitize user input',
          });
        });
      }
    });
  }

  // =============================================================================
  // 🐛 Vulnerable Patterns Detection
  // =============================================================================

  checkVulnerablePatterns(content, filePath) {
    const vulnerablePatterns = [
      // Weak crypto usage
      {
        pattern: /crypto\.createHash\s*\(\s*['"]md5['"]/gi,
        severity: 'medium',
        type: 'Weak Hash',
        description: 'MD5 hash usage detected (weak)',
      },
      // Missing CSRF protection
      {
        pattern: /app\.(get|post|put|delete)\s*\([^)]*,\s*async\s*\(/gi,
        severity: 'medium',
        type: 'CSRF Risk',
        description: 'Route handler without CSRF protection',
      },
      // Missing input validation
      {
        pattern: /req\.(body|query|params)\.[^.]*[^=]*=/gi,
        severity: 'low',
        type: 'Input Validation',
        description: 'Direct use of request data without validation',
      },
    ];

    vulnerablePatterns.forEach(({ pattern, severity, type, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          this.addIssue(severity, {
            file: filePath,
            type: type,
            description: description,
            line: this.getLineNumber(content, match),
            match: match.substring(0, 100),
            recommendation: 'Implement proper security measures',
          });
        });
      }
    });
  }

  // =============================================================================
  // 📝 Console Statements Detection
  // =============================================================================

  checkConsoleStatements(content, filePath) {
    // Skip test files and development files
    if (
      filePath.includes('test') ||
      filePath.includes('spec') ||
      filePath.includes('dev')
    ) {
      return;
    }

    const consolePattern = /console\.(log|warn|error|debug|info)\s*\(/gi;
    const matches = content.match(consolePattern);

    if (matches) {
      matches.forEach(match => {
        this.addIssue('low', {
          file: filePath,
          type: 'Console Statement',
          description: 'Console statement in production code',
          line: this.getLineNumber(content, match),
          match: match.substring(0, 50),
          recommendation: 'Remove or replace with proper logging service',
        });
      });
    }
  }

  // =============================================================================
  // 🌍 Environment Variables Validation
  // =============================================================================

  async validateEnvironmentVariables() {
    console.log('🌍 Validating environment variables...');

    const envFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
    ];
    const foundEnvFiles = envFiles.filter(file => fs.existsSync(file));

    if (foundEnvFiles.length === 0) {
      this.addIssue('high', {
        file: 'Environment',
        type: 'Missing .env',
        description: 'No .env file found',
        recommendation: 'Create .env file with proper configuration',
      });
      return;
    }

    // Check if .env is in .gitignore
    if (fs.existsSync('.gitignore')) {
      const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
      if (!gitignoreContent.includes('.env')) {
        this.addIssue('critical', {
          file: '.gitignore',
          type: 'Security Risk',
          description: '.env file not in .gitignore',
          recommendation:
            'Add .env to .gitignore to prevent credential exposure',
        });
      }
    }

    // Validate .env.example exists
    if (
      !fs.existsSync('.env.example') &&
      !fs.existsSync('ENV_TEMPLATE_COMPREHENSIVE.md')
    ) {
      this.addIssue('medium', {
        file: 'Environment',
        type: 'Missing Template',
        description: 'No .env.example or template file found',
        recommendation: 'Create .env.example template for other developers',
      });
    }
  }

  // =============================================================================
  // 📦 Dependencies Security Check
  // =============================================================================

  async checkDependencies() {
    console.log('📦 Checking dependencies...');

    if (!fs.existsSync('package.json')) {
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Check for known vulnerable packages
      const vulnerablePackages = [
        'lodash',
        'moment',
        'request',
        'express',
        'jquery',
      ];

      vulnerablePackages.forEach(pkg => {
        if (allDeps[pkg]) {
          this.addIssue('medium', {
            file: 'package.json',
            type: 'Vulnerable Package',
            description: `Package ${pkg} may have known vulnerabilities`,
            recommendation: 'Update to latest version and run npm audit',
          });
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not parse package.json:', error.message);
    }
  }

  // =============================================================================
  // 📊 Report Generation
  // =============================================================================

  generateReport(duration) {
    console.log('\n' + '='.repeat(60));
    console.log('🔐 AURAOS SECURITY SCAN REPORT');
    console.log('='.repeat(60));

    console.log(`📁 Files scanned: ${this.scannedFiles}`);
    console.log(`⏱️  Scan duration: ${duration}s`);
    console.log(`🔍 Total issues: ${this.totalIssues}`);

    // Calculate security score
    const score = this.calculateSecurityScore();
    console.log(`📊 Security score: ${score}/100`);

    // Display issues by severity
    this.displayIssuesBySeverity();

    // Generate recommendations
    this.generateRecommendations();

    // Save detailed report
    this.saveDetailedReport();

    console.log('\n🎉 Security scan completed!');
  }

  calculateSecurityScore() {
    const weights = { critical: 25, high: 15, medium: 10, low: 5, info: 1 };
    let totalWeight = 0;

    Object.keys(this.scanResults).forEach(severity => {
      totalWeight += this.scanResults[severity].length * weights[severity];
    });

    return Math.max(0, 100 - totalWeight);
  }

  displayIssuesBySeverity() {
    const severities = ['critical', 'high', 'medium', 'low', 'info'];

    severities.forEach(severity => {
      const issues = this.scanResults[severity];
      if (issues.length > 0) {
        console.log(
          `\n🔴 ${severity.toUpperCase()} ISSUES (${issues.length}):`
        );
        issues.forEach(issue => {
          console.log(
            `   • ${issue.file}:${issue.line} - ${issue.description}`
          );
          console.log(`     Recommendation: ${issue.recommendation}`);
        });
      }
    });
  }

  generateRecommendations() {
    console.log('\n💡 SECURITY RECOMMENDATIONS:');
    console.log('='.repeat(40));

    const recommendations = [
      '1. Move all hardcoded secrets to environment variables',
      '2. Implement proper input validation and sanitization',
      '3. Use parameterized queries to prevent SQL injection',
      '4. Add CSRF protection to all forms',
      '5. Implement rate limiting on API endpoints',
      '6. Use HTTPS in production',
      '7. Regular security audits and dependency updates',
      '8. Implement proper error handling without information leakage',
      '9. Use Content Security Policy (CSP) headers',
      '10. Regular penetration testing',
    ];

    recommendations.forEach(rec => console.log(`   ${rec}`));
  }

  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      scanDuration: `${this.scannedFiles} files scanned`,
      securityScore: this.calculateSecurityScore(),
      issues: this.scanResults,
      summary: {
        total: this.totalIssues,
        critical: this.scanResults.critical.length,
        high: this.scanResults.high.length,
        medium: this.scanResults.medium.length,
        low: this.scanResults.low.length,
        info: this.scanResults.info.length,
      },
    };

    fs.writeFileSync(
      'security-scan-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log('\n📄 Detailed report saved to: security-scan-report.json');
  }

  // =============================================================================
  // 🛠️ Utility Methods
  // =============================================================================

  addIssue(severity, issue) {
    this.scanResults[severity].push(issue);
    this.totalIssues++;
  }

  getLineNumber(content, match) {
    const lines = content.substring(0, content.indexOf(match)).split('\n');
    return lines.length;
  }
}

// =============================================================================
// 🚀 Main Execution
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const scanner = new AuraOSSecurityScanner();
  scanner.scanCodebase().catch(console.error);
}

export default AuraOSSecurityScanner;
