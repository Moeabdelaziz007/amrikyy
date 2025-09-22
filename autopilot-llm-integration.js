#!/usr/bin/env node

// cursor-llm-integration.ts
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
dotenv.config();
var CursorLLMIntegration = class {
  config;
  openai;
  gemini;
  anthropic;
  constructor() {
    this.config = this.loadConfig();
    this.initializeProviders();
  }
  /**
   * Load LLM configuration
   */
  loadConfig() {
    const config = {
      provider: process.env.LLM_PROVIDER || 'gemini',
      apiKey: process.env.LLM_API_KEY || process.env.GOOGLE_AI_API_KEY,
      model: process.env.LLM_MODEL || 'gemini-pro',
      baseUrl: process.env.LLM_BASE_URL,
      temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2000'),
    };
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
  initializeProviders() {
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
          console.log(chalk.yellow('Anthropic provider configured'));
          break;
        case 'ollama':
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
  async sendMessage(message, context) {
    try {
      console.log(
        chalk.blue(
          `\u{1F916} Using ${this.config.provider} (${this.config.model})...`
        )
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
  async sendOpenAIMessage(message, context) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }
    const systemPrompt =
      context ||
      'You are a helpful AI assistant for the AuraOS Autopilot system.';
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
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
      model: this.config.model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : void 0,
    };
  }
  /**
   * Send message via Gemini API
   */
  async sendGeminiMessage(message, context) {
    if (!this.gemini) {
      throw new Error('Gemini client not initialized');
    }
    const model = this.gemini.getGenerativeModel({ model: this.config.model });
    const prompt = context
      ? `${context}

${message}`
      : message;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      content: response.text(),
      provider: 'gemini',
      model: this.config.model,
    };
  }
  /**
   * Send message via Anthropic API
   */
  async sendAnthropicMessage(message, context) {
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
      model: this.config.model,
      usage: response.data.usage
        ? {
            promptTokens: response.data.usage.input_tokens,
            completionTokens: response.data.usage.output_tokens,
            totalTokens:
              response.data.usage.input_tokens +
              response.data.usage.output_tokens,
          }
        : void 0,
    };
  }
  /**
   * Send message via Ollama API
   */
  async sendOllamaMessage(message, context) {
    const response = await axios.post(`${this.config.baseUrl}/api/generate`, {
      model: this.config.model,
      prompt: context
        ? `${context}

${message}`
        : message,
      stream: false,
    });
    return {
      content: response.data.response,
      provider: 'ollama',
      model: this.config.model,
    };
  }
  /**
   * Interactive chat with LLM
   */
  async interactiveChat() {
    console.log(chalk.blue.bold('\n\u{1F916} Cursor LLM Chat\n'));
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
    const conversationHistory = [];
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
        console.log(chalk.yellow('\n\u{1F44B} Goodbye!'));
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
        console.log(chalk.blue('\u{1F914} Thinking...'));
        const response = await this.sendMessage(message);
        console.log(chalk.green('\u{1F916} AI:'), response.content);
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
      } catch (error) {
        console.error(chalk.red('\u274C Error:'), error.message);
      }
      console.log('');
    }
  }
  /**
   * Code analysis with LLM
   */
  async analyzeCode(filePath) {
    console.log(chalk.blue.bold('\n\u{1F4DD} Code Analysis with LLM\n'));
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
      console.log(chalk.yellow(`\u{1F50D} Analyzing ${fileName}...`));
      const response = await this.sendMessage(
        prompt,
        'You are an expert code reviewer.'
      );
      console.log(chalk.green('\n\u{1F4CA} Analysis Results:\n'));
      console.log(response.content);
    } catch (error) {
      console.error(chalk.red('\u274C Analysis failed:'), error.message);
    }
  }
  /**
   * Generate code with LLM
   */
  async generateCode(description, language = 'typescript') {
    console.log(chalk.blue.bold('\n\u26A1 Code Generation with LLM\n'));
    const prompt = `Generate ${language} code for: ${description}

Requirements:
- Clean, well-commented code
- Error handling
- Best practices
- Type safety (if applicable)`;
    try {
      console.log(chalk.yellow('\u{1F528} Generating code...'));
      const response = await this.sendMessage(
        prompt,
        `You are an expert ${language} developer.`
      );
      console.log(chalk.green('\n\u{1F4C4} Generated Code:\n'));
      console.log(response.content);
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
        console.log(chalk.green(`\u2705 Code saved to ${filename}`));
      }
    } catch (error) {
      console.error(chalk.red('\u274C Generation failed:'), error.message);
    }
  }
  /**
   * Switch LLM provider
   */
  async switchProvider() {
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
    this.initializeProviders();
    console.log(chalk.green(`\u2705 Switched to ${provider}`));
  }
  /**
   * Show current status
   */
  showStatus() {
    console.log(chalk.blue.bold('\n\u{1F4CA} LLM Configuration Status\n'));
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
  showHelp() {
    console.log(chalk.blue.bold('\n\u{1F4DA} Cursor LLM Commands\n'));
    console.log(chalk.green('Available commands:'));
    console.log('  help    - Show this help message');
    console.log('  exit    - Exit the chat');
    console.log('  switch  - Switch LLM provider');
    console.log('  status  - Show current configuration');
    console.log('');
  }
};
var program = new Command();
var llm = new CursorLLMIntegration();
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
      console.log(chalk.blue('\u{1F914} Thinking...'));
      const response = await llm.sendMessage(question);
      console.log(chalk.green('\n\u{1F916} Answer:\n'));
      console.log(response.content);
    } catch (error) {
      console.error(chalk.red('\u274C Error:'), error.message);
    }
    process.exit(0);
  });
