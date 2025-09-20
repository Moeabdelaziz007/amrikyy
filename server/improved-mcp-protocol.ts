// Quick Fix: Enhanced MCP Protocol with Immediate Improvements
import { EventEmitter } from 'events';
import axios from 'axios';
import { createHash } from 'crypto';

// Enhanced error handling
export class MCPError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

// Configuration management
export interface MCPConfig {
  apis: {
    huggingface: { key: string; baseUrl: string };
    libreTranslate: { baseUrl: string };
    myMemory: { baseUrl: string };
  };
  limits: {
    defaultRateLimit: number;
    maxRetries: number;
    timeout: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
}

// Simple cache implementation
class SimpleCache {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private ttl: number = 300000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl || this.ttl)
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Rate limiter
class RateLimiter {
  private buckets: Map<string, { count: number; resetTime: number }> = new Map();

  async checkLimit(key: string, limit: number, window: number = 60000): Promise<boolean> {
    const now = Date.now();
    const bucketKey = `${key}_${Math.floor(now / window)}`;
    const bucket = this.buckets.get(bucketKey) || { count: 0, resetTime: now + window };

    if (now > bucket.resetTime) {
      bucket.count = 0;
      bucket.resetTime = now + window;
    }

    if (bucket.count >= limit) {
      return false;
    }

    bucket.count++;
    this.buckets.set(bucketKey, bucket);
    return true;
  }
}

// Enhanced MCP Tool interface
export interface EnhancedMCPTool {
  name: string;
  description: string;
  inputSchema: any;
  execute: (params: any) => Promise<any>;
  category: 'text' | 'image' | 'audio' | 'web' | 'data' | 'utility' | 'ai';
  isFree: boolean;
  rateLimit?: number;
  timeout?: number;
  retries?: number;
}

export class ImprovedMCPProtocol extends EventEmitter {
  private tools: Map<string, EnhancedMCPTool> = new Map();
  private config: MCPConfig;
  private cache: SimpleCache;
  private rateLimiter: RateLimiter;
  private metrics: Map<string, number> = new Map();

  constructor(config?: Partial<MCPConfig>) {
    super();
    this.config = this.loadConfig(config);
    this.cache = new SimpleCache();
    this.rateLimiter = new RateLimiter();
    this.initializeTools();
  }

  private loadConfig(override?: Partial<MCPConfig>): MCPConfig {
    const defaultConfig: MCPConfig = {
      apis: {
        huggingface: {
          key: process.env.HUGGINGFACE_API_KEY || 'hf_your_free_token',
          baseUrl: 'https://api-inference.huggingface.co/models'
        },
        libreTranslate: {
          baseUrl: 'https://libretranslate.de'
        },
        myMemory: {
          baseUrl: 'https://api.mymemory.translated.net'
        }
      },
      limits: {
        defaultRateLimit: 100,
        maxRetries: 3,
        timeout: 30000
      },
      cache: {
        ttl: 300000,
        maxSize: 1000
      }
    };

    return { ...defaultConfig, ...override };
  }

  private initializeTools() {
    // Enhanced Sentiment Analysis Tool
    this.addTool({
      name: 'enhanced_sentiment_analysis',
      description: 'Enhanced sentiment analysis with caching and fallback',
      category: 'text',
      isFree: true,
      rateLimit: 100,
      timeout: 10000,
      retries: 3,
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to analyze' },
          provider: { type: 'string', enum: ['huggingface', 'fallback'], default: 'huggingface' },
          useCache: { type: 'boolean', description: 'Use cached results', default: true }
        },
        required: ['text']
      },
      execute: async (params) => {
        return await this.executeWithEnhancements('sentiment', params);
      }
    });

