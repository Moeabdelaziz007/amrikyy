// Gemini API Integration for MCP Protocol
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventEmitter } from 'events';
import axios from 'axios';
import { createHash } from 'crypto';

// Enhanced error handling
export class GeminiMCPError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'GeminiMCPError';
  }
}

// Gemini MCP Tool interface
export interface GeminiMCPTool {
  name: string;
  description: string;
  inputSchema: any;
  execute: (params: any) => Promise<any>;
  category: 'text' | 'image' | 'audio' | 'web' | 'data' | 'utility' | 'ai';
  isFree: boolean;
  rateLimit?: number;
  timeout?: number;
  retries?: number;
  usesGemini: boolean;
}

// Configuration for Gemini
export interface GeminiConfig {
  apiKey: string;
  model: string;
  safetySettings: any[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export class GeminiMCPProtocol extends EventEmitter {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private tools: Map<string, GeminiMCPTool> = new Map();
  private config: GeminiConfig;
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private rateLimits: Map<string, { count: number; resetTime: number }> =
    new Map();
  private metrics: Map<string, number> = new Map();

  constructor(apiKey: string) {
    super();
    this.config = this.loadConfig(apiKey);
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: this.config.model,
      safetySettings: this.config.safetySettings,
      generationConfig: this.config.generationConfig,
    });
    this.initializeGeminiTools();
  }

  private loadConfig(apiKey: string): GeminiConfig {
    return {
      apiKey,
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };
  }

  private initializeGeminiTools() {
    // Gemini-powered Text Analysis
    this.addTool({
      name: 'gemini_sentiment_analysis',
      description: 'Advanced sentiment analysis using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 100,
      timeout: 15000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze for sentiment',
          },
          detail: {
            type: 'string',
            enum: ['simple', 'detailed'],
            default: 'simple',
            description: 'Level of analysis detail',
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['text'],
      },
      execute: async params => {
        return await this.executeWithGemini('sentiment', params);
      },
    });

    // Gemini-powered Text Summarization
    this.addTool({
      name: 'gemini_text_summarization',
      description: 'Intelligent text summarization using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 50,
      timeout: 20000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to summarize' },
          maxLength: {
            type: 'number',
            description: 'Maximum summary length in words',
            default: 100,
          },
          style: {
            type: 'string',
            enum: ['concise', 'detailed', 'bullet_points'],
            default: 'concise',
            description: 'Summary style',
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['text'],
      },
      execute: async params => {
        return await this.executeWithGemini('summarization', params);
      },
    });

    // Gemini-powered Translation
    this.addTool({
      name: 'gemini_translation',
      description: 'Context-aware translation using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 200,
      timeout: 15000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to translate' },
          from: {
            type: 'string',
            description: 'Source language',
            default: 'auto',
          },
          to: { type: 'string', description: 'Target language', default: 'en' },
          context: {
            type: 'string',
            description: 'Additional context for better translation',
            default: '',
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['text', 'to'],
      },
      execute: async params => {
        return await this.executeWithGemini('translation', params);
      },
    });

    // Gemini-powered Code Explanation
    this.addTool({
      name: 'gemini_code_explanation',
      description: 'Explain code using Gemini AI with context awareness',
      category: 'ai',
      isFree: true,
      rateLimit: 100,
      timeout: 20000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Code to explain' },
          language: {
            type: 'string',
            description: 'Programming language',
            default: 'javascript',
          },
          detail: {
            type: 'string',
            enum: ['simple', 'detailed', 'comprehensive'],
            default: 'detailed',
            description: 'Explanation detail level',
          },
          includeExamples: {
            type: 'boolean',
            description: 'Include code examples',
            default: true,
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['code'],
      },
      execute: async params => {
        return await this.executeWithGemini('code_explanation', params);
      },
    });

