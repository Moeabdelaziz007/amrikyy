#!/usr/bin/env node

/**
 * Cursor CLI - LLM Integration
 * ربط Cursor CLI مع نماذج اللغة الكبيرة المختلفة
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
dotenv.config();

// LLM Provider Types
type LLMProvider =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'ollama'
  | 'cursor';

interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Cursor LLM Integration Class
 */
class CursorLLMIntegration {
  private config: LLMConfig;
  private openai?: OpenAI;
  private gemini?: GoogleGenerativeAI;
  private anthropic?: any;

  constructor() {
    this.config = this.loadConfig();
    this.initializeProviders();
  }

  /**
   * Load LLM configuration
   */
  private loadConfig(): LLMConfig {
    const config: LLMConfig = {
      provider: (process.env.LLM_PROVIDER as LLMProvider) || 'gemini',
      apiKey: process.env.LLM_API_KEY || process.env.GOOGLE_AI_API_KEY,
      model: process.env.LLM_MODEL || 'gemini-pro',
      baseUrl: process.env.LLM_BASE_URL,
      temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2000'),
    };

    // Provider-specific configurations
    switch (config.provider) {
      case 'openai':
        config.apiKey = process.env.OPENAI_API_KEY || config.apiKey;
        config.model = config.model || 'gpt-4-turbo-preview';
        break;
      case 'anthropic':
        config.apiKey = process.env.ANTHROPIC_API_KEY || config.apiKey;
        config.model = config.model || 'claude-3-opus-20240229';
        break;
      case 'gemini':
        config.apiKey = process.env.GOOGLE_AI_API_KEY || config.apiKey;
        config.model = config.model || 'gemini-pro';
        break;
      case 'groq':
        config.apiKey = process.env.GROQ_API_KEY || config.apiKey;
        config.model = config.model || 'mixtral-8x7b-32768';
        config.baseUrl = 'https://api.groq.com/openai/v1';
        break;
      case 'ollama':
        config.baseUrl =
          process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        config.model = config.model || 'llama2';
        break;
      case 'cursor':
        config.apiKey = process.env.CURSOR_API_KEY || config.apiKey;
        config.baseUrl = 'https://api.cursor.com/v1';
        config.model = config.model || 'gpt-4';
        break;
    }

    return config;
  }