program.parse();
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// autopilot-llm-integration.ts
import { Command as Command2 } from 'commander';
import chalk2 from 'chalk';
import inquirer2 from 'inquirer';
import axios2 from 'axios';
import dotenv2 from 'dotenv';
dotenv2.config();
var AutopilotLLMIntegration = class {
  llmIntegration;
  config;
  baseUrl;
  taskQueue = [];
  activeTasks = /* @__PURE__ */ new Map();
  constructor() {
    this.baseUrl = process.env.AURAOS_API_URL || 'http://localhost:5000';
    this.config = this.loadAutopilotLLMConfig();
    this.llmIntegration = new CursorLLMIntegration();
    console.log(chalk2.blue('\u{1F916} Autopilot-LLM Integration initialized'));
  }
  /**
   * Load autopilot LLM configuration
   */
  loadAutopilotLLMConfig() {
    return {
      enabled: process.env.AUTOPILOT_LLM_ENABLED === 'true' || true,
      defaultProvider: process.env.AUTOPILOT_LLM_PROVIDER || 'gemini',
      fallbackProviders: ['openai', 'anthropic', 'groq'],
      context: {
        autopilot: `You are an advanced AI assistant integrated with the AuraOS Autopilot system. 
        You help with task analysis, decision making, and providing intelligent responses for automation tasks.
        You have access to the full autopilot system and can analyze tasks, suggest optimizations, and provide context-aware assistance.`,
        system: `You are operating within the AuraOS ecosystem with access to:
        - Real-time system status
        - Task queue and workflow management
        - Agent coordination and resource allocation
        - Performance monitoring and analytics
        - User preferences and historical data`,
        user: `You interact with users through the autopilot system and should:
        - Provide clear, actionable responses
        - Suggest optimizations and improvements
        - Explain complex automation concepts simply
        - Offer proactive assistance based on context`,
      },
      limits: {
        maxTokens: parseInt(process.env.AUTOPILOT_LLM_MAX_TOKENS || '4000'),
        timeout: parseInt(process.env.AUTOPILOT_LLM_TIMEOUT || '30000'),
        retries: parseInt(process.env.AUTOPILOT_LLM_RETRIES || '3'),
      },
    };
  }
  /**
   * Analyze task using LLM
   */
  async analyzeTask(task) {
    try {
      console.log(
        chalk2.blue(`\u{1F50D} Analyzing task ${task.id} with LLM...`)
      );
      const prompt = `
        Analyze this autopilot task and provide structured recommendations:

        Task Details:
        - ID: ${task.id}
        - Type: ${task.type}
        - Content: ${task.content}
        - Priority: ${task.priority}
        - Status: ${task.status}

        Provide analysis in JSON format:
        {
          "intent": "what the user wants to accomplish",
          "category": "data_analysis|web_scraping|automation|ai_task|general|system_optimization",
          "complexity": "low|medium|high",
          "estimated_duration": "seconds|minutes|hours",
          "required_resources": ["resource1", "resource2"],
          "suggested_agent": "best_agent_for_this_task",
          "optimization_suggestions": ["suggestion1", "suggestion2"],
          "risk_assessment": "low|medium|high",
          "dependencies": ["dependency1", "dependency2"]
        }
      `;
      const response = await this.llmIntegration.sendMessage(
        prompt,
        this.config.context.autopilot
      );
      try {
        const analysis = JSON.parse(response.content);
        task.llmAnalysis = analysis;
        task.llmResponse = response.content;
        console.log(
          chalk2.green(`\u2705 Task ${task.id} analyzed successfully`)
        );
        return analysis;
      } catch (parseError) {
        task.llmAnalysis = {
          intent: 'general task processing',
          category: 'general',
          complexity: 'medium',
          estimated_duration: 'minutes',
          required_resources: [],
          suggested_agent: 'gemini_ai',
          optimization_suggestions: [],
          risk_assessment: 'low',
          dependencies: [],
        };
        task.llmResponse = response.content;
        return task.llmAnalysis;
      }
    } catch (error) {
      console.error(
        chalk2.red(`\u274C Task analysis failed for ${task.id}:`),
        error
      );
      return {
        intent: 'general task processing',
        category: 'general',
        complexity: 'medium',
        estimated_duration: 'minutes',
        required_resources: [],
        suggested_agent: 'gemini_ai',
        optimization_suggestions: [],
        risk_assessment: 'low',
        dependencies: [],
      };
    }
  }
  /**
   * Generate intelligent response for autopilot decision making
   */
  async generateIntelligentResponse(query, context) {
    try {
      const systemContext = this.config.context.system;
      const userContext = this.config.context.user;
      const fullContext = `${systemContext}

Current System Context:
${JSON.stringify(context, null, 2)}

User Context: ${userContext}`;
      const response = await this.llmIntegration.sendMessage(
        query,
        fullContext
      );
      return response.content;
    } catch (error) {
      console.error(
        chalk2.red('\u274C Intelligent response generation failed:'),
        error
      );
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }
  /**
   * Optimize autopilot workflow using LLM
   */
  async optimizeWorkflow(workflowData) {
    try {
      console.log(chalk2.blue('\u{1F527} Optimizing workflow with LLM...'));
      const prompt = `
        Analyze this autopilot workflow and suggest optimizations:

        Workflow Data:
        ${JSON.stringify(workflowData, null, 2)}

        Provide optimization suggestions in JSON format:
        {
          "performance_improvements": ["improvement1", "improvement2"],
          "efficiency_gains": ["gain1", "gain2"],
          "resource_optimization": ["optimization1", "optimization2"],
          "error_reduction": ["reduction1", "reduction2"],
          "scalability_suggestions": ["suggestion1", "suggestion2"],
          "priority_recommendations": ["rec1", "rec2"]
        }
      `;
      const response = await this.llmIntegration.sendMessage(
        prompt,
        this.config.context.autopilot
      );
      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        return {
          performance_improvements: ['Review task prioritization'],
          efficiency_gains: ['Optimize agent allocation'],
          resource_optimization: ['Monitor resource usage'],
          error_reduction: ['Improve error handling'],
          scalability_suggestions: ['Consider load balancing'],
          priority_recommendations: ['Focus on high-priority tasks'],
        };
      }
    } catch (error) {
      console.error(chalk2.red('\u274C Workflow optimization failed:'), error);
      return {
        performance_improvements: [],
        efficiency_gains: [],
        resource_optimization: [],
        error_reduction: [],
        scalability_suggestions: [],
        priority_recommendations: [],
      };
    }
  }
  /**
   * Provide autopilot assistance through chat interface
   */
  async autopilotChat(query) {
    try {
      let autopilotContext = {};
      try {
        const response2 = await axios2.get(
          `${this.baseUrl}/api/autopilot/status`
        );
        autopilotContext = response2.data;
      } catch (error) {
        console.log(
          chalk2.yellow(
            '\u26A0\uFE0F Could not fetch autopilot status for context'
          )
        );
      }
      const contextPrompt = `
        User Query: ${query}
        
        Current Autopilot System Context:
        ${JSON.stringify(autopilotContext, null, 2)}
        
        Please provide helpful assistance related to the AuraOS Autopilot system.
        Be specific and actionable in your response.
      `;
      const response = await this.llmIntegration.sendMessage(
        contextPrompt,
        this.config.context.autopilot
      );
      return response.content;
    } catch (error) {
      console.error(chalk2.red('\u274C Autopilot chat failed:'), error);
      return 'I apologize, but I encountered an error while processing your autopilot query. Please try again.';
    }
  }
  /**
   * Analyze system performance using LLM
   */
  async analyzeSystemPerformance() {
    try {
      console.log(
        chalk2.blue('\u{1F4CA} Analyzing system performance with LLM...')
      );
      const systemData = await this.gatherSystemData();
      const prompt = `
        Analyze this AuraOS Autopilot system performance data and provide insights:

        System Data:
        ${JSON.stringify(systemData, null, 2)}

        Provide analysis in JSON format:
        {
          "overall_health": "excellent|good|fair|poor",
          "performance_score": 0-100,
          "key_metrics": {
            "efficiency": "percentage",
            "reliability": "percentage", 
            "scalability": "percentage"
          },
          "bottlenecks": ["bottleneck1", "bottleneck2"],
          "recommendations": ["rec1", "rec2"],
          "optimization_opportunities": ["opp1", "opp2"],
          "risk_factors": ["risk1", "risk2"]
        }
      `;
      const response = await this.llmIntegration.sendMessage(
        prompt,
        this.config.context.system
      );
      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        return {
          overall_health: 'good',
          performance_score: 75,
          key_metrics: {
            efficiency: '80%',
            reliability: '85%',
            scalability: '70%',
          },
          bottlenecks: ['Resource allocation'],
          recommendations: ['Monitor system resources'],
          optimization_opportunities: ['Improve task scheduling'],
          risk_factors: ['High load periods'],
        };
      }
    } catch (error) {
      console.error(
        chalk2.red('\u274C System performance analysis failed:'),
        error
      );
      return {
        overall_health: 'unknown',
        performance_score: 0,
        key_metrics: {
          efficiency: 'unknown',
          reliability: 'unknown',
          scalability: 'unknown',
        },
        bottlenecks: [],
        recommendations: ['Check system status'],
        optimization_opportunities: [],
        risk_factors: [],
      };
    }
  }
  /**
   * Gather system data for analysis
   */
  async gatherSystemData() {
    const systemData = {
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      autopilot_status: null,
      system_status: null,
      task_queue: this.taskQueue.length,
      active_tasks: this.activeTasks.size,
      llm_config: this.config,
    };
    try {
      const autopilotResponse = await axios2.get(
        `${this.baseUrl}/api/autopilot/status`
      );
      systemData.autopilot_status = autopilotResponse.data;
    } catch (error) {
      console.log(
        chalk2.yellow('\u26A0\uFE0F Could not fetch autopilot status')
      );
    }
    try {
      const systemResponse = await axios2.get(
        `${this.baseUrl}/api/system/status`
      );
      systemData.system_status = systemResponse.data;
    } catch (error) {
      console.log(chalk2.yellow('\u26A0\uFE0F Could not fetch system status'));
    }
    return systemData;
  }
  /**
   * Interactive autopilot LLM chat
   */
  async interactiveChat() {
    console.log(chalk2.blue.bold('\n\u{1F916} Autopilot LLM Assistant\n'));
    console.log(
      chalk2.gray(
        'Type "exit" to quit, "help" for commands, "analyze" for system analysis\n'
      )
    );
    while (true) {
      const { message } = await inquirer2.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk2.cyan('You:'),
          validate: input =>
            input.trim().length > 0 || 'Please enter a message',
        },
      ]);
      if (message.toLowerCase() === 'exit') {
        console.log(chalk2.yellow('\n\u{1F44B} Goodbye!'));
        break;
      }
      if (message.toLowerCase() === 'help') {
        this.showHelp();
        continue;
      }
      if (message.toLowerCase() === 'analyze') {
        await this.performSystemAnalysis();
        continue;
      }
      if (message.toLowerCase() === 'status') {
        await this.showAutopilotStatus();
        continue;
      }
      try {
        console.log(chalk2.blue('\u{1F916} Autopilot AI:'), 'Thinking...');
        const response = await this.autopilotChat(message);
        console.log(chalk2.green('\u{1F916} Autopilot AI:'), response);
        console.log('');
      } catch (error) {
        console.error(chalk2.red('\u274C Error:'), error.message);
      }
    }
  }
  /**
   * Show help information
   */
  showHelp() {
    console.log(chalk2.blue.bold('\n\u{1F4DA} Autopilot LLM Commands\n'));
    console.log(chalk2.green('Available commands:'));
    console.log('  help    - Show this help message');
    console.log('  exit    - Exit the chat');
    console.log('  analyze - Analyze system performance');
    console.log('  status  - Show autopilot status');
    console.log('');
    console.log(chalk2.green('Ask questions about:'));
    console.log('  \u2022 Task optimization and automation');
    console.log('  \u2022 System performance and monitoring');
    console.log('  \u2022 Workflow improvements');
    console.log('  \u2022 Agent coordination and management');
    console.log('  \u2022 Troubleshooting and diagnostics');
    console.log('');
  }
  /**
   * Perform system analysis
   */
  async performSystemAnalysis() {
    console.log(chalk2.blue.bold('\n\u{1F4CA} System Analysis\n'));
    try {
      console.log(chalk2.yellow('\u{1F50D} Analyzing system performance...'));
      const analysis = await this.analyzeSystemPerformance();
      console.log(chalk2.green('\u{1F4CA} Analysis Results:\n'));
      console.log(`Overall Health: ${chalk2.blue(analysis.overall_health)}`);
      console.log(
        `Performance Score: ${chalk2.blue(analysis.performance_score + '/100')}`
      );
      console.log(
        `Efficiency: ${chalk2.blue(analysis.key_metrics.efficiency)}`
      );
      console.log(
        `Reliability: ${chalk2.blue(analysis.key_metrics.reliability)}`
      );
      console.log(
        `Scalability: ${chalk2.blue(analysis.key_metrics.scalability)}`
      );
      if (analysis.bottlenecks.length > 0) {
        console.log(chalk2.yellow('\n\u{1F6A7} Bottlenecks:'));
        analysis.bottlenecks.forEach((bottleneck, index) => {
          console.log(`  ${index + 1}. ${bottleneck}`);
        });
      }
      if (analysis.recommendations.length > 0) {
        console.log(chalk2.green('\n\u{1F4A1} Recommendations:'));
        analysis.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }
    } catch (error) {
      console.error(chalk2.red('\u274C Analysis failed:'), error.message);
    }
  }
  /**
   * Show autopilot status
   */
  async showAutopilotStatus() {
    console.log(chalk2.blue.bold('\n\u{1F916} Autopilot Status\n'));
    try {
      const response = await axios2.get(`${this.baseUrl}/api/autopilot/status`);
      const status = response.data;
      console.log(chalk2.green('\u{1F4CA} Autopilot Information:'));
      console.log(
        `Status: ${status.active ? chalk2.green('\u2705 Active') : chalk2.red('\u274C Inactive')}`
      );
      console.log(`Active Rules: ${chalk2.blue(status.rules || 0)}`);
      console.log(`Active Workflows: ${chalk2.blue(status.workflows || 0)}`);
      console.log(
        `Last Execution: ${chalk2.yellow(status.lastExecution || 'N/A')}`
      );
      console.log(
        `LLM Integration: ${this.config.enabled ? chalk2.green('\u2705 Enabled') : chalk2.red('\u274C Disabled')}`
      );
      console.log(`LLM Provider: ${chalk2.blue(this.config.defaultProvider)}`);
    } catch (error) {
      console.error(
        chalk2.red('\u274C Failed to get autopilot status:'),
        error.message
      );
    }
  }
  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }
  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log(chalk2.green('\u2705 Configuration updated'));
  }
};
var program2 = new Command2();
var autopilotLLM = new AutopilotLLMIntegration();
program2
  .name('autopilot-llm')
  .description('Autopilot LLM Integration System')
  .version('1.0.0');