    // Gemini-powered Content Generation
    this.addTool({
      name: 'gemini_content_generation',
      description: 'Generate creative content using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 50,
      timeout: 25000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Content generation prompt' },
          type: {
            type: 'string',
            enum: ['article', 'story', 'poem', 'email', 'social_media'],
            default: 'article',
            description: 'Type of content',
          },
          length: {
            type: 'string',
            enum: ['short', 'medium', 'long'],
            default: 'medium',
            description: 'Content length',
          },
          tone: {
            type: 'string',
            enum: ['professional', 'casual', 'creative', 'technical'],
            default: 'professional',
            description: 'Content tone',
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['prompt'],
      },
      execute: async params => {
        return await this.executeWithGemini('content_generation', params);
      },
    });

    // Gemini-powered Data Analysis
    this.addTool({
      name: 'gemini_data_analysis',
      description: 'Analyze data and generate insights using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 30,
      timeout: 30000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          data: {
            type: 'string',
            description: 'Data to analyze (JSON, CSV, or text)',
          },
          analysisType: {
            type: 'string',
            enum: ['trends', 'patterns', 'summary', 'insights'],
            default: 'insights',
            description: 'Type of analysis',
          },
          context: {
            type: 'string',
            description: 'Additional context about the data',
            default: '',
          },
          format: {
            type: 'string',
            enum: ['json', 'csv', 'text'],
            default: 'text',
            description: 'Data format',
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['data'],
      },
      execute: async params => {
        return await this.executeWithGemini('data_analysis', params);
      },
    });

