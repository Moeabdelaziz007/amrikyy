// Enhanced Cursor-Telegram Integration with Fallback System
import { GoogleGenerativeAI } from '@google/generative-ai';
import TelegramBot from 'node-telegram-bot-api';

export class EnhancedCursorTelegramIntegration {
  private bot: TelegramBot;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cursorChatId: number | null = null;
  private isConnected: boolean = false;
  private apiQuotaExceeded: boolean = false;
  private fallbackResponses: Map<string, string> = new Map();

  constructor(telegramToken: string, geminiApiKey: string) {
    this.bot = new TelegramBot(telegramToken, { polling: true });
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    this.initializeFallbackResponses();
    this.setupEventHandlers();
  }

  private initializeFallbackResponses() {
    // Fallback responses for when API quota is exceeded
    this.fallbackResponses.set(
      'code_generation',
      `
💻 **Code Generation (Fallback Mode)**

I can help you generate code! Here are some examples:

**React Component:**
\`\`\`javascript
import React, { useState } from 'react';

function UserLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default UserLogin;
\`\`\`

**API Hook:**
\`\`\`javascript
import { useState, useEffect } from 'react';

function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useApi;
\`\`\`
`
    );

    this.fallbackResponses.set(
      'code_explanation',
      `
📚 **Code Explanation (Fallback Mode)**

I can explain code patterns! Here are common explanations:

**Function Explanation:**
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

**Explanation:**
1. **Purpose:** Calculates the nth Fibonacci number
2. **Base Case:** If n ≤ 1, return n (first two numbers are 0 and 1)
3. **Recursive Case:** Return sum of previous two Fibonacci numbers
4. **Pattern:** Each number is sum of the two preceding ones
5. **Usage:** fibonacci(10) returns 55

**Key Concepts:**
- Recursion: Function calls itself
- Base case: Prevents infinite recursion
- Mathematical sequence: 0, 1, 1, 2, 3, 5, 8, 13...
`
    );

    this.fallbackResponses.set(
      'code_refactoring',
      `
🔧 **Code Refactoring (Fallback Mode)**

I can help refactor code! Here are common improvements:

**Original Code:**
\`\`\`javascript
function add(a, b) {
  return a + b;
}
\`\`\`

**Refactored Version:**
\`\`\`javascript
function add(a, b) {
  // Input validation
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  
  // Handle edge cases
  if (!isFinite(a) || !isFinite(b)) {
    throw new Error('Arguments must be finite numbers');
  }
  
  return a + b;
}

// Alternative with default parameters
function add(a = 0, b = 0) {
  return Number(a) + Number(b);
}
\`\`\`

**Improvements Made:**
- Added input validation
- Added error handling
- Added edge case handling
- Added JSDoc comments
- Made function more robust
`
    );

    this.fallbackResponses.set(
      'code_debugging',
      `
🐛 **Code Debugging (Fallback Mode)**

I can help debug code! Here are common issues and fixes:

**Common Issues:**

1. **Division by Zero:**
\`\`\`javascript
// Problem
function divide(a, b) {
  return a / b; // Error if b = 0
}

// Fixed
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
\`\`\`

2. **Undefined Variables:**
\`\`\`javascript
// Problem
const result = data.find(item => item.id === undefined);

// Fixed
const result = data.find(item => item.id !== undefined);
\`\`\`

3. **Async/Await Issues:**
\`\`\`javascript
// Problem
async function fetchData() {
  const response = fetch('/api/data');
  return response.json(); // Error: response is a Promise
}

// Fixed
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
\`\`\`
`
    );

    this.fallbackResponses.set(
      'test_generation',
      `
🧪 **Test Generation (Fallback Mode)**

I can help generate tests! Here are common test patterns:

**Jest Test Example:**
\`\`\`javascript
// add.js
function add(a, b) {
  return a + b;
}

module.exports = add;

// add.test.js
const add = require('./add');

describe('add function', () => {
  test('adds two positive numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers correctly', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test('adds zero correctly', () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
  });

  test('handles decimal numbers', () => {
    expect(add(1.5, 2.5)).toBe(4);
  });
});
\`\`\`

**React Component Test:**
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import UserLogin from './UserLogin';

describe('UserLogin Component', () => {
  test('renders login form', () => {
    render(<UserLogin />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('handles form submission', () => {
    render(<UserLogin />);
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);
    // Add assertions here
  });
});
\`\`\`
`
    );

    this.fallbackResponses.set(
      'general_query',
      `
🤖 **AI Assistant (Fallback Mode)**

I'm here to help with programming questions! Here are some common topics:

**React Performance Optimization:**
- Use React.memo() for component memoization
- Implement useMemo() and useCallback() for expensive calculations
- Avoid creating objects/functions in render
- Use React.lazy() for code splitting
- Optimize re-renders with proper dependency arrays

**JavaScript Best Practices:**
- Use const/let instead of var
- Implement proper error handling
- Use async/await for asynchronous operations
- Follow consistent naming conventions
- Write clean, readable code

**Common Patterns:**
- Higher-order functions
- Function composition
- Event delegation
- Module pattern
- Observer pattern

**Need specific help?** Try these commands:
- \`/code <description>\` - Generate code
- \`/explain <code>\` - Explain code
- \`/refactor <code>\` - Refactor code
- \`/debug <code>\` - Debug code
- \`/test <code>\` - Generate tests
`
    );
  }