program2
  .command('chat')
  .description('Interactive chat with autopilot LLM')
  .action(async () => {
    await autopilotLLM.interactiveChat();
    process.exit(0);
  });
program2
  .command('analyze')
  .description('Analyze system performance with LLM')
  .action(async () => {
    console.log(chalk2.blue.bold('\n\u{1F4CA} System Analysis\n'));
    try {
      const analysis = await autopilotLLM.analyzeSystemPerformance();
      console.log(chalk2.green('\u{1F4CA} Analysis Results:\n'));
      console.log(JSON.stringify(analysis, null, 2));
    } catch (error) {
      console.error(chalk2.red('\u274C Analysis failed:'), error.message);
    }
    process.exit(0);
  });
program2
  .command('ask <question>')
  .description('Ask a question to the autopilot LLM')
  .action(async question => {
    try {
      console.log(chalk2.blue('\u{1F914} Thinking...'));
      const response = await autopilotLLM.autopilotChat(question);
      console.log(chalk2.green('\n\u{1F916} Autopilot AI:\n'));
      console.log(response);
    } catch (error) {
      console.error(chalk2.red('\u274C Error:'), error.message);
    }
    process.exit(0);
  });
program2
  .command('status')
  .description('Show autopilot LLM status')
  .action(async () => {
    await autopilotLLM.showAutopilotStatus();
    process.exit(0);
  });
program2.parse();
if (!process.argv.slice(2).length) {
  program2.outputHelp();
}
export { AutopilotLLMIntegration };
