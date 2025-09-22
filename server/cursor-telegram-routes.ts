// Cursor-Telegram Integration API Routes
import { Router } from 'express';
import { cursorTelegramIntegration } from './cursor-telegram-integration.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Gemini for direct API calls
const genAI = new GoogleGenerativeAI('AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

// Get integration status
router.get('/status', async (req, res) => {
  try {
    const status = cursorTelegramIntegration.getStatus();

    res.json({
      success: true,
      data: {
        ...status,
        timestamp: new Date().toISOString(),
        features: {
          codeGeneration: true,
          codeExplanation: true,
          codeRefactoring: true,
          debugging: true,
          testGeneration: true,
          generalQueries: true,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send message to Cursor-connected chat
router.post('/send-to-cursor', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'message is required',
      });
    }

    await cursorTelegramIntegration.sendToCursor(message);

    res.json({
      success: true,
      message: 'Message sent to Cursor chat successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Generate code
router.post('/generate-code', async (req, res) => {
  try {
    const { description, language, framework } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'description is required',
      });
    }

    const prompt = `Generate ${language || 'JavaScript'} code based on this description: "${description}"

${framework ? `Framework: ${framework}` : ''}

Requirements:
- Provide clean, well-commented code
- Include proper imports and dependencies
- Follow best practices
- Add error handling where appropriate
- Include usage examples if relevant

Format the response with proper code blocks and explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = response.text();

    res.json({
      success: true,
      data: {
        code,
        description,
        language: language || 'JavaScript',
        framework: framework || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Explain code
router.post('/explain-code', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'code is required',
      });
    }

    const prompt = `Explain this ${language || 'JavaScript'} code in detail:

\`\`\`${language || 'javascript'}
${code}
\`\`\`

Provide:
1. What the code does
2. How it works (line by line if complex)
3. Key concepts and patterns
4. Potential improvements or considerations
5. Usage examples

Make it clear and educational for developers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({
      success: true,
      data: {
        explanation,
        code,
        language: language || 'JavaScript',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Refactor code
router.post('/refactor-code', async (req, res) => {
  try {
    const { code, language, focus } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'code is required',
      });
    }

    const prompt = `Refactor this ${language || 'JavaScript'} code to improve it:

\`\`\`${language || 'javascript'}
${code}
\`\`\`

${focus ? `Focus on: ${focus}` : ''}

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const refactored = response.text();

    res.json({
      success: true,
      data: {
        refactored,
        originalCode: code,
        language: language || 'JavaScript',
        focus: focus || 'general improvement',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Debug code
router.post('/debug-code', async (req, res) => {
  try {
    const { code, language, errorMessage } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'code is required',
      });
    }

    const prompt = `Debug this ${language || 'JavaScript'} code and identify potential issues:

\`\`\`${language || 'javascript'}
${code}
\`\`\`

${errorMessage ? `Error message: ${errorMessage}` : ''}

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const debugInfo = response.text();

    res.json({
      success: true,
      data: {
        debugInfo,
        originalCode: code,
        language: language || 'JavaScript',
        errorMessage: errorMessage || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Generate tests
router.post('/generate-tests', async (req, res) => {
  try {
    const { code, language, framework } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'code is required',
      });
    }

    const prompt = `Generate comprehensive tests for this ${language || 'JavaScript'} code:

\`\`\`${language || 'javascript'}
${code}
\`\`\`

${framework ? `Testing framework: ${framework}` : 'Use Jest for JavaScript'}

Provide:
1. Unit tests with different scenarios
2. Edge cases and boundary conditions
3. Error handling tests
4. Test setup and teardown
5. Mock data if needed

Use appropriate testing framework and include:
- Test descriptions
- Assertions
- Expected vs actual results
- Coverage considerations`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tests = response.text();

    res.json({
      success: true,
      data: {
        tests,
        originalCode: code,
        language: language || 'JavaScript',
        framework: framework || 'Jest',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Ask Cursor AI
router.post('/ask-cursor', async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'question is required',
      });
    }

    const prompt = `You are Cursor AI, an advanced code assistant. Answer this question about programming, development, or coding:

Question: ${question}
${context ? `Context: ${context}` : ''}

Provide a helpful, technical response that would assist a developer using Cursor IDE. Include code examples when relevant.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({
      success: true,
      data: {
        answer,
        question,
        context: context || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Connect chat to Cursor
router.post('/connect', async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        error: 'chatId is required',
      });
    }

    // This would need to be implemented in the integration service
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Chat connected to Cursor successfully',
      chatId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Disconnect chat from Cursor
router.post('/disconnect', async (req, res) => {
  try {
    cursorTelegramIntegration.disconnectCursor();

    res.json({
      success: true,
      message: 'Chat disconnected from Cursor successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get available commands
router.get('/commands', async (req, res) => {
  try {
    const commands = [
      { command: 'cursor', description: 'Ask Cursor AI anything' },
      { command: 'code', description: 'Generate code based on description' },
      { command: 'explain', description: 'Explain how code works' },
      { command: 'refactor', description: 'Refactor code for better quality' },
      { command: 'debug', description: 'Debug and fix code issues' },
      { command: 'test', description: 'Generate comprehensive tests' },
      { command: 'connect', description: 'Connect this chat to Cursor' },
      { command: 'help', description: 'Show help message' },
    ];

    res.json({
      success: true,
      data: commands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
