/**
 * AI Service - Powered by Google Gemini
 * 
 * This service integrates with Google's Gemini AI model to provide
 * intelligent features across AuraOS including:
 * - Text summarization
 * - Action item extraction
 * - Command analysis and processing
 * - Natural language understanding
 * 
 * Architecture: Direct integration with Gemini API
 * Future: Can be migrated to Firebase Functions for better security
 */

import { IService } from '../types/os';

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class AIService implements IService {
  public readonly name = 'ai';
  private apiKey: string = GEMINI_API_KEY;

  start(): void {
    if (!this.apiKey) {
      console.warn('⚠️ Gemini API key not configured. AI features will use fallback mode.');
    } else {
      console.log('🤖 AI Service started - Powered by Google Gemini');
    }
  }

  /**
   * Call Gemini API with a prompt
   */
  private async callGemini(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response from Gemini');
      }

      return text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  /**
   * Summarize text using Gemini AI
   */
  async summarizeText(text: string): Promise<string> {
    if (!this.apiKey) {
      // Fallback: simple truncation
      return `Summary: ${text.slice(0, 120)}${text.length > 120 ? '…' : ''}`;
    }

    try {
      const prompt = `Summarize the following text in 2-3 concise sentences:\n\n${text}`;
      return await this.callGemini(prompt);
    } catch (error) {
      console.error('Summarization failed:', error);
      return `Summary: ${text.slice(0, 120)}${text.length > 120 ? '…' : ''}`;
    }
  }

  /**
   * Extract action items from text using Gemini AI
   */
  async extractActionItems(text: string): Promise<string[]> {
    if (!this.apiKey) {
      // Fallback: simple regex matching
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      return lines.filter(l => /^(todo:|action:|-|\*|\d+\.)/i.test(l));
    }

    try {
      const prompt = `Extract all action items and tasks from the following text. Return only the action items as a numbered list:\n\n${text}`;
      const response = await this.callGemini(prompt);
      
      // Parse the response into an array
      return response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ''));
    } catch (error) {
      console.error('Action item extraction failed:', error);
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      return lines.filter(l => /^(todo:|action:|-|\*|\d+\.)/i.test(l));
    }
  }

  /**
   * Analyze a command and return structured information
   * Used by Terminal and Command Palette
   */
  async analyzeCommand(command: string): Promise<any> {
    if (!this.apiKey) {
      // Fallback: basic command parsing
      return this.parseBasicCommand(command);
    }

    try {
      const prompt = `Analyze this command and return a JSON object with: type (system/notes/automation/ai), command (the action to take), and description.
      
Command: ${command}

Return only valid JSON, no markdown or explanation.`;
      
      const response = await this.callGemini(prompt);
      
      // Try to parse JSON from response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn('Failed to parse Gemini JSON response');
      }
      
      return this.parseBasicCommand(command);
    } catch (error) {
      console.error('Command analysis failed:', error);
      return this.parseBasicCommand(command);
    }
  }

  /**
   * Process a command and return a response
   * Used by Terminal for AI-powered command execution
   */
  async processCommand(command: string): Promise<string> {
    if (!this.apiKey) {
      return `Command received: ${command}\n[AI processing unavailable - Gemini API key not configured]`;
    }

    try {
      const prompt = `You are an AI assistant for AuraOS, a desktop operating system. Process this command and provide a helpful response:

Command: ${command}

Provide a concise, actionable response.`;
      
      return await this.callGemini(prompt);
    } catch (error) {
      console.error('Command processing failed:', error);
      return `Command received: ${command}\n[AI processing failed - using fallback mode]`;
    }
  }

  /**
   * Get text embeddings (placeholder for future implementation)
   */
  async getEmbeddings(_text: string): Promise<number[]> {
    // Gemini doesn't provide embeddings directly
    // This would require a different model or service
    return [0.1, 0.2, 0.3, 0.4];
  }

  /**
   * Fallback: Basic command parsing without AI
   */
  private parseBasicCommand(command: string) {
    const cmd = command.toLowerCase().trim();
    
    // System commands
    if (cmd === 'help' || cmd.includes('help')) {
      return {
        type: 'system',
        command: 'help',
        description: 'Show available commands'
      };
    }
    
    if (cmd === 'status' || cmd.includes('system status') || cmd.includes('show status')) {
      return {
        type: 'system',
        command: 'status',
        description: 'Show system status'
      };
    }
    
    if (cmd.includes('memory') || cmd.includes('ram')) {
      return {
        type: 'system',
        command: 'status',
        description: 'Show memory usage'
      };
    }
    
    if (cmd.includes('services') || cmd.includes('list services')) {
      return {
        type: 'system',
        command: 'services',
        description: 'List running services'
      };
    }
    
    if (cmd.includes('processes') || cmd.includes('list processes')) {
      return {
        type: 'system',
        command: 'processes',
        description: 'List active processes'
      };
    }
    
    if (cmd.includes('uptime')) {
      return {
        type: 'system',
        command: 'uptime',
        description: 'Show system uptime'
      };
    }
    
    // Notes commands
    if (cmd.includes('note') || cmd.includes('write')) {
      return {
        type: 'notes',
        command: command,
        description: 'Notes operation'
      };
    }
    
    // Automation commands
    if (cmd.includes('automat') || cmd.includes('workflow')) {
      return {
        type: 'automation',
        command: command,
        description: 'Automation operation'
      };
    }
    
    // AI commands
    if (cmd.startsWith('ask ') || cmd.startsWith('what ') || cmd.startsWith('how ')) {
      return {
        type: 'ai',
        command: command,
        description: 'AI question'
      };
    }
    
    if (cmd.startsWith('summarize ') || cmd.includes('summary')) {
      return {
        type: 'ai',
        command: command,
        description: 'Summarize text'
      };
    }
    
    if (cmd.startsWith('analyze ')) {
      return {
        type: 'ai',
        command: command,
        description: 'Analyze text'
      };
    }
    
    // Default to AI processing
    return {
      type: 'ai',
      command: command,
      description: 'AI processing'
    };
  }
}

export const aiService = new AIService();