  /**
   * Initialize LLM providers
   */
  private initializeProviders() {
    try {
      switch (this.config.provider) {
        case 'openai':
        case 'groq':
        case 'cursor':
          this.openai = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseUrl,
          });
          break;
        case 'gemini':
          if (this.config.apiKey) {
            this.gemini = new GoogleGenerativeAI(this.config.apiKey);
          }
          break;
        case 'anthropic':
          // Anthropic SDK would be initialized here
          console.log(chalk.yellow('Anthropic provider configured'));
          break;
        case 'ollama':
          // Ollama uses REST API directly
          console.log(chalk.blue('Ollama provider configured'));
          break;
      }
    } catch (error) {
      console.error(chalk.red('Failed to initialize LLM provider:'), error);
    }
  }

  /**
   * Send message to LLM
   */
  async sendMessage(message: string, context?: string): Promise<LLMResponse> {
    try {
      console.log(
        chalk.blue(`🤖 Using ${this.config.provider} (${this.config.model})...`)
      );

      switch (this.config.provider) {
        case 'openai':
        case 'groq':
        case 'cursor':
          return await this.sendOpenAIMessage(message, context);
        case 'gemini':
          return await this.sendGeminiMessage(message, context);
        case 'anthropic':
          return await this.sendAnthropicMessage(message, context);
        case 'ollama':
          return await this.sendOllamaMessage(message, context);
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error(chalk.red('LLM Error:'), error);
      throw error;
    }
  }

  /**
   * Send message via OpenAI-compatible API
   */
  private async sendOpenAIMessage(
    message: string,
    context?: string
  ): Promise<LLMResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const systemPrompt =
      context ||
      'You are a helpful AI assistant for the AuraOS Autopilot system.';

    const completion = await this.openai.chat.completions.create({
      model: this.config.model!,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    return {
      content: completion.choices[0].message.content || '',
      provider: this.config.provider,
      model: this.config.model!,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Send message via Gemini API
   */
  private async sendGeminiMessage(
    message: string,
    context?: string
  ): Promise<LLMResponse> {
    if (!this.gemini) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.gemini.getGenerativeModel({ model: this.config.model! });
    const prompt = context ? `${context}\n\n${message}` : message;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      content: response.text(),
      provider: 'gemini',
      model: this.config.model!,
    };
  }

  /**
   * Send message via Anthropic API
   */
  private async sendAnthropicMessage(
    message: string,
    context?: string
  ): Promise<LLMResponse> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: this.config.model,
        messages: [{ role: 'user', content: message }],
        system:
          context ||
          'You are a helpful AI assistant for the AuraOS Autopilot system.',
        max_tokens: this.config.maxTokens,
      },
      {
        headers: {
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.content[0].text,
      provider: 'anthropic',
      model: this.config.model!,
      usage: response.data.usage
        ? {
            promptTokens: response.data.usage.input_tokens,
            completionTokens: response.data.usage.output_tokens,
            totalTokens:
              response.data.usage.input_tokens +
              response.data.usage.output_tokens,
          }
        : undefined,
    };
  }

  /**
   * Send message via Ollama API
   */
  private async sendOllamaMessage(
    message: string,
    context?: string
  ): Promise<LLMResponse> {
    const response = await axios.post(`${this.config.baseUrl}/api/generate`, {
      model: this.config.model,
      prompt: context ? `${context}\n\n${message}` : message,
      stream: false,
    });

    return {
      content: response.data.response,
      provider: 'ollama',
      model: this.config.model!,
    };
  }

  /**
   * Interactive chat with LLM
   */
  async interactiveChat() {
    console.log(chalk.blue.bold('\n🤖 Cursor LLM Chat\n'));
    console.log(
      chalk.gray(
        `Provider: ${this.config.provider} | Model: ${this.config.model}`
      )
    );
    console.log(
      chalk.gray(
        'Type "exit" to quit, "help" for commands, "switch" to change provider\n'
      )
    );

    const conversationHistory: Array<{ role: string; content: string }> = [];

    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('You:'),
          validate: input =>
            input.trim().length > 0 || 'Please enter a message',
        },
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\n👋 Goodbye!'));
        break;
      }

      if (message.toLowerCase() === 'help') {
        this.showHelp();
        continue;
      }

      if (message.toLowerCase() === 'switch') {
        await this.switchProvider();
        continue;
      }

      if (message.toLowerCase() === 'status') {
        this.showStatus();
        continue;
      }

      try {
        console.log(chalk.blue('🤔 Thinking...'));

        const response = await this.sendMessage(message);
        console.log(chalk.green('🤖 AI:'), response.content);

        if (response.usage) {
          console.log(
            chalk.gray(
              `   Tokens: ${response.usage.totalTokens} (Prompt: ${response.usage.promptTokens}, Completion: ${response.usage.completionTokens})`
            )
          );
        }

        conversationHistory.push({ role: 'user', content: message });
        conversationHistory.push({
          role: 'assistant',
          content: response.content,
        });
      } catch (error: any) {
        console.error(chalk.red('❌ Error:'), error.message);
      }

      console.log(''); // Empty line for readability
    }
  }

  /**
   * Code analysis with LLM
   */
  async analyzeCode(filePath: string) {
    console.log(chalk.blue.bold('\n📝 Code Analysis with LLM\n'));

    try {
      const code = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath);

      const prompt = `Please analyze this code file (${fileName}) and provide:
1. Summary of what the code does
2. Potential issues or bugs
3. Suggestions for improvement
4. Security considerations

Code:
\`\`\`
${code}
\`\`\``;

      console.log(chalk.yellow(`🔍 Analyzing ${fileName}...`));
      const response = await this.sendMessage(
        prompt,
        'You are an expert code reviewer.'
      );

      console.log(chalk.green('\n📊 Analysis Results:\n'));
      console.log(response.content);
    } catch (error: any) {
      console.error(chalk.red('❌ Analysis failed:'), error.message);
    }
  }

  /**
   * Generate code with LLM
   */
  async generateCode(description: string, language: string = 'typescript') {
    console.log(chalk.blue.bold('\n⚡ Code Generation with LLM\n'));

    const prompt = `Generate ${language} code for: ${description}

Requirements:
- Clean, well-commented code
- Error handling
- Best practices
- Type safety (if applicable)`;

    try {
      console.log(chalk.yellow('🔨 Generating code...'));
      const response = await this.sendMessage(
        prompt,
        `You are an expert ${language} developer.`
      );

      console.log(chalk.green('\n📄 Generated Code:\n'));
      console.log(response.content);

      // Offer to save the code
      const { save } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'save',
          message: 'Save generated code to file?',
          default: true,
        },
      ]);

      if (save) {
        const { filename } = await inquirer.prompt([
          {
            type: 'input',
            name: 'filename',
            message: 'Enter filename:',
            default: `generated.${language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language}`,
          },
        ]);

        await fs.writeFile(filename, response.content);
        console.log(chalk.green(`✅ Code saved to ${filename}`));
      }
    } catch (error: any) {
      console.error(chalk.red('❌ Generation failed:'), error.message);
    }
  }

  /**
   * Switch LLM provider
   */
  private async switchProvider() {
    const { provider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Select LLM provider:',
        choices: [
          { name: 'OpenAI (GPT-4)', value: 'openai' },
          { name: 'Anthropic (Claude)', value: 'anthropic' },
          { name: 'Google (Gemini)', value: 'gemini' },
          { name: 'Groq (Fast)', value: 'groq' },
          { name: 'Ollama (Local)', value: 'ollama' },
          { name: 'Cursor API', value: 'cursor' },
        ],
      },
    ]);

    this.config.provider = provider;

    // Ask for API key if needed
    if (provider !== 'ollama') {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter API key for ${provider} (or press Enter to use existing):`,
          mask: '*',
        },
      ]);

      if (apiKey) {
        this.config.apiKey = apiKey;
      }
    }

    // Reinitialize providers
    this.initializeProviders();
    console.log(chalk.green(`✅ Switched to ${provider}`));
  }

  /**
   * Show current status
   */
  private showStatus() {
    console.log(chalk.blue.bold('\n📊 LLM Configuration Status\n'));
    console.log(chalk.green('Current Settings:'));
    console.log(`  Provider: ${chalk.blue(this.config.provider)}`);
    console.log(`  Model: ${chalk.blue(this.config.model)}`);
    console.log(`  Temperature: ${chalk.blue(this.config.temperature)}`);
    console.log(`  Max Tokens: ${chalk.blue(this.config.maxTokens)}`);
    console.log(
      `  API Key: ${chalk.blue(this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : 'Not set')}`
    );
    if (this.config.baseUrl) {
      console.log(`  Base URL: ${chalk.blue(this.config.baseUrl)}`);
    }
    console.log('');
  }

  /**
   * Show help
   */
  private showHelp() {
    console.log(chalk.blue.bold('\n📚 Cursor LLM Commands\n'));
    console.log(chalk.green('Available commands:'));
    console.log('  help    - Show this help message');
    console.log('  exit    - Exit the chat');
    console.log('  switch  - Switch LLM provider');
    console.log('  status  - Show current configuration');
    console.log('');
  }
}

// CLI Setup
const program = new Command();
const llm = new CursorLLMIntegration();

program
  .name('cursor-llm')
  .description('Cursor CLI with LLM Integration')
  .version('2.0.0');

program
  .command('chat')
  .description('Interactive chat with LLM')
  .action(async () => {
    await llm.interactiveChat();
    process.exit(0);
  });

program
  .command('analyze <file>')
  .description('Analyze code file with LLM')
  .action(async file => {
    await llm.analyzeCode(file);
    process.exit(0);
  });

program
  .command('generate')
  .description('Generate code with LLM')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-d, --description <desc>', 'Code description')
  .action(async options => {
    let description = options.description;

    if (!description) {
      const { desc } = await inquirer.prompt([
        {
          type: 'input',
          name: 'desc',
          message: 'What code do you want to generate?',
          validate: input =>
            input.trim().length > 0 || 'Please enter a description',
        },
      ]);
      description = desc;
    }

    await llm.generateCode(description, options.language);
    process.exit(0);
  });

program
  .command('ask <question>')
  .description('Ask a quick question to LLM')
  .action(async question => {
    try {
      console.log(chalk.blue('🤔 Thinking...'));
      const response = await llm.sendMessage(question);
      console.log(chalk.green('\n🤖 Answer:\n'));
      console.log(response.content);
    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
    process.exit(0);
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

export { CursorLLMIntegration, LLMConfig, LLMProvider, LLMResponse };
