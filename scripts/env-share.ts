#!/usr/bin/env ts-node

/**
 * AuraOS Environment Sharing Agent
 * Manages shared environment variables across multiple Git repositories
 */

import * as fs from 'fs';
import * as path from 'path';

interface SharedEnvConfig {
  repositories: string[];
  sharedVariables: string[];
  localOverrides: Record<string, string>;
}

class EnvShareAgent {
  private configPath: string;
  private sharedEnvPath: string;

  constructor() {
    this.configPath = path.join(process.cwd(), '.env-share.json');
    this.sharedEnvPath = path.join(process.cwd(), '.env.shared');
  }

  /**
   * Initialize shared environment configuration
   */
  async init(): Promise<void> {
    const config: SharedEnvConfig = {
      repositories: [
        '../auraos-frontend',
        '../auraos-backend', 
        '../auraos-mobile',
        '../auraos-desktop'
      ],
      sharedVariables: [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'FIREBASE_PROJECT_ID',
        'OPENAI_API_KEY',
        'JWT_SECRET'
      ],
      localOverrides: {}
    };

    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    console.log('✅ Created .env-share.json configuration');
  }

  /**
   * Create shared environment file
   */
  async createShared(): Promise<void> {
    const sharedContent = `# Shared Environment Variables for AuraOS Ecosystem
# This file contains common variables used across all repositories

# Core Configuration
NODE_ENV=development
PORT=3002
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auraos

# Firebase
FIREBASE_PROJECT_ID=auraos-production
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Security
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# External APIs
WEATHER_API_KEY=your-weather-key
GOOGLE_MAPS_API_KEY=your-maps-key

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
`;

    fs.writeFileSync(this.sharedEnvPath, sharedContent);
    console.log('✅ Created .env.shared file');
  }

  /**
   * Sync shared environment to all repositories
   */
  async sync(): Promise<void> {
    if (!fs.existsSync(this.configPath)) {
      console.log('❌ Configuration not found. Run: npm run env:share:init');
      return;
    }

    const config: SharedEnvConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
    
    if (!fs.existsSync(this.sharedEnvPath)) {
      console.log('❌ Shared environment file not found. Run: npm run env:share:create');
      return;
    }

    const sharedContent = fs.readFileSync(this.sharedEnvPath, 'utf-8');

    for (const repo of config.repositories) {
      const repoPath = path.resolve(repo);
      const envPath = path.join(repoPath, '.env');
      
      if (fs.existsSync(repoPath)) {
        fs.writeFileSync(envPath, sharedContent);
        console.log(`✅ Synced to ${repo}`);
      } else {
        console.log(`⚠️  Repository not found: ${repo}`);
      }
    }
  }

  /**
   * Pull environment from shared file
   */
  async pull(): Promise<void> {
    if (!fs.existsSync(this.sharedEnvPath)) {
      console.log('❌ Shared environment file not found');
      return;
    }

    const sharedContent = fs.readFileSync(this.sharedEnvPath, 'utf-8');
    const localEnvPath = path.join(process.cwd(), '.env');
    
    fs.writeFileSync(localEnvPath, sharedContent);
    console.log('✅ Pulled shared environment to local .env');
  }

  /**
   * Push local environment to shared file
   */
  async push(): Promise<void> {
    const localEnvPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(localEnvPath)) {
      console.log('❌ Local .env file not found');
      return;
    }

    const localContent = fs.readFileSync(localEnvPath, 'utf-8');
    fs.writeFileSync(this.sharedEnvPath, localContent);
    console.log('✅ Pushed local environment to shared file');
  }

  /**
   * Show help
   */
  private showHelp(): void {
    console.log(`
🌐 AuraOS Environment Sharing Agent

Usage: npx ts-node ./scripts/env-share.ts <command>

Commands:
  init              Initialize shared environment configuration
  create            Create .env.shared file
  sync              Sync shared environment to all repositories
  pull              Pull shared environment to local .env
  push              Push local environment to shared file

Examples:
  npm run env:share:init     # Initialize configuration
  npm run env:share:create    # Create shared file
  npm run env:share:sync     # Sync to all repos
  npm run env:share:pull     # Pull shared env locally
  npm run env:share:push     # Push local env to shared
`);
  }

  /**
   * Main execution
   */
  async run(): Promise<void> {
    const command = process.argv[2];
    
    if (!command || command === 'help') {
      this.showHelp();
      return;
    }

    try {
      switch (command) {
        case 'init':
          await this.init();
          break;
        case 'create':
          await this.createShared();
          break;
        case 'sync':
          await this.sync();
          break;
        case 'pull':
          await this.pull();
          break;
        case 'push':
          await this.push();
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Share agent error:', error);
      process.exit(1);
    }
  }
}

// Execute the agent
const agent = new EnvShareAgent();
agent.run().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
