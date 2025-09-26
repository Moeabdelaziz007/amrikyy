const express = require('express');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// Mock automation data (in production, this would be a database model)
let automationRules = [];
let automationLogs = [];

// @route   GET /api/automation/rules
// @desc    Get user's automation rules
// @access  Private
router.get('/rules', async (req, res) => {
  try {
    const userRules = automationRules.filter(rule => rule.userId === req.userId);
    
    res.json({
      success: true,
      data: { rules: userRules }
    });
  } catch (error) {
    logger.error('Get automation rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching automation rules'
    });
  }
});

// @route   POST /api/automation/rules
// @desc    Create a new automation rule
// @access  Private
router.post('/rules', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Rule name is required'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('trigger').isObject().withMessage('Trigger configuration is required'),
  body('action').isObject().withMessage('Action configuration is required'),
  body('enabled').optional().isBoolean()
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

    const rule = {
      id: Date.now().toString(),
      userId: req.userId,
      name: req.body.name,
      description: req.body.description || '',
      trigger: req.body.trigger,
      action: req.body.action,
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastExecuted: null,
      executionCount: 0
    };

    automationRules.push(rule);

    logger.info(`Automation rule created: ${rule.name} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Automation rule created successfully',
      data: { rule }
    });
  } catch (error) {
    logger.error('Create automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating automation rule'
    });
  }
});

// @route   PUT /api/automation/rules/:id
// @desc    Update an automation rule
// @access  Private
router.put('/rules/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('trigger').optional().isObject(),
  body('action').optional().isObject(),
  body('enabled').optional().isBoolean()
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

    const ruleIndex = automationRules.findIndex(rule => 
      rule.id === req.params.id && rule.userId === req.userId
    );

    if (ruleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    // Update rule
    const rule = automationRules[ruleIndex];
    Object.assign(rule, req.body);
    rule.updatedAt = new Date();

    logger.info(`Automation rule updated: ${rule.name} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Automation rule updated successfully',
      data: { rule }
    });
  } catch (error) {
    logger.error('Update automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating automation rule'
    });
  }
});

// @route   DELETE /api/automation/rules/:id
// @desc    Delete an automation rule
// @access  Private
router.delete('/rules/:id', async (req, res) => {
  try {
    const ruleIndex = automationRules.findIndex(rule => 
      rule.id === req.params.id && rule.userId === req.userId
    );

    if (ruleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    const deletedRule = automationRules.splice(ruleIndex, 1)[0];

    logger.info(`Automation rule deleted: ${deletedRule.name} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Automation rule deleted successfully',
      data: { rule: deletedRule }
    });
  } catch (error) {
    logger.error('Delete automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting automation rule'
    });
  }
});

// @route   POST /api/automation/rules/:id/execute
// @desc    Manually execute an automation rule
// @access  Private
router.post('/rules/:id/execute', async (req, res) => {
  try {
    const rule = automationRules.find(r => 
      r.id === req.params.id && r.userId === req.userId
    );

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    if (!rule.enabled) {
      return res.status(400).json({
        success: false,
        message: 'Automation rule is disabled'
      });
    }

    // Simulate rule execution
    const executionResult = {
      success: true,
      message: 'Rule executed successfully',
      executedAt: new Date()
    };

    // Update rule execution count
    rule.executionCount += 1;
    rule.lastExecuted = new Date();

    // Log execution
    const logEntry = {
      id: Date.now().toString(),
      ruleId: rule.id,
      userId: req.userId,
      executedAt: new Date(),
      result: executionResult,
      trigger: rule.trigger,
      action: rule.action
    };

    automationLogs.push(logEntry);

    logger.info(`Automation rule executed: ${rule.name} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Automation rule executed successfully',
      data: { 
        rule,
        execution: executionResult
      }
    });
  } catch (error) {
    logger.error('Execute automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while executing automation rule'
    });
  }
});