  private setupEventHandlers() {
    // Handle incoming messages
    this.bot.on('message', async msg => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
        await this.sendErrorMessage(
          msg.chat.id,
          'Sorry, an error occurred while processing your message.'
        );
      }
    });

    // Handle callback queries
    this.bot.on('callback_query', async callbackQuery => {
      try {
        await this.handleCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
        await this.bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Error processing request',
        });
      }
    });

    this.isConnected = true;
    console.log('🔗 Enhanced Cursor-Telegram integration connected');
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from?.username || msg.from?.first_name || 'Unknown';

    console.log(`📨 Enhanced Cursor-Telegram: ${username}: ${text}`);

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
    } else if (text?.startsWith('/status')) {
      await this.sendStatusMessage(chatId);
    } else {
      await this.handleGeneralQuery(chatId, text, username);
    }
  }

  private async handleCursorCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const query = text.replace('/cursor', '').trim();

    if (!query) {
      await this.sendMessage(
        chatId,
        `👨‍💻 **Cursor Integration Help**

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
• \`/status\` - Check integration status

**Examples:**
• \`/code create a React component for user login\`
• \`/explain function fibonacci(n) { ... }\`
• \`/cursor how to optimize React performance?\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode (API quota exceeded)' : '✅ Full AI Mode'}`,
        'Markdown'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('general_query') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

      const prompt = `You are Cursor AI, an advanced code assistant. Answer this question about programming, development, or coding:

Question: ${query}

Provide a helpful, technical response that would assist a developer using Cursor IDE. Include code examples when relevant.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      await this.sendMessage(
        chatId,
        `👨‍💻 **Cursor AI Response:**

${answer}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('general_query')}

**Note:** The AI API has reached its daily limit. Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error processing your Cursor request.'
        );
      }
    }
  }

  private async handleCodeCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const description = text.replace('/code', '').trim();

    if (!description) {
      await this.sendMessage(
        chatId,
        'Please provide a description for the code you want to generate.\n\nExample: `/code create a React component for user login`'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('code_generation') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

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

      await this.sendMessage(
        chatId,
        `💻 **Generated Code:**

${code}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('code_generation')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error generating code.'
        );
      }
    }
  }

  private async handleExplainCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const code = text.replace('/explain', '').trim();

    if (!code) {
      await this.sendMessage(
        chatId,
        'Please provide code to explain.\n\nExample: `/explain function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }`'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('code_explanation') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

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

      await this.sendMessage(
        chatId,
        `📚 **Code Explanation:**

${explanation}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('code_explanation')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error explaining the code.'
        );
      }
    }
  }

  private async handleRefactorCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const code = text.replace('/refactor', '').trim();

    if (!code) {
      await this.sendMessage(
        chatId,
        'Please provide code to refactor.\n\nExample: `/refactor function add(a,b) { return a+b; }`'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('code_refactoring') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

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

      await this.sendMessage(
        chatId,
        `🔧 **Refactored Code:**

${refactored}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('code_refactoring')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error refactoring the code.'
        );
      }
    }
  }

  private async handleDebugCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const code = text.replace('/debug', '').trim();

    if (!code) {
      await this.sendMessage(
        chatId,
        'Please provide code to debug.\n\nExample: `/debug function divide(a,b) { return a/b; }`'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('code_debugging') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

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

      await this.sendMessage(
        chatId,
        `🐛 **Debug Analysis:**

${debugInfo}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('code_debugging')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error debugging the code.'
        );
      }
    }
  }

  private async handleTestCommand(
    chatId: number,
    text: string,
    username: string
  ) {
    const code = text.replace('/test', '').trim();

    if (!code) {
      await this.sendMessage(
        chatId,
        'Please provide code to test.\n\nExample: `/test function add(a,b) { return a+b; }`'
      );
      return;
    }

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('test_generation') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

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

      await this.sendMessage(
        chatId,
        `🧪 **Generated Tests:**

${tests}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('test_generation')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error generating tests.'
        );
      }
    }
  }

  private async handleConnectCommand(chatId: number, username: string) {
    this.cursorChatId = chatId;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '💻 Code Generation', callback_data: 'cursor_code' },
          { text: '📚 Code Explanation', callback_data: 'cursor_explain' },
        ],
        [
          { text: '🔧 Refactoring', callback_data: 'cursor_refactor' },
          { text: '🐛 Debugging', callback_data: 'cursor_debug' },
        ],
        [
          { text: '🧪 Testing', callback_data: 'cursor_test' },
          { text: '❓ Help', callback_data: 'cursor_help' },
        ],
        [{ text: '📊 Status', callback_data: 'cursor_status' }],
      ],
    };

    await this.sendMessage(
      chatId,
      `🔗 **Cursor Integration Connected!**

Welcome ${username}! This chat is now connected to Cursor AI.

**Available Commands:**
• \`/cursor <question>\` - Ask Cursor anything
• \`/code <description>\` - Generate code
• \`/explain <code>\` - Explain code
• \`/refactor <code>\` - Refactor code
• \`/debug <code>\` - Debug code
• \`/test <code>\` - Generate tests
• \`/status\` - Check integration status

**Quick Actions:**
**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode (API quota exceeded)' : '✅ Full AI Mode'}`,
      'Markdown',
      { replyMarkup: keyboard }
    );
  }

  private async handleGeneralQuery(
    chatId: number,
    text: string,
    username: string
  ) {
    if (!text) return;

    try {
      if (this.apiQuotaExceeded) {
        await this.sendMessage(
          chatId,
          this.fallbackResponses.get('general_query') ||
            'Fallback response not available',
          'Markdown'
        );
        return;
      }

      const prompt = `You are a helpful AI assistant integrated with Cursor IDE. Answer this question:

"${text}"

Provide a helpful response that could assist a developer. If it's coding-related, include examples and best practices.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      await this.sendMessage(
        chatId,
        `🤖 **AI Response:**

${answer}`,
        'Markdown'
      );
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.apiQuotaExceeded = true;
        await this.sendMessage(
          chatId,
          `⚠️ **API Quota Exceeded**

${this.fallbackResponses.get('general_query')}

**Note:** Using fallback responses until quota resets.`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          '❌ Sorry, I encountered an error processing your request.'
        );
      }
    }
  }

  private async sendStatusMessage(chatId: number) {
    const status = this.getStatus();

    const statusText = `📊 **Integration Status**

**Connection Status:**
• Telegram Bot: ${status.isConnected ? '✅ Connected' : '❌ Disconnected'}
• Cursor Integration: ${status.cursorConnected ? '✅ Connected' : '❌ Not Connected'}
• AI API: ${this.apiQuotaExceeded ? '⚠️ Quota Exceeded' : '✅ Available'}

**Features:**
• Code Generation: ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}
• Code Explanation: ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}
• Code Refactoring: ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}
• Debugging: ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}
• Test Generation: ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}