    // Gemini-powered Question Answering
    this.addTool({
      name: 'gemini_question_answering',
      description: 'Answer questions using Gemini AI with context',
      category: 'ai',
      isFree: true,
      rateLimit: 100,
      timeout: 15000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'Question to answer' },
          context: {
            type: 'string',
            description: 'Additional context for the question',
            default: '',
          },
          detail: {
            type: 'string',
            enum: ['brief', 'detailed', 'comprehensive'],
            default: 'detailed',
            description: 'Answer detail level',
          },
          includeSources: {
            type: 'boolean',
            description: 'Include source information',
            default: false,
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['question'],
      },
      execute: async params => {
        return await this.executeWithGemini('question_answering', params);
      },
    });

    // Gemini-powered Text Enhancement
    this.addTool({
      name: 'gemini_text_enhancement',
      description: 'Enhance and improve text using Gemini AI',
      category: 'ai',
      isFree: true,
      rateLimit: 100,
      timeout: 20000,
      retries: 2,
      usesGemini: true,
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to enhance' },
          enhancement: {
            type: 'string',
            enum: ['grammar', 'clarity', 'style', 'tone', 'all'],
            default: 'all',
            description: 'Type of enhancement',
          },
          targetAudience: {
            type: 'string',
            enum: ['general', 'professional', 'academic', 'casual'],
            default: 'general',
            description: 'Target audience',
          },
          preserveOriginal: {
            type: 'boolean',
            description: 'Preserve original meaning',
            default: true,
          },
          useCache: {
            type: 'boolean',
            description: 'Use cached results',
            default: true,
          },
        },
        required: ['text'],
      },
      execute: async params => {
        return await this.executeWithGemini('text_enhancement', params);
      },
    });
  }

  private addTool(tool: GeminiMCPTool) {
    this.tools.set(tool.name, tool);
  }

  private async executeWithGemini(
    operation: string,
    params: any
  ): Promise<any> {
    const tool = this.tools.get(`gemini_${operation}`);
    if (!tool) {
      throw new GeminiMCPError(
        'TOOL_NOT_FOUND',
        `Tool gemini_${operation} not found`
      );
    }

    // Check rate limits
    if (tool.rateLimit) {
      const canProceed = await this.checkRateLimit(tool.name, tool.rateLimit);
      if (!canProceed) {
        throw new GeminiMCPError(
          'RATE_LIMIT_EXCEEDED',
          `Rate limit exceeded for ${tool.name}`,
          null,
          true
        );
      }
    }

    // Check cache
    const cacheKey = `${tool.name}_${JSON.stringify(params)}`;
    if (params.useCache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.incrementMetric('cache_hits');
        return { ...cached, fromCache: true };
      }
    }

    // Execute with retries
    const result = await this.executeWithRetry(
      () => this.executeGeminiOperation(operation, params),
      tool.retries || 2
    );

    // Cache result
    if (params.useCache !== false) {
      this.setCache(cacheKey, result);
    }

    this.incrementMetric('gemini_api_calls');
    return result;
  }

  private async executeGeminiOperation(
    operation: string,
    params: any
  ): Promise<any> {
    const startTime = Date.now();

    try {
      let prompt = '';
      let result: any;

      switch (operation) {
        case 'sentiment':
          prompt = this.buildSentimentPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'summarization':
          prompt = this.buildSummarizationPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'translation':
          prompt = this.buildTranslationPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'code_explanation':
          prompt = this.buildCodeExplanationPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'content_generation':
          prompt = this.buildContentGenerationPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'data_analysis':
          prompt = this.buildDataAnalysisPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'question_answering':
          prompt = this.buildQuestionAnsweringPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        case 'text_enhancement':
          prompt = this.buildTextEnhancementPrompt(params);
          result = await this.callGeminiAPI(prompt);
          break;
        default:
          throw new GeminiMCPError(
            'UNKNOWN_OPERATION',
            `Unknown operation: ${operation}`
          );
      }

      const duration = Date.now() - startTime;
      this.incrementMetric('gemini_response_time', duration);

      return {
        success: true,
        result: this.parseGeminiResponse(operation, result),
        duration,
        timestamp: new Date().toISOString(),
        operation,
        model: this.config.model,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.incrementMetric('gemini_error_time', duration);
      throw error;
    }
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new GeminiMCPError(
        'GEMINI_API_ERROR',
        `Gemini API error: ${error.message}`,
        error,
        true
      );
    }
  }

  private buildSentimentPrompt(params: any): string {
    const { text, detail } = params;
    const detailLevel =
      detail === 'detailed' ? 'detailed analysis' : 'simple analysis';

    return `Analyze the sentiment of the following text and provide a ${detailLevel}:

Text: "${text}"

Please provide:
1. Overall sentiment (positive, negative, neutral)
2. Confidence level (0-1)
3. Key emotional indicators
${detail === 'detailed' ? '4. Emotional nuances and context\n5. Suggested improvements if negative' : ''}

Format your response as JSON with the following structure:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.0-1.0,
  "indicators": ["list", "of", "key", "words"],
  ${detail === 'detailed' ? '"nuances": "detailed analysis",\n  "suggestions": "improvement suggestions"' : ''}
}`;
  }

  private buildSummarizationPrompt(params: any): string {
    const { text, maxLength, style } = params;

    let styleInstruction = '';
    switch (style) {
      case 'concise':
        styleInstruction = 'Provide a concise summary';
        break;
      case 'detailed':
        styleInstruction = 'Provide a detailed summary';
        break;
      case 'bullet_points':
        styleInstruction = 'Provide a summary in bullet points';
        break;
    }

    return `${styleInstruction} of the following text in approximately ${maxLength} words:

Text: "${text}"

Requirements:
- Maintain key information
- Use clear, readable language
- ${style === 'bullet_points' ? 'Format as bullet points' : 'Format as flowing text'}
- Include main topics and conclusions

Summary:`;
  }

  private buildTranslationPrompt(params: any): string {
    const { text, from, to, context } = params;

    return `Translate the following text from ${from === 'auto' ? 'the detected language' : from} to ${to}:

Text: "${text}"
${context ? `Context: ${context}` : ''}

Requirements:
- Provide accurate translation
- Maintain original meaning and tone
- Use appropriate cultural context
- If source language is auto-detected, mention the detected language

Translation:`;
  }

  private buildCodeExplanationPrompt(params: any): string {
    const { code, language, detail, includeExamples } = params;

    return `Explain the following ${language} code with ${detail} detail:

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overall purpose and functionality
2. Line-by-line explanation
3. Key concepts and patterns used
${includeExamples ? '4. Similar examples or use cases' : ''}
${detail === 'comprehensive' ? '5. Potential improvements or optimizations\n6. Common pitfalls or considerations' : ''}

Format your response in a clear, structured manner.`;
  }

  private buildContentGenerationPrompt(params: any): string {
    const { prompt, type, length, tone } = params;

    return `Generate ${type} content based on the following prompt:

Prompt: "${prompt}"

Requirements:
- Type: ${type}
- Length: ${length}
- Tone: ${tone}
- Be creative and engaging
- Follow best practices for ${type} writing
- Ensure content is original and valuable

Generated Content:`;
  }

  private buildDataAnalysisPrompt(params: any): string {
    const { data, analysisType, context, format } = params;

    return `Analyze the following ${format} data and provide ${analysisType} insights:

Data:
${data}

${context ? `Context: ${context}` : ''}

Please provide:
1. Key findings and patterns
2. Statistical insights
3. Trends and correlations
4. Actionable recommendations
5. Data quality assessment

Format your analysis in a clear, structured manner.`;
  }

  private buildQuestionAnsweringPrompt(params: any): string {
    const { question, context, detail, includeSources } = params;

    return `Answer the following question with ${detail} detail:

Question: ${question}
${context ? `Context: ${context}` : ''}

Requirements:
- Provide accurate, well-reasoned answer
- Use the context if provided
- Be comprehensive but concise
${includeSources ? '- Include relevant sources or references' : ''}
- Structure your response clearly

Answer:`;
  }

  private buildTextEnhancementPrompt(params: any): string {
    const { text, enhancement, targetAudience, preserveOriginal } = params;

    return `Enhance the following text for ${enhancement} improvement targeting ${targetAudience} audience:

Original Text: "${text}"

Requirements:
- Focus on: ${enhancement}
- Target audience: ${targetAudience}
- ${preserveOriginal ? 'Preserve original meaning and intent' : 'Feel free to improve meaning if needed'}
- Maintain appropriate tone and style
- Provide both original and enhanced versions

Enhanced Text:`;
  }

  private parseGeminiResponse(operation: string, response: string): any {
    try {
      // Try to parse as JSON first
      if (response.trim().startsWith('{') || response.trim().startsWith('[')) {
        return JSON.parse(response);
      }

      // For non-JSON responses, return as structured text
      return {
        text: response,
        formatted: true,
      };
    } catch (error) {
      // If JSON parsing fails, return raw response
      return {
        text: response,
        raw: true,
      };
    }
  }

  private async checkRateLimit(
    key: string,
    limit: number,
    window: number = 60000
  ): Promise<boolean> {
    const now = Date.now();
    const bucketKey = `${key}_${Math.floor(now / window)}`;
    const bucket = this.rateLimits.get(bucketKey) || {
      count: 0,
      resetTime: now + window,
    };

    if (now > bucket.resetTime) {
      bucket.count = 0;
      bucket.resetTime = now + window;
    }

    if (bucket.count >= limit) {
      return false;
    }

    bucket.count++;
    this.rateLimits.set(bucketKey, bucket);
    return true;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.incrementMetric('gemini_retries');

        if (i === maxRetries - 1) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }

    throw new GeminiMCPError(
      'MAX_RETRIES_EXCEEDED',
      `Max retries exceeded: ${lastError.message}`,
      lastError,
      false
    );
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  private incrementMetric(name: string, value: number = 1): void {
    this.metrics.set(name, (this.metrics.get(name) || 0) + value);
  }

  // Public API
  public getTools(): GeminiMCPTool[] {
    return Array.from(this.tools.values());
  }

  public getTool(name: string): GeminiMCPTool | undefined {
    return this.tools.get(name);
  }

  public async executeTool(name: string, params: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new GeminiMCPError('TOOL_NOT_FOUND', `Tool ${name} not found`);
    }

    const operation = name.replace('gemini_', '');
    return await this.executeWithGemini(operation, params);
  }

  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getConfig(): GeminiConfig {
    return { ...this.config };
  }

  public getGeminiTools(): GeminiMCPTool[] {
    return this.getTools().filter(tool => tool.usesGemini);
  }
}

// Export singleton instance
export const geminiMCP = new GeminiMCPProtocol(
  'AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU'
);
export default geminiMCP;
