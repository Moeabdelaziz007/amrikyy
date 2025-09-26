const express = require('express');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// Mock AI data (in production, this would integrate with actual AI services)
let aiSessions = [];
let aiInsights = [];

// @route   POST /api/ai/chat
// @desc    Send a message to AI assistant
// @access  Private
router.post('/chat', [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required'),
  body('sessionId').optional().isString(),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, sessionId, context } = req.body;
    
    // Find or create session
    let session = aiSessions.find(s => s.id === sessionId && s.userId === req.userId);
    if (!session) {
      session = {
        id: Date.now().toString(),
        userId: req.userId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      aiSessions.push(session);
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    session.messages.push(userMessage);

    // Generate AI response (mock response for now)
    const aiResponse = await generateAIResponse(message, context, req.userId);
    
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      suggestions: aiResponse.suggestions || [],
      actions: aiResponse.actions || []
    };
    session.messages.push(assistantMessage);

    session.updatedAt = new Date();

    logger.info(`AI chat message processed for user ${req.userId}`);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        message: assistantMessage,
        suggestions: aiResponse.suggestions || [],
        actions: aiResponse.actions || []
      }
    });
  } catch (error) {
    logger.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing AI chat'
    });
  }
});

// @route   GET /api/ai/sessions
// @desc    Get user's AI chat sessions
// @access  Private
router.get('/sessions', async (req, res) => {
  try {
    const userSessions = aiSessions
      .filter(session => session.userId === req.userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(session => ({
        id: session.id,
        messageCount: session.messages.length,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastMessage: session.messages[session.messages.length - 1]?.content || ''
      }));

    res.json({
      success: true,
      data: { sessions: userSessions }
    });
  } catch (error) {
    logger.error('Get AI sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI sessions'
    });
  }
});

// @route   GET /api/ai/sessions/:id
// @desc    Get a specific AI chat session
// @access  Private
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = aiSessions.find(s => 
      s.id === req.params.id && s.userId === req.userId
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'AI session not found'
      });
    }

    res.json({
      success: true,
      data: { session }
    });
  } catch (error) {
    logger.error('Get AI session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI session'
    });
  }
});