**Commands Available:**
• \`/cursor\` - Ask Cursor AI anything
• \`/code\` - Generate code
• \`/explain\` - Explain code
• \`/refactor\` - Refactor code
• \`/debug\` - Debug code
• \`/test\` - Generate tests
• \`/connect\` - Connect to Cursor
• \`/help\` - Show help
• \`/status\` - Show this status

${this.apiQuotaExceeded ? '**Note:** API quota exceeded. Using fallback responses until quota resets (usually 24 hours).' : '**Note:** Full AI mode active. All features available.'}`;

    await this.sendMessage(chatId, statusText, 'Markdown');
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    if (!chatId) return;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    switch (data) {
      case 'cursor_code':
        await this.sendMessage(
          chatId,
          `💻 **Code Generation**

Use \`/code <description>\` to generate code.

**Examples:**
• \`/code create a React component for user login\`
• \`/code write a Python function to sort a list\`
• \`/code create a REST API endpoint for user registration\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}`
        );
        break;

      case 'cursor_explain':
        await this.sendMessage(
          chatId,
          `📚 **Code Explanation**

Use \`/explain <code>\` to explain code.

**Examples:**
• \`/explain function fibonacci(n) { ... }\`
• \`/explain const users = data.map(user => ({ ...user, active: true }))\`
• \`/explain useEffect(() => { ... }, [dependency])\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}`
        );
        break;

      case 'cursor_refactor':
        await this.sendMessage(
          chatId,
          `🔧 **Code Refactoring**

Use \`/refactor <code>\` to refactor code.

**Examples:**
• \`/refactor function add(a,b) { return a+b; }\`
• \`/refactor if (user && user.name && user.name.length > 0) { ... }\`
• \`/refactor for (let i = 0; i < array.length; i++) { ... }\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}`
        );
        break;

      case 'cursor_debug':
        await this.sendMessage(
          chatId,
          `🐛 **Code Debugging**

Use \`/debug <code>\` to debug code.

**Examples:**
• \`/debug function divide(a,b) { return a/b; }\`
• \`/debug const result = data.find(item => item.id === undefined)\`
• \`/debug async function fetchData() { ... }\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}`
        );
        break;

      case 'cursor_test':
        await this.sendMessage(
          chatId,
          `🧪 **Test Generation**

Use \`/test <code>\` to generate tests.

**Examples:**
• \`/test function add(a,b) { return a+b; }\`
• \`/test class UserService { ... }\`
• \`/test function validateEmail(email) { ... }\`

**Status:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode' : '✅ AI Mode'}`
        );
        break;

      case 'cursor_help':
        await this.sendCursorHelp(chatId);
        break;

      case 'cursor_status':
        await this.sendStatusMessage(chatId);
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
• \`/status\` - Check integration status

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

**Integration Status:** ${this.isConnected ? '✅ Connected' : '❌ Disconnected'}
**AI Mode:** ${this.apiQuotaExceeded ? '⚠️ Fallback Mode (API quota exceeded)' : '✅ Full AI Mode'}`;

    await this.sendMessage(chatId, helpText, 'Markdown');
  }

  private async sendMessage(
    chatId: number,
    text: string,
    parseMode?: string,
    options?: any
  ) {
    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: parseMode,
        ...options,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private async sendErrorMessage(chatId: number, message: string) {
    await this.sendMessage(chatId, `❌ ${message}`, undefined, { priority: 2 });
  }

  // Public methods
  public async sendToCursor(message: string) {
    if (this.cursorChatId) {
      await this.sendMessage(
        this.cursorChatId,
        `📨 **From Cursor:**\n\n${message}`,
        'Markdown'
      );
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
      cursorChatId: this.cursorChatId,
      apiQuotaExceeded: this.apiQuotaExceeded,
    };
  }

  public resetApiQuota() {
    this.apiQuotaExceeded = false;
  }
}

// Export singleton instance
export const enhancedCursorTelegramIntegration =
  new EnhancedCursorTelegramIntegration(
    '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0',
    'AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU'
  );

export default enhancedCursorTelegramIntegration;