    // Enhanced Translation Tool
    this.addTool({
      name: 'enhanced_translation',
      description: 'Enhanced translation with multiple providers and caching',
      category: 'text',
      isFree: true,
      rateLimit: 200,
      timeout: 15000,
      retries: 2,
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to translate' },
          from: { type: 'string', description: 'Source language', default: 'auto' },
          to: { type: 'string', description: 'Target language', default: 'en' },
          provider: { type: 'string', enum: ['libre', 'mymemory'], default: 'libre' },
          useCache: { type: 'boolean', description: 'Use cached results', default: true }
        },
        required: ['text', 'to']
      },
      execute: async (params) => {
        return await this.executeWithEnhancements('translation', params);
      }
    });

    // Enhanced Web Scraping Tool
    this.addTool({
      name: 'enhanced_web_scraping',
      description: 'Enhanced web scraping with validation and caching',
      category: 'web',
      isFree: true,
      rateLimit: 50,
      timeout: 20000,
      retries: 2,
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to scrape' },
          selector: { type: 'string', description: 'CSS selector for specific content' },
          format: { type: 'string', enum: ['html', 'text', 'json'], default: 'text' },
          useCache: { type: 'boolean', description: 'Use cached results', default: true },
          timeout: { type: 'number', description: 'Request timeout in ms', default: 20000 }
        },
        required: ['url']
      },
      execute: async (params) => {
        return await this.executeWithEnhancements('scraping', params);
      }
    });

    // Enhanced Data Processing Tool
    this.addTool({
      name: 'enhanced_data_processing',
      description: 'Enhanced data processing with validation and error handling',
      category: 'data',
      isFree: true,
      rateLimit: 1000,
      timeout: 5000,
      retries: 1,
      inputSchema: {
        type: 'object',
        properties: {
          data: { type: 'string', description: 'Data to process' },
          format: { type: 'string', enum: ['json', 'csv', 'xml'], description: 'Data format' },
          operation: { type: 'string', enum: ['validate', 'parse', 'transform', 'analyze'], default: 'parse' },
          options: { type: 'object', description: 'Processing options' }
        },
        required: ['data', 'format']
      },
      execute: async (params) => {
        return await this.executeWithEnhancements('data_processing', params);
      }
    });
  }

  private addTool(tool: EnhancedMCPTool) {
    this.tools.set(tool.name, tool);
  }

  private async executeWithEnhancements(operation: string, params: any): Promise<any> {
    const tool = this.tools.get(`enhanced_${operation}`) || this.tools.get(operation);
    if (!tool) {
      throw new MCPError('TOOL_NOT_FOUND', `Tool ${operation} not found`);
    }

    // Check rate limits
    if (tool.rateLimit) {
      const canProceed = await this.rateLimiter.checkLimit(tool.name, tool.rateLimit);
      if (!canProceed) {
        throw new MCPError('RATE_LIMIT_EXCEEDED', `Rate limit exceeded for ${tool.name}`, null, true);
      }
    }

    // Check cache
    const cacheKey = `${tool.name}_${JSON.stringify(params)}`;
    if (params.useCache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.incrementMetric('cache_hits');
        return { ...cached, fromCache: true };
      }
    }

    // Execute with retries
    const result = await this.executeWithRetry(
      () => this.executeToolOperation(tool, params),
      tool.retries || this.config.limits.maxRetries
    );

    // Cache result
    if (params.useCache !== false) {
      this.cache.set(cacheKey, result);
    }

    this.incrementMetric('tool_executions');
    return result;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.incrementMetric('tool_errors');
        
        if (i === maxRetries - 1) {
          break;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    
    throw new MCPError('MAX_RETRIES_EXCEEDED', `Max retries exceeded: ${lastError.message}`, lastError, false);
  }

  private async executeToolOperation(tool: EnhancedMCPTool, params: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Input validation
      this.validateInput(tool, params);
      
      // Execute tool-specific logic
      let result;
      switch (tool.name) {
        case 'enhanced_sentiment_analysis':
          result = await this.analyzeSentimentEnhanced(params);
          break;
        case 'enhanced_translation':
          result = await this.translateTextEnhanced(params);
          break;
        case 'enhanced_web_scraping':
          result = await this.scrapeWebEnhanced(params);
          break;
        case 'enhanced_data_processing':
          result = await this.processDataEnhanced(params);
          break;
        default:
          throw new MCPError('UNKNOWN_TOOL', `Unknown tool: ${tool.name}`);
      }
      
      const duration = Date.now() - startTime;
      this.incrementMetric('tool_duration', duration);
      
      return {
        success: true,
        result,
        duration,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.incrementMetric('tool_error_duration', duration);
      throw error;
    }
  }

  private validateInput(tool: EnhancedMCPTool, params: any): void {
    const schema = tool.inputSchema;
    const required = schema.required || [];
    
    for (const field of required) {
      if (params[field] === undefined || params[field] === null) {
        throw new MCPError('VALIDATION_ERROR', `Required field '${field}' is missing`);
      }
    }
    
    // Additional validation based on tool type
    if (tool.name.includes('web_scraping') && params.url) {
      this.validateUrl(params.url);
    }
    
    if (tool.name.includes('translation') && params.text) {
      this.sanitizeText(params.text);
    }
  }

  private validateUrl(url: string): void {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new MCPError('INVALID_URL', 'Only HTTP and HTTPS URLs are allowed');
      }
    } catch {
      throw new MCPError('INVALID_URL', 'Invalid URL format');
    }
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  // Enhanced tool implementations
  private async analyzeSentimentEnhanced(params: any): Promise<any> {
    const { text, provider } = params;
    const sanitizedText = this.sanitizeText(text);
    
    if (provider === 'huggingface') {
      try {
        const response = await axios.post(
          `${this.config.apis.huggingface.baseUrl}/cardiffnlp/twitter-roberta-base-sentiment-latest`,
          { inputs: sanitizedText },
          {
            headers: {
              'Authorization': `Bearer ${this.config.apis.huggingface.key}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.limits.timeout
          }
        );
        return { sentiment: response.data, provider: 'huggingface' };
      } catch (error) {
        // Fallback to simple analysis
        return this.fallbackSentimentAnalysis(sanitizedText);
      }
    } else {
      return this.fallbackSentimentAnalysis(sanitizedText);
    }
  }

  private fallbackSentimentAnalysis(text: string): any {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'joy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst', 'disappointed', 'sad', 'angry'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    const totalScore = positiveScore + negativeScore;
    if (totalScore === 0) return { sentiment: 'neutral', confidence: 0.5, provider: 'fallback' };
    
    const sentiment = positiveScore > negativeScore ? 'positive' : 'negative';
    const confidence = Math.abs(positiveScore - negativeScore) / totalScore;
    
    return { sentiment, confidence, provider: 'fallback' };
  }

  private async translateTextEnhanced(params: any): Promise<any> {
    const { text, from, to, provider } = params;
    const sanitizedText = this.sanitizeText(text);
    
    try {
      if (provider === 'libre') {
        const response = await axios.post(`${this.config.apis.libreTranslate.baseUrl}/translate`, {
          q: sanitizedText,
          source: from,
          target: to,
          format: 'text'
        }, { timeout: this.config.limits.timeout });
        
        return { translation: response.data.translatedText, provider: 'libre' };
      } else {
        const response = await axios.get(`${this.config.apis.myMemory.baseUrl}/get`, {
          params: { q: sanitizedText, langpair: `${from}|${to}` },
          timeout: this.config.limits.timeout
        });
        
        return { translation: response.data.responseData.translatedText, provider: 'mymemory' };
      }
    } catch (error) {
      throw new MCPError('TRANSLATION_ERROR', `Translation failed: ${error.message}`, error, true);
    }
  }

  private async scrapeWebEnhanced(params: any): Promise<any> {
    const { url, format = 'text' } = params;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MCPBot/1.0)'
        },
        timeout: params.timeout || this.config.limits.timeout
      });
      
      if (format === 'html') {
        return { content: response.data, format: 'html' };
      } else {
        const textContent = response.data.replace(/<[^>]*>/g, '').trim();
        return { content: textContent, format: 'text' };
      }
    } catch (error) {
      throw new MCPError('SCRAPING_ERROR', `Web scraping failed: ${error.message}`, error, true);
    }
  }

  private async processDataEnhanced(params: any): Promise<any> {
    const { data, format, operation } = params;
    
    try {
      switch (format) {
        case 'json':
          return this.processJsonData(data, operation);
        case 'csv':
          return this.processCsvData(data, operation);
        default:
          throw new MCPError('UNSUPPORTED_FORMAT', `Unsupported format: ${format}`);
      }
    } catch (error) {
      throw new MCPError('DATA_PROCESSING_ERROR', `Data processing failed: ${error.message}`, error);
    }
  }

  private processJsonData(data: string, operation: string): any {
    const parsed = JSON.parse(data);
    
    switch (operation) {
      case 'validate':
        return { valid: true, message: 'JSON is valid' };
      case 'parse':
        return { data: parsed };
      case 'transform':
        return { transformed: JSON.stringify(parsed, null, 2) };
      case 'analyze':
        return { 
          keys: Object.keys(parsed),
          size: JSON.stringify(parsed).length,
          type: Array.isArray(parsed) ? 'array' : 'object'
        };
      default:
        return { data: parsed };
    }
  }

  private processCsvData(data: string, operation: string): any {
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    
    switch (operation) {
      case 'validate':
        return { valid: true, rows: rows.length, columns: headers.length };
      case 'parse':
        return { headers, rows };
      case 'transform':
        return { json: rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]]))) };
      case 'analyze':
        return {
          totalRows: rows.length,
          columns: headers.length,
          headers,
          sample: rows.slice(0, 3)
        };
      default:
        return { headers, rows };
    }
  }

  private incrementMetric(name: string, value: number = 1): void {
    this.metrics.set(name, (this.metrics.get(name) || 0) + value);
  }

  // Public API
  public getTools(): EnhancedMCPTool[] {
    return Array.from(this.tools.values());
  }

  public getTool(name: string): EnhancedMCPTool | undefined {
    return this.tools.get(name);
  }

  public async executeTool(name: string, params: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new MCPError('TOOL_NOT_FOUND', `Tool ${name} not found`);
    }

    return await this.executeWithEnhancements(name.replace('enhanced_', ''), params);
  }

  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getConfig(): MCPConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const improvedMCP = new ImprovedMCPProtocol();
export default improvedMCP;
