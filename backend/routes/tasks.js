const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').optional().isIn(['work', 'personal', 'health', 'learning', 'finance', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format'),
  body('estimatedTime').optional().isInt({ min: 0 }).withMessage('Estimated time must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// @route   GET /api/tasks
// @desc    Get user's tasks with filtering and pagination
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  query('category').optional().isIn(['work', 'personal', 'health', 'learning', 'finance', 'other']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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

    const {
      page = 1,
      limit = 20,
      status,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { userId: req.userId, isArchived: false };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Task.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get user's task statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.getTaskStats(req.userId);
    const overdueTasks = await Task.findOverdue(req.userId);
    
    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
          totalTimeSpent: 0,
          avgTimeSpent: 0
        },
        overdueCount: overdueTasks.length,
        overdueTasks: overdueTasks.slice(0, 5) // Return first 5 overdue tasks
      }
    });
  } catch (error) {
    logger.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task statistics'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.userId },
        { 'collaboration.sharedWith.userId': req.userId }
      ],
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', validateTask, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.userId,
      metadata: {
        createdBy: req.userId,
        lastModifiedBy: req.userId
      }
    };

    const task = new Task(taskData);
    await task.save();

    // Update user stats
    const user = await User.findByUid(req.userId);
    if (user) {
      await user.incrementTaskCount();
    }

    logger.info(`New task created: ${task.title} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', validateTask, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.userId },
        { 'collaboration.sharedWith.userId': req.userId, 'collaboration.sharedWith.role': { $in: ['editor', 'admin'] } }
      ],
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    // Update task
    Object.assign(task, req.body);
    task.metadata.lastModifiedBy = req.userId;
    task.metadata.version += 1;

    await task.save();

    logger.info(`Task updated: ${task.title} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Soft delete by archiving
    task.isArchived = true;
    await task.save();

    logger.info(`Task archived: ${task.title} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

// @route   POST /api/tasks/:id/subtasks
// @desc    Add a subtask
// @access  Private
router.post('/:id/subtasks', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Subtask title is required')
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

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.addSubtask(req.body.title);

    res.json({
      success: true,
      message: 'Subtask added successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Add subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding subtask'
    });
  }
});

// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @desc    Update a subtask
// @access  Private
router.put('/:id/subtasks/:subtaskId', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    // Update subtask
    if (req.body.title) subtask.title = req.body.title;
    if (req.body.completed !== undefined) {
      subtask.completed = req.body.completed;
      subtask.completedAt = req.body.completed ? new Date() : null;
    }

    await task.save();

    res.json({
      success: true,
      message: 'Subtask updated successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Update subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating subtask'
    });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add a comment to a task
// @access  Private
router.post('/:id/comments', [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment content is required')
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

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.userId },
        { 'collaboration.sharedWith.userId': req.userId }
      ],
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    await task.addComment(req.userId, req.body.content);

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
});

// @route   POST /api/tasks/:id/share
// @desc    Share a task with another user
// @access  Private
router.post('/:id/share', [
  body('userId').trim().isLength({ min: 1 }).withMessage('User ID is required'),
  body('role').optional().isIn(['viewer', 'editor', 'admin']).withMessage('Invalid role')
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

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      isArchived: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if target user exists
    const targetUser = await User.findByUid(req.body.userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    await task.shareWithUser(req.body.userId, req.body.role || 'viewer');

    res.json({
      success: true,
      message: 'Task shared successfully',
      data: { task }
    });
  } catch (error) {
    logger.error('Share task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sharing task'
    });
  }
});

module.exports = router;