// @route   DELETE /api/ai/sessions/:id
// @desc    Delete an AI chat session
// @access  Private
router.delete('/sessions/:id', async (req, res) => {
  try {
    const sessionIndex = aiSessions.findIndex(s => 
      s.id === req.params.id && s.userId === req.userId
    );

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'AI session not found'
      });
    }

    const deletedSession = aiSessions.splice(sessionIndex, 1)[0];

    logger.info(`AI session deleted: ${deletedSession.id} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'AI session deleted successfully',
      data: { session: deletedSession }
    });
  } catch (error) {
    logger.error('Delete AI session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting AI session'
    });
  }
});

// @route   POST /api/ai/insights
// @desc    Generate AI-powered insights
// @access  Private
router.post('/insights', [
  body('type').isIn(['productivity', 'time-management', 'task-optimization', 'workflow']).withMessage('Invalid insight type'),
  body('data').isObject().withMessage('Data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, data } = req.body;
    
    // Generate AI insights (mock implementation)
    const insights = await generateAIInsights(type, data, req.userId);
    
    // Store insight
    const insight = {
      id: Date.now().toString(),
      userId: req.userId,
      type,
      data,
      insights,
      createdAt: new Date()
    };
    aiInsights.push(insight);

    logger.info(`AI insights generated for user ${req.userId}`);

    res.json({
      success: true,
      data: { insights }
    });
  } catch (error) {
    logger.error('Generate AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating AI insights'
    });
  }
});

// @route   GET /api/ai/insights
// @desc    Get user's AI insights
// @access  Private
router.get('/insights', async (req, res) => {
  try {
    const userInsights = aiInsights
      .filter(insight => insight.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: { insights: userInsights }
    });
  } catch (error) {
    logger.error('Get AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI insights'
    });
  }
});

// @route   POST /api/ai/recommendations
// @desc    Get AI-powered recommendations
// @access  Private
router.post('/recommendations', [
  body('context').isObject().withMessage('Context is required'),
  body('type').optional().isIn(['tasks', 'workflow', 'time-management', 'productivity'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { context, type = 'tasks' } = req.body;
    
    // Generate AI recommendations (mock implementation)
    const recommendations = await generateAIRecommendations(context, type, req.userId);

    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    logger.error('Generate AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating AI recommendations'
    });
  }
});

// @route   POST /api/ai/voice-command
// @desc    Process voice command
// @access  Private
router.post('/voice-command', [
  body('transcript').trim().isLength({ min: 1, max: 500 }).withMessage('Transcript is required'),
  body('confidence').optional().isFloat({ min: 0, max: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { transcript, confidence = 0.8 } = req.body;
    
    // Process voice command (mock implementation)
    const command = await processVoiceCommand(transcript, confidence, req.userId);

    res.json({
      success: true,
      data: { command }
    });
  } catch (error) {
    logger.error('Process voice command error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing voice command'
    });
  }
});

// Helper functions (mock implementations)
async function generateAIResponse(message, context, userId) {
  // Mock AI response generation
  const responses = {
    'create task': {
      content: 'I can help you create a task. What would you like to name it?',
      suggestions: ['Create a new task', 'Set a reminder', 'Schedule a meeting'],
      actions: ['create-task', 'set-reminder']
    },
    'productivity': {
      content: 'Based on your recent activity, I can see you\'ve been very productive! Here are some insights about your performance.',
      suggestions: ['View productivity report', 'Set new goals', 'Optimize workflow'],
      actions: ['view-report', 'set-goals']
    },
    'help': {
      content: 'I\'m here to help you manage your tasks and boost your productivity. You can ask me to create tasks, set reminders, analyze your performance, or get recommendations.',
      suggestions: ['Create a task', 'View analytics', 'Get recommendations'],
      actions: ['create-task', 'view-analytics']
    }
  };

  // Simple keyword matching for demo
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('task') || lowerMessage.includes('create')) {
    return responses['create task'];
  } else if (lowerMessage.includes('productivity') || lowerMessage.includes('performance')) {
    return responses['productivity'];
  } else {
    return responses['help'];
  }
}

async function generateAIInsights(type, data, userId) {
  // Mock AI insights generation
  const insights = {
    productivity: [
      {
        title: 'Peak Productivity Hours',
        description: 'You are most productive between 9 AM and 11 AM',
        confidence: 0.85,
        actionable: true
      },
      {
        title: 'Task Completion Rate',
        description: 'Your completion rate has improved by 15% this week',
        confidence: 0.92,
        actionable: false
      }
    ],
    'time-management': [
      {
        title: 'Time Estimation Accuracy',
        description: 'Your time estimates are 20% more accurate than last month',
        confidence: 0.78,
        actionable: true
      }
    ],
    'task-optimization': [
      {
        title: 'Task Breakdown Opportunity',
        description: 'Consider breaking down large tasks into smaller subtasks',
        confidence: 0.88,
        actionable: true
      }
    ],
    workflow: [
      {
        title: 'Workflow Optimization',
        description: 'Your current workflow is 85% efficient',
        confidence: 0.90,
        actionable: true
      }
    ]
  };

  return insights[type] || [];
}

async function generateAIRecommendations(context, type, userId) {
  // Mock AI recommendations generation
  const recommendations = {
    tasks: [
      {
        title: 'Break down large tasks',
        description: 'Split tasks that take more than 4 hours into smaller subtasks',
        priority: 'high',
        impact: 'productivity'
      },
      {
        title: 'Set realistic deadlines',
        description: 'Use historical data to improve time estimates',
        priority: 'medium',
        impact: 'time-management'
      }
    ],
    workflow: [
      {
        title: 'Implement time blocking',
        description: 'Allocate specific time slots for different types of tasks',
        priority: 'high',
        impact: 'focus'
      }
    ],
    'time-management': [
      {
        title: 'Use the Pomodoro Technique',
        description: 'Work in 25-minute focused intervals with short breaks',
        priority: 'medium',
        impact: 'concentration'
      }
    ],
    productivity: [
      {
        title: 'Optimize your morning routine',
        description: 'Start with your most important task first thing in the morning',
        priority: 'high',
        impact: 'overall-productivity'
      }
    ]
  };

  return recommendations[type] || [];
}

async function processVoiceCommand(transcript, confidence, userId) {
  // Mock voice command processing
  const lowerTranscript = transcript.toLowerCase();
  
  if (lowerTranscript.includes('create task')) {
    return {
      action: 'create-task',
      parameters: {
        title: extractTaskTitle(transcript),
        priority: extractPriority(transcript)
      },
      confidence,
      response: 'I\'ll create that task for you'
    };
  } else if (lowerTranscript.includes('show tasks')) {
    return {
      action: 'show-tasks',
      parameters: {},
      confidence,
      response: 'Showing your tasks'
    };
  } else if (lowerTranscript.includes('set reminder')) {
    return {
      action: 'set-reminder',
      parameters: {
        message: extractReminderMessage(transcript),
        time: extractTime(transcript)
      },
      confidence,
      response: 'I\'ll set that reminder for you'
    };
  } else {
    return {
      action: 'unknown',
      parameters: {},
      confidence,
      response: 'I didn\'t understand that command. Can you try again?'
    };
  }
}

// Helper functions for voice command processing
function extractTaskTitle(transcript) {
  // Simple extraction logic
  const words = transcript.split(' ');
  const taskIndex = words.findIndex(word => word.toLowerCase() === 'task');
  if (taskIndex !== -1 && taskIndex + 1 < words.length) {
    return words.slice(taskIndex + 1).join(' ');
  }
  return 'New Task';
}

function extractPriority(transcript) {
  if (transcript.toLowerCase().includes('urgent') || transcript.toLowerCase().includes('high')) {
    return 'high';
  } else if (transcript.toLowerCase().includes('low')) {
    return 'low';
  }
  return 'medium';
}

function extractReminderMessage(transcript) {
  // Simple extraction logic
  return transcript.replace(/remind me to|set reminder|reminder/i, '').trim();
}

function extractTime(transcript) {
  // Simple time extraction
  if (transcript.includes('tomorrow')) {
    return 'tomorrow';
  } else if (transcript.includes('next week')) {
    return 'next week';
  }
  return 'in 1 hour';
}

module.exports = router;
