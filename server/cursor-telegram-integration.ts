// Cursor-Telegram Integration Service
import { GoogleGenerativeAI } from '@google/generative-ai';
import TelegramBot from 'node-telegram-bot-api';

export class CursorTelegramIntegration {
  private bot: TelegramBot;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cursorChatId: number | null = null;
  private isConnected: boolean = false;

  constructor(telegramToken: string, geminiApiKey: string) {
    this.bot = new TelegramBot(telegramToken, { polling: true });
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Handle incoming messages
    this.bot.on('message', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Handle callback queries
    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await this.handleCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
      }
    });

    this.isConnected = true;
    console.log('🔗 Cursor-Telegram integration connected');
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from?.username || msg.from?.first_name || 'Unknown';

    console.log(`📨 Cursor-Telegram: ${username}: ${text}`);

    // Handle Cursor-specific commands
    if (text?.startsWith('/cursor')) {
      await this.handleCursorCommand(chatId, text, username);
    } else if (text?.startsWith('/code')) {
      await this.handleCodeCommand(chatId, text, username);
    } else if (text?.startsWith('/debug')) {
      await this.handleDebugCommand(chatId, text, username);
    } else if (text?.startsWith('/explain')) {
      await this.handleExplainCommand(chatId, text, username);
    } else if (text?.startsWith('/refactor')) {
      await this.handleRefactorCommand(chatId, text, username);
    } else if (text?.startsWith('/test')) {
      await this.handleTestCommand(chatId, text, username);
    } else if (text?.startsWith('/connect')) {
      await this.handleConnectCommand(chatId, username);
    } else if (text?.startsWith('/help')) {
      await this.sendCursorHelp(chatId);
    } else {
      await this.handleGeneralQuery(chatId, text, username);
    }
  }

  private async handleCursorCommand(chatId: number, text: string, username: string) {
    const query = text.replace('/cursor', '').trim();
    
    if (!query) {
      await this.sendMessage(chatId, `👨‍💻 **Cursor Integration Help**

Use these commands to interact with Cursor:

**Code Commands:**
• \`/code <description>\` - Generate code
• \`/explain <code>\` - Explain code
• \`/refactor <code>\` - Refactor code
• \`/debug <code>\` - Debug code
• \`/test <code>\` - Generate tests

**General Commands:**
• \`/cursor <question>\` - Ask Cursor anything
• \`/connect\` - Connect this chat to Cursor
• \`/help\` - Show this help

**Examples:**
• \`/code create a React component for user login\`
• \`/explain function fibonacci(n) { ... }\`
• \`/cursor how to optimize React performance?\``, 'Markdown');
      return;
    }

    try {
      const prompt = `You are Cursor AI, an advanced code assistant. Answer this question about programming, development, or coding:

Question: ${query}

Provide a helpful, technical response that would assist a developer using Cursor IDE. Include code examples when relevant.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      await this.sendMessage(chatId, `👨‍💻 **Cursor AI Response:**

${answer}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error processing your Cursor request.');
    }
  }

  private async handleCodeCommand(chatId: number, text: string, username: string) {
    const description = text.replace('/code', '').trim();
    
    if (!description) {
      await this.sendMessage(chatId, 'Please provide a description for the code you want to generate.\n\nExample: `/code create a React component for user login`');
      return;
    }

    try {
      const prompt = `Generate code based on this description: "${description}"

Requirements:
- Provide clean, well-commented code
- Include proper imports and dependencies
- Follow best practices
- Add error handling where appropriate
- Include usage examples if relevant

Format the response with proper code blocks and explanations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const code = response.text();

      await this.sendMessage(chatId, `💻 **Generated Code:**

${code}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error generating code.');
    }
  }

  private async handleExplainCommand(chatId: number, text: string, username: string) {
    const code = text.replace('/explain', '').trim();
    
    if (!code) {
      await this.sendMessage(chatId, 'Please provide code to explain.\n\nExample: `/explain function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }`');
      return;
    }

    try {
      const prompt = `Explain this code in detail:

\`\`\`
${code}
\`\`\`

Provide:
1. What the code does
2. How it works (line by line if complex)
3. Key concepts and patterns
4. Potential improvements or considerations
5. Usage examples

Make it clear and educational for developers.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanation = response.text();

      await this.sendMessage(chatId, `📚 **Code Explanation:**

${explanation}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error explaining the code.');
    }
  }

  private async handleRefactorCommand(chatId: number, text: string, username: string) {
    const code = text.replace('/refactor', '').trim();
    
    if (!code) {
      await this.sendMessage(chatId, 'Please provide code to refactor.\n\nExample: `/refactor function add(a,b) { return a+b; }`');
      return;
    }

    try {
      const prompt = `Refactor this code to improve it:

\`\`\`
${code}
\`\`\`

Provide:
1. The refactored code
2. Explanation of improvements made
3. Benefits of the refactoring
4. Any additional considerations

Focus on:
- Code readability
- Performance optimization
- Error handling
- Best practices
- Maintainability`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const refactored = response.text();

      await this.sendMessage(chatId, `🔧 **Refactored Code:**

${refactored}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error refactoring the code.');
    }
  }

  private async handleDebugCommand(chatId: number, text: string, username: string) {
    const code = text.replace('/debug', '').trim();
    
    if (!code) {
      await this.sendMessage(chatId, 'Please provide code to debug.\n\nExample: `/debug function divide(a,b) { return a/b; }`');
      return;
    }

    try {
      const prompt = `Debug this code and identify potential issues:

\`\`\`
${code}
\`\`\`

Provide:
1. Potential bugs or issues
2. Debugging suggestions
3. Fixed version of the code
4. Explanation of fixes
5. Prevention strategies

Focus on common issues like:
- Null/undefined checks
- Type errors
- Logic errors
- Performance issues
- Security vulnerabilities`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const debugInfo = response.text();

      await this.sendMessage(chatId, `🐛 **Debug Analysis:**

${debugInfo}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error debugging the code.');
    }
  }

  private async handleTestCommand(chatId: number, text: string, username: string) {
    const code = text.replace('/test', '').trim();
    
    if (!code) {
      await this.sendMessage(chatId, 'Please provide code to test.\n\nExample: `/test function add(a,b) { return a+b; }`');
      return;
    }

    try {
      const prompt = `Generate comprehensive tests for this code:

\`\`\`
${code}
\`\`\`

Provide:
1. Unit tests with different scenarios
2. Edge cases and boundary conditions
3. Error handling tests
4. Test setup and teardown
5. Mock data if needed

Use appropriate testing framework (Jest, Mocha, etc.) and include:
- Test descriptions
- Assertions
- Expected vs actual results
- Coverage considerations`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const tests = response.text();

      await this.sendMessage(chatId, `🧪 **Generated Tests:**

${tests}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error generating tests.');
    }
  }

  private async handleConnectCommand(chatId: number, username: string) {
    this.cursorChatId = chatId;
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '💻 Code Generation', callback_data: 'cursor_code' },
          { text: '📚 Code Explanation', callback_data: 'cursor_explain' }
        ],
        [
          { text: '🔧 Refactoring', callback_data: 'cursor_refactor' },
          { text: '🐛 Debugging', callback_data: 'cursor_debug' }
        ],
        [
          { text: '🧪 Testing', callback_data: 'cursor_test' },
          { text: '❓ Help', callback_data: 'cursor_help' }
        ]
      ]
    };

    await this.sendMessage(chatId, `🔗 **Cursor Integration Connected!**

Welcome ${username}! This chat is now connected to Cursor AI.

**Available Commands:**
• \`/cursor <question>\` - Ask Cursor anything
• \`/code <description>\` - Generate code
• \`/explain <code>\` - Explain code
• \`/refactor <code>\` - Refactor code
• \`/debug <code>\` - Debug code
• \`/test <code>\` - Generate tests

**Quick Actions:**`, 'Markdown', { replyMarkup: keyboard });
  }

  private async handleGeneralQuery(chatId: number, text: string, username: string) {
    if (!text) return;

    try {
      const prompt = `You are a helpful AI assistant integrated with Cursor IDE. Answer this question:

"${text}"

Provide a helpful response that could assist a developer. If it's coding-related, include examples and best practices.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      await this.sendMessage(chatId, `🤖 **AI Response:**

${answer}`, 'Markdown');

    } catch (error) {
      await this.sendMessage(chatId, '❌ Sorry, I encountered an error processing your request.');
    }
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    if (!chatId) return;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    switch (data) {
      case 'cursor_code':
        await this.sendMessage(chatId, '💻 **Code Generation**

Use `/code <description>` to generate code.

**Examples:**
• `/code create a React component for user login`
• `/code write a Python function to sort a list`
• `/code create a REST API endpoint for user registration`');
        break;
      
      case 'cursor_explain':
        await this.sendMessage(chatId, '📚 **Code Explanation**

Use `/explain <code>` to explain code.

**Examples:**
• `/explain function fibonacci(n) { ... }`
• `/explain const users = data.map(user => ({ ...user, active: true }))`
• `/explain useEffect(() => { ... }, [dependency])`');
        break;
      
      case 'cursor_refactor':
        await this.sendMessage(chatId, '🔧 **Code Refactoring**

Use `/refactor <code>` to refactor code.

**Examples:**
• `/refactor function add(a,b) { return a+b; }`
• `/refactor if (user && user.name && user.name.length > 0) { ... }`
• `/refactor for (let i = 0; i < array.length; i++) { ... }`');
        break;
      
      case 'cursor_debug':
        await this.sendMessage(chatId, '🐛 **Code Debugging**

Use `/debug <code>` to debug code.

**Examples:**
• `/debug function divide(a,b) { return a/b; }`
• `/debug const result = data.find(item => item.id === undefined)`
• `/debug async function fetchData() { ... }`');
        break;
      
      case 'cursor_test':
        await this.sendMessage(chatId, '🧪 **Test Generation**

Use `/test <code>` to generate tests.

**Examples:**
• `/test function add(a,b) { return a+b; }`
• `/test class UserService { ... }`
• `/test function validateEmail(email) { ... }`');
        break;
      
      case 'cursor_help':
        await this.sendCursorHelp(chatId);
        break;
    }
  }

  private async sendCursorHelp(chatId: number) {
    const helpText = `👨‍💻 **Cursor-Telegram Integration Help**

**Code Commands:**
• \`/code <description>\` - Generate code based on description
• \`/explain <code>\` - Explain how code works
• \`/refactor <code>\` - Refactor code for better quality
• \`/debug <code>\` - Debug and fix code issues
• \`/test <code>\` - Generate comprehensive tests

**General Commands:**
• \`/cursor <question>\` - Ask Cursor AI anything
• \`/connect\` - Connect this chat to Cursor
• \`/help\` - Show this help message

**Examples:**
• \`/code create a React hook for API calls\`
• \`/explain function quickSort(arr) { ... }\`
• \`/refactor const users = data.filter(u => u.active).map(u => u.name)\`
• \`/debug async function fetchUser(id) { ... }\`
• \`/test function calculateTotal(items) { ... }\`
• \`/cursor how to optimize React performance?\`

**Tips:**
• Be specific in your descriptions
• Include context when asking questions
• Use proper code formatting
• Ask follow-up questions for clarification

**Integration Status:** ${this.isConnected ? '✅ Connected' : '❌ Disconnected'}`;

    await this.sendMessage(chatId, helpText, 'Markdown');
  }

  private async sendMessage(chatId: number, text: string, parseMode?: string, options?: any) {
    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: parseMode,
        ...options
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // Public methods
  public async sendToCursor(message: string) {
    if (this.cursorChatId) {
      await this.sendMessage(this.cursorChatId, `📨 **From Cursor:**\n\n${message}`, 'Markdown');
    }
  }

  public isCursorConnected(): boolean {
    return this.cursorChatId !== null;
  }

  public getCursorChatId(): number | null {
    return this.cursorChatId;
  }

  public disconnectCursor() {
    this.cursorChatId = null;
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      cursorConnected: this.isCursorConnected(),
      cursorChatId: this.cursorChatId
    };
  }
}

// Export singleton instance
export const cursorTelegramIntegration = new CursorTelegramIntegration(
  '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0',
  'AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU'
);

export default cursorTelegramIntegration;
