const express = require('express');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// Mock notification data (in production, this would be a database model)
let notifications = [];

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    // Filter notifications for current user
    let userNotifications = notifications.filter(notification => 
      notification.userId === req.userId
    );

    // Filter unread only if requested
    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(notification => !notification.read);
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    // Get unread count
    const unreadCount = notifications.filter(notification => 
      notification.userId === req.userId && !notification.read
    ).length;

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(userNotifications.length / limit),
          totalItems: userNotifications.length,
          itemsPerPage: parseInt(limit)
        },
        unreadCount
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('actionUrl').optional().isURL().withMessage('Invalid action URL')
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

    const notification = {
      id: Date.now().toString(),
      userId: req.userId,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || 'info',
      actionUrl: req.body.actionUrl,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    notifications.push(notification);

    logger.info(`Notification created: ${notification.title} for user ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = notifications.find(n => 
      n.id === notificationId && n.userId === req.userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;
    notification.updatedAt = new Date();

    logger.info(`Notification marked as read: ${notificationId} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', async (req, res) => {
  try {
    const userNotifications = notifications.filter(notification => 
      notification.userId === req.userId && !notification.read
    );

    userNotifications.forEach(notification => {
      notification.read = true;
      notification.updatedAt = new Date();
    });

    logger.info(`All notifications marked as read by user ${req.userId}`);

    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: { updatedCount: userNotifications.length }
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notifications'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notificationIndex = notifications.findIndex(n => 
      n.id === notificationId && n.userId === req.userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const deletedNotification = notifications.splice(notificationIndex, 1)[0];

    logger.info(`Notification deleted: ${notificationId} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: { notification: deletedNotification }
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
});

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const userNotifications = notifications.filter(notification => 
      notification.userId === req.userId
    );

    notifications = notifications.filter(notification => 
      notification.userId !== req.userId
    );

    logger.info(`All notifications deleted by user ${req.userId}`);

    res.json({
      success: true,
      message: 'All notifications deleted successfully',
      data: { deletedCount: userNotifications.length }
    });
  } catch (error) {
    logger.error('Delete all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notifications'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userNotifications = notifications.filter(notification => 
      notification.userId === req.userId
    );

    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      read: userNotifications.filter(n => n.read).length,
      byType: {
        info: userNotifications.filter(n => n.type === 'info').length,
        success: userNotifications.filter(n => n.type === 'success').length,
        warning: userNotifications.filter(n => n.type === 'warning').length,
        error: userNotifications.filter(n => n.type === 'error').length
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    logger.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification statistics'
    });
  }
});

module.exports = router;