// @route   GET /api/automation/logs
// @desc    Get automation execution logs
// @access  Private
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 20, ruleId } = req.query;
    
    let userLogs = automationLogs.filter(log => log.userId === req.userId);
    
    if (ruleId) {
      userLogs = userLogs.filter(log => log.ruleId === ruleId);
    }

    // Sort by execution date (newest first)
    userLogs.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = userLogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(userLogs.length / limit),
          totalItems: userLogs.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get automation logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching automation logs'
    });
  }
});

// @route   GET /api/automation/templates
// @desc    Get automation rule templates
// @access  Private
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      {
        id: 'due-date-reminder',
        name: 'Due Date Reminder',
        description: 'Send a reminder when a task is due soon',
        category: 'notifications',
        trigger: {
          type: 'due-date',
          config: {
            timeBefore: 24, // hours
            unit: 'hours'
          }
        },
        action: {
          type: 'send-notification',
          config: {
            title: 'Task Due Soon',
            message: 'Your task "{{task.title}}" is due in {{timeRemaining}}'
          }
        }
      },
      {
        id: 'auto-complete-subtasks',
        name: 'Auto-complete Subtasks',
        description: 'Automatically complete a task when all subtasks are done',
        category: 'task-management',
        trigger: {
          type: 'subtask-completion',
          config: {
            allSubtasksCompleted: true
          }
        },
        action: {
          type: 'update-task-status',
          config: {
            status: 'completed'
          }
        }
      },
      {
        id: 'priority-escalation',
        name: 'Priority Escalation',
        description: 'Increase task priority when overdue',
        category: 'task-management',
        trigger: {
          type: 'overdue',
          config: {
            daysOverdue: 1
          }
        },
        action: {
          type: 'update-priority',
          config: {
            priority: 'high'
          }
        }
      },
      {
        id: 'time-tracking',
        name: 'Automatic Time Tracking',
        description: 'Track time spent on tasks automatically',
        category: 'time-management',
        trigger: {
          type: 'status-change',
          config: {
            fromStatus: 'in-progress',
            toStatus: 'completed'
          }
        },
        action: {
          type: 'update-time-spent',
          config: {
            calculateFromStart: true
          }
        }
      },
      {
        id: 'weekly-report',
        name: 'Weekly Progress Report',
        description: 'Generate and send weekly progress reports',
        category: 'reporting',
        trigger: {
          type: 'schedule',
          config: {
            frequency: 'weekly',
            day: 'friday',
            time: '17:00'
          }
        },
        action: {
          type: 'generate-report',
          config: {
            reportType: 'weekly-progress',
            includeMetrics: true
          }
        }
      }
    ];

    res.json({
      success: true,
      data: { templates }
    });
  } catch (error) {
    logger.error('Get automation templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching automation templates'
    });
  }
});

// @route   GET /api/automation/stats
// @desc    Get automation statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userRules = automationRules.filter(rule => rule.userId === req.userId);
    const userLogs = automationLogs.filter(log => log.userId === req.userId);

    const stats = {
      totalRules: userRules.length,
      enabledRules: userRules.filter(rule => rule.enabled).length,
      disabledRules: userRules.filter(rule => !rule.enabled).length,
      totalExecutions: userLogs.length,
      successfulExecutions: userLogs.filter(log => log.result.success).length,
      failedExecutions: userLogs.filter(log => !log.result.success).length,
      averageExecutionsPerRule: userRules.length > 0 ? 
        Math.round(userLogs.length / userRules.length) : 0
    };

    // Get execution history for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLogs = userLogs.filter(log => 
      new Date(log.executedAt) >= thirtyDaysAgo
    );

    const executionHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayLogs = recentLogs.filter(log => 
        log.executedAt.toDateString() === date.toDateString()
      );
      
      executionHistory.push({
        date: date.toISOString().split('T')[0],
        executions: dayLogs.length,
        successful: dayLogs.filter(log => log.result.success).length,
        failed: dayLogs.filter(log => !log.result.success).length
      });
    }

    res.json({
      success: true,
      data: {
        stats,
        executionHistory
      }
    });
  } catch (error) {
    logger.error('Get automation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching automation statistics'
    });
  }
});

module.exports = router;
