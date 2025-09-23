import { OpenAI } from 'openai';
import { ErrorHandler } from '@/lib/error-handling';
import { AdvancedLogger } from '@/lib/advanced-logger';

// Enhanced Chatbot Service with AI Integration
export class EnhancedChatbotService {
  private openai: OpenAI;
  private logger: AdvancedLogger;
  private conversationHistory: Map<string, any[]> = new Map();
  private userPreferences: Map<string, any> = new Map();
  private contextMemory: Map<string, any> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.logger = new AdvancedLogger('chatbot-service');
  }

  // Process incoming message with enhanced AI capabilities
  async processMessage(
    message: string,
    userId: string,
    attachments: any[] = [],
    mode: string = 'text'
  ): Promise<{
    response: string;
    metadata: any;
    suggestions: string[];
  }> {
    try {
      this.logger.info('Processing message', { userId, mode, hasAttachments: attachments.length > 0 });

      // Get conversation context
      const context = await this.getConversationContext(userId);
      
      // Analyze message intent and sentiment
      const analysis = await this.analyzeMessage(message, attachments);
      
      // Generate AI response
      const response = await this.generateAIResponse(message, context, analysis, mode);
      
      // Update conversation history
      this.updateConversationHistory(userId, message, response.response);
      
      // Generate contextual suggestions
      const suggestions = await this.generateSuggestions(response.response, analysis);
      
      // Log interaction for learning
      await this.logInteraction(userId, message, response.response, analysis);

      return {
        response: response.text,
        metadata: {
          analysis,
          context,
          timestamp: new Date().toISOString(),
          mode,
          attachments: attachments.map(att => ({
            type: att.type,
            name: att.name,
            size: att.size,
          })),
        },
        suggestions,
      };
    } catch (error) {
      this.logger.error('Error processing message', error);
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });
      
      return {
        response: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        metadata: {
          error: true,
          timestamp: new Date().toISOString(),
        },
        suggestions: [
          'Try rephrasing your question',
          'Check your internet connection',
          'Contact support if the issue persists'
        ],
      };
    }
  }

  // Analyze message for intent, sentiment, and context
  private async analyzeMessage(message: string, attachments: any[]): Promise<any> {
    const analysis = {
      intent: 'general',
      sentiment: 'neutral',
      entities: [],
      topics: [],
      confidence: 0.8,
      timestamp: new Date().toISOString(),
    };

    // Intent recognition patterns
    const intentPatterns = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      question: ['what', 'how', 'why', 'when', 'where', 'who', '?'],
      request: ['can you', 'could you', 'please', 'help me', 'show me'],
      complaint: ['problem', 'issue', 'error', 'bug', 'broken', 'not working'],
      compliment: ['thanks', 'thank you', 'great', 'awesome', 'good job'],
      goodbye: ['bye', 'goodbye', 'see you', 'farewell'],
      technical: ['install', 'setup', 'configure', 'troubleshoot', 'debug'],
      feature: ['feature', 'capability', 'function', 'option', 'setting'],
    };

    const messageLower = message.toLowerCase();
    
    // Determine intent
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => messageLower.includes(pattern))) {
        analysis.intent = intent;
        break;
      }
    }

    // Sentiment analysis
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrating'];
    
    const words = messageLower.split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) analysis.sentiment = 'positive';
    else if (negativeCount > positiveCount) analysis.sentiment = 'negative';

    // Entity extraction
    const entityPatterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      url: /https?:\/\/[^\s]+/g,
      version: /\b\d+\.\d+(?:\.\d+)?\b/g,
      file: /\b\w+\.\w+\b/g,
    };

    Object.entries(entityPatterns).forEach(([type, pattern]) => {
      const matches = message.match(pattern);
      if (matches) {
        analysis.entities.push(...matches.map(match => ({ type, value: match })));
      }
    });

    // Topic extraction
    const topics = [
      'auraos', 'download', 'install', 'settings', 'help', 'chat', 'ai', 'features',
      'automation', 'analytics', 'dashboard', 'user', 'account', 'security', 'privacy'
    ];
    analysis.topics = topics.filter(topic => messageLower.includes(topic));

    // Adjust confidence based on analysis quality
    if (analysis.intent !== 'general') analysis.confidence += 0.1;
    if (analysis.entities.length > 0) analysis.confidence += 0.1;
    if (analysis.topics.length > 0) analysis.confidence += 0.1;
    if (attachments.length > 0) analysis.confidence += 0.1;

    analysis.confidence = Math.min(analysis.confidence, 1.0);

    return analysis;
  }

  // Generate AI response using OpenAI
  private async generateAIResponse(
    message: string,
    context: any,
    analysis: any,
    mode: string
  ): Promise<{ text: string; metadata: any }> {
    try {
      const systemPrompt = this.buildSystemPrompt(context, analysis);
      const userPrompt = this.buildUserPrompt(message, analysis, mode);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot generate a response at this time.';
      
      return {
        text: response,
        metadata: {
          model: 'gpt-4',
          tokens: completion.usage?.total_tokens || 0,
          finishReason: completion.choices[0]?.finish_reason || 'unknown',
        },
      };
    } catch (error) {
      this.logger.error('Error generating AI response', error);
      
      // Fallback to rule-based responses
      return this.generateFallbackResponse(message, analysis);
    }
  }

  // Build system prompt for AI
  private buildSystemPrompt(context: any, analysis: any): string {
    return `You are AuraOS AI Assistant, a helpful and knowledgeable AI that assists users with AuraOS, a modern operating system platform.

Key capabilities:
- Help with AuraOS installation, configuration, and troubleshooting
- Provide information about features, capabilities, and best practices
- Assist with automation setup and analytics
- Offer technical support and guidance
- Maintain a friendly, professional, and helpful tone

Current context:
- User intent: ${analysis.intent}
- Sentiment: ${analysis.sentiment}
- Topics: ${analysis.topics.join(', ') || 'none'}
- Confidence: ${analysis.confidence}

Guidelines:
- Be concise but comprehensive
- Use technical terms appropriately
- Provide actionable advice when possible
- Maintain context awareness
- Be empathetic to user concerns
- Offer relevant suggestions for next steps

Respond naturally and helpfully to the user's message.`;
  }

  // Build user prompt
  private buildUserPrompt(message: string, analysis: any, mode: string): string {
    let prompt = `User message: "${message}"`;
    
    if (mode === 'voice') {
      prompt += '\nNote: This message was sent via voice input.';
    } else if (mode === 'image') {
      prompt += '\nNote: This message includes image attachments for analysis.';
    }
    
    if (analysis.entities.length > 0) {
      prompt += `\nDetected entities: ${analysis.entities.map(e => `${e.type}: ${e.value}`).join(', ')}`;
    }
    
    return prompt;
  }

  // Generate fallback response when AI is unavailable
  private generateFallbackResponse(message: string, analysis: any): { text: string; metadata: any } {
    const responses = {
      greeting: [
        'Hello! I\'m here to help you with AuraOS. What can I assist you with today?',
        'Hi there! Welcome to AuraOS. How can I help you get started?',
        'Greetings! I\'m your AuraOS assistant. What would you like to know?',
      ],
      question: [
        'That\'s a great question! Let me help you with that.',
        'I\'d be happy to answer that for you.',
        'Good question! Here\'s what I can tell you...',
      ],
      request: [
        'I\'ll be glad to help you with that.',
        'Absolutely! Let me assist you.',
        'Of course! I\'m here to help.',
      ],
      complaint: [
        'I\'m sorry to hear you\'re having issues. Let me help resolve this.',
        'I understand your frustration. Let\'s work together to fix this.',
        'That sounds frustrating. I\'m here to help you get this sorted out.',
      ],
      compliment: [
        'Thank you so much! I\'m glad I could help.',
        'You\'re very welcome! I\'m happy to assist.',
        'I appreciate your kind words! Let me know if you need anything else.',
      ],
      goodbye: [
        'Goodbye! Feel free to come back anytime.',
        'See you later! I\'m always here to help.',
        'Take care! Don\'t hesitate to reach out if you need assistance.',
      ],
      technical: [
        'I can help you with technical aspects of AuraOS. What specific issue are you facing?',
        'Let\'s troubleshoot this together. Can you provide more details?',
        'Technical support is my specialty. How can I assist you?',
      ],
      feature: [
        'AuraOS has many great features! Which one interests you most?',
        'I\'d be happy to explain AuraOS features. What would you like to know?',
        'Let me tell you about AuraOS capabilities. What\'s your focus?',
      ],
      general: [
        'I\'m here to help! What would you like to know about AuraOS?',
        'That\'s interesting! Tell me more about what you\'re looking for.',
        'I\'d be happy to assist you with that.',
      ],
    };

    const intentResponses = responses[analysis.intent] || responses.general;
    const baseResponse = intentResponses[Math.floor(Math.random() * intentResponses.length)];
    
    // Enhance response based on context
    let enhancedResponse = baseResponse;
    
    if (analysis.topics.length > 0) {
      const topicInfo = {
        auraos: ' AuraOS is our modern operating system platform with advanced features.',
        download: ' You can download AuraOS from our official website.',
        install: ' Installation is straightforward with our guided setup process.',
        settings: ' You can access settings from your dashboard or system preferences.',
        help: ' I\'m here to provide comprehensive assistance.',
        chat: ' Our chat system supports multiple input modes including voice and image.',
        ai: ' Our AI system includes smart recommendations and automation capabilities.',
        features: ' AuraOS includes many advanced features like PWA support and real-time analytics.',
      };
      
      analysis.topics.forEach(topic => {
        if (topicInfo[topic]) {
          enhancedResponse += topicInfo[topic];
        }
      });
    }

    return {
      text: enhancedResponse,
      metadata: {
        fallback: true,
        intent: analysis.intent,
        topics: analysis.topics,
      },
    };
  }

  // Generate contextual suggestions
  private async generateSuggestions(response: string, analysis: any): Promise<string[]> {
    const suggestions = [];

    if (analysis.intent === 'question') {
      suggestions.push(
        'Show me AuraOS features',
        'Help with installation',
        'Explain AI capabilities',
        'Get technical support'
      );
    } else if (analysis.topics.includes('auraos')) {
      suggestions.push(
        'Download AuraOS',
        'View features',
        'Get support',
        'Read documentation'
      );
    } else if (analysis.intent === 'technical') {
      suggestions.push(
        'Troubleshooting guide',
        'System requirements',
        'Contact support',
        'Check documentation'
      );
    } else {
      suggestions.push(
        'Try voice commands',
        'Upload an image',
        'Ask for help',
        'Explore features'
      );
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  // Get conversation context
  private async getConversationContext(userId: string): Promise<any> {
    const history = this.conversationHistory.get(userId) || [];
    const preferences = this.userPreferences.get(userId) || {};
    const context = this.contextMemory.get(userId) || {};

    return {
      messageCount: history.length,
      lastMessage: history[history.length - 1],
      preferences,
      context,
      sessionStart: context.sessionStart || new Date().toISOString(),
    };
  }

  // Update conversation history
  private updateConversationHistory(userId: string, userMessage: string, botResponse: string): void {
    const history = this.conversationHistory.get(userId) || [];
    
    history.push({
      user: userMessage,
      bot: botResponse,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    this.conversationHistory.set(userId, history);
  }

  // Log interaction for learning
  private async logInteraction(
    userId: string,
    userMessage: string,
    botResponse: string,
    analysis: any
  ): Promise<void> {
    try {
      const interaction = {
        userId,
        userMessage,
        botResponse,
        analysis,
        timestamp: new Date().toISOString(),
      };

      this.logger.info('Chatbot interaction logged', interaction);
      
      // Store in context memory for future reference
      const context = this.contextMemory.get(userId) || {};
      context.lastInteraction = interaction;
      context.interactionCount = (context.interactionCount || 0) + 1;
      this.contextMemory.set(userId, context);
    } catch (error) {
      this.logger.error('Error logging interaction', error);
    }
  }

  // Get chat history for a user
  async getChatHistory(userId: string, limit: number = 20): Promise<any[]> {
    const history = this.conversationHistory.get(userId) || [];
    return history.slice(-limit).map((item, index) => ({
      id: `msg_${userId}_${index}`,
      role: 'user',
      content: item.user,
      timestamp: item.timestamp,
    }));
  }

  // Clear chat history for a user
  async clearChatHistory(userId: string): Promise<void> {
    this.conversationHistory.delete(userId);
    this.contextMemory.delete(userId);
    this.logger.info('Chat history cleared', { userId });
  }

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: any): Promise<void> {
    this.userPreferences.set(userId, preferences);
    this.logger.info('User preferences updated', { userId, preferences });
  }

  // Get service health status
  async getHealthStatus(): Promise<any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      activeUsers: this.conversationHistory.size,
      totalInteractions: Array.from(this.conversationHistory.values())
        .reduce((total, history) => total + history.length, 0),
      memoryUsage: {
        conversations: this.conversationHistory.size,
        preferences: this.userPreferences.size,
        contexts: this.contextMemory.size,
      },
    };
  }
}

// Export singleton instance
export const chatbotService = new EnhancedChatbotService();
